<template lang="pug">
mutation-modal-form(
  :header="String($t('ac.teams.posts.addMenu.addForm.header'))"
  :subheader="team.name + ' (' + team.shortName + ')'"
  :buttonText="String($t('ac.teams.posts.addMenu.addForm.buttonText'))"
  :mutation="require('~/gql/eleden/mutations/job_post/add_job_post.graphql')"
  :variables="variables"
  :update="(store, data) => update(store, data, userJob)"
  mutation-name="addJobPost"
  i18n-path="ac.teams.posts.addMenu.form"
  width="700"
  @close="close"
)
  template(#activator="{ on }")
    slot(name="activator" :on="on")
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.posts.addMenu.form.userId'))"
      rules="required"
    )
      v-autocomplete(
        v-model="userId"
        :items="team.jobs.map(job => job.user)"
        :filter="filterUsers"
        :label="$t('ac.teams.posts.addMenu.form.userId')"
        :error-messages="errors"
        :success="valid"
        item-value="id"
        clearable
        hide-no-data
        hide-selected
      )
        template(#selection="{ item }") {{ getUserFullName(item) }}
        template(#item="{ item }")
          v-list-item-avatar
            avatar-dialog(:item="item")
          v-list-item-content
            v-list-item-title {{ getUserFullName(item) }}
            v-list-item-subtitle {{ item.username }}
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.posts.addMenu.form.rate'))"
      rules="required|rate"
    )
      v-text-field(
        v-model="rate"
        :label="$t('ac.teams.posts.addMenu.form.rate')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.posts.addMenu.form.postId'))"
      rules="required"
    )
      v-autocomplete(
        v-model="postId"
        :disabled="!userId"
        :items="availablePosts"
        :loading="loading"
        :label="$t('ac.teams.posts.addMenu.form.postId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
        @change="resetStatus"
      )
    validation-provider(
      ref="statusIdValidationProvider"
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.posts.addMenu.form.statusId'))"
      rules="required"
    )
      v-select(
        v-model="statusId"
        :disabled="!postId"
        :items="statuses"
        :loading="loading"
        :label="$t('ac.teams.posts.addMenu.form.statusId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
      )
        template(#item="{ item }") {{ getStatusText(item) }}
        template(#selection="{ item }") {{ getStatusText(item) }}
    v-row(v-if="canGenerateDecree")
      v-col(cols="6")
        v-checkbox(v-model="generateDocx" :label="$t('ac.teams.posts.addMenu.form.generateDocx')" success)
      v-col(cols="6")
        v-checkbox(v-model="generatePdf" :label="$t('ac.teams.posts.addMenu.form.generatePdf')" success)
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
          :label="$t('ac.teams.posts.addMenu.form.statusCreatedAt')"
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
      :label="$t('ac.teams.posts.addMenu.form.kind')"
      :hint="$t('ac.teams.posts.addMenu.form.kindHint')"
      success
      persistent-hint
    )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent } from '#app'
import { ValidationProvider } from 'vee-validate'
import { DataProxy } from 'apollo-cache'
import {
  TeamType,
  UserType,
  JobType,
  PostType,
  JobPostType,
  JobPostStatusType,
  AddJobPostMutationPayload,
  AddJobPostMutationVariables,
  PostsQuery,
  PostsQueryVariables
} from '~/types/graphql'
import { useFilters, useCommonQuery, useI18n } from '~/composables'
import postsQuery from '~/gql/eleden/queries/team/posts.graphql'
import { getStatusText as _getStatusText } from '~/services/eleden'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

export type AddJobPostData = { data: { addJobPost: AddJobPostMutationPayload } }
type UpdateType = (store: DataProxy, data: AddJobPostData, job: JobType) => void
type statusIdValidationProviderType = InstanceType<typeof ValidationProvider> | null

export default defineComponent({
  components: { MutationModalForm, AvatarDialog },
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    update: { type: Function as PropType<UpdateType>, required: true },
    jobKinds: { type: Array as PropType<JobKind[]>, required: true }
  },
  setup (props) {
    const { getUserFullName, getNowDate } = useFilters()
    const { t } = useI18n()

    const statusIdValidationProvider = ref<statusIdValidationProviderType>(null)
    const userId = ref<string | null>(null)
    const rate = ref<number>(1)
    const postId = ref<string | null>(null)
    const kind = ref<string>('MJ')
    const statusId = ref<string | null>(null)
    const statusCreatedAt = ref<string>(getNowDate())
    const statusCreatedAtMenuActive = ref<boolean>(false)
    const generateDocx = ref<boolean>(false)
    const generatePdf = ref<boolean>(false)

    const variables = computed<AddJobPostMutationVariables>(() => ({
      jobId: userJob.value ? userJob.value.id : '',
      rate: rate.value,
      kind: kind.value,
      postId: postId.value ?? '',
      statusId: statusId.value ?? '',
      statusCreatedAt: statusCreatedAt.value,
      generateDocx: generateDocx.value,
      generatePdf: generatePdf.value
    }))

    const userJob = computed<JobType | null>(() => {
      if (!userId.value) {
        return null
      }
      return props.team.jobs.find(job => job.user.id === userId.value)!
    })

    const existingPosts = computed<PostType[] | null>(() => {
      if (!userJob.value) {
        return null
      }
      return userJob.value.jobPosts.reduce(
        (acc: PostType[], jobPost: JobPostType) => [...acc, jobPost.post], [] as PostType[]
      )
    })

    const availablePosts = computed<PostType[]>(() => {
      if (!existingPosts.value || !posts.value) {
        return []
      }
      return posts.value.filter(
        post => !existingPosts.value!.find((existingPost: PostType) => post.id === existingPost.id)
      )
    })

    const statuses = computed<JobPostStatusType[]>(() => {
      return postId.value && posts.value ? posts.value.find(post => post.id === postId.value)!.statuses : []
    })

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

    const getStatusText = (status: JobPostStatusType) => _getStatusText(t, status)

    const filterUsers = (item: UserType, queryText: string): boolean => {
      const qt: string = queryText.toLowerCase()
      const ln: string = item.lastName.toLowerCase()
      const fn: string = item.firstName.toLowerCase()
      return ln.includes(qt) || fn.includes(qt) || item.username.includes(qt)
    }

    const resetStatus = (): void => {
      if (!statuses.value.find((status: JobPostStatusType) => status.id === statusId.value)) {
        statusId.value = null
        statusIdValidationProvider.value.reset()
      }
    }

    const close = (): void => {
      rate.value = 1
      kind.value = 'MJ'
      userId.value = null
      postId.value = null
      statusId.value = null
      statusCreatedAt.value = getNowDate()
      statusCreatedAtMenuActive.value = false
      generateDocx.value = false
      generatePdf.value = false
    }

    watch(canGenerateDecree, () => {
      generateDocx.value = false
      generatePdf.value = false
    })

    return {
      getUserFullName,
      statusIdValidationProvider,
      userId,
      rate,
      postId,
      kind,
      statusId,
      statusCreatedAt,
      statusCreatedAtMenuActive,
      generateDocx,
      generatePdf,
      variables,
      userJob,
      existingPosts,
      availablePosts,
      statuses,
      canGenerateDecree,
      formattingStatusCreatedAt,
      posts,
      loading,
      getStatusText,
      filterUsers,
      resetStatus,
      close
    }
  }
})
</script>
