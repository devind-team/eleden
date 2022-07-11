<template lang="pug">
mutation-modal-form(
  :header="String($t('ac.teams.teamActions.generateNewPasswords.generatingNewPasswords'))"
  :subheader="team.name"
  :buttonText="String($t('ac.teams.teamActions.generateNewPasswords.generatePasswords'))"
  :mutation="require('~/gql/eleden/mutations/team/generate_team_new_passwords.graphql')"
  :variables="{ teamId: team.id, usersId: selectedJobs.map((e) => e.user.id), date }"
  mutation-name="generateTeamNewPasswords"
  width="1000"
  errors-in-alert
  @done="generatePasswordsDone"
  @close="close"
)
  template(#activator="{ on }")
    slot(:on="on")
  template(#form)
    v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
    validation-provider(rules="required")
      v-data-table.mb-3(
        v-model="selectedJobs"
        :headers="headers"
        :items="team.jobs"
        :search="search"
        item-key="user.id"
        disable-pagination
        hide-default-footer
        show-select
      )
        template(#item.user.avatar="{ item }")
          avatar-dialog(:item="item.user")
        template(#item.user.username="{ item }")
          v-tooltip(bottom)
            template(#activator="{ on }")
              span(v-on="on") {{ item.user.username }}
            span {{ item.user.email }}
    v-menu(
      v-model="dateMenuActive"
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
          v-model="formattingDate"
          :label= "$t('ac.teams.teamActions.generateNewPasswords.generationDate')"
          prepend-icon="mdi-calendar"
          hide-details
          readonly
          success
        )
      v-date-picker(
        v-model="date"
        first-day-of-week="1"
        no-title
        @input="dateMenuActive = false"
      )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataTableHeader } from 'vuetify'
import { TeamType, JobType, GenerateTeamNewPasswordsMutationPayload } from '~/types/graphql'
import { useI18n, useFilters } from '~/composables'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

type GenerateTeamNewPasswordsDataType = { data: { generateTeamNewPasswords: GenerateTeamNewPasswordsMutationPayload } }

export default defineComponent({
  components: { MutationModalForm, AvatarDialog },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const { t } = useI18n()
    const { getNowDate } = useFilters()

    const search = ref<string>('')
    const selectedJobs = ref<JobType[]>([])
    const date = ref<string>(getNowDate())
    const dateMenuActive = ref<boolean>(false)

    const headers = computed<DataTableHeader[]>(() => ([
      {
        text: t('ac.teams.teamActions.generateNewPasswords.tableHeaders.avatar') as string,
        value: 'user.avatar'
      },
      {
        text: t('ac.teams.teamActions.generateNewPasswords.tableHeaders.username') as string,
        value: 'user.username'
      },
      {
        text: t('ac.teams.teamActions.generateNewPasswords.tableHeaders.lastName') as string,
        value: 'user.lastName'
      },
      {
        text: t('ac.teams.teamActions.generateNewPasswords.tableHeaders.firstName') as string,
        value: 'user.firstName'
      },
      {
        text: t('ac.teams.teamActions.generateNewPasswords.tableHeaders.sirName') as string,
        value: 'user.sirName'
      }
    ]))

    const formattingDate = computed<string>(() => (new Date(date.value).toLocaleDateString()))

    const generatePasswordsDone = ({ data: { generateTeamNewPasswords: { success, src } } }: GenerateTeamNewPasswordsDataType): void => {
      if (success) {
        window.open(`/${src}`, '_blank')
      }
    }

    const close = (): void => {
      search.value = ''
      selectedJobs.value = []
      date.value = getNowDate()
      dateMenuActive.value = false
    }

    return { search, selectedJobs, date, dateMenuActive, headers, formattingDate, generatePasswordsDone, close }
  }
})
</script>
