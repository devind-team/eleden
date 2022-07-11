<template lang="pug">
v-menu(left bottom)
  template(#activator="{ on }")
    v-btn(v-on="on" icon)
      v-avatar(v-on="on" color="primary")
        v-img(v-if="!!user.avatar" :src="`/${user.avatar}`")
        .headline(v-else) {{ user.lastName[0] }}{{ user.firstName[0] }}
  v-list
    template(v-for="item in items")
      v-list-item(v-if="!!item.permissions ? hasPerm(item.permissions) : true" :key="item.name" :to="localePath({ name: item.path })")
        v-list-item-icon
          v-icon mdi-{{ item.icon }}
        v-list-item-content
          v-list-item-title {{ $t(`avatarMenu.${item.name}`) }}
</template>

<script lang="ts">
import { defineComponent } from '#app'
import { useAuthStore } from '~/store'

export type AvatarMenuItem = {
  name: string,
  icon: string,
  path: string,
  permissions?: string | string[]
}

export default defineComponent({
  setup () {
    const authStore = useAuthStore()
    const { user, hasPerm } = authStore
    const items: AvatarMenuItem[] = [
      { name: 'profile', icon: 'face-man', path: 'profile-me' },
      { name: 'messenger', icon: 'chat-outline', path: 'messenger', permissions: 'core.view_experimental' },
      { name: 'controlPanel', icon: 'cog', path: 'panel', permissions: 'core.view_user' },
      { name: 'infoPanel', icon: 'view-dashboard-outline', path: 'dashboard', permissions: 'core.view_user' },
      { name: 'eleden', icon: 'decagram-outline', path: 'eleden' },
      { name: 'logout', icon: 'logout', path: 'auth-logout' }
    ]
    return { user, hasPerm, items }
  }
})
</script>
