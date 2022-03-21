<template lang="pug">
  mutation-form(
    :header="t('header')"
    :subheader="t('subheader', { updatedAt: $filters.dateTimeHM(eduProgram.updatedAt) })"
    :mutation="require('~/gql/eleden/mutations/edu_programs/change_edu_program.graphql')"
    :variables="changeVariables"
    :button-text="t('buttonText')"
    mutation-name="changeEduProgram"
    i18n-path="eduPrograms.form"
    @done="changeEduProgramDone"
  )
    template(#form)
      edu-program-form(:edu-program="inputEduProgram")
    template(#actions="{ invalid, loading, buttonText, setError }")
      apollo-mutation(
        v-if="hasPerm(['eleden.delete_eduprogram'])"
        v-slot="{ mutate }"
        :mutation="require('~/gql/eleden/mutations/edu_programs/delete_edu_program.graphql')"
        :variables="{ eduProgramId: eduProgram.id }"
        @error="setError"
        @done="redirectToEduPrograms"
      )
        delete-menu(v-slot="{ on }" :item-name="t('deleteItemName')" @confirm="mutate")
          v-btn(v-on="on" color="error") {{ t('deleteButtonText') }}
      v-spacer
      v-btn(:disabled="invalid" :loading="loading" type="submit" color="primary") {{ buttonText }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import {
  EduProgramType,
  ChangeEduProgramMutationPayload,
  ChangeEduProgramMutationVariables
} from '~/types/graphql'
import MutationForm from '~/components/common/forms/MutationForm.vue'
import EduProgramForm, { InputEduProgram } from '~/components/eleden/edu_programs/EduProgramForm.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type ChangeEduProgramData = {
  data: { changeEduProgram: ChangeEduProgramMutationPayload }
}

@Component<EduProgramIdSettings>({
  components: { MutationForm, EduProgramForm, DeleteMenu },
  permissions: ['eleden.change_eduprogram'],
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    changeVariables (): ChangeEduProgramMutationVariables {
      return {
        eduProgramId: this.inputEduProgram.id!,
        deleteDescription: !this.inputEduProgram.description && !this.inputEduProgram.existingDescription,
        deleteSyllabus: !this.inputEduProgram.syllabus && !this.inputEduProgram.existingSyllabus,
        deleteCalendar: !this.inputEduProgram.calendar && !this.inputEduProgram.existingCalendar,
        name: this.inputEduProgram.name !== this.eduProgram.name ? this.inputEduProgram.name : undefined,
        adaptive: this.inputEduProgram.adaptive !== this.eduProgram.adaptive
          ? this.inputEduProgram.adaptive
          : undefined,
        admission: Number(this.inputEduProgram.admission) !== this.eduProgram.admission
          ? Number(this.inputEduProgram.admission)
          : undefined,
        expedited: this.inputEduProgram.expedited !== this.eduProgram.expedited
          ? this.inputEduProgram.expedited
          : undefined,
        description: this.inputEduProgram.description,
        syllabus: this.inputEduProgram.syllabus,
        calendar: this.inputEduProgram.calendar,
        eduFormId: this.inputEduProgram.eduForm ? Number(this.inputEduProgram.eduForm.id) : undefined,
        directionId: this.inputEduProgram.direction ? this.inputEduProgram.direction.id : undefined
      }
    }
  }
})
export default class EduProgramIdSettings extends Vue {
  @Prop({ type: Object as PropType<EduProgramType>, required: true }) readonly eduProgram!: EduProgramType

  readonly hasPerm!: (perm: string | string[], or?: boolean) => boolean

  inputEduProgram!: InputEduProgram

  data () {
    return {
      inputEduProgram: this.getInputEduProgram()
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.settings.${path}`, values) as string
  }

  /**
   * Получение текущей образовательной программы
   * @return
   */
  getInputEduProgram (): InputEduProgram {
    return {
      id: this.eduProgram.id,
      name: this.eduProgram.name,
      adaptive: this.eduProgram.adaptive,
      admission: this.eduProgram.admission,
      expedited: this.eduProgram.expedited,
      eduForm: this.eduProgram.eduForm,
      direction: this.eduProgram.direction,
      description: null,
      existingDescription: this.eduProgram.description ? { src: this.eduProgram.description } : undefined,
      syllabus: null,
      existingSyllabus: this.eduProgram.syllabus ? { src: this.eduProgram.syllabus } : undefined,
      calendar: null,
      existingCalendar: this.eduProgram.calendar ? { src: this.eduProgram.calendar } : undefined
    }
  }

  /**
   * Обновление текущей образовательной программы после изменения образовательной программы
   * @param success
   */
  changeEduProgramDone ({ data: { changeEduProgram: { success } } }: ChangeEduProgramData): void {
    if (success) {
      this.inputEduProgram = this.getInputEduProgram()
    }
  }

  /**
   * Перенаправление на страницу образовательных программ
   */
  redirectToEduPrograms (): void {
    this.$nuxt.context.redirect(
      this.localePath({
        name: 'eleden-edu_programs'
      })
    )
  }
}
</script>
