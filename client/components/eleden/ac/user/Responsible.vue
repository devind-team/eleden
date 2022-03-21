<template lang="pug">
  v-list
    v-list-item(@click="" v-for="team in user.responsibleTeams" :key="team.id")
      v-list-item-content
        v-list-item-title {{ team.name }} ({{ team.shortName }})
        v-list-item-subtitle {{ $t('ac.users.personalities.responsible.admission') }} {{ team.admission }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { UserType } from '~/types/graphql'

@Component<Responsible>({})
export default class Responsible extends Vue {
  @Prop({ required: true, type: Object as PropType<UserType> }) user!: UserType
}
</script>
