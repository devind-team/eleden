<template lang="pug">
  v-card
    v-card-title {{ $t('ac.users.profile.name') }}
    v-card-text
      additional-information(v-if="hasPerm('core.view_user')" :viewUser="viewUser")
      profile-information(v-else :viewUser="viewUser")
</template>

<script lang="ts">
import type { PropType, ComputedRef, Ref } from '#app'
import { defineComponent, computed, ref } from '#app'
import { DataTableHeader } from 'vuetify'
import { ProfileType, UserType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n } from '~/composables'
import AdditionalInformation from '~/components/profile/AdditionalInformation.vue'
import ProfileInformation from '~/components/profile/ProfileInformation.vue'

export default defineComponent({
  components: { AdditionalInformation, ProfileInformation },
  middleware: 'auth',
  props: {
    viewUser: { type: Object as PropType<UserType>, required: true }
  },
  setup () {
    const { t } = useI18n()

    const { hasPerm } = useAuthStore()

    const section: Ref<{ [key: string]: { [key: string]: string }[] }> = ref<{ [key: string]: { [key: string]: string }[] }>()
    const profile: Ref<ProfileType> = ref<ProfileType>()

    const headers: ComputedRef<DataTableHeader[]> = computed<DataTableHeader[]>(() => ([
      { text: t('ac.users.profile.tableHeaders.name') as string, value: 'name' },
      { text: t('ac.users.profile.tableHeaders.value') as string, value: 'value' }
    ]))

    return { hasPerm, section, profile, headers }
  }
})
</script>
