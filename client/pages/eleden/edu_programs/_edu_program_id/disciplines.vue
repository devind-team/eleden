<template lang="pug">
  v-card
    v-card-title {{ $t('eduPrograms.disciplines.name') }}
    v-card-text
      v-row
        v-col(v-if="hasPerm('eleden.add_discipline')")
          add-disciplines(
            :edu-program="eduProgram"
            :add-discipline-update="(store, result) => addUpdate(store, result, 'discipline')"
          )
            template(#default="{ on }")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ $t('eduPrograms.disciplines.buttons.add') }}
      v-row(align="center")
        v-col(cols="12" md="6")
          v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count, totalCount }) }}
      v-row
        v-col
          disciplines-table(
            :edu-program="eduProgram"
            :disciplines="disciplines"
            :search="search"
            :loading="loading"
            @count-change="countChange"
          )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, onMounted, ref, toRef, useRoute, useRouter } from '#app'
import { useAuthStore } from '~/store'
import { useQueryRelay, useI18n, useApolloHelpers, useCursorPagination } from '~/composables'
import { EduProgramType, DisciplinesQuery, DisciplinesQueryVariables } from '~/types/graphql'
import AddDisciplines from '~/components/eleden/edu_programs/AddDisciplines.vue'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import DisciplinesTable from '~/components/eleden/edu_programs/DisciplinesTable.vue'
import { fromGlobalId } from '~/services/graphql-relay'

export default defineComponent({
  components: { AddDisciplines, DisciplinesTable },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const route = useRoute()
    const router = useRouter()
    const { localePath } = useI18n()
    const { defaultClient } = useApolloHelpers()

    const search = ref<string>('')
    const count = ref<number>(0)
    const totalCount = ref<number>(0)

    const {
      data: disciplines,
      loading,
      update,
      addUpdate
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => ({ eduProgramId: props.eduProgram.id })
    }, {
      pagination: useCursorPagination({ pageSize: 100 })
    })

    const countChange = ({ count: countt, totalCount: totalCountt }: { count: number, totalCount: number }): void => {
      count.value = countt
      totalCount.value = totalCountt
    }

    onMounted(() => {
      if (route.query.disciplineId) {
        update(
          defaultClient.cache,
          { data: { deleteDiscipline: { id: route.query.disciplineId } } },
          (cacheData, { data: { deleteDiscipline: { id: disciplineId } } }) => {
            cacheData.disciplines.edges =
               cacheData.disciplines.edges.filter(e => fromGlobalId(e.node.id).id !== Number(disciplineId))
            --cacheData.disciplines.totalCount
            return cacheData
          }
        )
        router.push(localePath({ name: 'eleden-edu_programs-edu_program_id-disciplines', params: route.params }))
      }
    })

    return { hasPerm, search, count, totalCount, disciplines, loading, addUpdate, countChange }
  }
})
</script>
