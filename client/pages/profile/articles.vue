<template lang="pug">
v-card
  v-card-title {{ $t('articles.name') }}
  v-card-text
    v-row(align="center")
      v-col(cols="6")
        add-article(
          v-slot="{ on }"
          :add-article-update="addArticleUpdate"
          :add-article-from-bibtex-update="addArticleFromBibtexUpdate"
        )
          v-btn(v-on="on" color="primary")
            v-icon(left) mdi-plus
            | {{ $t('articles.actions.add') }}
      v-col(cols="6").text-right
        unload-articles(v-slot="{ on }")
          v-btn(v-on="on" color="success")
            v-icon(left) mdi-upload
            | {{ $t('articles.actions.unload') }}
    article-view(:articles="articles" :delete-article-update="deleteArticleUpdate" :totalCount="totalCount")
</template>

<script lang="ts">
import { AsyncComponent } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { MetaInfo } from 'vue-meta'
import { mapGetters } from 'vuex'
import {
  AddArticleFromBibtexMutationPayload,
  AddArticleMutationPayload,
  ArticlesQuery, ArticlesQueryVariables,
  ArticleType,
  ArticleTypeConnection,
  ArticleTypeEdge,
  Maybe,
  UserType
} from '~/types/graphql'
import ArticleView from '~/components/eleden/articles/ArticlesView.vue'
import AddArticle from '~/components/eleden/articles/AddArticle.vue'
import { ArticlesQueryVariablesType } from '~/pages/articles/index.vue'
import articlesQuery from '~/gql/eleden/queries/article/articles.graphql'

const UnloadArticles: AsyncComponent = () => import('~/components/eleden/articles/UnloadArticles.vue')

type AddArticleData = { data: { addArticle: AddArticleMutationPayload } }
type AddArticleFromBibtexData = { data: { addArticleFromBibtex: AddArticleFromBibtexMutationPayload } }

@Component<ProfileArticles>({
  components: { ArticleView, UnloadArticles, AddArticle },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    articlesVariables (): ArticlesQueryVariablesType {
      return {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        users: [this.user.id],
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
  head (): MetaInfo {
    return { title: this.t('name') } as MetaInfo
  }
})
export default class ProfileArticles extends Vue {
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
    return this.$t(`articles.${path}`, values) as string
  }

  /**
   * Добавление публикации
   * @param store
   * @param article
   */
  addArticle (store: DataProxy, article: ArticleType): void {
    const data: ArticlesQuery | any = store.readQuery<ArticlesQuery, ArticlesQueryVariables>({
      query: articlesQuery,
      variables: this.articlesVariables
    })
    ++data.articles.totalCount
    data.articles.edges = [{ node: article, __typename: 'ArticleTypeEdge' }, ...data.articles.edges]
    data.articles.edges.splice(
      this.pageSize * Math.max(Math.floor(data.articles.edges.length / this.pageSize), 1)
    )
    store.writeQuery({ query: articlesQuery, variables: this.articlesVariables, data })
  }

  /**
   * Обновление списка публикаций после добавления
   * @param store
   * @param success
   * @param article
   */
  addArticleUpdate (
    store: DataProxy,
    { data: { addArticle: { success, article } } }: AddArticleData
  ): void {
    if (success) {
      this.addArticle(store, article as ArticleType)
    }
  }

  /**
   * Добавление и обновление списка публикаций после загрузки из bibtex
   * @param store
   * @param success
   * @param article
   */
  addArticleFromBibtexUpdate (
    store: DataProxy,
    { data: { addArticleFromBibtex: { success, articles } } }: AddArticleFromBibtexData
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: articlesQuery, variables: this.articlesVariables })
      data.articles.totalCount += articles!.length
      data.articles.edges = [
        ...articles!
          .map((article: any) => ({ node: article, __typename: 'ArticleTypeEdge' }))
          .reverse(),
        ...data.articles.edges
      ]
      data.articles.edges.splice(
        this.pageSize * Math.max(Math.floor(data.articles.edges.length / this.pageSize), 1)
      )
      store.writeQuery({ query: articlesQuery, variables: this.articlesVariables, data })
    }
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
