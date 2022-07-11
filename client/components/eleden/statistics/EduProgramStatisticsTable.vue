<template lang="pug">
v-row
  v-col(cols="12")
    tree-data-table(:headers="headers" :items="treeItems" disable-pagination hide-default-footer)
      template(v-for="f in formatColumns" v-slot:[`item.${f}`]="{ item }")
        v-tooltip(bottom)
          template(#activator="{ on }")
            span(v-on="on") {{ (item[f].value / item[f].total * 100).toFixed(2) }}%
          div {{ $t('statistics.eduProgramsStatistics.filled') }} {{ item[f].value }}
          div {{ $t('statistics.eduProgramsStatistics.total') }} {{ item[f].total }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataTableHeader } from 'vuetify/types'
import { EduProgramStatisticsType } from '~/types/graphql'
import { useI18n } from '~/composables'
import TreeDataTable from '~/components/common/tables/TreeDataTable.vue'

export default defineComponent({
  components: { TreeDataTable },
  props: {
    items: { required: true, type: Array as PropType<EduProgramStatisticsType[]> }
  },
  setup (props) {
    const { t } = useI18n()

    const headers = computed<DataTableHeader[]>(() => ([
      { text: t('statistics.eduProgramsStatistics.headers.name') as string, value: 'name' },
      { text: t('statistics.eduProgramsStatistics.headers.eduForm') as string, value: 'eduForm', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.admission') as string, value: 'admission', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.description') as string, value: 'description', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.syllabus') as string, value: 'syllabus', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.calendar') as string, value: 'calendar', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.users') as string, value: 'users', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.annotation') as string, value: 'annotation', align: 'center' },
      { text: t('statistics.eduProgramsStatistics.headers.work_program') as string, value: 'work_program', align: 'center' },
      {
        text: t('statistics.eduProgramsStatistics.headers.methodological_support') as string,
        value: 'methodological_support',
        align: 'center'
      }
    ]))

    const formatColumns = computed<string[]>(() => (
      ['description', 'syllabus', 'calendar', 'users', 'annotation', 'work_program', 'methodological_support']
    ))

    const treeItems = computed<any>(() => (buildTreeItems(props.items)))

    const buildTreeItems = (items: EduProgramStatisticsType[], code: number = 0) => {
      const currentCodes = [...new Set(items.map((e: EduProgramStatisticsType) => e.directionCode.split('.').slice(0, code + 1).join('.')))].sort()
      return currentCodes.reduce((a: any, c: string) => {
        const directionDown: boolean = code < c.split('.').length && code < 2
        // Собираем верхушку
        const n: any = {
          id: c,
          name: c,
          children: directionDown
            ? buildTreeItems(items.filter((e: EduProgramStatisticsType) => e.directionCode.substr(0, c.length) === c), code + 1)
            : buildItemsValue(items.filter((e: EduProgramStatisticsType) => e.directionCode === c))
        }
        // Рассчитываем вверх
        const calculations: any = ['description', 'syllabus', 'calendar', 'users', 'annotation', 'work_program', 'methodological_support'].reduce((a: any, c: string) => {
          return { ...a, [c]: { value: n.children.reduce((a: number, current: any) => a + current[c].value, 0), total: n.children.reduce((a: number, current: any) => a + current[c].total, 0) } }
        }, {})
        return [...a, Object.assign(calculations, n)]
      }, [])
    }

    const buildItemsValue = (items: EduProgramStatisticsType[]) => {
      return items.map((e: EduProgramStatisticsType) => {
        return Object.assign(e.points.reduce((a: any, c: any) => {
          return { ...a, [c.name]: { value: +c.value, total: +c.total } }
        }, {}), e)
      })
    }

    return { headers, formatColumns, treeItems, buildTreeItems, buildItemsValue }
  }
})
</script>
