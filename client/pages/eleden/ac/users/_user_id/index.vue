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
      name: 'eleden-ac-users-user_id-personalities',
      params: { user_id: route.params.user_id }
    }))
  }
})
</script>
