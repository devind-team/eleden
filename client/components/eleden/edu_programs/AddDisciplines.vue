<template lang="pug">
  v-menu(bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="t('addForm.header')"
        :button-text="t('addForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_discipline.graphql')"
        :variables="formVariables"
        :update="addDisciplineUpdate"
        mutation-name="addDiscipline"
        i18n-path="eduPrograms.discipline.form"
        @close="close"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-form-select
            v-list-item-content {{ t('buttons.fillForm') }}
        template(#form)
          discipline-form(
            :edu-program="eduProgram"
            :discipline="inputDiscipline"
          )
      mutation-modal-form(
        :header="t('filesForm.header')"
        :button-text="t('filesForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_disciplines_files.graphql')"
        :variables="disciplinesFilesArchiveVariables"
        :errors-in-alert="true"
        mutation-name="addDisciplinesFiles"
        @close="disciplinesFilesArchive = null"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-archive-outline
            v-list-item-content {{ t('buttons.addDisciplinesFilesFromArchive') }}
            v-list-item-action
              help-dialog(
                v-slot="{ on: onHelper }"
                :text="t('helpDialog.helpInstruction')"
                doc="help/add_disciplines_files"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ t('buttons.helpInstruction') }}
        template(#form)
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('filesForm.archive')"
            rules="required"
          )
            v-file-input(
              v-model="disciplinesFilesArchive"
              :label="t('filesForm.archive')"
              :error-messages="errors"
              :success="valid"
              accept=".zip"
              clearable
            )
      mutation-modal-form(
        :header="t('methodologicalSupportForm.header')"
        :button-text="t('methodologicalSupportForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_program_methodological_supports.graphql')"
        :variables="methodologicalSupportsArchiveVariables"
        :errors-in-alert="true"
        mutation-name="addEduProgramMethodologicalSupports"
        @close="methodologicalSupportsArchive = null"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-archive-outline
            v-list-item-content {{ t('buttons.addMethodologicalSupportFromArchive') }}
            v-list-item-action
              help-dialog(
                v-slot="{ on: onHelper }"
                :text="t('helpDialog.helpInstruction')"
                doc="help/add_edu_program_methodological_supports"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ t('buttons.helpInstruction') }}
        template(#form)
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('methodologicalSupportForm.archive')"
            rules="required"
          )
            v-file-input(
              v-model="methodologicalSupportsArchive"
              :label="t('methodologicalSupportForm.archive')"
              :error-messages="errors"
              :success="valid"
              accept=".zip"
              clearable
            )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  EduProgramType,
  AddDisciplineMutationVariables,
  AddDisciplinesFilesMutationVariables,
  AddEduProgramMethodologicalSupportsMutationVariables
} from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DisciplineForm, { InputDiscipline } from '~/components/eleden/edu_programs/DisciplineForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'

type AddDisciplineUpdate = (store: any, result: any) => void

@Component<AddDisciplines>({
  components: { MutationModalForm, DisciplineForm, HelpDialog },
  computed: {
    formVariables (): AddDisciplineMutationVariables {
      return {
        code: this.inputDiscipline.code,
        name: this.inputDiscipline.name,
        eduProgramId: this.eduProgram.id,
        userIds: this.inputDiscipline.users.map(user => user.id),
        viewId: this.inputDiscipline.view ? this.inputDiscipline.view.id : undefined,
        parentId: this.inputDiscipline.parent ? this.inputDiscipline.parent.id : undefined,
        annotation: this.inputDiscipline.annotation,
        workProgram: this.inputDiscipline.workProgram,
        methodologicalSupport: this.inputDiscipline.methodologicalSupport
          ? this.inputDiscipline.methodologicalSupport.map((file: File) => ({ name: file.name, src: file }))
          : []
      }
    },
    disciplinesFilesArchiveVariables (): AddDisciplinesFilesMutationVariables {
      return {
        eduProgramId: this.eduProgram.id,
        file: this.disciplinesFilesArchive
      }
    },
    methodologicalSupportsArchiveVariables (): AddEduProgramMethodologicalSupportsMutationVariables {
      return {
        eduProgramId: this.eduProgram.id,
        file: this.methodologicalSupportsArchive
      }
    }
  }
})
export default class AddDisciplines extends Vue {
  @Prop({ type: Object as PropType<EduProgramType>, required: true }) readonly eduProgram!: EduProgramType
  @Prop({ type: Function as PropType<AddDisciplineUpdate>, required: true })
  readonly addDisciplineUpdate!: AddDisciplineUpdate

  readonly formVariables!: AddDisciplineMutationVariables
  readonly disciplinesFilesArchiveVariables!: AddDisciplinesFilesMutationVariables
  readonly methodologicalSupportsArchiveVariables!: AddEduProgramMethodologicalSupportsMutationVariables

  inputDiscipline!: InputDiscipline
  disciplinesFilesArchive!: File | null
  methodologicalSupportsArchive!: File | null

  data () {
    return {
      inputDiscipline: this.getInputDiscipline(),
      disciplinesFilesArchive: null,
      methodologicalSupportsArchive: null
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.discipline.addMenu.${path}`, values) as string
  }

  /**
   * Получение пустой дисциплины
   * @return
   */
  getInputDiscipline (): InputDiscipline {
    return {
      code: '',
      name: '',
      annotation: null,
      workProgram: null,
      view: null,
      parent: null,
      users: [],
      methodologicalSupport: []
    }
  }

  /**
   * Закрытие формы
   */
  close (): void {
    this.inputDiscipline = this.getInputDiscipline()
  }
}
</script>
