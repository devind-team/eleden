<template lang="pug">
bread-crumbs(:items="bc")
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { MetaInfo } from 'vue-meta'
import { BreadCrumbsItem } from '~/types/devind'
import BreadCrumbs from '@/components/common/BreadCrumbs.vue'

@Component<ArticlesIndex>({
  components: { BreadCrumbs },
  computed: {
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        { text: `Статья ${this.$route.params.article_id}`, to: this.localePath({ name: 'articles-article_id' }), exact: true }
      ]
    }
  },
  head (): MetaInfo {
    return { title: `Статья ${this.$route.params.article_id}` } as MetaInfo
  }
})
export default class ArticlesIndex extends Vue {
  @Prop({ required: true, type: Array as PropType<BreadCrumbsItem[]> }) breadCrumbs!: BreadCrumbsItem[]

  readonly bc!: BreadCrumbsItem[]

  /**
   * Получение перевода относительно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`articles.${path}`, values) as string
  }
}
</script>
