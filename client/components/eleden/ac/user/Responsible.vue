<template lang="pug">
  v-list
    v-list-item(@click="" v-for="team in user.responsibleTeams" :key="team.id")
      v-list-item-content
        v-list-item-title {{ team.name }} ({{ team.shortName }})
        v-list-item-subtitle {{ $t('ac.users.personalities.responsible.admission') }} {{ team.admission }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { UserType } from '~/types/graphql'

export default defineComponent({
  props: {
    user: { required: true, type: Object as PropType<UserType> }
  }
})
</script>
