<template lang="pug">
v-menu(bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    mutation-modal-form(
      :header="$t('articles.addMenu.addForm.header')"
      :button-text="$t('articles.addMenu.addForm.buttonText')"
      :mutation="require('~/gql/eleden/mutations/articles/add_article.graphql')"
      :variables="formVariables"
      :update="addArticleUpdate"
      :errors-in-alert="true"
      mutation-name="addArticle"
      @close="close"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-form-select
          v-list-item-content
            v-list-item-title {{ $t('articles.actions.fillForm') }}
      template(#form)
        add-article-form(:article="inputArticle")
    mutation-modal-form(
      :header="$t('articles.addMenu.addBibtexForm.header')"
      :button-text="$t('articles.addMenu.addBibtexForm.buttonText')"
      :mutation="require('~/gql/eleden/mutations/articles/add_article_from_bibtex.graphql')"
      :variables="{ file, formVariables }"
      :update="addArticleFromBibtexUpdate"
      :errors-in-alert="true"
      mutation-name="addArticleFromBibtex"
      @close="file = null"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-script-text
          v-list-item-title {{ $t('articles.actions.addFromBibTex') }}
      template(#form)
        validation-provider(v-slot="{ errors, valid }" :name="$t('articles.addBibtexForm.file')" rules="required")
          v-file-input(
            v-model="file"
            :label="$t('articles.addMenu.addBibtexForm.file')"
            :error-messages="errors"
            :success="valid"
            accept=".bib"
            clearable
          )
</template>
<script lang="ts">
import { DataProxy } from 'apollo-cache'
import type { ComputedRef, PropType } from '#app'
import { computed, defineComponent, Ref, ref } from '#app'
import { useI18n } from '~/composables'
import { AddArticleMutationVariables } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AddArticleForm, { Author, InputArticle } from '~/components/eleden/articles/AddArticleForm.vue'

type AddArticleUpdate = (store: DataProxy, result: any) => void
type AddArticleFromBibtexUpdate = (store: DataProxy, result: any) => void

export default defineComponent({
  components: { AddArticleForm, MutationModalForm },
  props: {
    addArticleUpdate: { type: Function as PropType<AddArticleUpdate>, required: true },
    addArticleFromBibtexUpdate: { type: Function as PropType<AddArticleFromBibtexUpdate>, required: true }
  },
  setup () {
    const { t } = useI18n()
    const defaultInputArticle = (): InputArticle => ({
      name: '',
      year: new Date().getFullYear(),
      fileLink: '',
      file: null,
      index: null,
      kind: null,
      workload: 0,
      authors: [],
      edition: '',
      journal: '',
      volume: '',
      pages: '',
      note: '',
      type: t('articles.articleFields.typeChoice.printed') as string,
      key: ''
    })
    const inputArticle: Ref<InputArticle> = ref<InputArticle>(defaultInputArticle())
    const file: Ref<File | null> = ref<File | null>()
    const formVariables: ComputedRef<AddArticleMutationVariables> = computed<AddArticleMutationVariables>(() => ({
      name: inputArticle.value.name,
      year: inputArticle.value.year,
      fileLink: inputArticle.value.fileLink,
      file: inputArticle.value.file,
      indexId: inputArticle.value.index ? String(inputArticle.value.index) : '',
      kindId: inputArticle.value.kind ? String(inputArticle.value.kind) : '',
      workload: inputArticle.value.workload,
      authors: inputArticle.value.authors.map((author: Author) => ({ name: author.text, userId: author.id || null })),
      additional: JSON.stringify({
        edition: inputArticle.value.edition,
        journal: inputArticle.value.journal,
        volume: inputArticle.value.volume,
        pages: inputArticle.value.pages,
        type: inputArticle.value.type,
        note: inputArticle.value.note,
        key: inputArticle.value.key
      })
    }))
    const close = (): void => { inputArticle.value = defaultInputArticle() }
    return { formVariables, close, file, inputArticle }
  }
})
</script>
