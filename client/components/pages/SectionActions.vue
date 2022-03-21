<template lang="pug">
  v-menu(transition="scale-transition" origin="top left")
    template(v-slot:activator="{ on }")
      v-btn(v-on="on" icon absolute top right)
        v-icon mdi-dots-horizontal
    v-list
      v-list-item(@click="")
        v-list-item-icon #[v-icon mdi-file-document-edit-outline]
        v-list-item-content
          v-list-item-title {{ $t('pages.components.sectionActions.change') }}
      v-list-item(@click="")
        v-list-item-icon #[v-icon mdi-delete]
        v-list-item-content
          v-list-item-title {{ $t('pages.components.sectionActions.delete') }}
</template>
<script lang="ts">
import type { PropType, Ref } from '#app'
import { defineComponent, toRef } from '#app'
import { useAuthStore } from '~/store'
import { HasPermissionFnType } from '~/store/auth'
import { SectionInterface } from '~/types/graphql'

export default defineComponent({
  props: {
    section: { type: Object as PropType<SectionInterface>, required: true }
  },
  setup () {
    const authStore = useAuthStore()
    const hasPerm: Readonly<Ref<HasPermissionFnType>> = toRef(authStore, 'hasPerm')
    return { hasPerm }
  }
})
</script>
