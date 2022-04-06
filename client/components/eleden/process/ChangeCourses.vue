<template lang="pug">
  mutation-modal-form(
    :header="$t('process.teams.changeForm.header')"
    :button-text="$t('process.teams.changeForm.buttonText')"
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
import { DataProxy } from 'apollo-cache'
import type { PropType } from '#app'
import { UserType, TeamType, ChangeCoursesMutationVariables, ChangeCoursesMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import CoursesForm, { Course, Input } from '~/components/eleden/process/CoursesForm.vue'

export type ChangeCoursesDataType = { data: { changeCourses: ChangeCoursesMutationPayload } }

type changeCoursesUpdateType = (store: DataProxy, result: ChangeCoursesDataType, team: TeamType) => void

export default defineComponent({
  components: { MutationModalForm, CoursesForm },
  props: {
    team: { required: true, type: Object as PropType<TeamType> },
    changeCoursesUpdate: { required: true, type: Function as PropType<changeCoursesUpdateType> }
  },
  setup (props) {
    const courseForm = ref<CoursesForm>(null)

    const input = ref<Input>({
      team: props.team,
      discipline: null,
      courses: []
    })

    const changeCoursesVariables = computed<ChangeCoursesMutationVariables>(() => {
      return {
        disciplineId: input.value.discipline ? input.value.discipline.id : '',
        teamId: input.value.team ? input.value.team.id : '',
        courses: input.value.courses
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
    })

    const close = (): void => {
      courseForm.value.clear()
    }

    return { courseForm, input, changeCoursesVariables, close }
  }
})
</script>
