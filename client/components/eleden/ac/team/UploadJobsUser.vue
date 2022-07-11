<template lang="pug">
mutation-modal-form(
  :header="String($t('ac.teams.users.addMenu.fromFileForNew.header'))"
  :subheader="`${team.name} (${team.shortName})`"
  :buttonText="String($t('ac.teams.users.addMenu.fromFileForNew.buttonText'))"
  :mutation="require('~/gql/eleden/mutations/job/upload_jobs_user.graphql')"
  :variables="variables"
  :update="update"
  mutation-name="uploadJobsUser"
  errors-in-alert
  width="700"
  @close="close"
)
  template(#activator="{ on }")
    slot(name="activator" :on="on")
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.users.addMenu.form.rate'))"
      rules="required|rate"
    )
      v-text-field(
        v-model="rate"
        :label="$t('ac.teams.users.addMenu.form.rate')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.users.addMenu.form.postId'))"
      rules="required"
    )
      v-autocomplete(
        v-model="postId"
        :items="posts"
        :loading="loading"
        :label="$t('ac.teams.users.addMenu.form.postId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
        @change="resetStatus"
      )
    validation-provider(
      ref="statusIdValidationProvider"
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.users.addMenu.form.statusId'))"
      rules="required"
    )
      v-select(
        v-model="statusId"
        :disabled="!postId"
        :items="statuses"
        :loading="loading"
        :label="$t('ac.teams.users.addMenu.form.statusId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
      )
        template(#item="{ item }") {{ getStatusText(item) }}
        template(#selection="{ item }") {{ getStatusText(item) }}
    v-row(v-if="canGenerateDecree")
      v-col(cols="6")
        v-checkbox(v-model="generateDocx" :label="$t('ac.teams.users.addMenu.form.generateDocx')" success)
      v-col(cols="6")
        v-checkbox(v-model="generatePdf" :label="$t('ac.teams.users.addMenu.form.generatePdf')" success)
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
          :disabled="!postId"
          :label="$t('ac.teams.users.addMenu.form.statusCreatedAt')"
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
    v-select(
      v-model="kind"
      :items="jobKinds"
      :label="$t('ac.teams.users.addMenu.form.kind')"
      :hint="$t('ac.teams.users.addMenu.form.kindHint')"
      success
      persistent-hint
    )
    validation-provider(
      :name="String($t('ac.teams.users.addMenu.form.file'))"
      rules="required"
      v-slot="{ errors, valid }"
    )
      v-file-input(
        v-model="file"
        :label="$t('ac.teams.users.addMenu.form.file')"
        :success="valid"
        :error-messages="errors"
        accept=".xlsx,.csv,.json"
        clearable
      )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ValidationProvider } from 'vee-validate'
import { DataProxy } from 'apollo-cache'
import { computed, defineComponent, ref } from '#app'
import {
  TeamType,
  JobPostStatusType,
  UploadJobsUserMutationVariables,
  UploadJobsUserMutationPayload,
  PostsQuery,
  PostsQueryVariables
} from '~/types/graphql'
import { useCommonQuery, useFilters, useI18n } from '~/composables'
import postsQuery from '~/gql/eleden/queries/team/posts.graphql'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type UploadJobsUserData = { data: { uploadJobsUser: UploadJobsUserMutationPayload } }
type UpdateType = (store: DataProxy, data: UploadJobsUserData) => void
type statusIdValidationProviderType = InstanceType<typeof ValidationProvider> | null

export default defineComponent({
  components: { MutationModalForm },
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    update: { type: Function as PropType<UpdateType>, required: true },
    jobKinds: { type: Array as PropType<JobKind[]>, required: true }
  },
  setup (props) {
    const { getNowDate } = useFilters()
    const { t } = useI18n()

    const statusIdValidationProvider = ref<statusIdValidationProviderType>(null)
    const rate = ref<number>(1)
    const postId = ref<string | null>(null)
    const kind = ref<string>('MJ')
    const file = ref<File | null>(null)
    const statusId = ref<string | null>(null)
    const statusCreatedAt = ref<string>(getNowDate())
    const statusCreatedAtMenuActive = ref<boolean>(false)
    const generateDocx = ref<boolean>(false)
    const generatePdf = ref<boolean>(false)

    const variables = computed<UploadJobsUserMutationVariables>(() => ({
      rate: rate.value,
      kind: kind.value,
      file: file.value,
      teamId: props.team.id,
      postId: postId.value ?? '',
      statusId: statusId.value ?? '',
      statusCreatedAt: statusCreatedAt.value,
      generateDocx: generateDocx.value,
      generatePdf: generatePdf.value
    }))

    const canGenerateDecree = computed<boolean>(() => {
      if (!statusId.value) {
        return false
      }
      const status = statuses.value.find((status: JobPostStatusType) => status.id === statusId.value)
      if (!status) {
        return false
      }
      return Boolean(status.templateXml) && Boolean(status.templateDocx)
    })

    const formattingStatusCreatedAt = computed<string>(() => (new Date(statusCreatedAt.value).toLocaleDateString()))

    const {
      data: posts,
      loading
    } = useCommonQuery<PostsQuery, PostsQueryVariables>({ document: postsQuery })

    const statuses = computed<JobPostStatusType[]>(() => (
      postId.value && posts.value ? posts.value.find(post => post.id === postId.value)!.statuses : []
    ))

    const resetStatus = (): void => {
      if (!statuses.value.find((status: JobPostStatusType) => status.id === statusId.value)) {
        statusId.value = null
        statusIdValidationProvider.value.reset()
      }
    }

    const getStatusText = (status: JobPostStatusType): string => {
      return `${status.name} (${status.active
        ? t('ac.teams.users.addMenu.form.active')
        : t('ac.teams.users.addMenu.form.notActive')})`
    }

    const close = (): void => {
      rate.value = 1
      kind.value = 'MJ'
      file.value = null
      postId.value = null
      statusId.value = null
      generateDocx.value = false
      generatePdf.value = false
      statusCreatedAt.value = getNowDate()
      statusCreatedAtMenuActive.value = false
    }

    watch(canGenerateDecree, () => {
      generateDocx.value = false
      generatePdf.value = false
    })

    return {
      statusIdValidationProvider,
      rate,
      postId,
      kind,
      file,
      statusId,
      statusCreatedAt,
      statusCreatedAtMenuActive,
      generateDocx,
      generatePdf,
      variables,
      statuses,
      canGenerateDecree,
      formattingStatusCreatedAt,
      posts,
      loading,
      resetStatus,
      getStatusText,
      close
    }
  }
})
</script>
