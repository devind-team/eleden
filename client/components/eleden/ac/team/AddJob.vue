<template lang="pug">
  mutation-modal-form(
    :header="String($t('ac.teams.users.addMenu.fromExisting.header'))"
    :subheader="team.name + ' (' + team.shortName + ')'"
    :buttonText="String($t('ac.teams.users.addMenu.fromExisting.buttonText'))"
    :mutation="require('~/gql/eleden/mutations/job/add_job.graphql')"
    :variables="variables"
    :update="update"
    mutation-name="addJob"
    i18n-path="ac.teams.users.addMenu.form"
    width="700"
    @close="close"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    template(#form)
      validation-provider(
        v-slot="{ errors, valid }"
        :name="String($t('ac.teams.users.addMenu.form.userId'))"
        rules="required"
      )
        v-autocomplete(
          v-model="userId"
          :search-input="search"
          :items="users"
          :loading="usersLoading"
          :filter="filterUsers"
          :label="$t('ac.teams.users.addMenu.form.userId')"
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
          :loading="postsLoading"
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
          :loading="postsLoading"
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
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ValidationProvider } from 'vee-validate'
import { DataProxy } from 'apollo-cache'
import { computed, defineComponent, ref } from '#app'
import {
  TeamType,
  UserType,
  JobType,
  PostType,
  JobPostStatusType,
  AddJobMutationPayload,
  AddJobMutationVariables,
  PostsQuery,
  PostsQueryVariables,
  SearchUsersQuery,
  SearchUsersQueryVariables
} from '~/types/graphql'
import { useCommonQuery, useFilters, useI18n, useQueryRelay, useDebounceSearch } from '~/composables'
import postsQuery from '~/gql/eleden/queries/team/posts.graphql'
import usersQuery from '~/gql/eleden/queries/core/search_users.graphql'
import { getStatusText as _getStatusText } from '~/services/eleden'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

export type AddJobData = { data: { addJob: AddJobMutationPayload } }
type UpdateType = (store: DataProxy, data: AddJobData) => void
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

    const variables = computed<AddJobMutationVariables>(() => ({
      rate: rate.value,
      kind: kind.value,
      teamId: props.team.id,
      userId: userId.value ?? '',
      postId: postId.value ?? '',
      statusId: statusId.value ?? '',
      statusCreatedAt: statusCreatedAt.value,
      generateDocx: generateDocx.value,
      generatePdf: generatePdf.value
    }))

    const statuses = computed<JobPostStatusType[]>(() => {
      return postId.value && posts.value ? posts.value.find((post: PostType) => post.id === postId.value)!.statuses : []
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

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: usersData,
      loading: usersLoading,
      refetch
    } = useQueryRelay<SearchUsersQuery, SearchUsersQueryVariables>({
      document: usersQuery,
      variables: () => ({ first: debounceSearch.value ? undefined : 10, search: debounceSearch.value })
    })
    const users = computed<UserType[]>(() => (
      usersData.value.filter((user: UserType) => !props.team.jobs.find((job: JobType) => job.user.id === user.id))
    ))

    const {
      data: posts,
      loading: postsLoading
    } = useCommonQuery<PostsQuery, PostsQueryVariables>({ document: postsQuery })

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

    const getStatusText = (status: JobPostStatusType) => _getStatusText(t, status)

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

    const refetchUsers = (): void => {
      refetch()
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
      statuses,
      canGenerateDecree,
      formattingStatusCreatedAt,
      users,
      usersLoading,
      search,
      posts,
      postsLoading,
      filterUsers,
      resetStatus,
      getStatusText,
      close,
      refetchUsers
    }
  }
})
</script>
