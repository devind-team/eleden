<template lang="pug">
mutation-form(
  :mutation="require('~/gql/eleden/mutations/team/change_team_responsible_users.graphql')"
  :variables="{ teamId: team.id, usersId: responsibleUsers.map(user => user.id) }"
  :button-text="String($t('ac.teams.settings.changeTeamResponsibleUsers.save'))"
  mutation-name="changeTeamResponsibleUsers"
  i18n-path="'ac.teams.settings.changeTeamResponsibleUsers"
  flat
)
  template(#form)
    change-users(v-model="responsibleUsers" :init-users="team.responsibleUsers" success)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref } from '#app'
import { TeamType, UserType } from '~/types/graphql'
import ChangeUsers from '~/components/users/ChangeUsers.vue'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm, ChangeUsers },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const responsibleUsers = ref<UserType[]>(props.team.responsibleUsers)
    return { responsibleUsers }
  }
})
</script>
