<template lang="pug">
div
  left-navigator-driver(v-model="active" :items="links")
  nuxt-child(:breadCrumbs="bc" @update-drawer="active = !active")
</template>

<script lang="ts">
import type { ComputedRef, Ref } from '#app'
import { defineComponent, computed, ref } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { useI18n } from '~/composables'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'

export default defineComponent({
  components: { LeftNavigatorDriver },
  middleware: ['auth'],
  permissions: 'core.view_user',
  setup () {
    const { t, localePath } = useI18n()

    const active: Ref<boolean> = ref<boolean>(false)

    const links: ComputedRef<LinksType[]> = computed<LinksType[]>(() => ([
      {
        title: t('statistics.menu.eduPrograms') as string,
        to: 'eleden-statistics-edu_programs',
        icon: 'decagram-outline'
      }
    ]))

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      { text: t('ac.eleden') as string, to: localePath({ name: 'eleden' }), exact: true }
    ]))

    return { active, bc, links }
  }
})
</script>
