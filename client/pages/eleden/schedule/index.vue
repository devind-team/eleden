<template lang="pug">
bread-crumbs(:items="bc")
  v-row {{ $t('eleden.schedule') }}
</template>

<script lang="ts">
import type { PropType, ComputedRef } from '#app'
import { defineComponent, computed, useNuxt2Meta } from '#app'
import { BreadCrumbsItem } from '~/types/devind'
import { useI18n } from '~/composables'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'

export default defineComponent({
  components: { BreadCrumbs },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('eleden.schedule') as string })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      { text: t('eleden.schedule') as string, to: localePath({ name: 'eleden-schedule' }), exact: true }
    ]))

    return { bc }
  }
})
</script>
