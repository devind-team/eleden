<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-subtitle {{ t('responsible') }}&nbsp;
      span(v-if="team.responsibleUsers.length === 0") {{ t('noResponsible') }}
      template(v-else)
        user-link(v-for="user in team.responsibleUsers" :key="user.id" :user="user" chip link-class="mr-1")
    v-card-text
      v-row(align="center")
        v-col(cols="12" md="6")
          v-menu(v-if="canAdd" bottom)
            template(#activator="{ on }")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('addMenu.buttons.add') }}
            v-list
              add-job(ref="addJob" :team="team" :update="addJobUpdate" :job-kinds="jobKinds")
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-account
                    v-list-item-content {{ t('addMenu.buttons.fromExisting') }}
              upload-jobs(:team="team" :update="uploadJobsUpdate")
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-file
                    v-list-item-content {{ t('addMenu.buttons.fromFileForExisting') }}
                    v-list-item-action
                      help-dialog(
                        v-slot="{ on: onHelper }"
                        :text="t('addMenu.helpDialog.helpInstruction')"
                        doc="help/add_jobs"
                      )
                        v-tooltip(bottom)
                          template(#activator="{ on: onTooltip}")
                            v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                              v-icon mdi-help-circle-outline
                          span {{ t('addMenu.buttons.helpInstruction') }}
              upload-jobs-user(:team="team" :update="uploadJobsUserUpdate" :job-kinds="jobKinds")
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-account-multiple-plus
                    v-list-item-content {{ t('addMenu.buttons.fromFileForNew') }}
                    v-list-item-action
                      help-dialog(
                        v-slot="{ on: onHelper }"
                        :text="t('addMenu.helpDialog.helpInstruction')"
                        doc="help/add_team_users"
                      )
                        v-tooltip(bottom)
                          template(#activator="{ on: onTooltip}")
                            v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                              v-icon mdi-help-circle-outline
                          span {{ t('addMenu.buttons.helpInstruction') }}
        v-col.text-right(v-if="team.permissions.canChange && team.jobs.length > 0" cols="12" md="6")
          team-actions(v-slot="{ on }" :team="team")
            v-btn(v-on="on" icon)
              v-icon mdi-dots-vertical
      v-row(v-if="team.jobs.length > 0" align="center")
        v-col(cols="12" sm="6")
          v-text-field(v-model="search" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ t('shownOf', { count: jobsCount, totalCount: team.jobs.length }) }}
      v-row
        v-col
          v-data-table(
            :headers="headers"
            :items="team.jobs"
            :search="search"
            :custom-filter="filter"
            disable-pagination
            hide-default-footer
            @pagination="({ itemsLength }) => jobsCount = itemsLength"
          )
            template(#item.user.avatar="{ item }")
              avatar-dialog(:item="item.user")
            template(#item.user="{ item }")
              user-link(:user="item.user" full)
            template(#item.actions="{ item }")
              apollo-mutation(
                v-if="canDelete"
                :mutation="require('~/gql/eleden/mutations/job/delete_job.graphql')"
                :variables="{ jobId: item.id }"
                :update="(store, result) => deleteJobUpdate(store, result, item)"
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
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import { DeleteJobMutationPayload, JobType, TeamType, UserType } from '~/types/graphql'
import teamQuery from '~/gql/eleden/queries/team/team.graphql'
import UserLink from '~/components/eleden/user/UserLink.vue'
import AddJob, { AddJobData } from '~/components/eleden/ac/team/AddJob.vue'
import UploadJobs, { UploadJobsData } from '~/components/eleden/ac/team/UploadJobs.vue'
import UploadJobsUser, { UploadJobsUserData } from '~/components/eleden/ac/team/UploadJobsUser.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import TeamActions from '~/components/eleden/ac/team/TeamActions.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'

type DeleteJobData = { data: { deleteJob: DeleteJobMutationPayload } }

export default Vue.extend<any, any, any, any>({
  components: {
    UserLink,
    AddJob,
    UploadJobs,
    UploadJobsUser,
    AvatarDialog,
    TeamActions,
    DeleteMenu,
    MutationModalForm,
    HelpDialog
  },
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    jobKinds: { type: Array as PropType<JobKind[]>, required: true }
  },
  data () {
    return {
      search: '',
      jobsCount: this.team.jobs.length
    }
  },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm', user: 'auth/user' }),
    canAdd (): boolean {
      return this.hasPerm('eleden.add_job') || this.team.permissions.canChange
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_job') || this.team.permissions.canChange
    },
    headers (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        { text: this.t('tableHeaders.avatar'), value: 'user.avatar', sortable: false, filterable: false },
        { text: this.t('tableHeaders.name'), value: 'user' },
        { text: this.t('tableHeaders.username'), value: 'user.username' },
        { text: this.t('tableHeaders.email'), value: 'user.email' }
      ]
      if (this.canDelete) {
        headers.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    }
  },
  methods: {
    /**
     * Получение перевода относильно локального пути
     * @param path
     * @param values
     * @return
     */
    t (path: string, values: any = undefined): string {
      return this.$t(`ac.teams.users.${path}`, values) as string
    },
    /**
     * Обновление пользователей группы после добавления нового пользователя
     * @param store
     * @param success
     * @param job
     * @param src
     */
    addJobUpdate (store: DataProxy, { data: { addJob: { success, job, src } } }: AddJobData): void {
      if (success) {
        const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
        data.team.jobs.push(job)
        data.team.jobs.sort((j1: JobType, j2: JobType) =>
          this.$getUserFullName(j1.user).localeCompare(this.$getUserFullName(j2.user)))
        store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
        if (src) {
          window.open(`/${src}`, '_blank')
        }
        this.$refs.addJob.refetchUsers()
      }
    },
    /**
     * Обновление пользователей группы после загрузки существующих пользователей из файла
     * @param store
     * @param success
     * @param jobs
     * @param src
     */
    uploadJobsUpdate (store: DataProxy, { data: { uploadJobs: { success, jobs, src } } }: UploadJobsData): void {
      if (success) {
        const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
        data.team.jobs = [...data.team.jobs, ...jobs!].sort((j1: JobType, j2: JobType) =>
          this.$getUserFullName(j1.user).localeCompare(this.$getUserFullName(j2.user)))
        store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
        if (src) {
          window.open(`/${src}`, '_blank')
        }
        this.$refs.addJob.refetchUsers()
      }
    },
    /**
     * Обновление пользователей группы после загрузки новых пользователей из файла
     * @param store
     * @param success
     * @param jobs
     * @param src
     */
    uploadJobsUserUpdate (
      store: DataProxy,
      { data: { uploadJobsUser: { success, jobs, src } } }: UploadJobsUserData
    ): void {
      if (success) {
        const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
        data.team.jobs = [...data.team.jobs, ...jobs!].sort((j1: JobType, j2: JobType) =>
          this.$getUserFullName(j1.user).localeCompare(this.$getUserFullName(j2.user)))
        store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
        if (src) {
          window.open(`/${src}`, '_blank')
        }
        this.$refs.addJob.refetchUsers()
      }
    },
    /**
     * Обновление пользователей группы после удаления пользователя
     * @param store
     * @param success
     * @param job
     */
    deleteJobUpdate (store: DataProxy, { data: { deleteJob: { success } } }: DeleteJobData, job: JobType): void {
      if (success) {
        const data: any = store.readQuery({ query: teamQuery, variables: { teamId: this.team.id } })
        data.team.jobs.splice(data.team.jobs.findIndex((existJob: JobType) => existJob.id === job!.id), 1)
        store.writeQuery({ query: teamQuery, variables: { teamId: this.team.id }, data })
        this.$refs.addJob.refetchUsers()
      }
    },
    /**
     * Фильтрация пользователей
     * @param value
     * @param search
     * @return
     */
    filter (value: string | UserType | null, search: string | null): boolean {
      if (!search) {
        return true
      }
      if (!value) {
        return false
      }
      if (typeof value === 'string') {
        return String(value).toLocaleLowerCase().includes(search.toLocaleLowerCase())
      } else {
        return [this.$getUserName(value as UserType), this.$getUserFullName(value as UserType)].some(
          v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      }
    }
  }
})
</script>
