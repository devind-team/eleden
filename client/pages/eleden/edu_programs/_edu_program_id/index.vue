<template lang="pug">
v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import { defineComponent, useRoute, useRouter } from '#app'
import { useI18n } from '~/composables'

export default defineComponent({
  middleware: ['auth'],
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useI18n()
    router.push(localePath({
      name: 'eleden-edu_programs-edu_program_id-description',
      params: { edu_program_id: route.params.edu_program_id }
    }))
  }
})
</script>
