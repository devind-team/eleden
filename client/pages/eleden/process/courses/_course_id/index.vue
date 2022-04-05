<template lang="pug">
  v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import { defineComponent, useRouter, useRoute } from '#app'
import { useI18n } from '~/composables'

export default defineComponent({
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useI18n()

    router.push(localePath({
      name: 'eleden-process-courses-course_id-register',
      params: { course_id: route.params.course_id }
    }))
  }
})
</script>
