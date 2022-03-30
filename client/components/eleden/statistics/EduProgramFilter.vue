<template lang="pug">
  v-row
    v-col(cols="12" md="8")
      query-data-filter(
        v-model="syncedDirectionsFilter"
        v-bind="getFilterMessages('directionsFilter', true)"
        :query="require('~/gql/eleden/queries/education/directions.graphql')"
        :update="data => data.directions"
        :get-name="direction => `${direction.code} ${direction.name}`"
        max-width="600"
        max-height="600"
        message-container-class="mr-1 my-1"
        modal
        multiple
      )
        template(#search="{ searchLabel, loading }")
          v-card-text.flex-shrink-0
            v-text-field(
              v-model="directionsSearch"
              :label="searchLabel"
              :loading="loading"
              prepend-icon="mdi-magnify"
              hide-details
              clearable
            )
        template(#items="{ items, getSelected, setSelected }")
          v-treeview(
            :value="items.filter(getSelected)"
            :items="buildDirectionsTree(items)"
            :search="directionsSearch"
            :filter="(direction, search) => filterDirections(direction, search, getSelected)"
            selectable
            return-object
            @input="selectDirections(items, $event, setSelected)"
          )
      items-data-filter(
        v-model="syncedYearsFilter"
        v-bind="getFilterMessages('yearsFilter', true)"
        :items="years"
        :get-name="year => year.text"
        message-container-class="mr-1 my-1"
        multiple
        has-select-all
      )
      query-data-filter(
        v-model="syncedEduFormsFilter"
        v-bind="getFilterMessages('eduFormsFilter', true)"
        :query="require('~/gql/eleden/queries/education/edu_forms.graphql')"
        :update="data => data.eduForms"
        :get-name="eduForm => eduForm.name"
        message-container-class="mr-1 my-1"
        multiple
        has-select-all
      )
    v-col.text-md-right(cols="12" md="4")
      v-btn-toggle(v-model="syncedView")
        v-tooltip(v-for="v in ['chart-arc', 'table']" :key="v" bottom)
          template(#activator="{ on }")
            v-btn(v-on="on" :value="v" icon)
              v-icon mdi-{{ v }}
          span {{ t(`view.${v}`) }}
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'
import { PropType } from 'vue'
import { DirectionType, EduFormType } from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

export type View = 'chart-arc' | 'table'
export type Year = {
  id: string | number,
  text: string
}
type DirectionFilter = {
  id: string,
  name: string,
  children: DirectionFilter[] | DirectionType[]
}

@Component<EduProgramFilter>({
  components: { ItemsDataFilter, QueryDataFilter },
  computed: {
    years (): Year[] {
      const start: number = 2017
      const year = new Date().getFullYear() + 2
      return Array.from(Array(year - start).keys())
        .map((y: number) => y + start).reverse()
        .map((y: number) => ({ id: y, text: this.t('filters.yearsFilter.year', { year: y }) }))
    }
  }
})
export default class EduProgramFilter extends Vue {
  @PropSync('directionsFilter', { type: Array as PropType<DirectionType[]>, required: true })
    syncedDirectionsFilter!: DirectionType[]

  @PropSync('yearsFilter', { type: Array as PropType<Year[]>, required: true })
    syncedYearsFilter!: Year[]

  @PropSync('eduFormsFilter', { type: Array as PropType<EduFormType[]>, required: true })
    syncedEduFormsFilter!: EduFormType[]

  @PropSync('view', { type: String, required: true }) syncedView!: View

  readonly years!: Year[]

  directionsSearch: string = ''

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`statistics.eduProgramsStatistics.${path}`, values) as string
  }

  /**
   * Получение сообщений для фильтра
   * @param filterName
   * @param multiple
   * @return
   */
  getFilterMessages (filterName: string, multiple: boolean = false): FilterMessages {
    return {
      title: this.t(`filters.${filterName}.title`),
      noFiltrationMessage: this.t(`filters.${filterName}.noFiltrationMessage`),
      multipleMessageFunction: multiple
        ? (name, restLength) =>
            this.$tc(
              `statistics.eduProgramsStatistics.filters.${filterName}.multipleMessage`,
              restLength, { name, restLength }
            )
        : undefined
    }
  }

  /**
   * Построение дерева направлений подготовки
   * @param directions
   * @param substrLength
   * @return
   */
  buildDirectionsTree (directions: DirectionType[], substrLength: number = 2): DirectionFilter[] {
    const codes: string[] = [
      ...new Set(directions.map((d: DirectionType) => d.code?.substr(0, substrLength)))
    ] as string[]
    return codes.map((code: string) => {
      const children = directions.filter((d: DirectionType) => d.code?.substr(0, code.length) === code)
      return {
        id: code,
        code,
        name: `${code}` + Array.from({ length: (8 - substrLength) / 3 }).map(_ => '.xx').join(''),
        children: substrLength < 5 ? this.buildDirectionsTree(children, substrLength + 3) : children
      }
    })
  }

  /**
   * Фильтрация направлений подготовки
   * @param direction
   * @param search
   * @param getSelected
   */
  filterDirections (
    direction: DirectionFilter | DirectionType,
    search: string,
    getSelected: (direction: DirectionType) => boolean
  ): boolean {
    if ('__typename' in direction) {
      return direction.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || getSelected(direction)
    }
    return direction.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      (direction as DirectionFilter).children
        .some((child: DirectionFilter | DirectionType) => this.filterDirections(child, search, getSelected))
  }

  /**
   * Выбор направлений подготовки
   * @param allDirections
   * @param directions
   * @param setSelected
   */
  selectDirections (
    allDirections: DirectionType[],
    directions: DirectionType[],
    setSelected: (direction: DirectionType, selected: boolean) => void
  ): void {
    allDirections.forEach(direction => setSelected(direction, false))
    directions.forEach(direction => setSelected(direction, true))
  }
}
</script>
