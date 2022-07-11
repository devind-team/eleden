<template lang="pug">
component(:is="BUILD === 'raai' ? 'raai-index' : 'v-container'")
  page-segment(v-if="!loading" v-for="segment in segments" :key="segment.id" :segment="segment")
  v-row(v-else)
    v-progress-circular.mt-12.mx-auto(size="60" color="primary" indeterminate)
</template>

<script lang="ts">
import { VContainer } from 'vuetify/lib/components'
import { defineComponent, useNuxt2Meta, useRuntimeConfig } from '#app'
import { SegmentsQuery, SegmentsQueryVariables } from '~/types/graphql'
import { useCommonQuery, useI18n } from '~/composables'
import segmentsQuery from '~/gql/pages/queries/segments.graphql'
import PageSegment from '~/components/pages/PageSegment.vue'
import RaaiIndex from '~/components/raai/RaaiIndex.vue'

export default defineComponent({
  components: { RaaiIndex, PageSegment, VContainer },
  setup () {
    const { BUILD } = useRuntimeConfig()
    const { t } = useI18n()
    useNuxt2Meta({ title: t('homePage') as string })

    const { data: segments, loading } = useCommonQuery<SegmentsQuery, SegmentsQueryVariables>({
      document: segmentsQuery
    })

    return { segments, loading, BUILD }
  }
})
</script>
