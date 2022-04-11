<template lang="pug">
  bread-crumbs(:items="bc")
    v-card
      v-card-title {{ $t('eduPrograms.name') }}
      v-card-text
        v-row(align="center")
          v-col(v-if="hasPerm('eleden.add_eduprogram')" cols="12" md="6")
            add-edu-programs(
              v-slot="{ on }"
              :add-edu-program-update="(cache, result) => addUpdate(cache, result, 'eduProgram')"
              :add-edu-program-from-plx-update="(cache, result) => addUpdate(cache, result, 'eduProgram')"
              :add-edu-programs-update="(cache, result) => addUpdate(cache, result, 'eduPrograms')"
            )
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ $t('eduPrograms.buttons.add') }}
          v-col.text-right(v-if="hasPerm('eleden.view_eduprogram')" cols="12" md="6")
            unload-edu-programs(v-slot="{ on }")
              v-btn(v-on="on" color="success")
                v-icon(left) mdi-upload
                | {{ $t('eduPrograms.buttons.unload') }}
        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
          v-col.text-right(cols="12" sm="6")
            | {{ $t('shownOf', { count: eduPrograms && eduPrograms.length, totalCount }) }}
        v-row
          v-col
            v-data-table(
              :headers="headers"
              :items="eduPrograms"
              :loading="loading"
              disable-pagination
              hide-default-footer
            )
              template(#item.direction.name="{ item }")
                nuxt-link(
                  :to="localePath({ name: 'eleden-edu_programs-edu_program_id', params: { edu_program_id: item.id } })"
                ) {{ item.direction.name }} ({{ item.eduForm.shortName }})
              template(#footer v-if="loading")
                v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, computed, useNuxt2Meta, toRef } from '#app'
import { DataTableHeader } from 'vuetify/types'
import { BreadCrumbsItem } from '~/types/devind'
import { EduProgramsQuery, EduProgramsQueryVariables, EduProgramType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useDebounceSearch, useI18n, useQueryRelay, useCursorPagination, useApolloHelpers } from '~/composables'
import eduProgramsQuery from '~/gql/eleden/queries/education/edu_programs.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import AddEduPrograms from '~/components/eleden/edu_programs/AddEduPrograms.vue'
import UnloadEduPrograms from '~/components/eleden/edu_programs/UnloadEduPrograms.vue'

export default defineComponent({
  components: { BreadCrumbs, AddEduPrograms, UnloadEduPrograms },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('eduPrograms.name') as string })
    const route = useRoute()
    const router = useRouter()
    const { defaultClient } = useApolloHelpers()

    const headers = computed<DataTableHeader[]>(() => ([
      { text: t('eduPrograms.tableHeaders.directionCode') as string, value: 'direction.code' },
      { text: t('eduPrograms.tableHeaders.directionName') as string, value: 'direction.name' },
      { text: t('eduPrograms.tableHeaders.admission') as string, value: 'admission' },
      { text: t('eduPrograms.tableHeaders.name') as string, value: 'name' },
      { text: t('eduPrograms.tableHeaders.eduLevel') as string, value: 'direction.eduService.name' }
    ]))

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('eduPrograms.name') as string,
        to: localePath({ name: 'eleden-edu_programs' }),
        exact: true
      }
    ]))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: eduPrograms,
      loading,
      pagination: { totalCount, count },
      update,
      addUpdate
    } = useQueryRelay<EduProgramsQuery, EduProgramsQueryVariables>({
      document: eduProgramsQuery,
      variables: () => ({ search: debounceSearch.value })
    },
    {
      pagination: useCursorPagination({ pageSize: 20 }),
      fetchScroll: typeof document === 'undefined' ? null : document
    }
    )

    onMounted(() => {
      if (route.query.eduProgramId) {
        update(
          defaultClient.cache,
          { data: { deleteEduProgram: { id: route.query.eduProgramId } } },
          (cacheData, { data: { deleteEduProgram: { id: eduProgramId } } }) => {
            cacheData.eduPrograms =
              cacheData.eduPrograms.edges.map(e => e.node).filter((e: EduProgramType) => e.id !== eduProgramId)
            return cacheData
          }
        )
        router.push(localePath({ name: 'eleden-edu_programs' }))
      }
    })

    return {
      hasPerm,
      headers,
      bc,
      eduPrograms,
      loading,
      search,
      totalCount,
      count,
      addUpdate
    }
  },
  watchQuery: ['search']
})
</script>
