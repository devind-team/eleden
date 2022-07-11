<template lang="pug">
v-menu(bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    mutation-modal-form(
      :header="t('addForm.header')"
      :button-text="t('addForm.buttonText')"
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
            v-list-item-title {{ t('buttons.fillForm') }}
      template(#form)
        courses-form(:input="input" ref="courseForm")
    experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on }")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-microsoft-excel
        v-list-item-content
          v-list-item-title {{ t('buttons.addFromFile') }}
        v-list-item-action
          help-dialog(v-slot="{ on: onHelper }" :text="t('helpDialog.helpInstruction')" doc="help/add_courses")
            v-tooltip(bottom)
              template(#activator="{ on: onTooltip}")
                v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                  v-icon mdi-help-circle-outline
              span {{ t('buttons.helpInstruction') }}
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import { UserType, TeamType, AddCoursesMutationVariables, AddCoursesMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import CoursesForm, { Course, Input } from '~/components/eleden/process/CoursesForm.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'

export type AddCoursesData = { data: { addCourses: AddCoursesMutationPayload } }

@Component<AddCourses>({
  components: { MutationModalForm, CoursesForm, ExperimentalDialog, HelpDialog },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    addCoursesVariables () : AddCoursesMutationVariables {
      return {
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
export default class AddCourses extends Vue {
  @Prop({ required: true, type: Function })
  readonly addCoursesUpdate!: (store: DataProxy, result: AddCoursesData, team: TeamType) => void

  @Ref() readonly courseForm!: InstanceType<typeof CoursesForm>

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean

  readonly addCoursesVariables!: AddCoursesMutationVariables
  input!: Input

  data () {
    return {
      input: {
        team: null,
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
    return this.$t(`process.teams.addMenu.${path}`, values) as string
  }

  /**
   * Закрытие формы
   */
  close (): void {
    this.courseForm.clear(true)
  }
}
</script>
