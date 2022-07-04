<template lang="pug">
  v-card
    v-card-title {{ $t('ac.users.personalities.name') }}
    v-card-subtitle {{ $t('ac.users.personalities.createdAt') }} {{ dateTimeHM(viewUser.createdAt) }}
    v-card-text
      v-row
        v-col(cols="12" sm="3") {{ $t('ac.users.personalities.tableHeaders.avatar') }}
        v-col(cols="12" sm="9")
          change-avatar(:user="viewUser" :update="updateAvatar")
      v-row
        v-col(cols="12" sm="3") {{ $t('ac.users.personalities.tableHeaders.personalities') }}
        v-col(cols="12" sm="9")
          personalities(:user="viewUser")
      v-row(v-if="viewUser.responsibleTeams.length > 0")
        v-col(cols="12" sm="3") {{ $t('ac.users.personalities.tableHeaders.responsible') }}
        v-col(cols="12" sm="9")
          responsible(:user="viewUser")
      v-row(v-if="viewUser.jobs.length > 0")
        v-col(cols="12" sm="3") {{ $t('ac.users.personalities.tableHeaders.jobs') }}
        v-col(cols="12" sm="9")
          jobs(:user="viewUser")
    v-card-text(v-if="hasPerm('core.delete_user') && viewUser.id !== user.id")
      v-row
        v-col(cols="12" sm="3") {{ $t('ac.users.personalities.tableHeaders.blocking') }}
        v-col(cols="12" sm="9")
          v-btn(v-if="viewUser.isActive" @click="" color="error") {{ $t('ac.users.personalities.buttons.blockUser') }}
          v-btn(v-else @click="" color="success") {{ $t('ac.users.personalities.buttons.unblockUser') }}
          .caption.mt-2 {{ $t('ac.users.personalities.helpText') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, inject, useNuxtApp, toRefs } from '#app'
import { DataProxy } from 'apollo-cache'
import { ChangeAvatarMutationPayload, UserType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useFilters } from '~/composables'
import ChangeAvatar from '~/components/eleden/ac/user/ChangeAvatar.vue'
import Personalities from '~/components/eleden/ac/user/Personalities.vue'
import Jobs from '~/components/eleden/ac/user/Jobs.vue'
import Responsible from '~/components/eleden/ac/user/Responsible.vue'

type ChangeAvatarMutationType = { data: { changeAvatar: ChangeAvatarMutationPayload } }

export default defineComponent({
  components: { Responsible, Jobs, Personalities, ChangeAvatar },
  middleware: 'auth',
  props: {
    viewUser: { required: true, type: Object as PropType<UserType> }
  },
  setup (props) {
    const authStore = useAuthStore()
    const { hasPerm, user } = toRefs(authStore)
    const { dateTimeHM } = useFilters()
    const { $store } = useNuxtApp()

    const userUpdate: any = inject('userUpdate')
    const updateAvatar = (cache: DataProxy, result: ChangeAvatarMutationType) => {
      userUpdate(cache, result, (dataCache, { data: { changeAvatar: { avatar, success } } }) => {
        if (success) {
          dataCache.user.avatar = avatar
          if (user.value.id === props.viewUser.id) {
            $store.dispatch('auth/changeUserAvatar', avatar)
          }
        }
        return dataCache
      })
    }

    return { hasPerm, user, dateTimeHM, updateAvatar }
  }
})
</script>
