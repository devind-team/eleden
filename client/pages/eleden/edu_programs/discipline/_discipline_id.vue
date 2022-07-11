<template lang="pug">
bread-crumbs(v-if="!loading" :items="bc")
  .title.mb-2
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    | {{ discipline.name }}
  two-columns(:links="links")
    nuxt-child(:discipline="discipline")
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, computed, useRoute, useNuxt2Meta } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { DisciplineQuery, DisciplineQueryVariables } from '~/types/graphql'
import { useI18n, useCommonQuery } from '~/composables'
import disciplineQuery from '~/gql/eleden/queries/education/discipline.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'

export default defineComponent({
  components: { TwoColumns, BreadCrumbs },
  middleware: 'auth',
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('eduPrograms.discipline.eduPrograms') as string })
    const route = useRoute()

    const {
      data: discipline,
      loading
    } = useCommonQuery<DisciplineQuery, DisciplineQueryVariables>({
      document: disciplineQuery,
      variables: () => ({ disciplineId: route.params.discipline_id })
    })

    const links = computed<LinksType[]>(() => ([
      {
        title: t('eduPrograms.discipline.menu.description') as string,
        to: 'eleden-edu_programs-discipline-discipline_id-description',
        params: route.params,
        icon: 'semantic-web'
      },
      {
        title: t('eduPrograms.discipline.menu.methodologicalSupport') as string,
        to: 'eleden-edu_programs-discipline-discipline_id-methodological_support',
        params: route.params,
        icon: 'file-multiple'
      },
      {
        title: t('eduPrograms.discipline.menu.competences') as string,
        to: 'eleden-edu_programs-discipline-discipline_id-competences',
        params: route.params,
        icon: 'text-box-multiple'
      },
      {
        title: t('eduPrograms.discipline.menu.eduHours') as string,
        to: 'eleden-edu_programs-discipline-discipline_id-edu_hours',
        params: route.params,
        icon: 'clock-time-four'
      },
      {
        title: t('eduPrograms.discipline.menu.settings') as string,
        to: 'eleden-edu_programs-discipline-discipline_id-settings',
        params: route.params,
        icon: 'cogs',
        permissions: ['eleden.change_discipline']
      }
    ]))

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('eduPrograms.discipline.eduPrograms') as string,
        to: localePath({ name: 'eleden-edu_programs' }),
        exact: true
      },
      {
        text: discipline.value!.eduProgram.name,
        to: localePath({
          name: 'eleden-edu_programs-edu_program_id',
          params: { edu_program_id: discipline.value!.eduProgram.id }
        })
      },
      {
        text: discipline.value!.name,
        to: localePath({
          name: 'eleden-edu_programs-discipline-discipline_id',
          params: { discipline_id: route.params.discipline_id }
        })
      }
    ]))
    return { discipline, loading, links, bc }
  }
})
</script>
