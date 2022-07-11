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
      :success="valid"
      :error-messages="errors"
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.year')"
    rules="required|digits:4"
  )
    v-text-field(
      v-model="article.year"
      :label="$t('articles.articleFields.year')"
      :success="valid"
      :error-messages="errors"
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
      v-model="newUsers"
      :search-input.sync="search"
      :loading="usersLoading"
      :items="allUsers"
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
          @click:close="newUsers.splice(newUsers.indexOf(item), 1)"
        ) {{ item.text }}
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.index')"
    rules="required"
  )
    v-autocomplete(
      v-model="article.index"
      :loading="articleIndexesLoading"
      :items="articleIndexes"
      :label="$t('articles.articleFields.index')"
      :success="valid"
      :error-messages="errors"
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
  validation-provider(
    v-if="!fileInput"
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.url')"
    rules="required|min:4"
  )
    v-text-field(
      v-model="article.fileLink"
      :label="$t('articles.articleFields.url')"
      :success="valid"
      :error-messages="errors"
      clearable
    )
  validation-provider(
    v-if="fileInput"
    v-slot="{ errors, valid }"
    :name="$t('articles.articleFields.file')"
    rules="required"
  )
    v-file-input(
      v-model="article.file"
      :label="$t('articles.articleFields.file')"
      :success="valid"
      :error-messages="errors"
      accept=".pdf"
      clearable
    )
  v-row
    v-col(cols="6")
      v-checkbox(
        v-model="fileInput"
        :label="$t('articles.articleFields.fileInput')"
        @click="reset"
      )
    v-col(cols="6")
      v-checkbox(
        v-model="additionalActive"
        :label="$t('articles.articleFields.additional')"
      )
  v-form(v-if="additionalActive")
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

export type Author = {
  id: string | null
  value: UserType | string
  text: string
}
export type InputArticle = {
  name: string,
  year: number,
  fileLink: string,
  file: File | null,
  index: string | null,
  kind: string | null,
  workload: number,
  authors: Author[],
  edition: string,
  journal: string,
  volume: string,
  pages: string,
  note: string,
  type: string,
  key: string,
}

export default defineComponent({
  props: {
    article: { type: Object as PropType<InputArticle>, required: true }
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
    const article: ComputedRef<InputArticle> = computed<InputArticle>(() => props.article)
    const newUsers: WritableComputedRef<Author[] | null> = computed<Author[] | null>({
      get: () => article.value.authors,
      set: (values: (Author | string)[]): void => {
        article.value.authors = values.map((value: Author | string) => (
          typeof value === 'string'
            ? { id: null, value, text: value }
            : value)
        )
      }
    })
    const instance = getCurrentInstance()
    const vm = instance?.proxy || instance as unknown as InstanceType<VueConstructor>
    const allUsers: ComputedRef<Author[]> = computed<Author[]>(() => {
      return users.value.map((user: UserType) => ({ id: user.id, value: user, text: vm.$getUserName(user) }))
    })
    const filterUsers = (item: Author, queryText: string): boolean => {
      const qt: string = queryText.toLowerCase()
      return item.text.toLowerCase().split(' ').some((word: string) => word.includes(qt))
    }
    const reset = () => {
      if (fileInput) {
        article.value.file = null
      } else {
        article.value.fileLink = ''
      }
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
      newUsers,
      allUsers,
      filterUsers,
      reset,
      search
    }
  }
})
</script>
