<template lang="pug">
  v-data-table(:headers="headers" :items="items" hide-default-header hide-default-footer disable-pagination)
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'
import { UserType } from '~/types/graphql'

@Component<Personalities>({
  computed: {
    headers (): DataTableHeader[] {
      return [
        { text: this.$t('ac.users.personalities.personalities.tableHeaders.text') as string, value: 'text' },
        { text: this.$t('ac.users.personalities.personalities.tableHeaders.value') as string, value: 'value' }
      ]
    },
    items (): { text: string, value: string }[] {
      return ['id', 'username', 'lastName', 'firstName', 'sirName', 'email'].map(
        (e: string) => ({ text: this.$t(`profile.${e}`) as string, value: (this.user as any)[e] })
      ) as { text: string, value: string }[]
    }
  }
})
export default class Personalities extends Vue {
  @Prop({ required: true, type: Object as PropType<UserType> }) user!: UserType
  readonly headers!: DataTableHeader[]
  readonly items!: { text: string, value: string }[]
}
</script>
