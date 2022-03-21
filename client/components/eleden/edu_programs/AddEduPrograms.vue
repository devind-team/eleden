<template lang="pug">
  v-menu(bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="t('addForm.header')"
        :button-text="t('addForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_program.graphql')"
        :variables="formVariables"
        :update="addEduProgramUpdate"
        mutation-name="addEduProgram"
        i18n-path="eduPrograms.form"
        @close="close"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-form-select
            v-list-item-content
              v-list-item-title {{ t('buttons.fillForm') }}
        template(#form)
          edu-program-form(:edu-program="inputEduProgram")
      mutation-modal-form(
        :header="t('fromPlxForm.header')"
        :button-text="t('fromPlxForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_program_from_plx.graphql')"
        :variables="{ file: plxFile }"
        :update="addEduProgramFromPlxUpdate"
        :errors-in-alert="true"
        mutation-name="addEduProgramFromPlx"
        width="625"
        @close="plxFile = null"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-xml
            v-list-item-content
              v-list-item-title {{ t('buttons.addFromPlx') }}
        template(#form)
          validation-provider(v-slot="{ errors, valid }" :name="t('fromPlxForm.file')" rules="required")
            v-file-input(
              v-model="plxFile"
              :label="t('fromPlxForm.file')"
              :error-messages="errors"
              :success="valid"
              accept=".plx"
              clearable
            )
      mutation-modal-form(
        :header="t('fromFileForm.header')"
        :button-text="t('fromFileForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_programs.graphql')"
        :variables="{ file }"
        :update="addEduProgramsUpdate"
        :errors-in-alert="true"
        mutation-name="addEduPrograms"
        width="725"
        @close="file = null"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-microsoft-excel
            v-list-item-content
              v-list-item-title {{ t('buttons.addFromFile') }}
            v-list-item-action
              help-dialog(v-slot="{ on: onHelper }" :text="t('helpDialog.helpInstruction')" doc="help/add_edu_programs")
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ t('buttons.helpInstruction') }}
        template(#form)
          validation-provider(v-slot="{ errors, valid }" :name="t('fromFileForm.file')" rules="required")
            v-file-input(
              v-model="file"
              :label="t('fromFileForm.file')"
              :error-messages="errors"
              :success="valid"
              accept=".xlsx,.csv,.json"
              clearable
            )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { AddEduProgramMutationVariables } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import EduProgramForm, { InputEduProgram } from '~/components/eleden/edu_programs/EduProgramForm.vue'

type AddEduProgramUpdate = (store: DataProxy, result: any) => void
type AddEduProgramFromPlxUpdate = (store: DataProxy, result: any) => void
type AddEduProgramsUpdate = (store: DataProxy, result: any) => void

@Component<AddEduPrograms>({
  components: { MutationModalForm, EduProgramForm, HelpDialog },
  computed: {
    formVariables (): AddEduProgramMutationVariables {
      return {
        name: this.inputEduProgram.name,
        adaptive: this.inputEduProgram.adaptive,
        admission: Number(this.inputEduProgram.admission),
        expedited: this.inputEduProgram.expedited,
        eduFormId: this.inputEduProgram.eduForm ? Number(this.inputEduProgram.eduForm.id) : 0,
        directionId: this.inputEduProgram.direction ? this.inputEduProgram.direction.id : '',
        description: this.inputEduProgram.description,
        syllabus: this.inputEduProgram.syllabus,
        calendar: this.inputEduProgram.calendar,
        eduProgramId: this.inputEduProgram.donor ? this.inputEduProgram.donor.id : undefined
      }
    }
  }
})
export default class AddEduPrograms extends Vue {
  @Prop({ type: Function as PropType<AddEduProgramUpdate>, required: true })
  readonly addEduProgramUpdate!: AddEduProgramUpdate

  @Prop({ type: Function as PropType<AddEduProgramFromPlxUpdate>, required: true })
  readonly addEduProgramFromPlxUpdate!: AddEduProgramFromPlxUpdate

  @Prop({ type: Function as PropType<AddEduProgramsUpdate>, required: true })
  readonly addEduProgramsUpdate!: AddEduProgramsUpdate

  readonly formVariables!: AddEduProgramMutationVariables

  inputEduProgram!: InputEduProgram
  file: File | null = null
  plxFile: File | null = null

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
    return this.$t(`eduPrograms.addMenu.${path}`, values) as string
  }

  /**
   * Получение пустой образовательной программы
   * @return
   */
  getInputEduProgram (): InputEduProgram {
    return {
      name: '',
      adaptive: false,
      admission: new Date().getFullYear(),
      expedited: false,
      eduForm: null,
      direction: null,
      description: null,
      syllabus: null,
      calendar: null,
      donor: null
    }
  }

  /**
   * Закрытие формы
   */
  close (): void {
    this.inputEduProgram = this.getInputEduProgram()
  }
}
</script>
