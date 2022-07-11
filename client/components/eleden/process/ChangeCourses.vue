<template lang="pug">
mutation-modal-form(
  :header="t('header')"
  :button-text="t('buttonText')"
  :mutation="require('~/gql/eleden/mutations/process/change_courses.graphql')"
  :variables="changeCoursesVariables"
  :update="(store, result) => changeCoursesUpdate(store, result, team)"
  mutation-name="changeCourses"
  i18n-path="process.courseForm"
  fullscreen
  @close="close"
)
  template(#activator="{ on }")
    slot(:on="on")
  template(#form)
    courses-form(:input="input" edit ref="courseForm")
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { UserType, TeamType, ChangeCoursesMutationVariables, ChangeCoursesMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import CoursesForm, { Course, Input } from '~/components/eleden/process/CoursesForm.vue'

export type ChangeCoursesData = { data: { changeCourses: ChangeCoursesMutationPayload } }

@Component<ChangeCourses>({
  components: { MutationModalForm, CoursesForm },
  computed: {
    changeCoursesVariables (): ChangeCoursesMutationVariables {
      return {
        disciplineId: this.input.discipline ? this.input.discipline.id : '',
        teamId: this.input.team ? this.input.team.id : '',
        courses: this.input.courses
          .filter((course: Course) => course.teachers.length &&
            Object.values(course.periods).some((value: boolean) => value))
          .map((course: Course) => {
            return {
              eduHoursId: course.eduHours.id,
              teacherIds: course.teachers.map((teacher: UserType) => teacher.id),
              periodIds: Object.entries(course.periods).filter(([_, value]) => value).map(([key]) => key)
            }
          })
      }
    }
  }
})
export default class ChangeCourses extends Vue {
  @Prop({ required: true, type: Object }) readonly team!: TeamType
  @Prop({ required: true, type: Function })
  readonly changeCoursesUpdate!: (store: DataProxy, result: ChangeCoursesData, team: TeamType) => void

  @Ref() readonly courseForm!: InstanceType<typeof CoursesForm>

  readonly changeCoursesVariables!: ChangeCoursesMutationVariables
  input!: Input

  data () {
    return {
      input: {
        team: this.team,
        discipline: null,
        courses: []
      }
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.teams.changeForm.${path}`, values) as string
  }

  /**
   * Закрытие формы
   */
  close (): void {
    this.courseForm.clear()
  }
}
</script>
