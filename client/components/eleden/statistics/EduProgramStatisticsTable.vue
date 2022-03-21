<template lang="pug">
  v-row
    v-col(cols="12")
      tree-data-table(:headers="headers" :items="treeItems" disable-pagination hide-default-footer)
        template(v-for="f in formatColumns" v-slot:[`item.${f}`]="{ item }")
          v-tooltip(bottom)
            template(#activator="{ on }")
              span(v-on="on") {{ (item[f].value / item[f].total * 100).toFixed(2) }}%
            div Заполнено: {{ item[f].value }}
            div Всего: {{ item[f].total }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify/types'
import { EduProgramStatisticsType } from '~/types/graphql'
import TreeDataTable from '~/components/common/tables/TreeDataTable.vue'

@Component<EduProgramStatisticsTable>({
  components: { TreeDataTable },
  computed: {
    headers (): DataTableHeader[] {
      return [
        { text: 'Направление подготовки', value: 'name' },
        { text: 'Форма обучения', value: 'eduForm', align: 'center' },
        { text: 'Год', value: 'admission', align: 'center' },
        { text: 'Описание', value: 'description', align: 'center' },
        { text: 'Учебный план', value: 'syllabus', align: 'center' },
        { text: 'Календарный учебный график', value: 'calendar', align: 'center' },
        { text: 'Авторы', value: 'users', align: 'center' },
        { text: 'Аннотации', value: 'annotation', align: 'center' },
        { text: 'Рабочие программы', value: 'work_program', align: 'center' },
        { text: 'Методическое обеспечение', value: 'methodological_support', align: 'center' }
      ]
    },
    formatColumns (): string[] {
      return ['description', 'syllabus', 'calendar', 'users', 'annotation', 'work_program', 'methodological_support']
    },
    treeItems (): any {
      return this.buildTreeItems(this.items)
    }
  }
})
export default class EduProgramStatisticsTable extends Vue {
  @Prop({ required: true, type: Array }) items!: EduProgramStatisticsType[]
  formatColumns!: string[]

  buildTreeItems (items: EduProgramStatisticsType[], code: number = 0) {
    const currentCodes = [...new Set(items.map((e: EduProgramStatisticsType) => e.directionCode.split('.').slice(0, code + 1).join('.')))].sort()
    return currentCodes.reduce((a: any, c: string) => {
      const directionDown: boolean = code < c.split('.').length && code < 2
      // Собираем верхушку
      const n: any = {
        id: c,
        name: c,
        children: directionDown
          ? this.buildTreeItems(items.filter((e: EduProgramStatisticsType) => e.directionCode.substr(0, c.length) === c), code + 1)
          : this.buildItemsValue(items.filter((e: EduProgramStatisticsType) => e.directionCode === c))
      }
      // Рассчитываем вверх
      const calculations: any = ['description', 'syllabus', 'calendar', 'users', 'annotation', 'work_program', 'methodological_support'].reduce((a: any, c: string) => {
        return { ...a, [c]: { value: n.children.reduce((a: number, current: any) => a + current[c].value, 0), total: n.children.reduce((a: number, current: any) => a + current[c].total, 0) } }
      }, {})
      return [...a, Object.assign(calculations, n)]
    }, [])
  }

  buildItemsValue (items: EduProgramStatisticsType[]) {
    return items.map((e: EduProgramStatisticsType) => {
      return Object.assign(e.points.reduce((a: any, c: any) => {
        return { ...a, [c.name]: { value: +c.value, total: +c.total } }
      }, {}), e)
    })
  }

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
