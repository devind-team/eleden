<template lang="pug">
universal-dictionary(
  :bread-crumbs="bc"
  :query="require('~/gql/eleden/queries/education/directions.graphql')"
  :headers="['code', 'name', 'secret', 'delete', { name: 'eduServiceName', value: 'eduService.name' }]"
  :convert-item="{ delete: (value) => !value }"
  :boolean-headers="['secret', 'delete']"
  query-name="directions"
  @update-drawer="$emit('update-drawer')"
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
  permissions: 'eleden.view_direction',
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('dictionaries.directions.header') as string })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('dictionaries.directions.header') as string,
        to: localePath({ name: 'eleden-dictionaries-directions' }),
        exact: true
      }
    ]))

    return { bc }
  }
})
</script>
