<template lang="pug">
v-card.summary_report
  v-card-title {{ $t('ac.teams.summaryReport.name') }}
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
            | {{ $t('ac.teams.summaryReport.buttons.upload') }}
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
import type { PropType } from '#app'
import { DataTableHeader } from 'vuetify'
import {
  UserType,
  TeamType,
  DisciplineType,
  AttestationType,
  RegistrationType,
  EduHoursType,
  WorkKindType,
  TeamsSummaryReportQuery,
  TeamsSummaryReportQueryVariables,
  UsersSummaryReportQuery,
  UsersSummaryReportQueryVariables,
  TeamSummaryReportType
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import { useAuthStore } from '~/store'
import { useCommonQuery, useI18n } from '~/composables'
import teamsSummaryReportQuery from '~/gql/eleden/queries/process/teams_summary_report.graphql'
import usersSummaryReportQuery from '~/gql/eleden/queries/process/users_summary_report.graphql'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

type ColumnsFilterValueType = 'noMarks' | 'anyMark' | 'allMarks'
type ColumnsFilterItemType = { id: string, value: ColumnsFilterValueType, text: string }
type ClassesType = (string | { [key: string]: boolean })[]
type SemesterType = { id: number, text: string }
type TopHeaderType = Omit<DataTableHeader, 'value'> & { key: string, colspan: number }
type EduHoursHeaderType = DataTableHeader & { key: string }
type RowType = { user: UserType, marks: { [eduHoursId: string]: RegistrationType | null } }

export default defineComponent({
  components: { UsersDataFilter, ItemsDataFilter, ExperimentalDialog, UserLink },
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
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    isMember: { type: Boolean, required: true },
    canViewSummaryReport: { type: Boolean, required: true }
  },
  setup (props) {
    const userStore = useAuthStore()
    const { hasPerm, user } = toRefs(userStore)
    const { t, tc } = useI18n()

    const usersFilter = ref<UserType[]>([])
    const columnsFilter = ref<ColumnsFilterItemType | null>(null)
    const semestersFilter = ref<SemesterType[]>([])
    const workKindsFilter = ref<WorkKindType[]>([])
    const disciplinesFilter = ref<DisciplineType[]>([])

    const isMobile = computed<boolean>(() => (useNuxtApp().$vuetify.breakpoint.mobile))

    const loading = computed<boolean>(() => (
      props.canViewSummaryReport ? teamsSummaryReportLoading.value : usersSummaryReportLoading.value
    ))

    const summaryReport = computed<TeamSummaryReportType[]>(() => (
      (props.canViewSummaryReport ? teamsSummaryReport.value : usersSummaryReport.value) || []
    ))

    const users = computed<UserType[]>(() => (
      props.canViewSummaryReport ? props.team.jobs.map(job => job.user) : [user.value]
    ))

    const filteredUsers = computed<UserType[]>(() => {
      if (!usersFilter.value.length) {
        return users.value
      }
      return usersFilter.value
    })

    const columnsFilterItems = computed<ColumnsFilterItemType[]>(() => ([
      { id: '1', value: 'noMarks', text: t('ac.teams.summaryReport.filters.columnsFilter.noMarks') },
      { id: '2', value: 'anyMark', text: t('ac.teams.summaryReport.filters.columnsFilter.anyMark') },
      { id: '3', value: 'allMarks', text: t('ac.teams.summaryReport.filters.columnsFilter.allMarks') }
    ]))

    const eduHours = computed<EduHoursType[]>(() => {
      if (!summaryReport.value.length) {
        return []
      }
      return summaryReport.value[0].eduHours
    })

    const filteredEduHours = computed<EduHoursType[]>(() => {
      let eduHoursValue = eduHours.value
      if (columnsFilter.value) {
        if (columnsFilter.value.value === 'noMarks') {
          eduHoursValue = eduHours.value.filter(
            eduHours => !attestations.value.find(mark => mark.course.eduHours.id === eduHours.id))
        } else if (columnsFilter.value.value === 'anyMark') {
          eduHoursValue = eduHours.value.filter(
            eduHours => !!attestations.value.find(mark => mark.course.eduHours.id === eduHours.id))
        } else if (columnsFilter.value.value === 'allMarks') {
          eduHoursValue = eduHours.value.filter(
            eduHours => attestations.value.filter(
              mark => mark.course.eduHours.id === eduHours.id).length === users.value.length)
        }
      }
      if (semestersFilter.value.length) {
        eduHoursValue = eduHours.filter(eduHours =>
          !!semestersFilter.value.find(semester => getSemester(eduHours) === semester.id))
      }
      if (workKindsFilter.value.length) {
        eduHoursValue = eduHours.filter(eduHours =>
          !!workKindsFilter.value.find(workKind => eduHours.workKind.id === workKind.id))
      }
      if (disciplinesFilter.value.length) {
        eduHoursValue = eduHours.filter(eduHours =>
          !!disciplinesFilter.value.find(discipline => eduHours.discipline.id === discipline.id))
      }
      return eduHoursValue
    })

    const attestations = computed<AttestationType[]>(() => {
      if (!summaryReport.value.length) {
        return []
      }
      return summaryReport.value[0].attestations
    })

    const semesters = computed<SemesterType[]>(() => (
      [...new Set(eduHours.value.map(getSemester))].map((semester: any) => ({
        id: semester,
        text: t('ac.teams.summaryReport.semester', { number: semester })
      }))
    ))

    const filteredSemesters = computed<SemesterType[]>(() => (
      [...new Set(filteredEduHours.value.map(getSemester))].map((semester: any) => ({
        id: semester,
        text: t('ac.teams.summaryReport.semester', { number: semester })
      }))
    ))

    const workKinds = computed<WorkKindType[]>(() => {
      const workKinds = eduHours.value.map(eduHours => eduHours.workKind)
      return workKinds.filter((w1, index) => workKinds.findIndex(w2 => w1.id === w2.id) === index)
    })

    const disciplines = computed<DisciplineType[]>(() => {
      const disciplines = eduHours.value.map(eduHours => eduHours.discipline)
      return disciplines.filter((d1, index) => disciplines.findIndex(d2 => d1.id === d2.id) === index)
    })

    const dataTableClasses = computed<ClassesType>(() => ([
      useNuxtApp().$vuetify.theme.dark ? 'data-table_dark' : 'data-table_light',
      { 'data-table_loading': loading.value }
    ]))

    const userHeader = computed<DataTableHeader>(() => ({
      text: t('ac.teams.summaryReport.dataTableHeaders.user'),
      value: 'user',
      width: 175,
      class: 'sticky user-column-cell user-column-header-cell',
      cellClass: 'sticky user-column-cell'
    }))

    const semesterHeaders = computed<TopHeaderType[]>(() => (
      filteredSemesters.value.map(semester => ({
        key: String(semester.id),
        text: semester.text,
        colspan: filteredEduHours.value.filter(eduHours => getSemester(eduHours) === semester.id).length,
        align: 'center'
      }))
    ))

    const workKindHeaders = computed<TopHeaderType[]>(() => (
      filteredSemesters.value.reduce((acc, semester) => {
        const eduHours = filteredEduHours.value.filter(eduHours => getSemester(eduHours) === semester.id)
        const workKinds = eduHours.map(eduHours => eduHours.workKind)
        const uniqueWorkKinds = workKinds.filter((w1, index) => workKinds.findIndex(w2 => w1.id === w2.id) === index)
        return [...acc, ...uniqueWorkKinds.map(workKind => ({
          key: `${semester.id}${workKind.id}`,
          text: workKind.name,
          colspan: eduHours.filter(eduHours => eduHours.workKind.id === workKind.id).length,
          align: 'center'
        })) as TopHeaderType[]]
      }, [] as TopHeaderType[])
    ))

    const eduHoursHeaders = computed<EduHoursHeaderType[]>(() => (
      filteredEduHours.value.map((eduHours) => {
        return {
          key: eduHours.id,
          text: isMobile.value
            ? `${eduHours.discipline.name} (${t('ac.teams.summaryReport.semester', { number: getSemester(eduHours) })}` +
              `, ${eduHours.workKind.shortName})`
            : eduHours.discipline.name,
          value: `marks.${eduHours.id}`,
          width: 150,
          align: 'center'
        }
      })
    ))

    const headers = computed<DataTableHeader[]>(() => ([userHeader.value, ...eduHoursHeaders.value]))

    const rows = computed<RowType[]>(() => {
      if (!summaryReport.value.length) {
        return []
      }
      return filteredUsers.value.map(user => ({
        user,
        marks: filteredEduHours.value.reduce((acc, eduHours) => {
          const attestation = attestations.value.find(
            attestation => attestation.user.id === user.id &&
              attestation.course.eduHours.id === eduHours.id
          )
          return {
            ...acc,
            [eduHours.id]: attestation ? attestation.registration : null
          }
        }, {})
      }))
    })

    const {
      data: teamsSummaryReport,
      loading: teamsSummaryReportLoading
    } = useCommonQuery<TeamsSummaryReportQuery, TeamsSummaryReportQueryVariables>({
      document: teamsSummaryReportQuery,
      variables: () => ({ teamIds: [props.team.id] }),
      options: () => ({
        enabled: props.canViewSummaryReport
      })
    })

    const {
      data: usersSummaryReport,
      loading: usersSummaryReportLoading
    } = useCommonQuery<UsersSummaryReportQuery, UsersSummaryReportQueryVariables>({
      document: usersSummaryReportQuery,
      variables: () => ({ userIds: [String(user.value.id)] }),
      options: () => ({
        enabled: !props.canViewSummaryReport
      })
    })

    const getSemester = (eduHours: EduHoursType): number => {
      return (eduHours.courseNumber - 1) * 2 + eduHours.semesterNumber
    }

    const getFilterMessages = (filterName: string, multiple: boolean = false): FilterMessages => {
      return {
        title: t(`ac.teams.summaryReport.filters.${filterName}.title`),
        noFiltrationMessage: t(`ac.teams.summaryReport.filters.${filterName}.noFiltrationMessage`),
        multipleMessageFunction: multiple
          ? (name, restLength) =>
              tc(`ac.teams.summaryReport.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
          : undefined
      }
    }

    const searchDiscipline = (discipline: DisciplineType, search: string): boolean => {
      return discipline.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    }

    return {
      hasPerm,
      usersFilter,
      columnsFilter,
      semestersFilter,
      workKindsFilter,
      disciplinesFilter,
      isMobile,
      loading,
      users,
      columnsFilterItems,
      filteredEduHours,
      semesters,
      workKinds,
      disciplines,
      dataTableClasses,
      userHeader,
      semesterHeaders,
      workKindHeaders,
      eduHoursHeaders,
      headers,
      rows,
      getFilterMessages,
      searchDiscipline
    }
  }
})
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
