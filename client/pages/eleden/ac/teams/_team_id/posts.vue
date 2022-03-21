<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      v-row(align="center")
        v-col
          v-menu(v-if="canAdd" bottom)
            template(#activator="{ on }")
              v-btn.mr-3(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('addMenu.buttons.add') }}
            v-list
              add-job-post(:team="team" :update="addJobPostUpdate" :job-kinds="jobKinds")
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ t('addMenu.buttons.fillForm') }}
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
          v-text-field(v-model="search" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ t('shownOf', { count: postsCount, totalCount: posts.length }) }}
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
                  span {{ t('tooltips.change') }}
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
                    span {{ t('tooltips.viewStatusHistory') }}
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
                    span {{ t('tooltips.addStatus') }}
              apollo-mutation(
                v-if="canDelete"
                :mutation="require('~/gql/eleden/mutations/job_post/delete_job_post.graphql')"
                :variables="{ jobPostId: item.jobPost.id }"
                :update="(store, result) => deleteJobPostUpdate(store, result, item.job, item.jobPost)"
                tag="span"
              )
                template(v-slot="{ mutate, loading }")
                  delete-menu(:item-name="t('deleteItemName')" @confirm="mutate")
                    template(#default="{ on: onMenu }")
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip }")
                          v-btn(v-on="{ ...onMenu, ...onTooltip }" :loading="loading" icon)
                            v-icon(color="error") mdi-delete
                        span {{ t('tooltips.delete') }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import {
  TeamType,
  UserType,
  JobType,
  PostType,
  JobPostType,
  JobPostStatusHistoryType,
  DeleteJobPostMutationPayload
} from '~/types/graphql'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import teamQuery from '~/gql/eleden/queries/team/team.graphql'
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

@Component<AcTeamIdPosts>({
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
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm', user: 'auth/user' }),
    canView (): boolean {
      return this.hasPerm('eleden.view_jobpost') ||
        (!!this.team && this.team.permissions.canViewTeamMembers)
    },
    canAdd (): boolean {
      return this.hasPerm('eleden.add_jobpost') || this.team.permissions.canChange
    },
    canChange (): boolean {
      return this.hasPerm('eleden.change_jobpost') || this.team.permissions.canChange
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_jobpost') || this.team.permissions.canChange
    },
    canViewStatusHistory (): boolean {
      return this.hasPerm('eleden.view_jobpoststatushistory') || this.team.permissions.canChange
    },
    canAddStatusHistory (): boolean {
      return this.hasPerm('eleden.add_jobpoststatushistory') || this.team.permissions.canChange
    },
    canChangeStatusHistory (): boolean {
      return this.hasPerm('eleden.change_jobpoststatushistory') || this.team.permissions.canViewTeamMembers
    },
    canDeleteStatusHistory (): boolean {
      return this.hasPerm('eleden.delete_jobpoststatushistory') || this.team.permissions.canChange
    },
    posts (): Post[] {
      return this.team.jobs.reduce((acc, job) => {
        return [
          ...acc,
          ...job.jobPosts.map(jobPost => ({ job, jobPost }))
        ]
      }, [] as Post[])
    },
    filteredPosts (): Post[] {
      let posts: Post[] = this.usersFilter.length
        ? this.posts.filter(post => this.usersFilter.find(user => post.job.user.id === user.id))
        : this.posts
      posts = this.postFilter
        ? posts.filter(post => post.jobPost.post.id === this.postFilter!.id)
        : posts
      posts = this.jobKindFilter
        ? posts.filter(post => post.jobPost.kind === this.jobKindFilter!.value)
        : posts
      return posts
    },
    users (): UserType[] {
      return this.team.jobs.map(job => job.user)
    },
    headers (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        { text: this.t('tableHeaders.avatar'), value: 'user.avatar', sortable: false, filterable: false },
        { text: this.t('tableHeaders.user'), value: 'user' },
        { text: this.t('tableHeaders.post'), value: 'jobPost.post.name' }
      ]
      if (this.canView || !this.team.eduProgram) {
        headers.push(
          { text: this.t('tableHeaders.kind'), value: 'jobPost.kind' },
          { text: this.t('tableHeaders.rate'), value: 'jobPost.rate', align: 'center' }
        )
      }
      const canViewAnyStatusHistory = this.canViewStatusHistory ||
        Boolean(this.team.jobs.find(job => job.user.id === this.user.id))
      const checks = [this.canChange, canViewAnyStatusHistory, this.canAddStatusHistory, this.canDelete]
      if (checks.some(check => check)) {
        headers.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center',
          width: `${Math.max(checks.reduce((acc: number, check: boolean) => check ? acc + 45 : acc, 0), 135)}px`,
          sortable: false,
          filterable: false
        })
      }
      return headers
    }
  }
})
export default class AcTeamIdPosts extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Boolean, required: true }) readonly isMember!: boolean
  @Prop({ type: Array as PropType<string[]>, required: true }) readonly rawJobKinds!: string[]
  @Prop({ type: Array as PropType<JobKind[]>, required: true }) readonly jobKinds!: JobKind[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly user!: UserType
  readonly canView!: boolean
  readonly canAdd!: boolean
  readonly canChange!: boolean
  readonly canDelete!: boolean
  readonly canViewStatusHistory!: boolean
  readonly canAddStatusHistory!: boolean
  readonly canChangeStatusHistory!: boolean
  readonly canDeleteStatusHistory!: boolean
  readonly posts!: Post[]
  readonly filteredPosts!: Post[]
  readonly users!: UserType[]
  readonly headers!: DataTableHeader[]

  usersFilter: UserType[] = []
  postFilter: PostType | null = null
  jobKindFilter: { text: string, value: string } | null = null
  search: string = ''
  postsCount: number = 0

  created () {
    this.postsCount = this.posts.length
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.posts.${path}`, values) as string
  }

  /**
   * Обновление должностей после добавления новой должности
   * @param store
   * @param success
   * @param jobPost
   * @param src
   * @param job
   */
  addJobPostUpdate (
    store: DataProxy,
    { data: { addJobPost: { success, jobPost, src } } }: AddJobPostData,
    job: JobType
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
      data.team.jobs.find((existingJob: JobType) => existingJob.id === job.id).jobPosts.push(jobPost)
      store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
      if (src) {
        window.open(`/${src}`, '_blank')
      }
    }
  }

  /**
   * Обновление должностей после удаления должности
   * @param store
   * @param success
   * @param job
   * @param jobPost
   */
  deleteJobPostUpdate (
    store: DataProxy,
    { data: { deleteJobPost: { success } } }: DeleteJobPostData,
    job: JobType,
    jobPost: JobPostType
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
      const existingJob: JobType = data.team.jobs.find((existingJob: JobType) => existingJob.id === job.id)
      existingJob.jobPosts = existingJob.jobPosts.filter(existingJobPost => existingJobPost.id !== jobPost.id)
      store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
    }
  }

  /**
   * Обновление истории стасусов должности после добавления нового статуса
   * @param store
   * @param success
   * @param newJobPostStatusHistory
   * @param completedJobPostStatusHistory
   * @param src
   * @param job
   * @param jobPost
   */
  addStatusHistoryUpdate (
    store: DataProxy,
    {
      data: {
        addJobPostStatusHistory: {
          success,
          newJobPostStatusHistory,
          completedJobPostStatusHistory,
          src
        }
      }
    }: AddJobPostStatusHistoryData,
    job: JobType,
    jobPost: JobPostType
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
      const existingJobPost: JobPostType = data.team.jobs
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
      store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
      if (src) {
        window.open(`/${src}`, '_blank')
      }
    }
  }

  /**
   * Получение сообщений для фильтра
   * @param filterName
   * @param multiple
   * @return
   */
  getFilterMessages (filterName: string, multiple: boolean = false): FilterMessages {
    return {
      title: this.t(`filters.${filterName}.title`),
      noFiltrationMessage: this.t(`filters.${filterName}.noFiltrationMessage`),
      multipleMessageFunction: multiple
        ? (name, restLength) =>
            this.$tc(`ac.teams.posts.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }

  /**
   * Поиск пользователя
   * @param user
   * @param search
   * @return
   */
  searchUser (user: UserType, search: string): boolean {
    return [this.$getUserName(user), this.$getUserFullName(user)].some(
      v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  }

  /**
   * Фильтрация должностей в таблице
   * @param value
   * @param search
   * @return
   */
  filter (value: string | number | UserType | null, search: string | null): boolean {
    if (!search) {
      return true
    }
    if (!value) {
      return false
    }
    if (['string', 'number'].includes(typeof value)) {
      if (typeof value === 'string' && this.rawJobKinds.includes(value.toLowerCase())) {
        return (this.$t(
          `ac.teams.jobKinds.${value.toLowerCase()}`
        ) as string).toLocaleLowerCase().includes(search.toLocaleLowerCase())
      } else {
        return String(value).toLocaleLowerCase().includes(search.toLocaleLowerCase())
      }
    } else {
      return this.searchUser(value as UserType, search)
    }
  }
}
</script>
