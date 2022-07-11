<template lang="pug">
v-data-table(:headers="headers" :items="items" hide-default-header hide-default-footer disable-pagination)
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import type { PropType } from '#app'
import { computed, defineComponent } from '#app'
import { UserType } from '~/types/graphql'
import { useI18n } from '~/composables'

export default defineComponent({
  props: {
    user: { required: true, type: Object as PropType<UserType> }
  },
  setup (props) {
    const { t } = useI18n()

    const headers = computed<DataTableHeader[]>(() => ([
      { text: t('ac.users.personalities.personalities.tableHeaders.text') as string, value: 'text' },
      { text: t('ac.users.personalities.personalities.tableHeaders.value') as string, value: 'value' }
    ]))

    const items = computed<{ text: string, value: string }[]>(() => (
      ['id', 'username', 'lastName', 'firstName', 'sirName', 'email'].map(
        (e: string) => ({ text: t(`profile.${e}`) as string, value: (props.user as any)[e] })
      ) as { text: string, value: string }[]
    ))

    return { headers, items }
  }
})
</script>
