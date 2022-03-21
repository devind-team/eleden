<template lang="pug">
  v-data-table(:headers="headers" :items="user.jobs" disable-pagination hide-default-header hide-default-footer)
    template(#item.team="{ item }")
      v-tooltip(bottom)
        template(#activator="{ on }")
          span(v-on="on") {{ item.team.shortName }}
        span {{ item.team.name }}
    template(#item.post="{ item }")
      template(v-if="item.jobPosts")
        template(v-for="(jobPost, i) in item.jobPosts") {{ jobPost.post.name }}
          span(v-if="i !== item.jobPosts.length - 1") ,#{' '}
      strong(v-else) &mdash;
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'
import { UserType } from '~/types/graphql'

@Component<Jobs>({
  computed: {
    headers (): DataTableHeader[] {
      return [
        { text: this.$t('ac.users.personalities.jobs.tableHeaders.team') as string, value: 'team' },
        { text: this.$t('ac.users.personalities.jobs.tableHeaders.post') as string, value: 'post' }
      ]
    }
  }
})
export default class Jobs extends Vue {
  @Prop({ required: true, type: Object as PropType<UserType> }) user!: UserType
  readonly headers!: DataTableHeader[]
}
</script>
