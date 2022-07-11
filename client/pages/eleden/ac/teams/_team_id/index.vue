<template lang="pug">
v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import { defineComponent, useRouter, useRoute } from '#app'
import { useI18n } from '~/composables'

export default defineComponent({
  middleware: ['auth'],
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useI18n()
    router.push(localePath({
      name: 'eleden-ac-teams-team_id-users',
      params: { team_id: route.params.team_id }
    }))
  }
})
</script>
