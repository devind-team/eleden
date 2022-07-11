<template lang="pug">
.courses-form
  validation-provider(
    v-slot="{ errors, valid }"
    :name="t('team')"
    rules="required"
    ref="teamProvider"
  )
    v-autocomplete(
      v-model="input.team"
      v-stream:update:search-input="searchStreamTeams$"
      :disabled="edit"
      :loading="$apollo.queries.teams.loading"
      :label="t('team')"
      :items="teams"
      :filter="filterTeams"
      :error-messages="getTeamErrors(errors)"
      :success="valid"
      item-value="id"
      hide-no-data
      hide-selected
      return-object
      @change="clear(false)"
    )
      template(#selection="{ item }") {{ item.name }} ({{ item.shortName }}, {{ item.admission }})
      template(#item="{ item }") {{ item.name }} ({{ item.shortName }}, {{ item.admission }})
  v-row.flex-grow-0
    v-col(cols="6")
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('courseNumber')"
        rules="required"
        ref="courseNumberProvider"
      )
        v-select(
          v-model="courseNumber"
          :disabled="!hasEduProgram"
          :loading="$apollo.queries.coursesNumbers.loading"
          :items="coursesNumbers"
          :label="t('courseNumber')"
          :error-messages="errors"
          :success="valid"
          @change="clearDiscipline"
        )
    v-col(cols="6")
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('courseNumber')"
        rules="required"
        ref="semesterNumberProvider"
      )
        v-select(
          v-model="semesterNumber"
          :disabled="!hasEduProgram"
          :items="[1, 2]"
          :label="t('semesterNumber')"
          :error-messages="errors"
          :success="valid"
          @change="clearDiscipline"
        )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="t('discipline')"
    rules="required"
    ref="disciplineProvider"
  )
    v-autocomplete(
      v-model="input.discipline"
      :disabled="!hasEduProgram || !hasSemester"
      :loading="$apollo.queries.disciplines.loading"
      :label="t('discipline')"
      :items="disciplines"
      :filter="filterDisciplines"
      :error-messages="getDisciplineErrors(errors)"
      :success="valid"
      item-value="id"
      hide-no-data
      hide-selected
      return-object
      @change="$event && fillCourses()"
    )
      template(#selection="{ item }") {{ item.code }} {{ item.name }}
      template(#item="{ item }") {{ item.code }} {{ item.name }}
  v-data-table(
    :headers="tableHeaders"
    :items="input.courses"
    :loading="coursesLoading"
    disable-pagination
    hide-default-footer
    dense
  )
    template(#header.status)
      validation-provider(
        v-if="input.courses.length"
        v-slot="{ invalid, errors }"
        :detectInput="false"
        vid="coursesProvider"
        ref="coursesProvider"
      )
        v-tooltip(v-if="invalid" bottom)
          template(#activator="{ on }")
            v-icon(v-on="on" color="error") mdi-alert
          span {{ errors[0] }}
        v-icon(v-else color="success") mdi-check-circle
    template(#header.selectRow)
      .checkbox-container(v-if="input.courses.length")
        v-tooltip(bottom)
          template(#activator="{ on }")
            .checkbox(v-on="on")
              v-checkbox(
                v-model="allPeriodsPicked"
                :ripple="false"
                dense
                hide-details
              )
          span {{ t('tableTooltips.pickAllPeriods') }}
    template(v-for="header in periodTableHeaders" v-slot:[`header.${header.value}`])
      v-tooltip(bottom)
        template(#activator="{ on }")
          span(v-on="on") {{ header.text }}
        span {{ header.fullText }}
    template(#item="{ item: course }")
      validation-provider(
        v-slot="{ invalid, errors }"
        :detectInput="false"
        :key="course.eduHours.id"
        :vid="course.eduHours.id"
        :ref="course.eduHours.id"
        slim
      )
        tr
          td.status
            v-tooltip(v-if="invalid" bottom)
              template(#activator="{ on }")
                v-icon(v-on="on" color="error") mdi-alert
              span {{ errors[0] }}
            v-tooltip(v-else-if="course.teachers.length === 0" bottom)
              template(#activator="{ on }")
                v-icon(v-on="on") mdi-minus
              span {{ t('tableItem.statuses.exclude') }}
            v-tooltip(v-else bottom)
              template(#activator="{ on }")
                v-icon(v-on="on" color="success") mdi-check-circle
              span {{ t('tableItem.statuses.add') }}
          td {{ course.eduHours.workKind.name + ' ' }}
            | ({{ $tc('process.teams.courseForm.tableItem.hours', course.eduHours.value) }})
          td.teachers
            v-autocomplete(
              v-model="course.teachers"
              v-stream:update:search-input="searchStreamTeachers$"
              :loading="$apollo.queries.searchTeachers.loading && focusCourse === course"
              :items="teachers"
              :filter="filterTeachers"
              hide-details="auto"
              item-value="id"
              full-width
              multiple
              dense
              hide-no-data
              hide-selected
              clearable
              return-object
              @change="validateTable"
              @focus="focusCourse = course"
              @blur="focusCourse = null"
            )
              template(#selection="{ attrs, selected, select, item: teacher }")
                v-chip(
                  v-bind="attrs"
                  :input-value="selected"
                  small
                  close
                  @click="select"
                  @click:close="deleteTeacher(course, teacher)"
                )
                  | {{ teacher.lastName }} {{ teacher.firstName[0] }}. {{ teacher.sirName[0] }}.
              template(#item="{ item: teacher }")
                v-list-item-avatar
                  avatar-dialog(:item="teacher" :show-dialog="false")
                v-list-item-content
                  v-list-item-title {{ teacher.lastName }} {{ teacher.firstName }} {{ teacher.sirName }}
                  v-list-item-subtitle {{ teacher.username }}
          td.checkbox-container
            v-tooltip(bottom)
              template(#activator="{ on }")
                .checkbox(v-on="on")
                  v-checkbox(
                    :input-value="Object.values(course.periods).every(value => value)"
                    :ripple="false"
                    dense
                    hide-details
                    @change="setRowsPeriods([course], $event)"
                  )
              span {{ t('tableTooltips.pickRowPeriods') }}
          td.checkbox-container(v-for="period in periods")
            .checkbox
              v-checkbox(
                v-model="course.periods[period.id]"
                :ripple="false"
                dense
                hide-details
                @change="validateTable"
              )
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { Subject } from 'rxjs'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import { DataTableHeader } from 'vuetify'
import { ValidationProvider } from 'vee-validate'
import {
  TeamType,
  CourseTeamsQueryVariables,
  EduProgramCoursesNumbersQueryVariables,
  DisciplineType,
  SemesterDisciplinesQueryVariables,
  PeriodType,
  EduHoursType,
  DisciplineSemesterEduHoursQueryVariables,
  UserType,
  SearchUsersQueryVariables,
  CourseType,
  CoursesQueryVariables
} from '~/types/graphql'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

type RowValidation = {
  valid: boolean,
  empty: boolean
}
type PeriodDataTableHeader = DataTableHeader & {
  fullText: string
}
export type Course = {
  eduHours: EduHoursType,
  teachers: UserType[],
  periods: {
    [key: string]: boolean
  }
}
export type Input = {
  team?: TeamType | null,
  discipline?: DisciplineType | null
  courses: Course[]
}

@Component<CoursesForm>({
  components: { AvatarDialog },
  computed: {
    hasEduProgram (): boolean {
      return Boolean(this.input.team && this.input.team!.eduProgram)
    },
    hasSemester (): boolean {
      return Boolean(this.courseNumber && this.semesterNumber)
    },
    baseTableHeaders (): DataTableHeader[] {
      return [
        {
          text: '',
          value: 'status',
          sortable: false
        },
        {
          text: this.t('baseTableHeaders.workKind'),
          value: 'workKind',
          sortable: false
        },
        {
          text: this.t('baseTableHeaders.teachers'),
          value: 'teachers',
          sortable: false
        },
        {
          text: '',
          value: 'selectRow',
          sortable: false
        }
      ]
    },
    periodTableHeaders (): PeriodDataTableHeader[] {
      return this.periods
        ? this.periods.map((period: PeriodType) => ({
          text: period.shortName,
          fullText: period.name,
          value: period.id,
          sortable: false,
          class: 'header-cell-class',
          align: 'center'
        }))
        : []
    },
    tableHeaders (): (DataTableHeader | PeriodDataTableHeader)[] {
      return [...this.baseTableHeaders, ...this.periodTableHeaders]
    },
    selectedTeachers (): UserType[] {
      return this.input.courses.reduce((acc: UserType[], { teachers }: Course) => {
        acc.push(...teachers as UserType[])
        return acc
      }, [])
    },
    teachers (): UserType[] {
      const searchTeachers = this.searchTeachers ? this.searchTeachers.slice(0) : []
      this.selectedTeachers.forEach((selectedTeacher: UserType) => {
        if (!searchTeachers.find((searchTeacher: UserType) => searchTeacher.id === selectedTeacher.id)) {
          searchTeachers.push(selectedTeacher)
        }
      })
      return searchTeachers
    },
    allPeriodsPicked: {
      get () {
        return this.input.courses.length &&
          this.input.courses.every(course => Object.values(course.periods).every(value => value))
      },
      set (value: boolean) {
        this.setRowsPeriods(this.input.courses, value)
      }
    },
    coursesLoading (): boolean {
      return this.edit
        ? this.$apollo.queries.eduHours.loading || this.$apollo.queries.courses.loading
        : this.$apollo.queries.eduHours.loading
    }
  },
  domStreams: ['searchStreamTeams$', 'searchStreamTeachers$'],
  subscriptions () {
    const searchTeams$ = this.searchStreamTeams$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    const searchTeachers$ = this.searchStreamTeachers$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchTeams$, searchTeachers$ }
  },
  apollo: {
    teams: {
      query: require('~/gql/eleden/queries/education/course_teams.graphql'),
      variables (): CourseTeamsQueryVariables {
        return {
          first: this.searchTeams$ ? undefined : 5,
          search: this.searchTeams$
        }
      },
      update ({ teams }): TeamType[] {
        return this.input.team
          ? [this.input.team, ...teams.edges
              .map((e: { node?: TeamType }) => e.node)
              .filter((team: TeamType) => team.id !== this.input.team!.id)]
          : teams.edges.map((e: { node?: TeamType }) => e.node)
      }
    },
    coursesNumbers: {
      query: require('~/gql/eleden/queries/process/edu_program_courses_numbers.graphql'),
      variables (): EduProgramCoursesNumbersQueryVariables {
        return {
          eduProgramId: this.input.team!.eduProgram!.id
        }
      },
      update ({ eduProgramCoursesNumbers }): number[] {
        return eduProgramCoursesNumbers
      },
      skip () {
        return !this.hasEduProgram
      }
    },
    disciplines: {
      query: require('~/gql/eleden/queries/process/semester_disciplines.graphql'),
      fetchPolicy: 'network-only',
      variables (): SemesterDisciplinesQueryVariables {
        return {
          teamId: this.input.team!.id,
          courseNumber: this.courseNumber as number,
          semesterNumber: this.semesterNumber as number,
          hasCourses: this.edit
        }
      },
      update ({ semesterDisciplines }): DisciplineType[] {
        return semesterDisciplines
      },
      skip () {
        return !this.hasEduProgram || !this.hasSemester
      }
    },
    periods: require('~/gql/eleden/queries/process/periods.graphql'),
    eduHours: {
      query: require('~/gql/eleden/queries/process/discipline_semester_edu_hours.graphql'),
      variables (): DisciplineSemesterEduHoursQueryVariables {
        return {
          disciplineId: this.input.discipline!.id,
          courseNumber: this.courseNumber as number,
          semesterNumber: this.semesterNumber as number
        }
      },
      update ({ disciplineSemesterEduHours }) {
        return disciplineSemesterEduHours
      },
      skip () {
        return !this.input.discipline
      }
    },
    searchTeachers: {
      query: require('~/gql/eleden/queries/core/search_users.graphql'),
      variables (): SearchUsersQueryVariables {
        return {
          first: this.searchTeachers$ ? undefined : 5,
          search: this.searchTeachers$
        }
      },
      update ({ users }): UserType[] {
        return users.edges.map((e: { node?: UserType }) => e.node)
      },
      skip () {
        return !this.input.discipline
      }
    },
    courses: {
      query: require('~/gql/eleden/queries/process/courses.graphql'),
      fetchPolicy: 'network-only',
      variables (): CoursesQueryVariables {
        return {
          teamId: this.input.team!.id
        }
      },
      update ({ courses }): CourseType[] {
        return courses.edges.map((e: { node?: CourseType }) => e.node)
      },
      skip () {
        return !this.edit || !this.input.discipline
      }
    }
  }
})
export default class CoursesForm extends Vue {
  @Prop({ required: true, type: Object }) readonly input!: Input
  @Prop({ type: Boolean, default: false }) readonly edit!: boolean

  @Ref() readonly teamProvider!: InstanceType<typeof ValidationProvider>
  @Ref() readonly courseNumberProvider!: InstanceType<typeof ValidationProvider>
  @Ref() readonly semesterNumberProvider!: InstanceType<typeof ValidationProvider>
  @Ref() readonly disciplineProvider!: InstanceType<typeof ValidationProvider>
  @Ref() readonly coursesProvider!: InstanceType<typeof ValidationProvider>

  readonly hasEduProgram!: boolean
  readonly hasSemester!: boolean
  readonly baseTableHeaders!: DataTableHeader[]
  readonly periodTableHeaders!: PeriodDataTableHeader[]
  readonly tableHeaders!: (DataTableHeader | PeriodDataTableHeader)[]
  readonly selectedTeachers!: UserType[]
  readonly teachers!: UserType[]
  allPeriodsPicked!: boolean
  readonly coursesLoading!: boolean
  readonly teams!: TeamType[] | undefined
  readonly coursesNumbers!: number[] | undefined
  readonly disciplines!: DisciplineType[] | undefined
  readonly periods!: PeriodType[] | undefined
  readonly eduHours!: EduHoursType[] | undefined
  readonly searchTeachers!: UserType[] | undefined
  readonly courses!: CourseType[] | undefined

  searchTeams$: string = ''
  searchStreamTeams$: Subject<any> = new Subject()
  searchTeachers$: string = ''
  searchStreamTeachers$: Subject<any> = new Subject()
  courseNumber: number | null = null
  semesterNumber: number | null = null
  focusCourse: Course | null = null

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.teams.courseForm.${path}`, values) as string
  }

  /**
   * Фильтрация групп
   * @param item
   * @param queryText
   */
  filterTeams (item: TeamType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const name: string = item.name.toLocaleLowerCase()
    const shortName: string = item.shortName.toLocaleLowerCase()
    const admission = String(item.admission).toLocaleLowerCase()
    return name.includes(qt) || shortName.includes(qt) || admission.includes(qt)
  }

  /**
   * Получение ошибок группы
   * @param providerErrors
   * @return
   */
  getTeamErrors (providerErrors: string[]): string[] {
    if (!this.input.team || this.hasEduProgram) {
      return providerErrors
    }
    return [this.t('noEduProgram'), ...providerErrors]
  }

  /**
   * Получение ошибок дисциплины
   * @param providerErrors
   * @return
   */
  getDisciplineErrors (providerErrors: string[]): string[] {
    if (!this.hasSemester || this.$apollo.queries.disciplines.loading || this.disciplines!.length > 0) {
      return providerErrors
    }
    return [this.t('noDisciplines'), ...providerErrors]
  }

  /**
   * Фильтрация дисциплин
   * @param item
   * @param queryText
   */
  filterDisciplines (item: DisciplineType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const code: string = item.code.toLocaleLowerCase()
    const name: string = item.name.toLocaleLowerCase()
    return code.includes(qt) || name.includes(qt)
  }

  /**
   * Фильтрация преподавателей
   * @param item
   * @param queryText
   */
  filterTeachers (item: UserType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const ln: string = item.lastName.toLocaleLowerCase()
    const fn: string = item.firstName.toLocaleLowerCase()
    return ln.includes(qt) || fn.includes(qt) || item.username.includes(qt)
  }

  /**
   * Получение порядка сортировки курсов
   * @param course
   * @return
   */
  getCourseOrder (course: Course): number {
    const eduHours = course.eduHours
    return eduHours.workKind && eduHours.workKind.workForm
      ? eduHours.workKind.workForm.order
      : 1000
  }

  /**
   * Очистка дисциплины
   */
  clearDiscipline () {
    this.input.discipline = null
    this.disciplineProvider.reset()
    this.input.courses = []
  }

  /**
   * Очистка формы
   * @param clearTeam
   */
  clear (clearTeam: boolean = false): void {
    if (clearTeam) {
      this.input.team = null
      this.teamProvider.reset()
    }
    this.clearDiscipline()
    this.courseNumber = null
    this.courseNumberProvider.reset()
    this.semesterNumber = null
    this.semesterNumberProvider.reset()
  }

  /**
   * Ожидание загрузки курсов
   */
  async awaitCoursesLoading (): Promise<void> {
    await this.$nextTick()
    await new Promise<void>((resolve) => {
      if (!this.coursesLoading) {
        resolve()
      } else {
        const sub = this.$watchAsObservable('coursesLoading')
          .pipe(pluck('newValue'))
          .subscribe((newValue: boolean) => {
            if (!newValue) {
              sub.unsubscribe()
              resolve()
            }
          })
      }
    })
  }

  /**
   * Заполнение курсов
   */
  async fillCourses (): Promise<void> {
    this.input.courses = []
    await this.awaitCoursesLoading()
    if (this.edit) {
      this.input.courses = this.eduHours!
        .map((eduHours: EduHoursType) => {
          const course: CourseType | undefined = this.courses!
            .find((course: CourseType) => course.eduHours.id === eduHours.id)
          return {
            eduHours,
            teachers: course && course.teachers ? course.teachers : [],
            periods: this.periods!.reduce(
              (acc: { [key: string]: boolean }, period: PeriodType) =>
                Object.assign(
                  acc,
                  {
                    [period.id]: course
                      ? Boolean(
                          course.periods!.find((existPeriod: PeriodType) => existPeriod.id === period.id)
                      )
                      : false
                  }
                ), {}
            )
          }
        })
    } else {
      this.input.courses = this.eduHours!
        .map((eduHours: EduHoursType) => {
          return {
            eduHours,
            teachers: [],
            periods: this.periods!.reduce(
              (acc: { [key: string]: boolean }, period: PeriodType) =>
                Object.assign(acc, { [period.id]: false }), {}
            )
          }
        })
    }
    this.input.courses.sort((eh1: Course, eh2: Course) =>
      this.getCourseOrder(eh1) - this.getCourseOrder(eh2))
    this.$nextTick(this.validateTable)
  }

  /**
   * Валидация строки таблицы
   * @param course
   * @return
   */
  validateRow (course: Course): RowValidation {
    const hasTeachers = course.teachers.length !== 0
    const hasPeriods = Object.values(course.periods).reduce((acc: boolean, curr: boolean) => acc || curr) === true
    const validationProvider = this.$refs[course.eduHours.id] as InstanceType<typeof ValidationProvider>
    if (hasTeachers && !hasPeriods) {
      validationProvider.setErrors([this.t('tableItem.statuses.noPeriods')])
      return { valid: false, empty: false }
    }
    if (!hasTeachers && hasPeriods) {
      validationProvider.setErrors([this.t('tableItem.statuses.noTeachers')])
      return { valid: false, empty: false }
    }
    validationProvider.reset()
    if (hasTeachers && hasPeriods) {
      return { valid: true, empty: false }
    }
    return { valid: true, empty: true }
  }

  /**
   * Валидация таблицы
   * @return
   */
  validateTable (): boolean {
    const { valid, empty } = this.input.courses.reduce((acc: RowValidation, course: Course) => {
      const { valid, empty } = this.validateRow(course)
      acc.valid = acc.valid && valid
      acc.empty = acc.empty && empty
      return acc
    }, { valid: true, empty: true })
    if (!valid) {
      this.coursesProvider.setErrors([this.t('tableErrors.validationError')])
      return false
    }
    if (empty && !this.edit) {
      this.coursesProvider.setErrors([this.t('tableErrors.atLeastOneCourseError')])
      return false
    }
    this.coursesProvider.reset()
    return true
  }

  /**
   * Удаление преподавателя из курса
   * @param course
   * @param teacher
   */
  deleteTeacher (course: Course, teacher: UserType): void {
    course.teachers.splice(course.teachers.indexOf(teacher), 1)
    this.validateTable()
  }

  /**
   * Установка или сброс периодов строки
   * @param courses
   * @param value
   */
  setRowsPeriods (courses: Course[], value: boolean): void {
    courses.forEach((course: Course) => {
      Object.keys(course.periods).forEach((key: string) => { course.periods[key] = value })
    })
    this.validateTable()
  }
}
</script>

<style lang="sass">
.courses-form
  .status
    padding: 6px 0 6px 16px !important
  .teachers
    padding: 4px 16px !important
  .checkbox-container
    min-width: 50px
    width: 50px
    .checkbox
      width: 24px
      height: 24px
      margin: 0 auto
      display: flex
      justify-content: center
      align-items: center
      div
        margin: 0
        padding: 0
  .header-cell-class
    padding-left: 0 !important
    padding-right: 0 !important
    width: 50px
</style>
