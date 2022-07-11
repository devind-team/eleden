<template lang="pug">
v-card
  v-card-title {{ $t('eduPrograms.discipline.description.name')  }}
  v-card-subtitle {{ $t('eduPrograms.discipline.description.updatedAt', { updatedAt: $filters.dateTimeHM(discipline.updatedAt) }) }}
  v-card-text
    v-data-table(:headers="headers" :items="items" hide-default-header hide-default-footer disable-pagination)
      template(#item.text="{ item }") {{ $t(`eduPrograms.discipline.description.form.${item.text}`) }}
      template(#item.value="{ item }")
        template(v-if="item.text === 'view'") {{ item.value.name }}
        template(v-else-if="item.text === 'parent'")
          span(v-if="item.value") {{ item.value.code }} {{ item.value.name }}
          strong(v-else) &mdash;
        template(v-else-if="item.text === 'users'")
          template(v-if="item.value.length")
            template(v-for="(user, i) in item.value" )
              user-link(:key="user.id" :user="user")
              span(v-if="i !== item.value.length - 1") ,#{' '}
          strong(v-else) &mdash;
        template(v-else-if="['annotation', 'workProgram'].includes(item.text)")
          v-tooltip(v-if="item.value" bottom)
            template(#activator="{ on }")
              v-btn(v-on="on" :href="`/${item.value}`" target="_blank" icon color="success" text)
                v-icon mdi-download
            span {{ $t('open') }}
          strong(v-else) &mdash;
        template(v-else) {{ item.value }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, toRef } from '#app'
import { DataTableHeader } from 'vuetify'
import { DisciplineType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import UnloadUsersMenu from '~/components/users/UnloadUsersMenu.vue'
import GenerateNewPasswords from '~/components/eleden/ac/team/GenerateNewPasswords.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

export default defineComponent({
  components: { UnloadUsersMenu, GenerateNewPasswords, DeleteMenu, UserLink },
  middleware: 'auth',
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const active = ref<boolean>(false)

    const headers = computed<DataTableHeader[]>(() => ([
      { text: 'Поле', value: 'text' },
      { text: 'Значение', value: 'value' }
    ]))

    const items = computed<{ text: string, value: any }[]>(() => {
      const parent = hasPerm.value('eleden.change_discipline_additional_fields') ? ['parent'] : []
      return [
        'code', 'name', 'view',
        ...parent, 'users', 'workProgram',
        'annotation'
      ].map(
        (e: string) => ({ text: e, value: (props.discipline as any)[e] })
      )
    })

    return { hasPerm, active, headers, items }
  }
})
</script>
