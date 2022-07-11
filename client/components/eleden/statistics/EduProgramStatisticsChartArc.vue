<template lang="pug">
v-row
  v-col(cols="12")
    .text-h6 {{ $t('statistics.eduProgramsStatistics.eduPrograms') }}
  v-col(v-for="chart in chartsEduPrograms" :key="chart" cols="12" md="4")
    div {{ labels[chart] }}
    client-only
      apex-chart(type="donut" :options="statistics[chart].options" :series="statistics[chart].series")
  v-col(cols="12")
    .text-h6 {{ $t('statistics.eduProgramsStatistics.disciplines') }}
  v-col(v-for="chart in chartDisciplines" :key="chart" cols="12" md="3")
    div {{ labels[camelCase(chart)] }}
    client-only
      apex-chart(type="donut" :options="statistics[chart].options" :series="statistics[chart].series")
</template>

<script lang="ts">
import type { PropType } from '#app'
import { camelCase } from 'scule'
import { EduProgramStatisticsType, PointTotalStatisticsType } from '~/types/graphql'
import { useI18n } from '~/composables'

type LabelsType = {
  description: string,
  syllabus: string,
  calendar: string,
  user: string,
  annotation: string,
  workProgram: string,
  methodologicalSupport: string
}

type StatisticsItem = {
  options: {
    labels: string[]
  },
  series: number[]
}
type StatisticsType = {
  description: StatisticsItem,
  syllabus: StatisticsItem,
  calendar: StatisticsItem,
  users: StatisticsItem,
  annotation: StatisticsItem,
  workProgram: StatisticsItem,
  methodologicalSupport: StatisticsItem
}
type PointType = {
  [k: string]: PointTotalStatisticsType
}

export default defineComponent({
  props: {
    items: { required: true, type: Array as PropType<EduProgramStatisticsType[]> }
  },
  setup (props) {
    const { t } = useI18n()

    const chartsEduPrograms = computed<string[]>(() => (['description', 'syllabus', 'calendar']))

    const chartDisciplines = computed<string[]>(() => (
      ['users', 'annotation', 'work_program', 'methodological_support']
    ))

    const labels = computed<LabelsType>(() => ({
      description: t('statistics.eduProgramsStatistics.labels.description'),
      syllabus: t('statistics.eduProgramsStatistics.labels.syllabus'),
      calendar: t('statistics.eduProgramsStatistics.labels.calendar'),
      users: t('statistics.eduProgramsStatistics.labels.users'),
      annotation: t('statistics.eduProgramsStatistics.labels.annotation'),
      workProgram: t('statistics.eduProgramsStatistics.labels.workProgram'),
      methodologicalSupport: t('statistics.eduProgramsStatistics.labels.methodologicalSupport')
    }))

    const statistics = computed<StatisticsType>(() => {
      const points: PointType[] = props.items
        .map((e: EduProgramStatisticsType) => e.points
          .reduce((a: PointType, c: PointTotalStatisticsType | any) => {
            return { ...a, [c.name]: c }
          }, {}))
      return [...chartsEduPrograms.value, ...chartDisciplines.value].reduce((a: any, c: string) => {
        const rawValues: PointTotalStatisticsType[] = points.map((e: PointType) => e[c])
        const { value, total } = rawValues.reduce((a: any, c: PointTotalStatisticsType) => {
          return { value: a.value + c.value, total: a.total + c.total }
        }, { value: 0, total: 0 })
        return Object.assign({
          [c]: {
            options: {
              labels: [
                t('statistics.eduProgramsStatistics.indicatorLabels.availability'),
                t('statistics.eduProgramsStatistics.indicatorLabels.lack')
              ]
            },
            series: [value, total - value]
          }
        }, a)
      }, {}) as StatisticsType
    })

    return { chartsEduPrograms, chartDisciplines, labels, statistics, camelCase }
  }
})
</script>
