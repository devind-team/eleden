<template lang="pug">
v-menu(v-model="active" :close-on-content-click="false" transition="slide-y-transition" bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    apollo-mutation(
      v-for="extension in ['docx', 'xlsx', 'bibtex']"
      v-slot="{ mutate, loading, error }"
      :key="extension"
      :mutation="require('~/gql/eleden/mutations/articles/unload_articles.graphql')"
      :variables="{ extension }"
      tag
      @done="unloadArticlesDone"
    )
      v-list-item(@click="mutate")
        v-list-item-action(v-if="loading")
          v-progress-circular(color="primary" indeterminate)
        v-list-item-icon(v-else)
          v-icon mdi-{{ extIcons[extension] }}
        v-list-item-content
          v-list-item-title {{ $t(`articles.unload.${extension}`) }}
</template>
<script lang="ts">
import { computed, ref, defineComponent } from '#app'
import type { ComputedRef, Ref } from '#app'
import { UnloadArticlesMutationPayload } from '~/types/graphql'

export type UnloadArticlesResultType = { data: { unloadArticles : UnloadArticlesMutationPayload } }

export default defineComponent({
  setup () {
    const active: Ref<boolean> = ref<boolean>(false)
    const extIcons: ComputedRef<{ [k: string]: string }> = computed<{ [k: string]: string }>(() => ({
      docx: 'file-word',
      xlsx: 'file-excel',
      bibtex: 'bookshelf'
    }))
    const unloadArticlesDone = ({ data: { unloadArticles: result } }: UnloadArticlesResultType): void => {
      if (result.success) {
        window.open(`/${result.src!}`)
      }
    }
    return { active, extIcons, unloadArticlesDone }
  }
})
</script>
