<template lang="pug">
mutation-modal-form(
  :header="String($t('ac.teams.users.addMenu.fromFileForExisting.header'))"
  :subheader="team.name + ' (' + team.shortName + ')'"
  :buttonText="String($t('ac.teams.users.addMenu.fromFileForExisting.buttonText'))"
  :mutation="require('~/gql/eleden/mutations/job/upload_jobs.graphql')"
  :variables="{ file, teamId: team.id, generateDocx, generatePdf }"
  :update="update"
  mutation-name="uploadJobs"
  errors-in-alert
  width="700"
  @close="close"
)
  template(#activator="{ on }")
    slot(name="activator" :on="on")
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.users.addMenu.form.file'))"
      rules="required"
    )
      v-file-input(
        v-model="file"
        :label="$t('ac.teams.users.addMenu.form.file')"
        :success="valid"
        :error-messages="errors"
        accept=".xlsx,.csv,.json"
        clearable
      )
    v-row
      v-col(cols="6")
        v-checkbox(v-model="generateDocx" :label="$t('ac.teams.users.addMenu.form.generateDocx')" success)
      v-col(cols="6")
        v-checkbox(v-model="generatePdf" :label="$t('ac.teams.users.addMenu.form.generatePdf')" success)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataProxy } from 'apollo-cache'
import { TeamType, UploadJobsMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type UploadJobsData = { data: { uploadJobs: UploadJobsMutationPayload } }
type UpdateType = (store: DataProxy, data: UploadJobsData) => void

export default defineComponent({
  components: { MutationModalForm },
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    update: { type: Function as PropType<UpdateType>, required: true }
  },
  setup () {
    const file = ref<File | null>(null)
    const generateDocx = ref<boolean>(false)
    const generatePdf = ref<boolean>(false)

    const close = (): void => {
      file.value = null
      generateDocx.value = false
      generatePdf.value = false
    }

    return { file, generateDocx, generatePdf, close }
  }
})
</script>
