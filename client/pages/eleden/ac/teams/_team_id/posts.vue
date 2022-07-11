<template lang="pug">
v-card
  v-card-title {{ $t('ac.teams.posts.name') }}
  v-card-text
    v-row(align="center")
      v-col
        v-menu(v-if="canAdd" bottom)
          template(#activator="{ on }")
            v-btn.mr-3(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('ac.teams.posts.addMenu.buttons.add') }}
          v-list
            add-job-post(:team="team" :update="addJobPostUpdate" :job-kinds="jobKinds")
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-form-select
                  v-list-item-content {{ $t('ac.teams.posts.addMenu.buttons.fillForm') }}
        users-data-filter(
          v-model="usersFilter"
          :users="users"
          message-container-class="mr-1 my-1"
          multiple
        )
        query-data-filter(
          v-model="postFilter"
          v-bind="getFilterMessages('postFilter')"
          :query="require('~/gql/eleden/queries/team/posts.graphql')"
          :update="data => data.posts"
          :get-name="post => post.name"
          :search-function="(item, search) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())"
          search-type="client"
          message-container-class="mr-1 my-1"
        )
        items-data-filter(
          v-model="jobKindFilter"
          v-bind="getFilterMessages('jobKindFilter')"
          :items="jobKinds"
          :get-name="jobKind => jobKind.text"
          message-container-class="mr-1 my-1"
        )
    v-row(v-if="posts.length > 0" align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count: postsCount, totalCount: posts.length }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :items="filteredPosts"
          :search="search"
          :custom-filter="filter"
          disable-pagination
          hide-default-footer
          @pagination="({ itemsLength }) => postsCount = itemsLength"
        )
          template(#item.jobPost.kind="{ item }") {{ $t(`ac.teams.jobKinds.${item.jobPost.kind.toLowerCase()}`) }}
          template(#item.user.avatar="{ item }")
            avatar-dialog(:item="item.job.user")
          template(#item.user="{ item }")
            user-link(:user="item.job.user" full)
          template(#item.actions="{ item }")
            experimental-dialog(v-if="hasPerm('core.view_experimental') && canChange" v-slot="{ on: onDialog }")
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip }")
                  v-btn(v-on="{ ...onDialog, ...onTooltip }" color="success" icon)
                    v-icon mdi-pencil
                span {{ $t('ac.teams.posts.tooltips.change') }}
            status-history(
              v-if="canViewStatusHistory || item.job.user.id === user.id"
              :job="item.job"
              :job-post="item.jobPost"
              :can-change="canChangeStatusHistory"
              :can-delete="canDeleteStatusHistory"
            )
              template(#activator="{ on: onDialog }")
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip }")
                    v-btn(v-on="{ ...onDialog, ...onTooltip }" color="primary" icon)
                      v-icon mdi-text-box-outline
                  span {{ $t('ac.teams.posts.tooltips.viewStatusHistory') }}
            add-status-history(
              v-if="canAddStatusHistory"
              :job="item.job"
              :job-post="item.jobPost"
              :update="addStatusHistoryUpdate"
            )
              template(#activator="{ on: onDialog }")
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip }")
                    v-btn(v-on="{ ...onDialog, ...onTooltip }" color="purple lighten-1" icon)
                      v-icon mdi-text-box-plus-outline
                  span {{ $t('ac.teams.posts.tooltips.addStatus') }}
            apollo-mutation(
              v-if="canDelete"
              :mutation="require('~/gql/eleden/mutations/job_post/delete_job_post.graphql')"
              :variables="{ jobPostId: item.jobPost.id }"
              :update="(store, result) => deleteJobPostUpdate(store, result, item.job, item.jobPost)"
              tag="span"
            )
              template(v-slot="{ mutate, loading }")
                delete-menu(:item-name="$t('ac.teams.posts.deleteItemName')" @confirm="mutate")
                  template(#default="{ on: onMenu }")
                    v-tooltip(bottom)
                      template(#activator="{ on: onTooltip }")
                        v-btn(v-on="{ ...onMenu, ...onTooltip }" :loading="loading" icon)
                          v-icon(color="error") mdi-delete
                      span {{ $t('ac.teams.posts.tooltips.delete') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ref, computed, defineComponent, toRefs, inject } from '#app'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import {
  TeamType,
  UserType,
  JobType,
  PostType,
  JobPostType,
  DeleteJobPostMutationPayload,
  JobPostStatusHistoryType
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useFilters } from '~/composables'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import { FilterMessages } from '~/types/filters'
import AddJobPost, { AddJobPostData } from '~/components/eleden/ac/team/AddJobPost.vue'
import AddStatusHistory, { AddJobPostStatusHistoryData } from '~/components/eleden/ac/team/AddStatusHistory.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import StatusHistory from '~/components/eleden/ac/team/StatusHistory.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

type Post = { job: JobType, jobPost: JobPostType }
type DeleteJobPostData = { data: { deleteJobPost: DeleteJobPostMutationPayload } }

export default defineComponent({
  components: {
    AddJobPost,
    AddStatusHistory,
    UsersDataFilter,
    AvatarDialog,
    UserLink,
    StatusHistory,
    DeleteMenu,
    ExperimentalDialog,
    ItemsDataFilter,
    QueryDataFilter
  },
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    isMember: { type: Boolean, required: true },
    rawJobKinds: { type: Array as PropType<string[]>, required: true },
    jobKinds: { type: Array as PropType<JobKind[]>, required: true }
  },
  setup (props) {
    const { t, tc } = useI18n()
    const { getUserFullName, getUserName } = useFilters()
    const userStore = useAuthStore()
    const { hasPerm, user } = toRefs(userStore)

    const usersFilter = ref<UserType[]>([])
    const postFilter = ref<PostType | null>(null)
    const jobKindFilter = ref<{ text: string, value: string } | null>(null)
    const search = ref<string>('')

    const canView = computed<boolean>(() => (
      hasPerm.value('eleden.view_jobpost') || (!!props.team && props.team.permissions.canViewTeamMembers)
    ))

    const canAdd = computed<boolean>(() => (
      hasPerm.value('eleden.add_jobpost') || props.team.permissions.canChange
    ))

    const canChange = computed<boolean>(() => (
      hasPerm.value('eleden.change_jobpost') || props.team.permissions.canChange
    ))

    const canDelete = computed<boolean>(() => (
      hasPerm.value('eleden.delete_jobpost') || props.team.permissions.canChange
    ))

    const canViewStatusHistory = computed<boolean>(() => (
      hasPerm.value('eleden.view_jobpoststatushistory') || props.team.permissions.canChange
    ))

    const canAddStatusHistory = computed<boolean>(() => (
      hasPerm.value('eleden.add_jobpoststatushistory') || props.team.permissions.canChange
    ))

    const canChangeStatusHistory = computed<boolean>(() => (
      hasPerm.value('eleden.change_jobpoststatushistory') || props.team.permissions.canViewTeamMembers
    ))

    const canDeleteStatusHistory = computed<boolean>(() => (
      hasPerm.value('eleden.delete_jobpoststatushistory') || props.team.permissions.canChange
    ))

    const posts = computed<Post[]>(() => (
      props.team.jobs.reduce((acc, job) => {
        return [
          ...acc,
          ...job.jobPosts.map(jobPost => ({ job, jobPost }))
        ]
      }, [] as Post[])
    ))

    const postsCount = ref<number>(posts.value.length)

    const filteredPosts = computed<Post[]>(() => {
      let postsValue: Post[] = usersFilter.value.length
        ? posts.value.filter(post => usersFilter.value.find(user => post.job.user.id === user.id))
        : posts.value
      postsValue = postFilter.value
        ? postsValue.filter(post => post.jobPost.post.id === postFilter.value!.id)
        : postsValue
      postsValue = jobKindFilter.value
        ? postsValue.filter(post => post.jobPost.kind === jobKindFilter.value!.value)
        : postsValue
      return postsValue
    })

    const users = computed<UserType[]>(() => (props.team.jobs.map(job => job.user)))

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        {
          text: t('ac.teams.posts.tableHeaders.avatar') as string,
          value: 'user.avatar',
          sortable: false,
          filterable: false
        },
        { text: t('ac.teams.posts.tableHeaders.user') as string, value: 'user' },
        { text: t('ac.teams.posts.tableHeaders.post') as string, value: 'jobPost.post.name' }
      ]
      if (canView.value || !props.team.eduProgram) {
        headers.push(
          { text: t('ac.teams.posts.tableHeaders.kind') as string, value: 'jobPost.kind' },
          { text: t('ac.teams.posts.tableHeaders.rate') as string, value: 'jobPost.rate', align: 'center' }
        )
      }
      const canViewAnyStatusHistory = canViewStatusHistory.value ||
        Boolean(props.team.jobs.find(job => job.user.id === user.value.id))
      const checks = [canChange.value, canViewAnyStatusHistory, canAddStatusHistory.value, canDelete.value]
      if (checks.some(check => check)) {
        headers.push({
          text: t('ac.teams.posts.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          width: `${Math.max(checks.reduce((acc: number, check: boolean) => check ? acc + 45 : acc, 0), 135)}px`,
          sortable: false,
          filterable: false
        })
      }
      return headers
    })

    const getFilterMessages = (filterName: string, multiple: boolean = false): FilterMessages => {
      return {
        title: t(`ac.teams.posts.filters.${filterName}.title`) as string,
        noFiltrationMessage: t(`ac.teams.posts.filters.${filterName}.noFiltrationMessage`) as string,
        multipleMessageFunction: multiple
          ? (name, restLength) =>
              tc(`ac.teams.posts.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
          : undefined
      }
    }

    const searchUser = (user: UserType, search: string): boolean => {
      return [getUserName(user), getUserFullName(user)].some(
        v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    }

    const filter = (value: string | number | UserType | null, search: string | null): boolean => {
      if (!search) {
        return true
      }
      if (!value) {
        return false
      }
      if (['string', 'number'].includes(typeof value)) {
        if (typeof value === 'string' && props.rawJobKinds.includes(value.toLowerCase())) {
          return (t(
          `ac.teams.jobKinds.${value.toLowerCase()}`
          ) as string).toLocaleLowerCase().includes(search.toLocaleLowerCase())
        } else {
          return String(value).toLocaleLowerCase().includes(search.toLocaleLowerCase())
        }
      } else {
        return searchUser(value as UserType, search)
      }
    }

    const teamUpdate: any = inject('teamUpdate')
    const addJobPostUpdate = (
      cache: DataProxy,
      result: AddJobPostData,
      job: JobType
    ): void => {
      teamUpdate(cache, result, (dataCache, { data: { addJobPost: { success, jobPost, src } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].jobs.find((existingJob: JobType) => existingJob.id === job.id).jobPosts.push(jobPost)
          if (src) {
            window.open(`/${src}`, '_blank')
          }
        }
      })
    }

    const deleteJobPostUpdate = (
      cache: DataProxy,
      result: DeleteJobPostData,
      job: JobType,
      jobPost: JobPostType
    ): void => {
      teamUpdate(cache, result, (dataCache, { data: { deleteJobPost: { success } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          const existingJob: JobType = dataCache[dataKey].jobs.find((existingJob: JobType) => existingJob.id === job.id)
          existingJob.jobPosts = existingJob.jobPosts.filter(existingJobPost => existingJobPost.id !== jobPost.id)
        }
      })
    }

    const addStatusHistoryUpdate = (
      cache: DataProxy,
      result: AddJobPostStatusHistoryData,
      job: JobType,
      jobPost: JobPostType
    ): void => {
      teamUpdate(cache, result, (
        dataCache,
        {
          data: {
            addJobPostStatusHistory: {
              success,
              newJobPostStatusHistory,
              completedJobPostStatusHistory,
              src
            }
          }
        }
      ) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          const existingJobPost: JobPostType = dataCache[dataKey].jobs
            .find((existingJob: JobType) => existingJob.id === job.id).jobPosts
            .find((existingJobPost: JobPostType) => existingJobPost.id === jobPost.id)
          existingJobPost.statusHistory.push(newJobPostStatusHistory!)
          completedJobPostStatusHistory!.forEach((completedStatusHistory: JobPostStatusHistoryType) => {
            existingJobPost.statusHistory.splice(
              existingJobPost.statusHistory.findIndex((existingStatusHistory: JobPostStatusHistoryType) =>
                completedStatusHistory.id === existingStatusHistory.id),
              1,
              completedStatusHistory
            )
          })
          if (src) {
            window.open(`/${src}`, '_blank')
          }
        }
      })
    }

    return {
      user,
      hasPerm,
      usersFilter,
      postFilter,
      jobKindFilter,
      search,
      postsCount,
      canAdd,
      canChange,
      canDelete,
      canAddStatusHistory,
      canChangeStatusHistory,
      canDeleteStatusHistory,
      canViewStatusHistory,
      posts,
      filteredPosts,
      users,
      headers,
      getFilterMessages,
      filter,
      addJobPostUpdate,
      deleteJobPostUpdate,
      addStatusHistoryUpdate
    }
  }
})
</script>
