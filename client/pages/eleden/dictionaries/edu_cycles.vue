<template lang="pug">
universal-dictionary(
  @update-drawer="$emit('update-drawer')"
  :bread-crumbs="bc"
  :query="require('~/gql/eleden/queries/education/edu_cycles.graphql')"
  :headers="['id', 'name', 'code', { name: 'blockKindName', value: 'blockKind.name' }, { name: 'disciplineKindName', value: 'disciplineKind.name' }]"
  query-name="eduCycles"
)
</template>

<script lang="ts">
import type { PropType, ComputedRef } from '#app'
import { defineComponent, computed, useNuxt2Meta } from '#app'
import { BreadCrumbsItem } from '~/types/devind'
import { useI18n } from '~/composables'
import UniversalDictionary from '~/components/eleden/dictionaries/UniversalDictionary.vue'

export default defineComponent({
  components: { UniversalDictionary },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('dictionaries.eduCycles.header') as string })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('dictionaries.eduCycles.header') as string,
        to: localePath({ name: 'eleden-dictionaries-edu_cycles' }),
        exact: true
      }
    ]))

    return { bc }
  }
})
</script>
