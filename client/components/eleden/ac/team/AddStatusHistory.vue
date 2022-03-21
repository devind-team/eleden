<template lang="pug">
  mutation-modal-form(
    :header="t('header')"
    :subheader="`${$getUserFullName(job.user)}, ${jobPost.post.name}`"
    :buttonText="t('buttonText')"
    :mutation="require('~/gql/eleden/mutations/job_post/add_job_post_status_history.graphql')"
    :variables="variables"
    :update="(store, data) => update(store, data, job, jobPost)"
    mutation-name="addJobPostStatusHistory"
    i18n-path="ac.teams.posts.statusHistoryAddForm"
    width="700"
    @close="close"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    template(#form)
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('statusId')"
        rules="required"
      )
        v-select(
          v-model="statusId"
          :class="{ 'add-status-history__status_warning': statusWarning }"
          :items="jobPost.post.statuses"
          :label="t('statusId')"
          :error-messages="errors"
          :success="valid"
          :hint="statusWarning"
          item-text="name"
          item-value="id"
        )
          template(#item="{ item }") {{ getStatusText(item) }}
          template(#selection="{ item }") {{ getStatusText(item) }}
      v-row(v-if="canGenerateDecree")
        v-col(cols="6")
          v-checkbox(v-model="generateDocx" :label="t('generateDocx')" success)
        v-col(cols="6")
          v-checkbox(v-model="generatePdf" :label="t('generatePdf')" success)
      v-menu(
        v-model="statusCreatedAtMenuActive"
        :close-on-content-click="false"
        :nudge-right="35"
        transition="scale-transition"
        min-width="auto"
        offset-y
      )
        template(#activator="{ on, attrs }")
          v-text-field(
            v-bind="attrs"
            v-on="on"
            v-model="formattingStatusCreatedAt"
            :label="t('statusCreatedAt')"
            prepend-icon="mdi-calendar"
            readonly
            success
          )
        v-date-picker(
          v-model="statusCreatedAt"
          first-day-of-week="1"
          no-title
          @input="statusCreatedAtMenuActive = false"
        )
      v-checkbox(v-model="completePrevious" :label="t('completePrevious')" success)
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import {
  JobType,
  JobPostType,
  JobPostStatusType,
  AddJobPostStatusHistoryMutationPayload,
  AddJobPostStatusHistoryMutationVariables
} from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type AddJobPostStatusHistoryData = { data: { addJobPostStatusHistory: AddJobPostStatusHistoryMutationPayload } }
type Update = (store: DataProxy, data: AddJobPostStatusHistoryData, job: JobType, jobPost: JobPostType) => void

@Component<AddStatusHistory>({
  components: { MutationModalForm },
  computed: {
    variables (): AddJobPostStatusHistoryMutationVariables {
      return {
        jobPostId: this.jobPost.id,
        statusId: this.statusId ?? '',
        statusCreatedAt: this.statusCreatedAt,
        generateDocx: this.generateDocx,
        generatePdf: this.generatePdf,
        completePrevious: this.completePrevious
      }
    },
    statusWarning (): string | null {
      if (this.statusId && this.jobPost.statusHistory.some(
        statusHistory => statusHistory.status.id === this.statusId && !statusHistory.endAt)) {
        return this.t('statusIdWarning')
      }
      return null
    },
    canGenerateDecree (): boolean {
      if (!this.statusId) {
        return false
      }
      const status = this.jobPost.post.statuses.find((status: JobPostStatusType) => status.id === this.statusId)
      if (!status) {
        return false
      }
      return Boolean(status.templateXml) && Boolean(status.templateDocx)
    },
    formattingStatusCreatedAt (): string {
      return new Date(this.statusCreatedAt).toLocaleDateString()
    }
  }
})
export default class AddStatusHistory extends Vue {
  @Prop({ type: Object as PropType<JobType>, required: true }) readonly job!: JobType
  @Prop({ type: Object as PropType<JobPostType>, required: true }) readonly jobPost!: JobPostType
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update

  readonly variables!: AddJobPostStatusHistoryMutationVariables
  readonly statusWarning!: string | null
  readonly canGenerateDecree!: boolean
  readonly formattingStatusCreatedAt!: string

  statusId: string | null = null
  statusCreatedAt: string = this.$getNowDate()
  statusCreatedAtMenuActive: boolean = false
  generateDocx: boolean = false
  generatePdf: boolean = false
  completePrevious: boolean = true

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.posts.statusHistoryAddForm.${path}`, values) as string
  }

  /**
   * Получение текста статуса
   * @param status
   * @return
   */
  getStatusText (status: JobPostStatusType): string {
    return `${status.name} (${status.active ? this.t('active') : this.t('notActive')})`
  }

  /**
   * Закрыте формы
   */
  close (): void {
    this.statusId = null
    this.statusCreatedAt = this.$getNowDate()
    this.statusCreatedAtMenuActive = false
    this.generateDocx = false
    this.generatePdf = false
    this.completePrevious = true
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.add-status-history__status_warning
  .v-messages__message
    color: map-get($amber, 'base')
</style>
