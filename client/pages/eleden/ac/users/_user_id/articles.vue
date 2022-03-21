<template lang="pug">
  v-card
    v-card-title {{ $t('articles.name') }}
    v-card-text
      articles-view(:articles="articles" :delete-article-update="deleteArticleUpdate" :total-count="totalCount")
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import { ArticlesQueryVariablesType } from '~/pages/articles/index.vue'
import {
  ArticleType,
  ArticleTypeConnection,
  ArticleTypeEdge,
  Maybe,
  UserType
} from '~/types/graphql'
import ArticlesView from '~/components/eleden/articles/ArticlesView.vue'
import articlesQuery from '~/gql/eleden/queries/article/articles.graphql'

@Component<AcUserIdArticles>({
  components: { ArticlesView },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    articlesVariables (): ArticlesQueryVariablesType {
      return {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        users: [this.viewUser.id],
        search: this.search
      }
    }
  },
  apollo: {
    articles: {
      query: articlesQuery,
      variables () { return this.articlesVariables },
      update ({ articles }: { articles: ArticleTypeConnection }): ArticleType[] {
        this.totalCount = articles.totalCount
        return articles.edges.map((a: Maybe<ArticleTypeEdge>) => a?.node!)
      }
    }
  },
  middleware: 'auth'
})
export default class AcUserIdArticles extends Vue {
  @Prop({ type: Object as PropType<UserType>, required: true }) viewUser!: UserType
  @Prop({ type: String, default: '' }) search!: string

  readonly user!: UserType
  readonly articles!: ArticleType[]
  readonly articlesVariables!: ArticlesQueryVariablesType

  page: number = 1
  pageSize: number = 15
  totalCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.articles.${path}`, values) as string
  }

  /**
   * Обновление после удаления публикации
   * @param store
   * @param success
   * @param article
   */
  deleteArticleUpdate (store: DataProxy, { data: { deleteArticle: { success } } }: any, article: ArticleType) {
    if (success) {
      const data: any = store.readQuery({ query: articlesQuery, variables: this.articlesVariables })
      data.articles.edges = data.articles.edges.filter((e: any) => e.node.id !== article.id)
      --data.articles.totalCount
      store.writeQuery({ query: articlesQuery, variables: this.articlesVariables, data })
    }
  }
}
</script>
