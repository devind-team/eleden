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
import { Vue, Component } from 'vue-property-decorator'
import { UnloadEduProgramsMutationPayload } from '~/types/graphql'

export type UnloadEduProgramsResultType = { data: { unloadEduPrograms : UnloadEduProgramsMutationPayload } }

@Component<UnloadEduPrograms>({})
export default class UnloadEduPrograms extends Vue {
  extensionIcons: { [k: string]: string } = {
    html: 'language-html5',
    excel: 'file-excel'
  }

  active: boolean = false

  /**
   * Завершение выгрузки образовательных программ
   * @param result
   */
  unloadEduProgramsDone ({ data: { unloadEduPrograms: result } }: UnloadEduProgramsResultType): void {
    if (result.success) {
      window.open(`/${result.src!}`)
    }
  }
}
</script>
