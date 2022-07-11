<template lang="pug">
  v-tooltip(bottom)
    template(#activator="{ on }")
      v-chip(v-if="chip" v-on="on" :class="linkClass" :to="getUserPath(user)" small) {{ getUser(user) }}
      nuxt-link(v-else :class="linkClass" :to="getUserPath(user)") {{ getUser(user) }}
    span {{ $t('user.userChip.goToUser') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { UserType } from '~/types/graphql'
import { useI18n, useFilters } from '~/composables'

export default defineComponent({
  props: {
    user: { type: Object as PropType<UserType>, required: true },
    chip: { type: Boolean, default: false },
    full: { type: Boolean, default: false },
    showSirName: { type: Boolean, default: true },
    linkClass: { type: [Array, Object, String], default: '' }
  },
  setup (props) {
    const { getUserFullName, getUserName } = useFilters()
    const { localePath } = useI18n()

    const getUser = (user: UserType): string => {
      return props.full ? getUserFullName(user, props.showSirName) : getUserName(user, props.showSirName)
    }

    const getUserPath = (user: UserType): string => {
      return localePath({ name: 'eleden-ac-users-user_id-personalities', params: { user_id: user.id } })
    }

    return { getUser, getUserPath }
  }
})
</script>
