<template lang="pug">
v-card
  v-card-title {{ $t('eduPrograms.description.name')  }}
  v-card-subtitle {{ $t('updatedAt', { updatedAt: dateTimeHM(eduProgram.updatedAt) }) }}
  v-card-text.text--primary
    v-data-table(:headers="headers" :items="items" hide-default-header hide-default-footer disable-pagination)
      template(#item.text="{ item }") {{ $t(`eduPrograms.description.form.${item.text}`)}}
      template(#item.value="{ item }")
        template(v-if="item.text === 'adaptive'") {{ item.value ? $t('yes') : $t('no') }}
        template(v-else-if="item.text === 'expedited'") {{ item.value ? $t('yes') : $t('no') }}
        template(v-else-if="item.text === 'eduForm'") {{ item.value.name }}
        template(v-else-if="item.text === 'direction'") {{ item.value.name }}
        template(v-else-if="['description', 'syllabus', 'calendar'].includes(item.text)")
          v-tooltip(v-if="item.value" bottom)
            template(#activator="{ on }")
              v-btn(v-on="on" :href="`/${item.value}`" target="_blank" icon color="success" text)
                v-icon mdi-download
            span {{ $t('open') }}
          strong(v-else) &mdash;
        span(v-else) {{ item.value }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref } from '#app'
import { DataTableHeader } from 'vuetify'
import { EduProgramType } from '~/types/graphql'
import { useFilters } from '~/composables'
import UnloadUsersMenu from '~/components/users/UnloadUsersMenu.vue'
import GenerateNewPasswords from '~/components/eleden/ac/team/GenerateNewPasswords.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

export default defineComponent({
  components: { UnloadUsersMenu, GenerateNewPasswords, DeleteMenu },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true }
  },
  setup (props) {
    const { dateTimeHM } = useFilters()

    const active = ref<boolean>(false)

    const headers: DataTableHeader[] = [
      { text: 'Поле', value: 'text' },
      { text: 'Значение', value: 'value' }
    ]

    const items: { text: string, value: string }[] = [
      'name', 'adaptive', 'expedited',
      'admission', 'eduForm', 'direction',
      'description', 'syllabus',
      'calendar'
    ].map((e: string) => ({ text: e, value: (props.eduProgram as any)[e] })) as { text: string, value: string }[]

    return { dateTimeHM, active, headers, items }
  }
})
</script>
