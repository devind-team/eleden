<template lang="pug">
  apollo-mutation(
    :mutation="require('~/gql/eleden/mutations/team/change_team_responsible_users.graphql')"
    :variables="{ teamId: team.id, usersId: responsibleUsers.map(user => user.id) }"
    @error="setApolloError"
    @done="changeTeamResponsibleUsersDone"
  )
    template(v-slot="{ mutate, error, loading }")
      form(@submit.prevent="mutate")
        mutation-result-alert(ref="mutationResultAlert")
        change-users(v-model="responsibleUsers" :init-users="team.responsibleUsers" success)
        .d-flex
          v-spacer
          v-btn(
            :loading="loading"
            type="submit"
            color="primary"
          ) {{ $t('ac.teams.settings.changeTeamResponsibleUsers.save') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ApolloError } from 'apollo-client'
import { ErrorType } from '~/types/devind'
import { ChangeTeamResponsibleUsersMutationPayload, TeamType, UserType } from '~/types/graphql'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'
import ChangeUsers from '~/components/users/ChangeUsers.vue'

type ChangeTeamResponsibleUsersDataType = {
  data:{ changeTeamResponsibleUsers: ChangeTeamResponsibleUsersMutationPayload }
}
type MutationResultAlertType = InstanceType<typeof MutationResultAlert> | null

export default defineComponent({
  components: { MutationResultAlert, ChangeUsers },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const responsibleUsers = ref<UserType[]>(props.team.responsibleUsers)
    const mutationResultAlert = ref<MutationResultAlertType>(null)

    const changeTeamResponsibleUsersDone = ({
      data: { changeTeamResponsibleUsers: { success, errors } }
    }: ChangeTeamResponsibleUsersDataType): void => {
      if (success) {
        setSuccess()
      } else {
        setError(errors[0].messages[0], 'BusinessLogicError')
      }
    }

    const setApolloError = (error: ApolloError): void => {
      mutationResultAlert.value.setApolloError(error)
    }

    const setError = (message: string, type: ErrorType): void => {
      mutationResultAlert.value.setError(message, type)
    }

    const setSuccess = (): void => {
      mutationResultAlert.value.setSuccess()
    }

    return { responsibleUsers, mutationResultAlert, changeTeamResponsibleUsersDone, setApolloError }
  }
})
</script>
