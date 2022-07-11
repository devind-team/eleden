<template lang="pug">
div
  user-link(v-if="!!user" :user="user")
  template(v-else)
    v-menu(v-if="canChange" v-model="active" bottom)
      template(#activator="{ on }")
        v-btn(v-on="on" :loading="loading" text color="primary") {{ $t('ac.users.portfolio.confirmation.confirm') }}
      v-card(style="width: 400px")
        v-card-text {{ $t('ac.users.portfolio.confirmation.confirmQuestion') }}
        v-card-actions
          v-btn(@click="confirm" color="primary") {{ $t('yes') }}
          v-spacer
          v-btn(@click="active = false" color="warning") {{ $t('no') }}
    .font-italic(v-else) {{ $t('ac.users.portfolio.confirmation.notConfirmed') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { UserType } from '~/types/graphql'
import UserLink from '~/components/eleden/user/UserLink.vue'

export default defineComponent({
  components: { UserLink },
  props: {
    user: { type: Object as PropType<UserType | null>, default: null },
    canChange: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  setup (_, { emit }) {
    const active = ref<boolean>(false)

    const confirm = () => {
      emit('confirm')
      active.value = false
    }

    return { active, confirm }
  }
})
</script>
