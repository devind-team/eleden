<template lang="pug">
  v-card.summary_report
    v-card-title {{ t('name') }}
    v-card-text
      v-row(align="center")
        v-col(cols="12" sm="6" md="8")
          users-data-filter(
            v-model="usersFilter"
            :users="users"
            message-container-class="mr-1 my-1"
            multiple
          )
          items-data-filter(
            v-model="columnsFilter"
            v-bind="getFilterMessages('columnsFilter')"
            :items="columnsFilterItems"
            :get-name="columnsFilterItem => columnsFilterItem.text"
            message-container-class="mr-1 my-1"
          )
          items-data-filter(
            v-model="semestersFilter"
            v-bind="getFilterMessages('semestersFilter', true)"
            :items="semesters"
            :get-name="semester => semester.text"
            message-container-class="mr-1 my-1"
            multiple
          )
          items-data-filter(
            v-model="workKindsFilter"
            v-bind="getFilterMessages('workKindsFilter', true)"
            :items="workKinds"
            :get-name="workKind => workKind.name"
            message-container-class="mr-1 my-1"
            multiple
          )
          items-data-filter(
            v-model="disciplinesFilter"
            v-bind="getFilterMessages('disciplinesFilter', true)"
            :items="disciplines"
            :get-name="discipline => discipline.name"
            :search-function="searchDiscipline"
            message-container-class="mr-1 my-1"
            multiple
          )
        v-col.text-right(v-if="hasPerm('core.view_experimental')" sm="6" md="4")
          experimental-dialog(v-slot="{ on }")
            v-btn(v-on="on" color="success")
              v-icon(left) mdi-upload
              | {{ t('buttons.upload') }}
      v-row
        v-col
          v-data-table.data-table(
            :class="dataTableClasses"
            :headers="headers"
            :items="rows"
            :loading="loading"
            :hide-default-header="!isMobile"
            disable-pagination
            hide-default-footer
            dense
          )
            template(#header="{ isMobile }" v-if="!loading")
              thead(v-if="!isMobile")
                tr
                  th(
                    :class="userHeader.class"
                    :style="{ minWidth: `${userHeader.width}px` }"
                    rowspan="3"
                  ) {{ userHeader.text }}
                  th(
                    v-for="semesterHeader in semesterHeaders"
                    :key="semesterHeader.key"
                    :colspan="semesterHeader.colspan"
                    :style="{ textAlign: semesterHeader.align }"
                  ) {{ semesterHeader.text }}
                tr
                  th(
                    v-for="workKindHeader in workKindHeaders"
                    :key="workKindHeader.key"
                    :colspan="workKindHeader.colspan"
                    :style="{ textAlign: workKindHeader.align }"
                  ) {{ workKindHeader.text }}
                tr
                  th(
                    v-for="eduHoursHeader in eduHoursHeaders"
                    :key="eduHoursHeader.key"
                    :style="{ minWidth: `${eduHoursHeader.width}px`, textAlign: eduHoursHeader.align }"
                  ) {{ eduHoursHeader.text }}
            template(#item.user="{ item }")
              user-link(:user="item.user")
            template(v-for="eduHours in filteredEduHours" v-slot:[`item.marks.${eduHours.id}`]="{ item }")
              v-tooltip(v-if="item.marks[eduHours.id]" bottom)
                template(#activator="{ on }")
                  span(v-on="on") {{ item.marks[eduHours.id].shortName }}
                span {{ item.marks[eduHours.id].name }}
              strong(v-else) &mdash;
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify'
import {
  UserType,
  TeamType,
  DisciplineType,
  AttestationType,
  RegistrationType,
  EduHoursType,
  WorkKindType,
  TeamsSummaryReportQueryVariables,
  UsersSummaryReportQueryVariables,
  TeamSummaryReportType
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

type ColumnsFilterValue = 'noMarks' | 'anyMark' | 'allMarks'
type ColumnsFilterItem = { id: string, value: ColumnsFilterValue, text: string }
type Classes = (string | { [key: string]: boolean })[]
type Semester = { id: number, text: string }
type TopHeader = Omit<DataTableHeader, 'value'> & { key: string, colspan: number }
type EduHoursHeader = DataTableHeader & { key: string }
type Row = { user: UserType, marks: { [eduHoursId: string]: RegistrationType | null } }

@Component<SummaryReport>({
  components: { UsersDataFilter, ItemsDataFilter, ExperimentalDialog, UserLink },
  middleware: 'auth',
  beforeRouteEnter (_to, _from, next) {
    next((vm) => {
      if (!(vm.canViewSummaryReport || vm.isMember)) {
        vm.$nuxt.error({
          statusCode: 403,
          message: vm.$t('permissionDenied') as string
        })
      }
    })
  },
  computed: {
    ...mapGetters({ user: 'auth/user', hasPerm: 'auth/hasPerm' }),
    isMobile (): boolean {
      return this.$vuetify.breakpoint.mobile
    },
    loading (): boolean {
      return this.canViewSummaryReport
        ? this.$apollo.queries.teamsSummaryReport.loading
        : this.$apollo.queries.usersSummaryReport.loading
    },
    summaryReport (): TeamSummaryReportType[] {
      return (this.canViewSummaryReport ? this.teamsSummaryReport : this.usersSummaryReport) || []
    },
    users (): UserType[] {
      return this.canViewSummaryReport ? this.team.jobs.map(job => job.user) : [this.user]
    },
    filteredUsers (): UserType[] {
      if (!this.usersFilter.length) {
        return this.users
      }
      return this.usersFilter
    },
    columnsFilterItems (): ColumnsFilterItem[] {
      return [
        { id: '1', value: 'noMarks', text: this.t('filters.columnsFilter.noMarks') },
        { id: '2', value: 'anyMark', text: this.t('filters.columnsFilter.anyMark') },
        { id: '3', value: 'allMarks', text: this.t('filters.columnsFilter.allMarks') }
      ]
    },
    eduHours (): EduHoursType[] {
      if (!this.summaryReport.length) {
        return []
      }
      return this.summaryReport[0].eduHours
    },
    filteredEduHours (): EduHoursType[] {
      let eduHours = this.eduHours
      if (this.columnsFilter) {
        if (this.columnsFilter.value === 'noMarks') {
          eduHours = this.eduHours.filter(
            eduHours => !this.attestations.find(mark => mark.course.eduHours.id === eduHours.id))
        } else if (this.columnsFilter.value === 'anyMark') {
          eduHours = this.eduHours.filter(
            eduHours => !!this.attestations.find(mark => mark.course.eduHours.id === eduHours.id))
        } else if (this.columnsFilter.value === 'allMarks') {
          eduHours = this.eduHours.filter(
            eduHours => this.attestations.filter(
              mark => mark.course.eduHours.id === eduHours.id).length === this.users.length)
        }
      }
      if (this.semestersFilter.length) {
        eduHours = eduHours.filter(eduHours =>
          !!this.semestersFilter.find(semester => this.getSemester(eduHours) === semester.id))
      }
      if (this.workKindsFilter.length) {
        eduHours = eduHours.filter(eduHours =>
          !!this.workKindsFilter.find(workKind => eduHours.workKind.id === workKind.id))
      }
      if (this.disciplinesFilter.length) {
        eduHours = eduHours.filter(eduHours =>
          !!this.disciplinesFilter.find(discipline => eduHours.discipline.id === discipline.id))
      }
      return eduHours
    },
    attestations (): AttestationType[] {
      if (!this.summaryReport.length) {
        return []
      }
      return this.summaryReport[0].attestations
    },
    semesters (): Semester[] {
      return [...new Set(this.eduHours.map(this.getSemester))].map((semester: any) => ({
        id: semester,
        text: this.t('semester', { number: semester })
      }))
    },
    filteredSemesters (): Semester[] {
      return [...new Set(this.filteredEduHours.map(this.getSemester))].map((semester: any) => ({
        id: semester,
        text: this.t('semester', { number: semester })
      }))
    },
    workKinds (): WorkKindType[] {
      const workKinds = this.eduHours.map(eduHours => eduHours.workKind)
      return workKinds.filter((w1, index) => workKinds.findIndex(w2 => w1.id === w2.id) === index)
    },
    disciplines (): DisciplineType[] {
      const disciplines = this.eduHours.map(eduHours => eduHours.discipline)
      return disciplines.filter((d1, index) => disciplines.findIndex(d2 => d1.id === d2.id) === index)
    },
    dataTableClasses (): Classes {
      return [
        this.$vuetify.theme.dark ? 'data-table_dark' : 'data-table_light',
        { 'data-table_loading': this.loading }
      ]
    },
    userHeader (): DataTableHeader {
      return {
        text: this.t('dataTableHeaders.user'),
        value: 'user',
        width: 175,
        class: 'sticky user-column-cell user-column-header-cell',
        cellClass: 'sticky user-column-cell'
      }
    },
    semesterHeaders (): TopHeader[] {
      return this.filteredSemesters.map(semester => ({
        key: String(semester.id),
        text: semester.text,
        colspan: this.filteredEduHours.filter(eduHours => this.getSemester(eduHours) === semester.id).length,
        align: 'center'
      }))
    },
    workKindHeaders (): TopHeader[] {
      return this.filteredSemesters.reduce((acc, semester) => {
        const eduHours = this.filteredEduHours.filter(eduHours => this.getSemester(eduHours) === semester.id)
        const workKinds = eduHours.map(eduHours => eduHours.workKind)
        const uniqueWorkKinds = workKinds.filter((w1, index) => workKinds.findIndex(w2 => w1.id === w2.id) === index)
        return [...acc, ...uniqueWorkKinds.map(workKind => ({
          key: `${semester.id}${workKind.id}`,
          text: workKind.name,
          colspan: eduHours.filter(eduHours => eduHours.workKind.id === workKind.id).length,
          align: 'center'
        })) as TopHeader[]]
      }, [] as TopHeader[])
    },
    eduHoursHeaders (): EduHoursHeader[] {
      return this.filteredEduHours.map((eduHours) => {
        return {
          key: eduHours.id,
          text: this.isMobile
            ? `${eduHours.discipline.name} (${this.t('semester', { number: this.getSemester(eduHours) })}` +
              `, ${eduHours.workKind.shortName})`
            : eduHours.discipline.name,
          value: `marks.${eduHours.id}`,
          width: 150,
          align: 'center'
        }
      })
    },
    headers (): DataTableHeader[] {
      return [this.userHeader, ...this.eduHoursHeaders]
    },
    rows (): Row[] {
      if (!this.summaryReport.length) {
        return []
      }
      return this.filteredUsers.map(user => ({
        user,
        marks: this.filteredEduHours.reduce((acc, eduHours) => {
          const attestation = this.attestations.find(
            attestation => attestation.user.id === user.id &&
              attestation.course.eduHours.id === eduHours.id
          )
          return {
            ...acc,
            [eduHours.id]: attestation ? attestation.registration : null
          }
        }, {})
      }))
    }
  },
  apollo: {
    teamsSummaryReport: {
      query: require('~/gql/eleden/queries/process/teams_summary_report.graphql'),
      variables (): TeamsSummaryReportQueryVariables {
        return { teamIds: [this.team.id] }
      },
      skip () {
        return !this.canViewSummaryReport
      }
    },
    usersSummaryReport: {
      query: require('~/gql/eleden/queries/process/users_summary_report.graphql'),
      variables (): UsersSummaryReportQueryVariables {
        return { userIds: [String(this.user.id)] }
      },
      skip () {
        return this.canViewSummaryReport
      }
    }
  }
})
export default class SummaryReport extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Boolean, required: true }) readonly isMember!: boolean
  @Prop({ type: Boolean, required: true }) readonly canViewSummaryReport!: boolean

  readonly user!: UserType
  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly isMobile!: boolean
  readonly loading!: boolean
  readonly summaryReport!: TeamSummaryReportType[]
  readonly users!: UserType[]
  readonly filteredUsers!: UserType[]
  readonly columnsFilterItems!: ColumnsFilterItem[]
  readonly eduHours!: EduHoursType[]
  readonly filteredEduHours!: EduHoursType[]
  readonly attestations!: AttestationType[]
  readonly semesters!: Semester[]
  readonly filteredSemesters!: Semester[]
  readonly workKinds!: WorkKindType[]
  readonly disciplines!: DisciplineType[]
  readonly dataTableClasses!: Classes
  readonly userHeader!: DataTableHeader
  readonly semesterHeaders!: TopHeader[]
  readonly workKindHeaders!: TopHeader[]
  readonly eduHoursHeaders!: EduHoursHeader[]
  readonly headers!: DataTableHeader[]
  readonly rows!: Row[]
  readonly teamsSummaryReport!: TeamSummaryReportType[] | undefined
  readonly usersSummaryReport!: TeamSummaryReportType[] | undefined

  usersFilter: UserType[] = []
  columnsFilter: ColumnsFilterItem | null = null
  semestersFilter: Semester[] = []
  workKindsFilter: WorkKindType[] = []
  disciplinesFilter: DisciplineType[] = []

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.summaryReport.${path}`, values) as string
  }

  /**
   * Получение номера семестра
   * @param eduHours
   * @return
   */
  getSemester (eduHours: EduHoursType): number {
    return (eduHours.courseNumber - 1) * 2 + eduHours.semesterNumber
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
            this.$tc(`ac.teams.summaryReport.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }

  /**
   * Поиск дисциплины
   * @param discipline
   * @param search
   * @return
   */
  searchDiscipline (discipline: DisciplineType, search: string): boolean {
    return discipline.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }
}
</script>

<style lang="sass">
  @use "sass:list"
  @use "sass:map"
  @import '~vuetify/src/styles/styles.sass'

  $light: rgba(0, 0, 0, .12)
  $dark: rgba(255, 255, 255, .12)
  $light-border: thin solid $light
  $dark-border: thin solid $dark
  @function create-shadow-border($color)
    $top-bottom: ('top': inset 0 1px 0 0 $color, 'bottom': inset 0 -1px 0 0 $color)
    $left-right: ('left': inset 1px 0 0 0 $color, 'right': inset -1px 0 0 0 $color)
    @return map.merge($top-bottom, $left-right)
  @function map-multiple-get($map, $keys...)
    $result: ()
    @each $key in $keys
      $result: list.append($result, map.get($map, $key), $separator: comma)
    @return $result
  $light-shadow-border: create-shadow-border($light)
  $dark-shadow-border: create-shadow-border($dark)
  @mixin create-data-table($theme, $color, $border, $shadow-border)
    .v-data-table__wrapper
      tbody
        tr:last-child
          td
            box-shadow: map.get($shadow-border, 'bottom') !important
          td:first-child.user-column-cell
            box-shadow: map-multiple-get($shadow-border, 'right', 'bottom', 'left') !important
      tr:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
        td, th
          border-radius: 0 !important
          border-right: $border
        th
          border-top: $border
      tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
        td
          background: map-deep-get($theme, 'table', 'hover')
      .user-column-cell
        background: $color
        box-shadow: map-multiple-get($shadow-border, 'right', 'bottom', 'left')
      .user-column-header-cell
        box-shadow: map-multiple-get($shadow-border, 'top', 'right', 'bottom', 'left')
  .summary_report
    .data-table:not(.data-table_loading):not(.v-data-table--mobile)
      table
        border-collapse: separate
        .user-column-cell
          left: 0
          z-index: 1 !important
          border: none !important
        .user-column-header-cell
          z-index: 3 !important
    .data-table_light:not(.data-table_loading):not(.v-data-table--mobile)
      @include create-data-table($material-light, #FFFFFF, $light-border, $light-shadow-border)
    .data-table_dark:not(.data-table_loading):not(.v-data-table--mobile)
      @include create-data-table($material-dark, #1E1E1E, $dark-border, $dark-shadow-border)
</style>
