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
          v-btn(:loading="loading" type="submit" color="primary") {{ t('save') }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ApolloError } from 'apollo-client'
import { ErrorType } from '~/types/devind'
import { ChangeTeamResponsibleUsersMutationPayload, TeamType } from '~/types/graphql'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'
import ChangeUsers from '~/components/users/ChangeUsers.vue'

type ChangeTeamResponsibleUsersData = {
  data:{ changeTeamResponsibleUsers: ChangeTeamResponsibleUsersMutationPayload }
}

export default Vue.extend<any, any, any, any>({
  components: { MutationResultAlert, ChangeUsers },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  data () {
    return {
      responsibleUsers: this.team.responsibleUsers
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
      return this.$t(`ac.teams.settings.changeTeamResponsibleUsers.${path}`, values) as string
    },
    /**
     * Установка успеха или ошибки после завершения мутации
     * @param success
     * @param errors
     */
    changeTeamResponsibleUsersDone ({
      data: { changeTeamResponsibleUsers: { success, errors } }
    }: ChangeTeamResponsibleUsersData): void {
      if (success) {
        this.setSuccess()
      } else {
        this.setError(errors[0].messages[0], 'BusinessLogicError')
      }
    },
    /**
     * Установка ошибки Apollo
     * @param error
     */
    setApolloError (error: ApolloError): void {
      this.$refs.mutationResultAlert.setApolloError(error)
    },
    /**
     * Установка ошибки
     * @param message
     * @param type
     */
    setError (message: string, type: ErrorType): void {
      this.$refs.mutationResultAlert.setError(message, type)
    },
    /**
     * Установка успеха
     */
    setSuccess (): void {
      this.$refs.mutationResultAlert.setSuccess()
    }
  }
})
</script>
