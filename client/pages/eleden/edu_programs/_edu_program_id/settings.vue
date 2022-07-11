<template lang="pug">
mutation-form(
  :header="$t('eduPrograms.settings.header')"
  :subheader="$t('eduPrograms.settings.subheader', { updatedAt: dateTimeHM(eduProgram.updatedAt) })"
  :mutation="require('~/gql/eleden/mutations/edu_programs/change_edu_program.graphql')"
  :variables="changeVariables"
  :button-text="$t('eduPrograms.settings.buttonText')"
  mutation-name="changeEduProgram"
  i18n-path="eduPrograms.form"
  @done="changeEduProgramDone"
)
  template(#form)
    edu-program-form(:edu-program="inputEduProgram")
  template(#actions="{ invalid, loading, buttonText, setError, setSuccess }")
    apollo-mutation(
      v-if="hasPerm(['eleden.delete_eduprogram'])"
      v-slot="{ mutate }"
      :mutation="require('~/gql/eleden/mutations/edu_programs/delete_edu_program.graphql')"
      :variables="{ eduProgramId: eduProgram.id }"
      @error="setError"
      @done="DeleteEduProgramDone"
    )
      delete-menu(v-slot="{ on }" :item-name="$t('eduPrograms.settings.deleteItemName')" @confirm="mutate")
        v-btn(v-on="on" color="error") {{ $t('eduPrograms.settings.deleteButtonText') }}
    v-spacer
    v-btn(:disabled="invalid" :loading="loading" type="submit" color="primary") {{ buttonText }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, useRouter, toRef } from '#app'
import {
  EduProgramType,
  ChangeEduProgramMutationPayload,
  ChangeEduProgramMutationVariables,
  DeleteEduProgramMutationPayload
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useFilters, useI18n } from '~/composables'
import MutationForm from '~/components/common/forms/MutationForm.vue'
import EduProgramForm, { InputEduProgram } from '~/components/eleden/edu_programs/EduProgramForm.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import { getInputEduProgram } from '~/services/eleden'

type ChangeEduProgramDataType = {
  data: { changeEduProgram: ChangeEduProgramMutationPayload }
}

type DeleteEduProgramDataType = {
  data: { deleteEduProgram: DeleteEduProgramMutationPayload }
}

export default defineComponent({
  components: { MutationForm, EduProgramForm, DeleteMenu },
  permissions: ['eleden.change_eduprogram'],
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { dateTimeHM } = useFilters()
    const { localePath } = useI18n()
    const router = useRouter()

    const inputEduProgram = ref<InputEduProgram>(getInputEduProgram(props.eduProgram))

    const changeVariables = computed<ChangeEduProgramMutationVariables>(() => ({
      eduProgramId: inputEduProgram.value.id!,
      deleteDescription: !inputEduProgram.value.description && !inputEduProgram.value.existingDescription,
      deleteSyllabus: !inputEduProgram.value.syllabus && !inputEduProgram.value.existingSyllabus,
      deleteCalendar: !inputEduProgram.value.calendar && !inputEduProgram.value.existingCalendar,
      name: inputEduProgram.value.name !== props.eduProgram.name ? inputEduProgram.value.name : undefined,
      adaptive: inputEduProgram.value.adaptive !== props.eduProgram.adaptive
        ? inputEduProgram.value.adaptive
        : undefined,
      admission: Number(inputEduProgram.value.admission) !== props.eduProgram.admission
        ? Number(inputEduProgram.value.admission)
        : undefined,
      expedited: inputEduProgram.value.expedited !== props.eduProgram.expedited
        ? inputEduProgram.value.expedited
        : undefined,
      description: inputEduProgram.value.description,
      syllabus: inputEduProgram.value.syllabus,
      calendar: inputEduProgram.value.calendar,
      eduFormId: inputEduProgram.value.eduForm ? Number(inputEduProgram.value.eduForm.id) : undefined,
      directionId: inputEduProgram.value.direction ? inputEduProgram.value.direction.id : undefined
    }))

    const changeEduProgramDone = ({ data: { changeEduProgram: { success } } }: ChangeEduProgramDataType):void => {
      if (success) {
        inputEduProgram.value = getInputEduProgram(props.eduProgram)
      }
    }

    const DeleteEduProgramDone = ({ data: { deleteEduProgram: { success, id } } }: DeleteEduProgramDataType): void => {
      if (success) {
        router.push(
          localePath({ name: 'eleden-edu_programs', query: { eduProgramId: id } })
        )
      }
    }

    return { hasPerm, dateTimeHM, inputEduProgram, changeVariables, changeEduProgramDone, DeleteEduProgramDone }
  }
})
</script>
