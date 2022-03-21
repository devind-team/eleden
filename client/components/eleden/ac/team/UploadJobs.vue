<template lang="pug">
  mutation-modal-form(
    :header="t('fromFileForExisting.header')"
    :subheader="team.name + ' (' + team.shortName + ')'"
    :buttonText="t('fromFileForExisting.buttonText')"
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
        :name="t('form.file')"
        rules="required"
      )
        v-file-input(
          v-model="file"
          :label="t('form.file')"
          :success="valid"
          :error-messages="errors"
          accept=".xlsx,.csv,.json"
          clearable
        )
      v-row
        v-col(cols="6")
          v-checkbox(v-model="generateDocx" :label="t('form.generateDocx')" success)
        v-col(cols="6")
          v-checkbox(v-model="generatePdf" :label="t('form.generatePdf')" success)
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { TeamType, UploadJobsMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type UploadJobsData = { data: { uploadJobs: UploadJobsMutationPayload } }
type Update = (store: DataProxy, data: UploadJobsData) => void

@Component<UploadJobs>({
  components: { MutationModalForm }
})
export default class UploadJobs extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update

  file: File | null = null
  generateDocx: boolean = false
  generatePdf: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.users.addMenu.${path}`, values) as string
  }

  /**
   * Закрыте формы
   */
  close (): void {
    this.file = null
    this.generateDocx = false
    this.generatePdf = false
  }
}
</script>
