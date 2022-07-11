<template lang="pug">
v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import { defineComponent, useRouter, useRoute } from '#app'
import { useI18n } from '~/composables'

export default defineComponent({
  middleware: 'auth',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useI18n()
    router.push(localePath({
      name: 'eleden-edu_programs-discipline-discipline_id-description',
      params: { discipline_id: route.params.discipline_id }
    }))
  }
})
</script>
