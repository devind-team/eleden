<template lang="pug">
nuxt-child(:breadCrumbs="bc")
</template>

<script lang="ts">
import type { ComputedRef } from '#app'
import { computed, defineComponent, useNuxt2Meta } from '#app'
import { useI18n } from '~/composables'
import { BreadCrumbsItem } from '~/types/devind'

export default defineComponent({
  middleware: 'auth',
  setup () {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('articles.name') as string })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      { text: t('articles.name') as string, to: localePath({ name: 'articles' }), exact: true }
    ]))
    return { bc }
  }
})
</script>
