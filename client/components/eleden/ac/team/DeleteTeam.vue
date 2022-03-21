<template lang="pug">
  div
    mutation-result-alert(ref="mutationResultAlert")
    .d-flex
      apollo-mutation(
        :mutation="require('~/gql/eleden/mutations/team/delete_team.graphql')"
        :variables="{ teamId: team.id }"
        @error="setApolloError"
        @done="deleteTeamDone"
      )
        template(v-slot="{ mutate, loading }")
          delete-menu(:item-name="t('deleteItemName')" @confirm="mutate")
            template(#default="{ on }")
              v-btn(v-on="on" :loading="loading" color="error") {{ t('delete') }}
      v-spacer
      apollo-mutation(
        :mutation="require('~/gql/eleden/mutations/team/change_team_delete.graphql')"
        :variables="{ teamId: team.id, delete: !team.delete }"
        @error="setApolloError"
        @done="changeTeamDeleteDone"
      )
        template(v-slot="{ mutate, loading }")
          confirm-menu(
            :text="team.delete ? t('restoreConfirmText') : t('archiveConfirmText')"
            yes-color="warning"
            no-color="success"
            @confirm="mutate"
          )
            template(#default="{ on }")
              v-btn(v-on="on" :loading="loading" color="warning") {{ team.delete ? t('restore') : t('archive') }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ApolloError } from 'apollo-client'
import { TeamType, DeleteTeamMutationPayload, ChangeTeamDeleteMutationPayload } from '~/types/graphql'
import { ErrorType } from '~/types/devind'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import ConfirmMenu from '~/components/common/menu/ConfirmMenu.vue'

type DeleteTeamData = { data: { deleteTeam: DeleteTeamMutationPayload } }
type ChangeTeamDeleteData = { data: { changeTeamDelete: ChangeTeamDeleteMutationPayload } }

export default Vue.extend<any, any, any, any>({
  components: { MutationResultAlert, DeleteMenu, ConfirmMenu },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  methods: {
    /**
     * Получение перевода относильно локального пути
     * @param path
     * @param values
     * @return
     */
    t (path: string, values: any = undefined): string {
      return this.$t(`ac.teams.settings.changeTeamDelete.${path}`, values) as string
    },
    /**
     * Установка успеха или ошибки после завершения мутации удаления
     * @param success
     * @param errors
     */
    deleteTeamDone ({ data: { deleteTeam: { success, errors } } }: DeleteTeamData): void {
      if (success) {
        this.$router.push(this.localePath('eleden-ac-teams'))
      } else {
        this.setError(errors[0].messages[0], 'BusinessLogicError')
      }
    },
    /**
     * Установка успеха или ошибки после завершения мутации мягкого удаления или восстановления
     * @param success
     * @param errors
     */
    changeTeamDeleteDone ({ data: { changeTeamDelete: { success, errors } } }: ChangeTeamDeleteData): void {
      if (!success) {
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
    }
  }
})
</script>
