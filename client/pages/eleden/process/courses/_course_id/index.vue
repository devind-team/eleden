<template lang="pug">
v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'

@Component<CourseIdIndex>({
  async asyncData ({ redirect, route, app: { localePath } }: Context): Promise<void> {
    await redirect(
      localePath({
        name: 'eleden-process-courses-course_id-register',
        params: { course_id: route.params.course_id }
      })
    )
  }
})
export default class CourseIdIndex extends Vue {}
</script>
