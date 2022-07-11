<template lang="pug">
div
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.title')"
    rules="required|min:4|max:1024"
  )
    v-text-field(
      v-model="article.name"
      :label="$t('articles.articleFields.title')"
      :error-messages="errors"
      :success="valid"
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.year')"
    rules="digits:4"
  )
    v-text-field(
      v-model="article.year"
      :label="$t('articles.articleFields.year')"
      :error-messages="errors"
      :success="valid"
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.kind')"
    rules="required"
  )
    v-autocomplete(
      v-model="article.kind"
      :loading="articleKindsLoading"
      :items="articleKinds"
      :label="$t('articles.articleFields.kind')"
      :success="valid"
      :error-messages="errors"
      item-value="id"
      item-text="name"
      clearable
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.authors')"
    rules="required"
  )
    v-combobox(
      v-model="newAuthors"
      :search-input.sync="search"
      :loading="usersLoading"
      :items="allAuthors"
      :label="$t('articles.articleFields.authors')"
      :filter="filterUsers"
      :success="valid"
      :error-messages="errors"
      :hint="$t('articles.addMenu.addForm.hint')"
      multiple
      return-object
      item-text="text"
      item-value="value"
      hide-selected
      clearable
    )
      template(#selection="{ item, index }")
        v-chip.ma-1(
          v-model="item"
          :key="item.id"
          close
          @click:close="newAuthors.splice(newAuthors.indexOf(item), 1)"
        ) {{ item.text }}
  v-autocomplete(
    v-model="article.index"
    :loading="articleIndexesLoading"
    :items="articleIndexes"
    :label="$t('articles.articleFields.index')"
    item-value="id"
    item-text="name"
    clearable
  )
  v-radio-group(v-model="article.type" row)
    v-radio(
      :label="$t('articles.articleFields.typeChoice.printed')"
      :value="$t('articles.articleFields.typeChoice.printed')"
    )
    v-radio(
      :label="$t('articles.articleFields.typeChoice.handwritten')"
      :value="$t('articles.articleFields.typeChoice.handwritten')"
    )
  v-text-field(v-model="article.workload" :label="$t('articles.articleFields.workload')" success clearable)
  v-text-field(v-model="article.edition" :label="$t('articles.articleFields.edition')" success clearable)
  v-text-field(v-model="article.journal" :label="$t('articles.articleFields.journal')" success clearable)
  v-text-field(v-model="article.volume" :label="$t('articles.articleFields.volume')" success clearable)
  v-text-field(v-model="article.pages" :label="$t('articles.articleFields.pages')" success clearable)
  v-text-field(v-model="article.note" :label="$t('articles.articleFields.note')" success clearable)
  v-text-field(v-model="article.key" :label="$t('articles.articleFields.key')" success clearable)
</template>
<script lang="ts">
import { VueConstructor } from 'vue'
import type { ComputedRef, PropType, WritableComputedRef } from '#app'
import { computed, defineComponent, getCurrentInstance, Ref, ref } from '#app'
import { useCommonQuery, useDebounceSearch, useQueryRelay } from '~/composables'
import {
  ArticleIndexesQuery,
  ArticleIndexesQueryVariables,
  ArticleKindsQuery,
  ArticleKindsQueryVariables,
  UsersQuery,
  UsersQueryVariables,
  UserType
} from '~/types/graphql'
import articleIndexesQuery from '~/gql/eleden/queries/article/article_indexes.graphql'
import articleKindsQuery from '~/gql/eleden/queries/article/article_kinds.graphql'
import usersQuery from '~/gql/core/queries/users.graphql'

export type NewAuthor = {
  id: string | null
  value: UserType | string | null
  text: string
}

export type InputChangeArticle = {
  id: string,
  name: string,
  year: number,
  index: string | null,
  kind: string | null,
  workload: number,
  authors: NewAuthor[],
  edition: string,
  journal: string,
  volume: string,
  pages: string,
  type: string,
  note: string,
  key: string,
}

export default defineComponent({
  props: {
    article: { type: Object as PropType<InputChangeArticle>, required: true }
  },
  setup (props) {
    const { search, debounceSearch } = useDebounceSearch()
    const {
      loading: articleIndexesLoading,
      data: articleIndexes
    } = useCommonQuery<ArticleIndexesQuery, ArticleIndexesQueryVariables>({
      document: articleIndexesQuery
    })
    const {
      loading: articleKindsLoading,
      data: articleKinds
    } = useCommonQuery<ArticleKindsQuery, ArticleKindsQueryVariables>({
      document: articleKindsQuery
    })
    const {
      loading: usersLoading,
      data: users
    } = useQueryRelay<UsersQuery, UsersQueryVariables, UserType>({
      document: usersQuery,
      variables: () => ({
        first: 5,
        search: debounceSearch.value
      })
    })
    const fileInput: Ref<boolean> = ref<boolean>(false)
    const additionalActive: Ref<boolean> = ref<boolean>(false)
    const article: ComputedRef<InputChangeArticle> = computed<InputChangeArticle>(() => props.article)
    const newAuthors: WritableComputedRef<NewAuthor[] | null> = computed<NewAuthor[] | null>({
      get: () => article.value.authors,
      set: (values: (NewAuthor | string)[]): void => {
        article.value.authors = values.map((value: NewAuthor | string) => (
          typeof value === 'string'
            ? { id: null, value, text: value }
            : value)
        )
      }
    })
    const instance = getCurrentInstance()
    const vm = instance?.proxy || instance as unknown as InstanceType<VueConstructor>
    const authorsUsers: ComputedRef<UserType[]> = computed<UserType[]>(() => {
      return article.value.authors
        .filter(article => article.value && typeof article.value !== 'string')
        .map(article => article.value as UserType)
    })
    const possibleUsers: ComputedRef<UserType[]> = computed<UserType[]>(() => {
      return users
        ? users.value.filter(user => !authorsUsers.value.find(authorsUser => user.id === authorsUser.id))
        : []
    })
    const allAuthors: ComputedRef<NewAuthor[]> = computed<NewAuthor[]>(() => {
      return [...possibleUsers.value.map(user => ({
        id: null,
        value: user,
        text: vm.$getUserName(user)
      })), ...article.value.authors]
    })
    const filterUsers = (item: NewAuthor, queryText: string): boolean => {
      const qt: string = queryText.toLowerCase()
      return item.text.toLowerCase().split(' ').some((word: string) => word.includes(qt))
    }
    return {
      articleIndexes,
      articleIndexesLoading,
      articleKinds,
      articleKindsLoading,
      users,
      usersLoading,
      fileInput,
      additionalActive,
      allAuthors,
      newAuthors,
      filterUsers,
      search
    }
  }
})
</script>
