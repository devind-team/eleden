<template lang="pug">
v-menu(v-model="active" :close-on-content-click="false" transition="slide-y-transition" bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    apollo-mutation(
      v-for="extension in ['html', 'excel']"
      v-slot="{ mutate, loading, error }"
      :key="extension"
      :mutation="require('~/gql/eleden/mutations/edu_programs/unload_edu_programs.graphql')"
      :variables="{ extension }"
      tag
      @done="unloadEduProgramsDone"
    )
      v-list-item(@click="mutate")
        v-list-item-action(v-if="loading")
          v-progress-circular(color="primary" indeterminate)
        v-list-item-icon(v-else)
          v-icon mdi-{{ extensionIcons[extension] }}
        v-list-item-content
          v-list-item-title {{ $t(`eduPrograms.unload.${extension}`) }}
</template>

<script lang="ts">
import { defineComponent, ref } from '#app'
import { UnloadEduProgramsMutationPayload } from '~/types/graphql'

export type UnloadEduProgramsResultType = { data: { unloadEduPrograms : UnloadEduProgramsMutationPayload } }

export default defineComponent({
  setup () {
    const extensionIcons: Record<string, string> = {
      html: 'language-html5',
      excel: 'file-excel'
    }

    const active = ref<boolean>(false)

    const unloadEduProgramsDone = ({ data: { unloadEduPrograms: result } }: UnloadEduProgramsResultType): void => {
      if (result.success) {
        window.open(`/${result.src!}`)
      }
    }

    return { extensionIcons, active, unloadEduProgramsDone }
  }
})
</script>
