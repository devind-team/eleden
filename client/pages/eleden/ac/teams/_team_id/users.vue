<template lang="pug">
v-card
  v-card-title {{ $t('ac.teams.users.name') }}
  v-card-subtitle {{ $t('ac.teams.users.responsible') }}&nbsp;
    span(v-if="team.responsibleUsers.length === 0") {{ $t('ac.teams.users.noResponsible') }}
    template(v-else)
      user-link(v-for="user in team.responsibleUsers" :key="user.id" :user="user" chip link-class="mr-1")
  v-card-text
    v-row(align="center")
      v-col(cols="12" md="6")
        v-menu(v-if="canAdd" bottom)
          template(#activator="{ on }")
            v-btn(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('ac.teams.users.addMenu.buttons.add') }}
          v-list
            add-job(ref="addJob" :team="team" :update="addJobUpdate" :job-kinds="jobKinds")
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-account
                  v-list-item-content {{ $t('ac.teams.users.addMenu.buttons.fromExisting') }}
            upload-jobs(:team="team" :update="uploadJobsUpdate")
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-file
                  v-list-item-content {{ $t('ac.teams.users.addMenu.buttons.fromFileForExisting') }}
                  v-list-item-action
                    help-dialog(
                      v-slot="{ on: onHelper }"
                      :text="$t('ac.teams.users.addMenu.helpDialog.helpInstruction')"
                      doc="help/add_jobs"
                    )
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip}")
                          v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                            v-icon mdi-help-circle-outline
                        span {{ $t('ac.teams.users.addMenu.buttons.helpInstruction') }}
            upload-jobs-user(:team="team" :update="uploadJobsUserUpdate" :job-kinds="jobKinds")
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-account-multiple-plus
                  v-list-item-content {{ $t('ac.teams.users.addMenu.buttons.fromFileForNew') }}
                  v-list-item-action
                    help-dialog(
                      v-slot="{ on: onHelper }"
                      :text="$t('ac.teams.users.addMenu.helpDialog.helpInstruction')"
                      doc="help/add_team_users"
                    )
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip}")
                          v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                            v-icon mdi-help-circle-outline
                        span {{ $t('ac.teams.users.addMenu.buttons.helpInstruction') }}
      v-col.text-right(v-if="team.permissions.canChange && team.jobs.length > 0" cols="12" md="6")
        team-actions(v-slot="{ on }" :team="team")
          v-btn(v-on="on" icon)
            v-icon mdi-dots-vertical
    v-row(v-if="team.jobs.length > 0" align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count: jobsCount, totalCount: team.jobs.length }) }}
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
                delete-menu(:item-name="$t('ac.teams.users.deleteItemName')" @confirm="mutate")
                  template(#default="{ on: onMenu }")
                    v-tooltip(bottom)
                      template(#activator="{ on: onTooltip }")
                        v-btn(v-on="{ ...onMenu, ...onTooltip }" :loading="loading" icon)
                          v-icon(color="error") mdi-delete
                      span {{ $t('ac.teams.users.tooltips.delete') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, ref, toRefs, defineComponent, inject } from '#app'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import { DeleteJobMutationPayload, JobType, TeamType, UserType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useFilters, useI18n } from '~/composables'
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
type AddJobType = InstanceType<typeof AddJob> | null

export default defineComponent({
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
    jobKinds: { type: Array as PropType<JobKind[]>, required: true },
    jobsCount: { type: Number, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const { hasPerm } = toRefs(authStore)
    const { getUserName, getUserFullName } = useFilters()
    const { t } = useI18n()

    const addJob = ref<AddJobType>(null)
    const search = ref<string>('')

    const canAdd = computed<boolean>(() => (hasPerm.value('eleden.add_job') || props.team.permissions.canChange))
    const canDelete = computed<boolean>(() => (
      hasPerm.value('eleden.delete_job') || props.team.permissions.canChange
    ))

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        {
          text: t('ac.teams.users.tableHeaders.avatar') as string,
          value: 'user.avatar',
          sortable: false,
          filterable: false
        },
        { text: t('ac.teams.users.tableHeaders.name') as string, value: 'user' },
        { text: t('ac.teams.users.tableHeaders.username') as string, value: 'user.username' },
        { text: t('ac.teams.users.tableHeaders.email') as string, value: 'user.email' }
      ]
      if (canDelete.value) {
        headers.push({
          text: t('ac.teams.users.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    })

    const filter = (value: string | UserType | null, search: string | null): boolean => {
      if (!search) {
        return true
      }
      if (!value) {
        return false
      }
      if (typeof value === 'string') {
        return String(value).toLocaleLowerCase().includes(search.toLocaleLowerCase())
      } else {
        return [getUserName(value as UserType), getUserFullName(value as UserType)].some(
          v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      }
    }
    const teamUpdate: any = inject('teamUpdate')
    const addJobUpdate = (cache: DataProxy, result: AddJobData): void => {
      teamUpdate(cache, result, (dataCache, { data: { addJob: { success, job, src } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].jobs.push(job)
          dataCache[dataKey].jobs.sort((j1: JobType, j2: JobType) =>
            getUserFullName(j1.user).localeCompare(getUserFullName(j2.user)))
          if (src) {
            window.open(`/${src}`, '_blank')
          }
          addJob.value.refetchUsers()
        }
      })
    }

    const uploadJobsUpdate = (cache: DataProxy, result: UploadJobsData): void => {
      teamUpdate(cache, result, (dataCache, { data: { uploadJobs: { success, jobs, src } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].jobs = [...dataCache[dataKey].jobs, ...jobs!].sort((j1: JobType, j2: JobType) =>
            getUserFullName(j1.user).localeCompare(getUserFullName(j2.user)))
          if (src) {
            window.open(`/${src}`, '_blank')
          }
          addJob.value.refetchUsers()
        }
      })
    }

    const uploadJobsUserUpdate = (cache: DataProxy, result: UploadJobsUserData): void => {
      teamUpdate(cache, result, (dataCache, { data: { uploadJobsUser: { success, jobs, src } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].jobs = [...dataCache[dataKey].jobs, ...jobs!].sort((j1: JobType, j2: JobType) =>
            getUserFullName(j1.user).localeCompare(getUserFullName(j2.user)))
          if (src) {
            window.open(`/${src}`, '_blank')
          }
          addJob.value.refetchUsers()
        }
      })
    }

    const deleteJobUpdate = (cache: DataProxy, result: DeleteJobData, job: JobType): void => {
      teamUpdate(cache, result, (dataCache, { data: { deleteJob: { success } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].jobs.splice(dataCache[dataKey].jobs.findIndex((existJob: JobType) => existJob.id === job!.id), 1)
          addJob.value.refetchUsers()
        }
      })
    }

    return {
      addJob,
      search,
      canAdd,
      canDelete,
      headers,
      filter,
      addJobUpdate,
      uploadJobsUpdate,
      uploadJobsUserUpdate,
      deleteJobUpdate
    }
  }
})
</script>
