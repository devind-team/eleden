<template lang="pug">
bread-crumbs(:items="breadCrumbs")
  v-row
    v-col(cols="12")
      cards-navigator(:items="cards")
</template>

<script lang="ts">
import type { ComputedRef, PropType } from '#app'
import { defineComponent, computed, useNuxt2Meta } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { useAuthStore } from '~/store'
import { useI18n } from '~/composables'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import CardsNavigator from '~/components/common/grid/CardsNavigator.vue'
import GeneralInfo from '~/components/eleden/GeneralInfo.vue'

export default defineComponent({
  components: { GeneralInfo, CardsNavigator, BreadCrumbs },
  props: {
    breadCrumbs: { required: true, type: Array as PropType<BreadCrumbsItem[]> }
  },
  setup () {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('eleden.name') as string })

    const { hasPerm } = useAuthStore()

    const cards: ComputedRef<LinksType[]> = computed<LinksType[]>(() => {
      const result = [
        {
          title: t('eleden.sections.eduPrograms') as string,
          icon: 'mdi-pencil-box-multiple',
          to: localePath({ name: 'eleden-edu_programs' }),
          color: 'success'
        },
        {
          title: t('eleden.sections.ac') as string,
          icon: 'mdi-account-multiple-outline',
          to: localePath({ name: 'eleden-ac' }),
          color: 'info'
        },
        {
          title: t('eleden.sections.process') as string,
          icon: 'mdi-book-education-outline',
          to: localePath({ name: 'eleden-process' }),
          color: 'warning'
        },
        {
          title: t('eleden.sections.dictionaries') as string,
          icon: 'mdi-book-alphabet',
          to: localePath({ name: 'eleden-dictionaries' }),
          color: 'brown'
        }
      ]
      if (hasPerm('core.view_user')) {
        result.push({
          title: t('eleden.sections.statistics') as string,
          icon: 'mdi-chart-bar ',
          to: localePath({ name: 'eleden-statistics' }),
          color: 'purple'
        })
      }
      return result
    })

    return { cards }
  }
})
</script>
