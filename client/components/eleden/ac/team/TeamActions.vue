<template lang="pug">
v-menu(v-model="active")
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on }")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-send
        v-list-item-content
          v-list-item-title {{ $t('ac.teams.teamActions.sendNotification') }}
    unload-users-form(v-slot="{ on }" :team="team" @close="active = false")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-upload
        v-list-item-content
          v-list-item-title {{ $t('ac.teams.teamActions.upload') }}
    generate-new-passwords(v-if="team.permissions.canChange" v-slot="{ on }" :team="team" @close="active = false")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-lock-reset
        v-list-item-content
          v-list-item-title {{ $t('ac.teams.teamActions.generateNewPasswords.name') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, toRef } from '#app'
import { useAuthStore } from '~/store'
import { TeamType } from '~/types/graphql'
import GenerateNewPasswords from '~/components/eleden/ac/team/GenerateNewPasswords.vue'
import UnloadUsersForm from '~/components/users/UnloadUsersForm.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

export default defineComponent({
  components: { GenerateNewPasswords, ExperimentalDialog, UnloadUsersForm },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup () {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')

    const active = ref<boolean>(false)

    return { hasPerm, active }
  }
})
</script>
