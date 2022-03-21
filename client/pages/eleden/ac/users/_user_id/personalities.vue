<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-subtitle {{ t('createdAt') }} {{ $filters.dateTimeHM(viewUser.createdAt) }}
    v-card-text
      v-row
        v-col(cols="12" sm="3") {{ t('tableHeaders.avatar') }}
        v-col(cols="12" sm="9")
          change-avatar(:user="viewUser" :update="updateAvatar")
      v-row
        v-col(cols="12" sm="3") {{ t('tableHeaders.personalities') }}
        v-col(cols="12" sm="9")
          personalities(:user="viewUser")
      v-row(v-if="viewUser.responsibleTeams.length > 0")
        v-col(cols="12" sm="3") {{ t('tableHeaders.responsible') }}
        v-col(cols="12" sm="9")
          responsible(:user="viewUser")
      v-row(v-if="viewUser.jobs.length > 0")
        v-col(cols="12" sm="3") {{ t('tableHeaders.jobs') }}
        v-col(cols="12" sm="9")
          jobs(:user="viewUser")
    v-card-text(v-if="hasPerm('core.delete_user') && viewUser.id !== user.id")
      v-row
        v-col(cols="12" sm="3") {{ t('tableHeaders.blocking') }}
        v-col(cols="12" sm="9")
          v-btn(v-if="viewUser.isActive" @click="" color="error") {{ t('buttons.blockUser') }}
          v-btn(v-else @click="" color="success") {{ t('buttons.unblockUser') }}
          .caption.mt-2 {{ t('helpText') }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import userQuery from '~/gql/eleden/queries/core/user.graphql'
import { ChangeAvatarMutationPayload, UserType } from '~/types/graphql'
import ChangeAvatar from '~/components/eleden/ac/user/ChangeAvatar.vue'
import Personalities from '~/components/eleden/ac/user/Personalities.vue'
import Jobs from '~/components/eleden/ac/user/Jobs.vue'
import Responsible from '~/components/eleden/ac/user/Responsible.vue'

@Component<AcUserIdPersonalities>({
  components: { Responsible, Jobs, Personalities, ChangeAvatar },
  middleware: 'auth',
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm', user: 'auth/user' })
  }
})
export default class AcUserIdPersonalities extends Vue {
  @Prop({ required: true, type: Object as PropType<UserType> }) viewUser!: UserType

  user!: UserType
  hasPerm!: (permissions: string | string[], or?: boolean) => boolean

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.personalities.${path}`, values) as string
  }

  updateAvatar (
    store: DataProxy,
    { data: { changeAvatar: { success, avatar } } }: { data: { changeAvatar: ChangeAvatarMutationPayload } }
  ) {
    if (success) {
      const data: any = store.readQuery({ query: userQuery, variables: { userId: this.viewUser.id } })
      data.user.avatar = avatar
      store.writeQuery({ query: userQuery, variables: { userId: this.viewUser.id }, data })
      if (this.user.id === this.viewUser.id) {
        this.$store.dispatch('auth/changeUserAvatar', avatar)
      }
    }
  }
}
</script>
