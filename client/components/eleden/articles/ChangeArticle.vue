<template lang="pug">
mutation-modal-form(
  :header="$t('articles.editForm.header')"
  :button-text="$t('articles.editForm.buttonText')"
  :mutation="require('~/gql/eleden/mutations/articles/change_article.graphql')"
  :variables="formVariables"
  :errors-in-alert="true"
  mutation-name="changeArticle"
  @done="done"
)
  template(#activator="{ on }")
    v-btn.ml-2(v-on="on" color="success") {{ $t('articles.actions.edit') }}
  template(#form)
    change-article-form(:article="inputChangeArticle")
</template>
<script lang="ts">
import type { ComputedRef, PropType } from '#app'
import { computed, defineComponent, Ref, ref } from '#app'
import { ArticleType, AuthorType, ChangeArticleMutationVariables } from '~/types/graphql'
import ChangeArticleForm, { InputChangeArticle, NewAuthor } from '~/components/eleden/articles/ChangeArticleForm.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export default defineComponent({
  components: { ChangeArticleForm, MutationModalForm },
  props: {
    value: { type: Object as PropType<ArticleType>, required: true }
  },
  setup (props, { emit }) {
    const getArticleVariables = (): InputChangeArticle => {
      const params = JSON.parse(props.value.additionalText)
      const authors = props.value.authors?.map((e: AuthorType) => ({
        id: e.id,
        value: e.user,
        text: e.name
      }))
      return {
        id: props.value.id,
        name: props.value.name,
        year: props.value.year,
        index: props.value.index?.id,
        kind: props.value.kind?.id,
        authors,
        ...params
      }
    }
    const inputChangeArticle: Ref<InputChangeArticle> = ref<InputChangeArticle>(getArticleVariables())
    const formVariables: ComputedRef<ChangeArticleMutationVariables> = computed<ChangeArticleMutationVariables>(() => ({
      articleId: props.value.id,
      name: inputChangeArticle.value.name,
      year: inputChangeArticle.value.year,
      indexId: inputChangeArticle.value.index ? String(inputChangeArticle.value.index) : '',
      kindId: inputChangeArticle.value.kind ? String(inputChangeArticle.value.kind) : '',
      workload: inputChangeArticle.value.workload,
      authors: inputChangeArticle.value.authors.map((author: NewAuthor) => ({
        name: author.text,
        authorId: author.id,
        userId: author.value === null || typeof author.value === 'string' ? null : author.value.id
      })),
      additional: JSON.stringify({
        journal: inputChangeArticle.value.journal,
        edition: inputChangeArticle.value.edition,
        volume: inputChangeArticle.value.volume,
        pages: inputChangeArticle.value.pages,
        type: inputChangeArticle.value.type,
        note: inputChangeArticle.value.note,
        key: inputChangeArticle.value.key
      })
    }))
    const done = (result: any): void => {
      emit('input', result.data.changeArticle.article)
      nextTick(() => { inputChangeArticle.value = getArticleVariables() })
    }
    return { formVariables, done, inputChangeArticle }
  }
})
</script>
