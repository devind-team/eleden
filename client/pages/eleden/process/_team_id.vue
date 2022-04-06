<template lang="pug">
  bread-crumbs(v-if="!teamLoading" :items="bc")
    v-card
      v-card-title {{ $t('process.team.name') }}
      v-card-text
        v-row(align="center")
          v-col
            items-data-filter(
              v-model="semesterFilter"
              v-bind="getFilterMessages('semesterFilter')"
              :items="semesters"
              :get-name="semester => semester.value"
              message-container-class="mr-1 my-1"
            )
            query-data-filter(
              v-model="disciplinesFilter"
              v-bind="getFilterMessages('disciplinesFilter', true)"
              :query="require('~/gql/eleden/queries/education/disciplines.graphql')"
              :variables="{ eduProgramId: team.eduProgram.id }"
              :update="data => data.disciplines.edges.map(e => e.node)"
              :get-name="discipline => `${discipline.code} ${discipline.name}`"
              search-type="server"
              message-container-class="mr-1 my-1"
              multiple
            )
            query-data-filter(
              v-model="workKindsFilter"
              v-bind="getFilterMessages('workKindsFilter', true)"
              :query="require('~/gql/eleden/queries/process/work_kinds.graphql')"
              :update="data => data.workKinds"
              :get-name="workKind => workKind.name"
              :search-function="(item, search) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())"
              search-type="client"
              message-container-class="mr-1 my-1"
              multiple
            )
            users-data-filter(
              v-model="teachersFilter"
              v-bind="getFilterMessages('teachersFilter', true)"
              :query="require('~/gql/eleden/queries/core/users.graphql')"
              :update="(data) => data.users.edges.map(e => e.node)"
              search-type="server"
              message-container-class="mr-1 my-1"
              multiple
            )
        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
          v-col.text-right(cols="12" sm="6")
            | {{ $t('shownOf', { count: courses && courses.length, totalCount }) }}
        v-row
          v-col(cols="12")
            v-data-table(
              :headers="coursesHeaders"
              :items="courses"
              :loading="coursesLoading"
              disable-pagination
              hide-default-footer
            )
              template(#item.name="{ item }")
                nuxt-link(
                  :title="getCourseName(item)"
                  :to="localePath({ name: 'eleden-process-courses-course_id', params: { course_id: item.id } })"
                ) {{ getCourseName(item) }}
              template(#item.teachers="{ item }")
                .font-italic(v-if="item.teachers.length === 0") {{ $t('process.team.tableItem.noSet') }}
                template(v-else)
                  user-link(
                    v-for="(teacher, index) in item.teachers"
                    :key="teacher.id"
                    :user="teacher"
                    :link-class="['my-1', { 'mr-1': index !== item.teachers.length - 1 }]"
                    chip
                  )
              template(#item.actions="{ item }")
                experimental-dialog(v-if="hasPerm('eleden.change_course')" v-slot="{ on: onChange }")
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{ ...onChange, ...onTooltip }" color="success" icon)
                        v-icon mdi-pencil
                    span {{ $t('process.team.tableItem.actions.change') }}
                apollo-mutation(
                  v-if="hasPerm('eleden.delete_course')"
                  v-slot="{ mutate, loading }"
                  :mutation="require('~/gql/eleden/mutations/process/delete_course.graphql')"
                  :variables="{ courseId: item.id }"
                  :update="(cache, result) => deleteUpdate(cache, result)"
                  tag
                )
                  delete-menu(
                    v-slot="{ on: onDelete }"
                    :item-name="$t('process.team.tableItem.deleteItemName')"
                    @confirm="mutate"
                  )
                    v-tooltip(bottom)
                      template(#activator="{ on: onTooltip }")
                        v-btn(v-on="{ ...onDelete, ...onTooltip }" :loading="loading" color="error" icon)
                          v-icon mdi-delete
                      span {{ $t('process.team.tableItem.actions.delete') }}
              template(#footer v-if="coursesLoading")
                v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify/types'
import type { PropType } from '#app'
import { BreadCrumbsItem } from '~/types/devind'
import {
  UserType,
  TeamQuery,
  TeamQueryVariables,
  CoursesQuery,
  CoursesQueryVariables,
  CourseType,
  DisciplineType,
  WorkKindType
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import { useAuthStore } from '~/store'
import {
  useI18n,
  useFilters,
  useQueryRelay,
  useCommonQuery,
  useDebounceSearch,
  useCursorPagination
} from '~/composables'
import teamQuery from '~/gql/eleden/queries/team/team.graphql'
import coursesQuery from '~/gql/eleden/queries/process/courses.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

type SemesterType = {
  id: number,
  value: string
}

export default defineComponent({
  components: {
    BreadCrumbs,
    ItemsDataFilter,
    QueryDataFilter,
    ExperimentalDialog,
    UsersDataFilter,
    UserLink,
    DeleteMenu
  },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { t, localePath, tc } = useI18n()
    const { getUserFullName } = useFilters()
    useNuxt2Meta({ title: t('process.team.process') as string })
    const route = useRoute()

    const semesterFilter = ref<SemesterType | null>(null)
    const disciplinesFilter = ref<DisciplineType[]>([])
    const workKindsFilter = ref<WorkKindType[]>([])
    const teachersFilter = ref<UserType[]>([])

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('process.team.process') as string,
        to: localePath({ name: 'eleden-process' }),
        exact: true
      },
      {
        text: team.value.name,
        to: localePath({
          name: 'eleden-process-team_id',
          params: { team_id: route.params.team_id }
        }),
        exact: true
      }
    ]))

    const semesters = computed<SemesterType[]>(() => {
      return Array.from({ length: 12 })
        .map((_, i) => ({ id: i + 1, value: t('process.team.filters.semesterFilter.semester', { number: i + 1 }) }))
    })

    const coursesHeaders = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        { text: t('process.team.tableHeaders.semester') as string, value: 'semester' },
        { text: t('process.team.tableHeaders.name') as string, value: 'name' },
        {
          text: t('process.team.tableHeaders.teachers') as string,
          value: 'teachers',
          sort: (t1: UserType[], t2: UserType[]): number => {
            if (t1.length === t2.length) {
              for (let i = 0; i < t1.length; i++) {
                const t1FullName = getUserFullName(t1[i])
                const t2FullName = getUserFullName(t2[i])
                const comparisonResult = t1FullName.localeCompare(t2FullName)
                if (comparisonResult !== 0) {
                  return comparisonResult
                }
              }
              return 0
            }
            return t1.length - t2.length
          }
        }
      ]
      if (hasPerm.value(['eleden.change_course', 'eleden.delete_course'], true)) {
        headers.push({
          text: t('process.team.tableHeaders.actions') as string,
          value: 'actions',
          sortable: false,
          align: 'center'
        })
      }
      return headers
    })

    const getFilterMessages = (filterName: string, multiple: boolean = false): FilterMessages => {
      return {
        title: t(`process.team.filters.${filterName}.title`) as string,
        noFiltrationMessage: t(`process.team.filters.${filterName}.noFiltrationMessage`) as string,
        multipleMessageFunction: multiple
          ? (name, restLength) =>
              tc(`process.team.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
          : undefined
      }
    }

    const getCourseName = (course: CourseType): string => {
      return `${course.eduHours.discipline!.name}, ${course.eduHours.workKind!.name}`
    }

    const { data: team, loading: teamLoading } = useCommonQuery<TeamQuery, TeamQueryVariables>({
      document: teamQuery,
      variables: () => ({ teamId: route.params.team_id })
    })

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: courses,
      loading: coursesLoading,
      pagination: { totalCount },
      deleteUpdate
    } = useQueryRelay<CoursesQuery, CoursesQueryVariables>({
      document: coursesQuery,
      variables: () => ({
        offset: 0,
        teamId: route.params.team_id,
        semester: semesterFilter.value ? semesterFilter.value.id : undefined,
        disciplineIds: disciplinesFilter.value.length
          ? disciplinesFilter.value.map((discipline: DisciplineType) => discipline.id)
          : undefined,
        workKindIds: workKindsFilter.value.length
          ? workKindsFilter.value.map((workKind: WorkKindType) => workKind.id)
          : undefined,
        teachersIds: teachersFilter.value.length
          ? teachersFilter.value.map((teacher: UserType) => teacher.id)
          : undefined,
        search: debounceSearch.value || ''
      })
    },
    {
      pagination: useCursorPagination({ pageSize: 20 }),
      fetchScroll: typeof document === 'undefined' ? null : document
    })

    return {
      hasPerm,
      semesterFilter,
      disciplinesFilter,
      workKindsFilter,
      teachersFilter,
      bc,
      semesters,
      coursesHeaders,
      team,
      teamLoading,
      courses,
      coursesLoading,
      search,
      totalCount,
      deleteUpdate,
      getFilterMessages,
      getCourseName
    }
  }
})
</script>
