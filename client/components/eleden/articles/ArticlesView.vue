<template lang="pug">
v-sheet
  v-navigation-drawer(
    v-model="active"
    width="40vw"
    app
    right
    bottom
    temporary
  )
    v-card.ma-2.transparent(v-if="selectArticle" flat)
      v-card-subtitle.text-h6.text-center {{ selectArticle.name }}
      v-card-subtitle.text-center {{ selectArticle.kind.name }}
      v-divider
      v-data-table.transparent(
        :headers="additionalHeaders"
        :items="additionalItems(selectArticle.additionalText)"
        hide-default-header
        hide-default-footer
        disable-pagination
      )
      v-divider
      v-simple-table.transparent
        tbody
          tr
            td {{ $t('articles.articleFields.workload') }}
            td {{ selectArticle.workload }}
      v-divider
      v-list
        v-list-item {{ $t('articles.articleFields.authUsers') }}
        v-chip.ma-1(
          v-for="u in selectArticle.users"
          :key="u.id"
          :to="localePath({ name: 'users-user_id', params: { user_id: u.id } })"
          nuxt
          link
        ) {{ $getUserName(u) }}
      v-divider
      v-card-actions.d-flex.flex-wrap.justify-center
        v-btn(
          v-if="hasPerm('eleden.view_article')"
          :href="`/${selectArticle.src}`"
          target="_blank"
          color="primary"
        ) {{ $t('articles.actions.view') }}
        change-article(
          v-if="selectArticle.user.id === user.id"
          v-model="selectArticle"
        )
        apollo-mutation(
          :mutation="require('~/gql/eleden/mutations/articles/delete_article.graphql')"
          :variables="{ articleId: selectArticle.id, userId: user.id }"
          :update="(store, result) => deleteArticleUpdate(store, result, selectArticle)"
          @done="selectArticle = null"
        )
          template(v-slot="{ mutate }")
            delete-menu(
              v-if="hasPerm('eleden.delete_article') || selectArticle.user.id === user.id"
              @confirm="mutate"
            )
              template(#default="{ on }")
                v-btn.ma-2(
                  v-on="on"
                  color="error"
                ) {{ $t('articles.actions.delete') }}
  v-row
    v-col
      v-data-table(
        :headers="headers"
        :items="articles"
        :loading="loading"
        :search="search"
        disable-pagination
        hide-default-footer
      )
        template(#top)
          v-row(align="center")
            v-col(cols="12" sm="6")
              v-text-field(
                v-model="search"
                :label="$t('search')"
                prepend-icon="mdi-magnify"
                clearable
              )
            v-col.text-right(cols="12" sm="6") {{ $t('articles.total', { count: articles.length, totalCount: totalCount }) }}.
        template(#item.users="{ item }")
          span(
            v-for="(a, i) in item.authors"
            :key="a.id"
          ) {{ a.name }}{{ item.authors.length - 1 > i ? ', ' : '' }}
        template(#item.name="{ item }")
          a(@click="selectArticle = item") {{ item.name }}
        template(#item.createdAt="{ item }")
          | {{ $filters.dateTimeHM(item.createdAt) }}, {{ $getUserName(item.user) }}
</template>
<script lang="ts">
import { DataTableHeader } from 'vuetify'
import type { ComputedRef, PropType, Ref, WritableComputedRef } from '#app'
import { computed, defineComponent, ref, toRefs } from '#app'
import { useDebounceSearch, useI18n } from '~/composables'
import { useAuthStore } from '~/store/auth-store'
import { ArticleType } from '~/types/graphql'
import ChangeArticle from '~/components/eleden/articles/ChangeArticle.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type DeleteArticleUpdate = (store: any, result: any, article: ArticleType) => void

export default defineComponent({
  components: { DeleteMenu, ChangeArticle },
  middleware: 'auth',
  props: {
    articles: { type: Array as PropType<ArticleType[]>, required: true, default: () => ([]) },
    deleteArticleUpdate: { type: Function as PropType<DeleteArticleUpdate>, required: true },
    loading: { type: Boolean, default: false },
    totalCount: { type: Number, default: 0 }
  },
  setup () {
    const userStore = useAuthStore()
    const { hasPerm, user } = toRefs(userStore)
    const { t } = useI18n()
    const { search } = useDebounceSearch()
    const articlesCount: Ref<number> = ref<number>(0)
    const selectArticle: Ref<ArticleType | null> = ref<ArticleType | null>(null)
    const active: WritableComputedRef<boolean> = computed<boolean>({
      get: () => (!!selectArticle.value),
      set: (value: boolean): void => {
        if (!value) {
          selectArticle.value = null
        }
      }
    })
    const additionalHeaders: ComputedRef<DataTableHeader[]> = computed<DataTableHeader[]>(() => ([
      { text: t('articles.tableHeaders.text') as string, value: 'text' },
      { text: t('articles.tableHeaders.value') as string, value: 'value' }
    ]))
    const headers: ComputedRef<DataTableHeader[]> = computed<DataTableHeader[]>(() => ([
      { text: t('articles.tableHeaders.users') as string, value: 'users' },
      { text: t('articles.tableHeaders.name') as string, value: 'name' },
      { text: t('articles.tableHeaders.year') as string, value: 'year' },
      { text: t('articles.tableHeaders.index') as string, value: 'index.name' },
      { text: t('articles.tableHeaders.createdAt') as string, value: 'createdAt' }
    ]))
    const additionalItems = (additional: string): { text: string, value: string }[] => {
      return ['journal', 'volume', 'number', 'pages', 'type', 'note', 'key'].map((e: string) => {
        if (additional !== 'null') {
          return {
            text: t(`articles.articleFields.${e}`) as string,
            value: ((JSON.parse(additional)) as any)[e]
          }
        }
        return {
          text: t(`articles.articleFields.${e}`) as string,
          value: ''
        }
      }) as { text: string, value: string }[]
    }
    return {
      user,
      hasPerm,
      search,
      active,
      headers,
      additionalHeaders,
      additionalItems,
      selectArticle,
      articlesCount
    }
  }
})
</script>
