<template lang="pug">
v-menu(bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    mutation-modal-form(
      :header="$t('eduPrograms.addMenu.addForm.header')"
      :button-text="$t('eduPrograms.addMenu.addForm.buttonText')"
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
            v-list-item-title {{ $t('eduPrograms.addMenu.buttons.fillForm') }}
      template(#form)
        edu-program-form(:edu-program="inputEduProgram")
    mutation-modal-form(
      :header="$t('eduPrograms.addMenu.fromPlxForm.header')"
      :button-text="$t('eduPrograms.addMenu.fromPlxForm.buttonText')"
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
            v-list-item-title {{ $t('eduPrograms.addMenu.buttons.addFromPlx') }}
      template(#form)
        validation-provider(
          v-slot="{ errors, valid }"
          :name="$t('eduPrograms.addMenu.fromPlxForm.file')"
          rules="required"
        )
          v-file-input(
            v-model="plxFile"
            :label="$t('eduPrograms.addMenu.fromPlxForm.file')"
            :error-messages="errors"
            :success="valid"
            accept=".plx"
            clearable
          )
    mutation-modal-form(
      :header="$t('eduPrograms.addMenu.fromFileForm.header')"
      :button-text="$t('eduPrograms.addMenu.fromFileForm.buttonText')"
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
            v-list-item-title {{ $t('eduPrograms.addMenu.buttons.addFromFile') }}
          v-list-item-action
            help-dialog(
              v-slot="{ on: onHelper }"
              :text="$t('eduPrograms.addMenu.helpDialog.helpInstruction')"
              doc="help/add_edu_programs"
            )
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip}")
                  v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                    v-icon mdi-help-circle-outline
                span {{ $t('eduPrograms.addMenu.buttons.helpInstruction') }}
      template(#form)
        validation-provider(
          v-slot="{ errors, valid }"
          :name="$t('eduPrograms.addMenu.fromFileForm.file')"
          rules="required"
        )
          v-file-input(
            v-model="file"
            :label="$t('eduPrograms.addMenu.fromFileForm.file')"
            :error-messages="errors"
            :success="valid"
            accept=".xlsx,.csv,.json"
            clearable
          )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed } from '#app'
import { DataProxy } from 'apollo-cache'
import { AddEduProgramMutationVariables } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import EduProgramForm, { InputEduProgram } from '~/components/eleden/edu_programs/EduProgramForm.vue'
import { getInputEduProgram } from '~/services/eleden'

type AddEduProgramUpdateType = (store: DataProxy, result: any) => void
type AddEduProgramFromPlxUpdateType = (store: DataProxy, result: any) => void
type AddEduProgramsUpdateType = (store: DataProxy, result: any) => void

export default defineComponent({
  components: { MutationModalForm, EduProgramForm, HelpDialog },
  props: {
    addEduProgramUpdate: { type: Function as PropType<AddEduProgramUpdateType>, required: true },
    addEduProgramFromPlxUpdate: { type: Function as PropType<AddEduProgramFromPlxUpdateType>, required: true },
    addEduProgramsUpdate: { type: Function as PropType<AddEduProgramsUpdateType>, required: true }
  },
  setup () {
    const inputEduProgram = ref<InputEduProgram>(getInputEduProgram())
    const file = ref<File | null>(null)
    const plxFile = ref<File | null>(null)

    const formVariables = computed<AddEduProgramMutationVariables>(() => ({
      name: inputEduProgram.value.name,
      adaptive: inputEduProgram.value.adaptive,
      admission: Number(inputEduProgram.value.admission),
      expedited: inputEduProgram.value.expedited,
      eduFormId: inputEduProgram.value.eduForm ? Number(inputEduProgram.value.eduForm.id) : 0,
      directionId: inputEduProgram.value.direction ? inputEduProgram.value.direction.id : '',
      description: inputEduProgram.value.description,
      syllabus: inputEduProgram.value.syllabus,
      calendar: inputEduProgram.value.calendar,
      eduProgramId: inputEduProgram.value.donor ? inputEduProgram.value.donor.id : undefined
    }))

    const close = (): void => {
      inputEduProgram.value = getInputEduProgram()
    }
    return { inputEduProgram, file, plxFile, formVariables, close }
  }
})
</script>
