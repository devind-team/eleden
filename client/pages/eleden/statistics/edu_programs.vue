<template lang="pug">
left-navigator-container(:bread-crumbs="bc" @update-drawer="$emit('update-drawer')" fluid)
  template(#header) {{ $t('statistics.eduProgramsStatistics.name') }}
  edu-program-filter(
    :directions-filter.sync="directionsFilter"
    :years-filter.sync="yearsFilter"
    :edu-forms-filter.sync="eduFormsFilter"
    :view.sync="view"
  )
  template(v-if="!loading")
    template(v-if="view === 'chart-arc'")
      edu-program-statistics-chart-arc(:items="eduProgramsStatistics")
    template(v-else)
      edu-program-statistics-table(:items="eduProgramsStatistics")
  v-progress-circular(v-else color="primary" indeterminate)
</template>

<script lang="ts">
import type { ComputedRef, PropType, Ref } from '#app'
import { computed, defineComponent, useNuxt2Meta, ref } from '#app'
import { BreadCrumbsItem } from '~/types/devind'
import {
  EduProgramsStatisticsQuery,
  EduProgramsStatisticsQueryVariables,
  DirectionType,
  EduFormType
} from '~/types/graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import LeftNavigatorContainer from '~/components/common/grid/LeftNavigatorContainer.vue'
import EduProgramStatisticsChartArc from '~/components/eleden/statistics/EduProgramStatisticsChartArc.vue'
import EduProgramStatisticsTable from '~/components/eleden/statistics/EduProgramStatisticsTable.vue'
import EduProgramFilter, { Year, View } from '~/components/eleden/statistics/EduProgramFilter.vue'
import { useCommonQuery, useI18n } from '~/composables'
import eduProgramsStatisticsQuery from '~/gql/eleden/queries/statistics/edu_programs_statistics.graphql'

export default defineComponent({
  components: {
    EduProgramStatisticsChartArc,
    EduProgramStatisticsTable,
    EduProgramFilter,
    LeftNavigatorContainer,
    BreadCrumbs
  },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('statistics.eduProgramsStatistics.name') as string })

    const directionsFilter: Ref<DirectionType[]> = ref<DirectionType[]>([])
    const yearsFilter: Ref<Year[]> = ref<Year[]>([])
    const eduFormsFilter: Ref<EduFormType[]> = ref<EduFormType[]>([])
    const view: Ref<View> = ref<View>('chart-arc')

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('statistics.eduProgramsStatistics.eduPrograms') as string,
        to: localePath({ name: 'eleden-statistics-edu_programs' }),
        exact: true
      }
    ]))

    const {
      data: eduProgramsStatistics,
      loading
    } = useCommonQuery<EduProgramsStatisticsQuery, EduProgramsStatisticsQueryVariables>({
      document: eduProgramsStatisticsQuery,
      variables: () => ({
        directions: directionsFilter.value.map(direction => direction.id),
        admissions: yearsFilter.value.map(year => year.id.toString()),
        eduForms: eduFormsFilter.value.map(eduForm => eduForm.id)
      })
    })

    return { directionsFilter, yearsFilter, eduFormsFilter, view, bc, eduProgramsStatistics, loading }
  }
})
</script>
