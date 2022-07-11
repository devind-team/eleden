<template lang="pug">
mutation-modal-form(
  :header="String($t('ac.teams.posts.statusHistoryAddForm.header'))"
  :subheader="`${getUserFullName(job.user)}, ${jobPost.post.name}`"
  :buttonText="String($t('ac.teams.posts.statusHistoryAddForm.buttonText'))"
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
      :name="String($t('ac.teams.posts.statusHistoryAddForm.statusId'))"
      rules="required"
    )
      v-select(
        v-model="statusId"
        :class="{ 'add-status-history__status_warning': statusWarning }"
        :items="jobPost.post.statuses"
        :label="$t('ac.teams.posts.statusHistoryAddForm.statusId')"
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
        v-checkbox(v-model="generateDocx" :label="$t('ac.teams.posts.statusHistoryAddForm.generateDocx')" success)
      v-col(cols="6")
        v-checkbox(v-model="generatePdf" :label="$t('ac.teams.posts.statusHistoryAddForm.generatePdf')" success)
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
          :label="$t('ac.teams.posts.statusHistoryAddForm.statusCreatedAt')"
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
    v-checkbox(v-model="completePrevious" :label="$t('ac.teams.posts.statusHistoryAddForm.completePrevious')" success)
</template>

<script lang="ts">
import { DataProxy } from 'apollo-cache'
import type { PropType } from '#app'
import { computed, defineComponent, ref } from '#app'
import {
  JobType,
  JobPostType,
  JobPostStatusType,
  AddJobPostStatusHistoryMutationPayload,
  AddJobPostStatusHistoryMutationVariables
} from '~/types/graphql'
import { useFilters, useI18n } from '~/composables'
import { getStatusText as _getStatusText } from '~/services/eleden'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type AddJobPostStatusHistoryData = { data: { addJobPostStatusHistory: AddJobPostStatusHistoryMutationPayload } }
type UpdateType = (store: DataProxy, data: AddJobPostStatusHistoryData, job: JobType, jobPost: JobPostType) => void

export default defineComponent({
  components: { MutationModalForm },
  props: {
    job: { type: Object as PropType<JobType>, required: true },
    jobPost: { type: Object as PropType<JobPostType>, required: true },
    update: { type: Function as PropType<UpdateType>, required: true }
  },
  setup (props) {
    const { getNowDate, getUserFullName } = useFilters()
    const { t } = useI18n()

    const statusId = ref<string | null>(null)
    const statusCreatedAt = ref<string>(getNowDate())
    const statusCreatedAtMenuActive = ref<boolean>(false)
    const generateDocx = ref<boolean>(false)
    const generatePdf = ref<boolean>(false)
    const completePrevious = ref<boolean>(true)

    const variables = computed<AddJobPostStatusHistoryMutationVariables>(() => ({
      jobPostId: props.jobPost.id,
      statusId: statusId.value ?? '',
      statusCreatedAt: statusCreatedAt.value,
      generateDocx: generateDocx.value,
      generatePdf: generatePdf.value,
      completePrevious: completePrevious.value
    }))

    const statusWarning = computed<string | null>(() => {
      if (statusId.value && props.jobPost.statusHistory.some(
        statusHistory => statusHistory.status.id === statusId.value && !statusHistory.endAt)) {
        return String(t('ac.teams.posts.statusHistoryAddForm.statusIdWarning'))
      }
      return null
    })

    const canGenerateDecree = computed<boolean>(() => {
      if (!statusId.value) {
        return false
      }
      const status = props.jobPost.post.statuses.find((status: JobPostStatusType) => status.id === statusId.value)
      if (!status) {
        return false
      }
      return Boolean(status.templateXml) && Boolean(status.templateDocx)
    })

    const formattingStatusCreatedAt = computed<string>(() => (new Date(statusCreatedAt.value).toLocaleDateString()))

    const getStatusText = (status: JobPostStatusType) => _getStatusText(t, status)

    const close = (): void => {
      statusId.value = null
      statusCreatedAt.value = getNowDate()
      statusCreatedAtMenuActive.value = false
      generateDocx.value = false
      generatePdf.value = false
      completePrevious.value = true
    }

    return {
      getUserFullName,
      statusId,
      statusCreatedAt,
      statusCreatedAtMenuActive,
      generateDocx,
      generatePdf,
      completePrevious,
      variables,
      statusWarning,
      canGenerateDecree,
      formattingStatusCreatedAt,
      getStatusText,
      close
    }
  }
})
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.add-status-history__status_warning
  .v-messages__message
    color: map-get($amber, 'base')
</style>
