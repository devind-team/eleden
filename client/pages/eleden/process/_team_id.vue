<template lang="pug">
bread-crumbs(v-if="!$apollo.queries.team.loading" :items="bc")
  v-card
    v-card-title {{ t('name') }}
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
          v-text-field(v-stream:input="searchStream$" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6")
          | {{ t('shownOf', { count: courses && courses.length, totalCount }) }}
      v-row
        v-col(cols="12")
          v-data-table(
            :headers="coursesHeaders"
            :items="courses"
            :loading="$apollo.queries.courses.loading"
            disable-pagination
            hide-default-footer
          )
            template(#item.name="{ item }")
              nuxt-link(
                :title="getCourseName(item)"
                :to="localePath({ name: 'eleden-process-courses-course_id', params: { course_id: item.id } })"
              ) {{ getCourseName(item) }}
            template(#item.teachers="{ item }")
              .font-italic(v-if="item.teachers.length === 0") {{ t('tableItem.noSet') }}
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
                  span {{ t('tableItem.actions.change') }}
              apollo-mutation(
                v-if="hasPerm('eleden.delete_course')"
                v-slot="{ mutate, loading }"
                :mutation="require('~/gql/eleden/mutations/process/delete_course.graphql')"
                :variables="{ courseId: item.id }"
                :update="(store, result) => deleteCourseUpdate(store, result, item)"
                tag
              )
                delete-menu(v-slot="{ on: onDelete }" :item-name="t('tableItem.deleteItemName')" @confirm="mutate")
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{ ...onDelete, ...onTooltip }" :loading="loading" color="error" icon)
                        v-icon mdi-delete
                    span {{ t('tableItem.actions.delete') }}
            template(#footer v-if="$apollo.queries.courses.loading")
              v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PropType } from 'vue'
import { DataProxy } from 'apollo-cache'
import { mapGetters } from 'vuex'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { DataTableHeader } from 'vuetify/types'
import { MetaInfo } from 'vue-meta'
import { BreadCrumbsItem } from '~/types/devind'
import {
  UserType,
  TeamType,
  TeamQueryVariables,
  CoursesQueryVariables,
  CourseType,
  DisciplineType,
  WorkKindType,
  DeleteCourseMutationPayload
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import Courses from '~/gql/eleden/queries/process/courses.graphql'

type Semester = {
  id: number,
  value: string
}
type DeleteCourseData = { data: { deleteCourse: DeleteCourseMutationPayload } }

@Component<TeamId>({
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
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        {
          text: this.t('process'),
          to: this.localePath({ name: 'eleden-process' }),
          exact: true
        },
        {
          text: this.team.name,
          to: this.localePath({
            name: 'eleden-process-team_id',
            params: { team_id: this.$route.params.team_id }
          }),
          exact: true
        }
      ]
    },
    semesters (): Semester[] {
      return Array.from({ length: 12 })
        .map((_, i) => ({ id: i + 1, value: this.t('filters.semesterFilter.semester', { number: i + 1 }) }))
    },
    coursesHeaders (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        { text: this.t('tableHeaders.semester'), value: 'semester' },
        { text: this.t('tableHeaders.name'), value: 'name' },
        {
          text: this.t('tableHeaders.teachers'),
          value: 'teachers',
          sort: (t1: UserType[], t2: UserType[]): number => {
            if (t1.length === t2.length) {
              for (let i = 0; i < t1.length; i++) {
                const t1FullName = this.$getUserFullName(t1[i])
                const t2FullName = this.$getUserFullName(t2[i])
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
      if (this.hasPerm(['eleden.change_course', 'eleden.delete_course'], true)) {
        headers.push({ text: this.t('tableHeaders.actions'), value: 'actions', sortable: false, align: 'center' })
      }
      return headers
    },
    coursesVariables (): CoursesQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        teamId: this.$route.params.team_id,
        semester: this.semesterFilter ? this.semesterFilter.id : undefined,
        disciplineIds: this.disciplinesFilter.length
          ? this.disciplinesFilter.map((discipline: DisciplineType) => discipline.id)
          : undefined,
        workKindIds: this.workKindsFilter.length
          ? this.workKindsFilter.map((workKind: WorkKindType) => workKind.id)
          : undefined,
        teachersIds: this.teachersFilter.length
          ? this.teachersFilter.map((teacher: UserType) => teacher.id)
          : undefined,
        search: this.search$ || ''
      }
    }
  },
  apollo: {
    team: {
      query: require('~/gql/eleden/queries/team/team.graphql'),
      variables (): TeamQueryVariables {
        return {
          teamId: this.$route.params.team_id
        }
      }
    },
    courses: {
      query: Courses,
      variables (): CoursesQueryVariables {
        return this.coursesVariables
      },
      update ({ courses }): CourseType[] {
        this.totalCount = courses.totalCount
        this.page = Math.ceil(courses.edges.length / this.pageSize)
        return courses.edges.map((e: { node?: CourseType }) => e.node)
      }
    }
  },
  domStreams: ['searchStream$'],
  subscriptions () {
    const search$ = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      distinctUntilChanged(),
      startWith('')
    )
    const al$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.courses.loading &&
        this.page * this.pageSize < this.totalCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreCourses()
      })
    )
    return { search$, al$ }
  },
  head (): MetaInfo {
    return { title: this.t('process') } as MetaInfo
  }
})
export default class TeamId extends Vue {
  @Prop({ type: Array as PropType<BreadCrumbsItem[]>, required: true }) readonly breadCrumbs!: BreadCrumbsItem[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly bc!: BreadCrumbsItem[]
  readonly semesters!: Semester[]
  readonly coursesHeaders!: DataTableHeader[]
  readonly coursesVariables!: CoursesQueryVariables
  readonly team!: TeamType
  readonly courses!: CourseType[]

  page: number = 1
  pageSize: number = 20
  totalCount: number = 0
  semesterFilter: Semester | null = null
  disciplinesFilter: DisciplineType[] = []
  workKindsFilter: WorkKindType[] = []
  teachersFilter: UserType[] = []
  search$: string = ''
  searchStream$: Subject<any> = new Subject()

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.team.${path}`, values) as string
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
            this.$tc(`process.team.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }

  /**
   * Получение имени курса
   * @param course
   * @return
   */
  getCourseName (course: CourseType): string {
    return `${course.eduHours.discipline!.name}, ${course.eduHours.workKind!.name}`
  }

  /**
   * Получение дополнительных курсов
   */
  async fetchMoreCourses (): Promise<void> {
    await this.$apollo.queries.courses.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.search$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { courses } }: any) => {
        return {
          courses: {
            __typename: previousResult.courses.__typename,
            totalCount: courses.totalCount,
            edges: [...previousResult.courses.edges, ...courses.edges]
          }
        }
      }
    })
  }

  /**
   * Обновление курсов после удаления курса
   * @param store
   * @param success
   * @param course
   */
  deleteCourseUpdate (
    store: DataProxy,
    { data: { deleteCourse: { success } } }: DeleteCourseData,
    course: CourseType
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: Courses, variables: this.coursesVariables })
      data.courses.totalCount -= 1
      data.courses.edges = data.courses.edges.filter(({ node }: { node: CourseType }) => node.id !== course.id)
      store.writeQuery({ query: Courses, variables: this.coursesVariables, data })
    }
  }
}
</script>
