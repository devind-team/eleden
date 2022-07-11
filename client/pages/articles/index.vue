<template lang="pug">
bread-crumbs(:items="breadCrumbs")
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      v-row
        v-col(v-if="hasPerm('eleden.add_article')" cols="12")
          add-article(
            v-slot="{ on }"
            :add-article-update="addArticleUpdate"
            :add-article-from-bibtex-update="addArticleFromBibtexUpdate"
          )
            v-btn(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ t('general.addMenu.buttons.add') }}
      v-row(align="center")
        v-col(cols="12" md="9")
          items-data-filter(
            v-model="selectYears"
            v-bind="getFilterMessages('yearsFilter')"
            :items="articlesYears.map(e => ({ id: e }))"
            message-container-class="mr-1 my-1"
            multiple
            has-select-all
          )
          users-data-filter(
            v-model="selectUsers"
            :query="require('~/gql/eleden/queries/core/users.graphql')"
            :update="(data) => data.users.edges.map(e => e.node)"
            search-type="server"
            message-container-class="ml-1 my-1"
            multiple
          )
      articles-view(
        v-model="search"
        :articles="articles"
        :loading="$apollo.queries.articles.loading"
        :totalCount="totalCount"
        :delete-article-update="deleteArticleUpdate"
      )
      v-pagination(v-if="totalCount > pageSize" v-model="page" :length="Math.ceil(totalCount / pageSize)")
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import {
  AddArticleMutationPayload,
  AddArticleFromBibtexMutationPayload,
  ArticlesQuery,
  ArticlesQueryVariables,
  ArticleType,
  ArticleTypeConnection,
  ArticleTypeEdge,
  Maybe,
  UserType
} from '~/types/graphql'
import { BreadCrumbsItem } from '~/types/devind'
import BreadCrumbs from '@/components/common/BreadCrumbs.vue'
import ArticlesView from '~/components/eleden/articles/ArticlesView.vue'
import AddArticle from '~/components/eleden/articles/AddArticle.vue'
import articlesQuery from '~/gql/eleden/queries/article/articles.graphql'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import { FilterMessages } from '~/types/filters'

type AddArticleData = { data: { addArticle: AddArticleMutationPayload } }
type AddArticleFromBibtexData = { data: { addArticleFromBibtex: AddArticleFromBibtexMutationPayload } }

export type ArticlesQueryVariablesType = {
  first: number,
  offset: number,
  users?: string[],
  name?: string,
  years?: number[],
  search: string
}

@Component<ArticlesIndex>({
  components: { ArticlesView, ItemsDataFilter, AddArticle, UsersDataFilter, BreadCrumbs },
  apollo: {
    articlesYears: require('~/gql/eleden/queries/article/articles_years.graphql'),
    articles: {
      query: articlesQuery,
      variables () { return this.articlesVariables },
      update ({ articles }: { articles: ArticleTypeConnection }): ArticleType[] {
        this.totalCount = articles.totalCount
        return articles.edges.map((a: Maybe<ArticleTypeEdge>) => a?.node!)
      }
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user', hasPerm: 'auth/hasPerm' }),
    articlesVariables (): ArticlesQueryVariablesType {
      return {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        users: this.selectUsers.map(e => e.id),
        search: this.search,
        years: this.selectYears.map(year => year.id)
      }
    }
  }
})
export default class ArticlesIndex extends Vue {
  @Prop({ type: Array as PropType<BreadCrumbsItem[]>, required: true }) breadCrumbs!: BreadCrumbsItem[]
  @Prop({ type: Array as PropType<UserType[]>, default: () => ([]) }) users!: UserType[]
  @Prop({ type: String, default: '' }) search!: string

  readonly user!: UserType
  readonly articles!: ArticleType[]
  readonly articlesVariables!: ArticlesQueryVariablesType

  articlesYears!: number[]

  page: number = 1
  pageSize: number = 10
  totalCount: number = 0
  selectYears: { id: number }[] = []
  selectUsers: UserType[] = []

  /**
   * Получение перевода относительно локального пути
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

  /**
   * Получение сообщений для фильтра
   * @param filterName
   * @param multiple
   * @return
   */
  getFilterMessages (filterName: string, multiple: boolean = false): FilterMessages {
    return {
      title: this.t(`general.filters.${filterName}.title`),
      noFiltrationMessage: this.t(`general.filters.${filterName}.noFiltrationMessage`),
      multipleMessageFunction: multiple
        ? (name, restLength) =>
            this.$tc(`general.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }
}
</script>
