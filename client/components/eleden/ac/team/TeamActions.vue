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
            v-list-item-title {{ t('sendNotification') }}
      unload-users-form(v-slot="{ on }" :team="team" @close="active = false")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-upload
          v-list-item-content
            v-list-item-title {{ t('upload') }}
      generate-new-passwords(v-if="team.permissions.canChange" v-slot="{ on }" :team="team" @close="active = false")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-lock-reset
          v-list-item-content
            v-list-item-title {{ t('generateNewPasswords.name') }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { TeamType } from '~/types/graphql'
import GenerateNewPasswords from '~/components/eleden/ac/team/GenerateNewPasswords.vue'
import UnloadUsersForm from '~/components/users/UnloadUsersForm.vue'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

@Component<TeamActions>({
  components: { GenerateNewPasswords, ExperimentalDialog, UnloadUsersForm },
  computed: mapGetters({ hasPerm: 'auth/hasPerm' })
})
export default class TeamActions extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean

  active: boolean = false

  /**
   * Получение перевода относительно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.teamActions.${path}`, values) as string
  }
}
</script>
