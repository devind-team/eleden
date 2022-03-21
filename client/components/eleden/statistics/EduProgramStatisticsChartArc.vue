<template lang="pug">
  v-row
    v-col(cols="12")
      .text-h6 {{ t('eduPrograms') }}
    v-col(v-for="chart in chartsEduPrograms" :key="chart" cols="12" md="4")
      div {{ labels[chart] }}
      client-only
        apex-chart(type="donut" :options="statistics[chart].options" :series="statistics[chart].series")
    v-col(cols="12")
      .text-h6 {{ t('disciplines') }}
    v-col(v-for="chart in chartDisciplines" :key="chart" cols="12" md="3")
      div {{ labels[$snakeToCamel(chart)] }}
      client-only
        apex-chart(type="donut" :options="statistics[chart].options" :series="statistics[chart].series")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { EduProgramStatisticsType, PointTotalStatisticsType } from '~/types/graphql'

type Labels = {
  description: string,
  syllabus: string,
  calendar: string,
  user: string,
  annotation: string,
  workProgram: string
}

type StatisticsItem = {
  options: {
    labels: string[]
  },
  series: number[]
}
type Statistics = {
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

@Component<EduProgramStatisticsChartArc>({
  computed: {
    chartsEduPrograms (): string[] {
      return ['description', 'syllabus', 'calendar']
    },
    chartDisciplines (): string[] {
      return ['users', 'annotation', 'work_program', 'methodological_support']
    },
    labels (): { calendar: string; annotation: string; syllabus: string; workProgram: string; description: string; methodologicalSupport: string; users: string } {
      return {
        description: this.t('labels.description'),
        syllabus: this.t('labels.syllabus'),
        calendar: this.t('labels.calendar'),
        users: this.t('labels.users'),
        annotation: this.t('labels.annotation'),
        workProgram: this.t('labels.workProgram'),
        methodologicalSupport: this.t('labels.methodologicalSupport')
      }
    },
    statistics (): Statistics {
      const points: PointType[] = this.items
        .map((e: EduProgramStatisticsType) => e.points
          .reduce((a: PointType, c: PointTotalStatisticsType | any) => {
            return { ...a, [c.name]: c }
          }, {}))
      return [...this.chartsEduPrograms, ...this.chartDisciplines].reduce((a: any, c: string) => {
        const rawValues: PointTotalStatisticsType[] = points.map((e: PointType) => e[c])
        const { value, total } = rawValues.reduce((a: any, c: PointTotalStatisticsType) => {
          return { value: a.value + c.value, total: a.total + c.total }
        }, { value: 0, total: 0 })
        return Object.assign({
          [c]: {
            options: {
              labels: [this.t('indicatorLabels.availability'), this.t('indicatorLabels.lack')]
            },
            series: [value, total - value]
          }
        }, a)
      }, {}) as Statistics
    }
  }
})
export default class EduProgramStatisticsChartArc extends Vue {
  @Prop({ required: true, type: Array }) items!: EduProgramStatisticsType[]

  readonly chartsEduPrograms!: string[]
  readonly chartDisciplines!: string[]
  readonly label!: Labels
  readonly statistics!: Statistics

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`statistics.eduProgramsStatistics.${path}`, values) as string
  }
}
</script>
