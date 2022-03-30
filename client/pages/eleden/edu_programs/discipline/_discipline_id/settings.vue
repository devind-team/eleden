<template lang="pug">
  mutation-form(
    :header="$t('eduPrograms.discipline.settings.header')"
    :subheader="$t('eduPrograms.discipline.settings.subheader', { updatedAt: dateTimeHM(discipline.updatedAt) })"
    :mutation="require('~/gql/eleden/mutations/edu_programs/change_discipline.graphql')"
    :variables="changeVariables"
    :button-text="$t('eduPrograms.discipline.settings.buttonText')"
    mutation-name="changeDiscipline"
    @done="changeDisciplineDone"
  )
    template(#form)
      discipline-form(
        :edu-program="discipline.eduProgram"
        :discipline="inputDiscipline"
      )
    template(#actions="{ invalid, loading, buttonText, setError }")
      apollo-mutation(
        v-if="hasPerm('eleden.delete_discipline')"
        v-slot="{ mutate }"
        :mutation="require('~/gql/eleden/mutations/edu_programs/delete_discipline.graphql')"
        :variables="{ disciplineId: discipline.id }"
        :update="deleteUpdate"
        @done="redirectToDisciplines"
        @error="setError"
      )
        delete-menu(
          v-slot="{ on }"
          :item-name="$t('eduPrograms.discipline.settings.deleteItemName')"
          @confirm="mutate"
        )
          v-btn(v-on="on" color="error") {{ $t('eduPrograms.discipline.settings.deleteButtonText') }}
      v-spacer
      v-btn(:disabled="invalid" :loading="loading" type="submit" color="primary") {{ buttonText }}
</template>

<script lang="ts">
import type { PropType, ComputedRef, Ref } from '#app'
import { defineComponent, computed, ref, useRouter, toRef } from '#app'
import {
  DisciplineType,
  ChangeDisciplineMutationVariables,
  ChangeDisciplineMutationPayload,
  DisciplinesQuery,
  DisciplinesQueryVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useFilters, useQueryRelay } from '~/composables'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import MutationForm from '~/components/common/forms/MutationForm.vue'
import DisciplineForm, { InputDiscipline } from '~/components/eleden/edu_programs/DisciplineForm.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type ChangeDisciplineData = {
  data: { changeDiscipline: ChangeDisciplineMutationPayload }
}

export default defineComponent({
  components: { MutationForm, DisciplineForm, DeleteMenu },
  permissions: ['eleden.change_discipline'],
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true }
  },
  setup (props) {
    const { localePath } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { dateTimeHM } = useFilters()
    const router = useRouter()

    const getInputDiscipline = (): InputDiscipline => {
      return {
        id: props.discipline.id,
        code: props.discipline.code,
        name: props.discipline.name,
        annotation: null,
        workProgram: null,
        existingAnnotation: props.discipline.annotation ? { src: props.discipline.annotation } : undefined,
        existingWorkProgram: props.discipline.workProgram ? { src: props.discipline.workProgram } : undefined,
        view: props.discipline.view,
        parent: props.discipline.parent,
        users: props.discipline.users,
        methodologicalSupport: undefined
      }
    }

    const inputDiscipline: Ref<InputDiscipline> = ref<InputDiscipline>(getInputDiscipline())

    const changeVariables: ComputedRef<ChangeDisciplineMutationVariables> = computed<ChangeDisciplineMutationVariables>(() => (
      {
        disciplineId: props.discipline.id,
        viewId: inputDiscipline.value.view ? inputDiscipline.value.view.id : '',
        userIds: inputDiscipline.value.users.map(user => user.id),
        deleteAnnotation: !inputDiscipline.value.annotation && !inputDiscipline.value.existingAnnotation,
        deleteWorkProgram: !inputDiscipline.value.workProgram && !inputDiscipline.value.existingWorkProgram,
        code: inputDiscipline.value.code !== props.discipline.code ? inputDiscipline.value.code : undefined,
        name: inputDiscipline.value.name !== props.discipline.name ? inputDiscipline.value.name : undefined,
        annotation: inputDiscipline.value.annotation,
        workProgram: inputDiscipline.value.workProgram,
        parentId: inputDiscipline.value.parent ? inputDiscipline.value.parent.id : undefined
      }
    ))

    const changeDisciplineDone = ({ data: { changeDiscipline: { success } } }: ChangeDisciplineData): void => {
      if (success) {
        inputDiscipline.value = getInputDiscipline()
      }
    }

    const { deleteUpdate } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => ({ eduProgramId: props.discipline.eduProgram.id })
    })

    const redirectToDisciplines = (): void => {
      router.push(
        localePath({
          name: 'eleden-edu_programs-edu_program_id',
          params: { edu_program_id: props.discipline.eduProgram.id }
        })
      )
    }

    return {
      hasPerm,
      dateTimeHM,
      getInputDiscipline,
      inputDiscipline,
      changeVariables,
      changeDisciplineDone,
      deleteUpdate,
      redirectToDisciplines
    }
  }
})
</script>
