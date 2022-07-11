<template lang="pug">
div
  left-navigator-driver(v-model="active" :items="links")
  nuxt-child(:breadCrumbs="bc" @update-drawer="active = !active")
</template>

<script lang="ts">
import type { ComputedRef, Ref } from '#app'
import { defineComponent, computed, ref, useNuxt2Meta } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { useI18n } from '~/composables'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'

export default defineComponent({
  components: { LeftNavigatorDriver },
  middleware: ['auth'],
  setup () {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('ac.name') as string })

    const active: Ref<boolean> = ref<boolean>(false)

    const links: ComputedRef<LinksType[]> = computed<LinksType[]>(() => ([
      { title: t('ac.teams.name') as string, to: 'eleden-ac-teams', icon: 'account-group' },
      { title: t('ac.users.name') as string, to: 'eleden-ac-users', icon: 'account-multiple' }
    ]))

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      { text: t('ac.eleden') as string, to: localePath({ name: 'eleden' }), exact: true }
    ]))

    return { active, bc, links }
  }
})
</script>
