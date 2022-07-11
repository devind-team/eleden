<template lang="pug">
div
  left-navigator-driver(v-model="active" :items="links")
  nuxt-child(:breadCrumbs="bc" @update-drawer="active = !active")
</template>

<script lang="ts">
import type { ComputedRef, Ref } from '#app'
import { defineComponent, computed, useNuxt2Meta, ref } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { useI18n } from '~/composables'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'
import UniversalDictionary from '~/components/eleden/dictionaries/UniversalDictionary.vue'

export default defineComponent({
  components: { LeftNavigatorDriver, UniversalDictionary },
  middleware: ['auth'],
  setup () {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('dictionaries.name') as string })

    const active: Ref<boolean> = ref<boolean>(false)

    const links: ComputedRef<LinksType[]> = computed<LinksType[]>(() => ([
      {
        title: t('dictionaries.fileKinds.header') as string,
        to: 'eleden-dictionaries-file_kinds',
        icon: 'file-document-multiple-outline'
      },
      {
        title: t('dictionaries.directions.header') as string,
        to: 'eleden-dictionaries-directions',
        permissions: 'eleden.view_direction',
        icon: 'sign-direction'
      },
      {
        title: t('dictionaries.eduServices.header') as string,
        to: 'eleden-dictionaries-edu_services',
        icon: 'briefcase-outline'
      },
      {
        title: t('dictionaries.articleIndexes.header') as string,
        to: 'eleden-dictionaries-article_indexes',
        icon: 'script-outline'
      },
      {
        title: t('dictionaries.eduForms.header') as string,
        to: 'eleden-dictionaries-edu_forms',
        icon: 'arrow-left-right-bold-outline'
      },
      {
        title: t('dictionaries.disciplineKinds.header') as string,
        to: 'eleden-dictionaries-discipline_kinds',
        icon: 'chevron-triple-up'
      },
      {
        title: t('dictionaries.disciplineViews.header') as string,
        to: 'eleden-dictionaries-discipline_views',
        icon: 'clipboard-text-outline'
      },
      {
        title: t('dictionaries.workForms.header') as string,
        to: 'eleden-dictionaries-work_forms',
        icon: 'card-bulleted-outline'
      },
      {
        title: t('dictionaries.workKinds.header') as string,
        to: 'eleden-dictionaries-work_kinds',
        icon: 'pencil-box-outline'
      },
      {
        title: t('dictionaries.hoursKinds.header') as string,
        to: 'eleden-dictionaries-hours_kinds',
        icon: 'clock-time-eight-outline'
      },
      {
        title: t('dictionaries.blockKinds.header') as string,
        to: 'eleden-dictionaries-block_kinds',
        icon: 'school-outline'
      },
      {
        title: t('dictionaries.eduCycles.header') as string,
        to: 'eleden-dictionaries-edu_cycles',
        icon: 'recycle-variant'
      },
      {
        title: t('dictionaries.periods.header') as string,
        to: 'eleden-dictionaries-periods',
        icon: 'google-classroom'
      }
    ]))

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      { text: t('dictionaries.eleden') as string, to: localePath({ name: 'eleden' }), exact: true }
    ]))

    return { active, bc, links }
  }
})
</script>
