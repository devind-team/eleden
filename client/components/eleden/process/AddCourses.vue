<template lang="pug">
  v-menu(bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="$t('process.teams.addMenu.addForm.header')"
        :button-text="$t('process.teams.addMenu.addForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/process/add_courses.graphql')"
        :variables="addCoursesVariables"
        :update="(store, result) => addCoursesUpdate(store, result, input.team)"
        mutation-name="addCourses"
        i18n-path="process.courseForm"
        fullscreen
        can-minimize
        @close="close"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-form-select
            v-list-item-content
              v-list-item-title {{ $t('process.teams.addMenu.buttons.fillForm') }}
        template(#form)
          courses-form(:input="input" ref="courseForm")
      experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-microsoft-excel
          v-list-item-content
            v-list-item-title {{ $t('process.teams.addMenu.buttons.addFromFile') }}
          v-list-item-action
            help-dialog(
              v-slot="{ on: onHelper }"
              :text="$t('process.teams.addMenu.helpDialog.helpInstruction')"
              doc="help/add_courses"
            )
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip}")
                  v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                    v-icon mdi-help-circle-outline
                span {{ $t('process.teams.addMenu.buttons.helpInstruction') }}
</template>

<script lang="ts">
import { DataProxy } from 'apollo-cache'
import type { PropType } from '#app'
import { UserType, TeamType, AddCoursesMutationVariables, AddCoursesMutationPayload } from '~/types/graphql'
import { useAuthStore } from '~/store'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import CoursesForm, { Course, Input } from '~/components/eleden/process/CoursesForm.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'

export type AddCoursesDataType = { data: { addCourses: AddCoursesMutationPayload } }
type addCoursesUpdateType = (store: DataProxy, result: AddCoursesDataType, team: TeamType) => void

export default defineComponent({
  components: { MutationModalForm, CoursesForm, ExperimentalDialog, HelpDialog },
  props: {
    addCoursesUpdate: { required: true, type: Function as PropType<addCoursesUpdateType> }
  },
  setup () {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')

    const courseForm = ref<CoursesForm>(null)
    const input = ref<Input>({
      team: null,
      discipline: null,
      courses: []
    })

    const addCoursesVariables = computed<AddCoursesMutationVariables>(() => {
      return {
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
      courseForm.value.clear(true)
    }

    return { hasPerm, courseForm, input, addCoursesVariables, close }
  }
})
</script>
