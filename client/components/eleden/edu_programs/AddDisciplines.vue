<template lang="pug">
  v-menu(bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="$t('eduPrograms.discipline.addMenu.addForm.header')"
        :button-text="$t('eduPrograms.discipline.addMenu.addForm.buttonText')"
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
            v-list-item-content {{ $t('eduPrograms.discipline.addMenu.buttons.fillForm') }}
        template(#form)
          discipline-form(
            :edu-program="eduProgram"
            :discipline="inputDiscipline"
          )
      mutation-modal-form(
        :header="$t('eduPrograms.discipline.addMenu.filesForm.header')"
        :button-text="$t('eduPrograms.discipline.addMenu.filesForm.buttonText')"
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
            v-list-item-content {{ $t('eduPrograms.discipline.addMenu.buttons.addDisciplinesFilesFromArchive') }}
            v-list-item-action
              help-dialog(
                v-slot="{ on: onHelper }"
                :text="$t('eduPrograms.discipline.addMenu.helpDialog.helpInstruction')"
                doc="help/add_disciplines_files"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ $t('eduPrograms.discipline.addMenu.buttons.helpInstruction') }}
        template(#form)
          validation-provider(
            v-slot="{ errors, valid }"
            :name="$t('eduPrograms.discipline.addMenu.filesForm.archive')"
            rules="required"
          )
            v-file-input(
              v-model="disciplinesFilesArchive"
              :label="$t('eduPrograms.discipline.addMenu.filesForm.archive')"
              :error-messages="errors"
              :success="valid"
              accept=".zip"
              clearable
            )
      mutation-modal-form(
        :header="$t('eduPrograms.discipline.addMenu.methodologicalSupportForm.header')"
        :button-text="$t('eduPrograms.discipline.addMenu.methodologicalSupportForm.buttonText')"
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
            v-list-item-content {{ $t('eduPrograms.discipline.addMenu.buttons.addMethodologicalSupportFromArchive') }}
            v-list-item-action
              help-dialog(
                v-slot="{ on: onHelper }"
                :text="$t('eduPrograms.discipline.addMenu.helpDialog.helpInstruction')"
                doc="help/add_edu_program_methodological_supports"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ $t('eduPrograms.discipline.addMenu.buttons.helpInstruction') }}
        template(#form)
          validation-provider(
            v-slot="{ errors, valid }"
            :name="$t('eduPrograms.discipline.addMenu.methodologicalSupportForm.archive')"
            rules="required"
          )
            v-file-input(
              v-model="methodologicalSupportsArchive"
              :label="$t('eduPrograms.discipline.addMenu.methodologicalSupportForm.archive')"
              :error-messages="errors"
              :success="valid"
              accept=".zip"
              clearable
            )
</template>

<script lang="ts">
import type { PropType, Ref, ComputedRef } from '#app'
import { defineComponent, ref, computed } from '#app'
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

export default defineComponent({
  components: { MutationModalForm, DisciplineForm, HelpDialog },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true },
    addDisciplineUpdate: { type: Function as PropType<AddDisciplineUpdate>, required: true }
  },
  setup (props) {
    const getInputDiscipline = (): InputDiscipline => {
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

    const inputDiscipline: Ref<InputDiscipline> = ref<InputDiscipline>(getInputDiscipline())
    const disciplinesFilesArchive: Ref<File | null> = ref<File | null>(null)
    const methodologicalSupportsArchive: Ref<File | null> = ref<File | null>(null)

    const formVariables: ComputedRef<AddDisciplineMutationVariables> =
      computed<AddDisciplineMutationVariables>(() => {
        return {
          code: inputDiscipline.value.code,
          name: inputDiscipline.value.name,
          eduProgramId: props.eduProgram.id,
          userIds: inputDiscipline.value.users.map(user => user.id),
          viewId: inputDiscipline.value.view ? inputDiscipline.value.view.id : undefined,
          parentId: inputDiscipline.value.parent ? inputDiscipline.value.parent.id : undefined,
          annotation: inputDiscipline.value.annotation,
          workProgram: inputDiscipline.value.workProgram,
          methodologicalSupport: inputDiscipline.value.methodologicalSupport
            ? inputDiscipline.value.methodologicalSupport.map((file: File) => ({ name: file.name, src: file }))
            : []
        }
      })

    const disciplinesFilesArchiveVariables: ComputedRef<AddDisciplinesFilesMutationVariables> =
      computed<AddDisciplinesFilesMutationVariables>(() => {
        return {
          eduProgramId: props.eduProgram.id,
          file: disciplinesFilesArchive.value
        }
      })

    const methodologicalSupportsArchiveVariables:
      ComputedRef<AddEduProgramMethodologicalSupportsMutationVariables> =
      computed<AddEduProgramMethodologicalSupportsMutationVariables>(() => {
        return {
          eduProgramId: props.eduProgram.id,
          file: methodologicalSupportsArchive.value
        }
      })

    const close = (): void => {
      inputDiscipline.value = getInputDiscipline()
    }

    return {
      getInputDiscipline,
      inputDiscipline,
      disciplinesFilesArchive,
      methodologicalSupportsArchive,
      formVariables,
      disciplinesFilesArchiveVariables,
      methodologicalSupportsArchiveVariables,
      close
    }
  }
})
</script>
