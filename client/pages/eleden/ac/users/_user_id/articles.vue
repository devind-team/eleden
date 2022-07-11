<template lang="pug">
v-card
  v-card-title {{ $t('articles.name') }}
  v-card-text
    articles-view(
      :articles="articles"
      :delete-article-update="(store, result) => deleteUpdate(store, result)"
      :total-count="totalCount"
    )
</template>

<script lang="ts">
import type { PropType } from '#app'
import {
  UserType,
  ArticlesQuery,
  ArticlesQueryVariables
} from '~/types/graphql'
import { useQueryRelay } from '~/composables'
import articlesQuery from '~/gql/eleden/queries/article/articles.graphql'
import ArticlesView from '~/components/eleden/articles/ArticlesView.vue'

export default defineComponent({
  components: { ArticlesView },
  middleware: 'auth',
  props: {
    viewUser: { type: Object as PropType<UserType>, required: true },
    search: { type: String, default: '' }
  },
  setup (props) {
    const {
      data: articles,
      pagination: { totalCount },
      deleteUpdate
    } = useQueryRelay<ArticlesQuery, ArticlesQueryVariables>({
      document: articlesQuery,
      variables: () => ({
        users: [props.viewUser.id],
        search: props.search
      })
    })

    return { articles, deleteUpdate, totalCount }
  }
})
</script>
