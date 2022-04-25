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
          delete-menu(:item-name="$t('ac.teams.settings.changeTeamDelete.deleteItemName')" @confirm="mutate")
            template(#default="{ on }")
              v-btn(v-on="on" :loading="loading" color="error") {{ $t('ac.teams.settings.changeTeamDelete.delete') }}
      v-spacer
      apollo-mutation(
        :mutation="require('~/gql/eleden/mutations/team/change_team_delete.graphql')"
        :variables="{ teamId: team.id, delete: !team.delete }"
        @error="setApolloError"
        @done="changeTeamDeleteDone"
      )
        template(v-slot="{ mutate, loading }")
          confirm-menu(
            :text="team.delete ? $t('ac.teams.settings.changeTeamDelete.restoreConfirmText') : $t('ac.teams.settings.changeTeamDelete.archiveConfirmText')"
            yes-color="warning"
            no-color="success"
            @confirm="mutate"
          )
            template(#default="{ on }")
              v-btn(v-on="on" :loading="loading" color="warning")
                | {{ team.delete ? $t('ac.teams.settings.changeTeamDelete.restore') : $t('ac.teams.settings.changeTeamDelete.archive') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ApolloError } from 'apollo-client'
import { TeamType, DeleteTeamMutationPayload, ChangeTeamDeleteMutationPayload } from '~/types/graphql'
import { ErrorType } from '~/types/devind'
import { useI18n } from '~/composables'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import ConfirmMenu from '~/components/common/menu/ConfirmMenu.vue'

type DeleteTeamDataType = { data: { deleteTeam: DeleteTeamMutationPayload } }
type ChangeTeamDeleteDataType = { data: { changeTeamDelete: ChangeTeamDeleteMutationPayload } }
type MutationResultAlertType = InstanceType<typeof MutationResultAlert> | null

export default defineComponent({
  components: { MutationResultAlert, DeleteMenu, ConfirmMenu },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const router = useRouter()
    const { localePath } = useI18n()

    const mutationResultAlert = ref<MutationResultAlertType>(null)

    const deleteTeamDone = ({ data: { deleteTeam: { success, errors } } }: DeleteTeamDataType): void => {
      if (success) {
        router.push(localePath({ name: 'eleden-ac-teams', query: { teamId: props.team.id } }))
      } else {
        setError(errors[0].messages[0], 'BusinessLogicError')
      }
    }

    const changeTeamDeleteDone = ({ data: { changeTeamDelete: { success, errors } } }: ChangeTeamDeleteDataType): void => {
      if (!success) {
        setError(errors[0].messages[0], 'BusinessLogicError')
      }
    }

    const setApolloError = (error: ApolloError): void => {
      mutationResultAlert.value.setApolloError(error)
    }

    const setError = (message: string, type: ErrorType): void => {
      mutationResultAlert.value.setError(message, type)
    }

    return { deleteTeamDone, changeTeamDeleteDone, setApolloError }
  }
})
</script>
