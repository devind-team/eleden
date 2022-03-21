<template lang="pug">

</template>

<script lang="ts">
import { defineComponent, useRouter } from '#app'
import { useApolloClient } from '@vue/apollo-composable'
import { useI18n } from '~/composables'
import Subsections from '~/gql/sveden/queries/subsections.graphql'

export default defineComponent({
  async setup () {
    const { resolveClient } = useApolloClient()
    const client = resolveClient()
    const { localePath } = useI18n()
    const router = useRouter()
    const { data: { subsections } } = await client.query({
      query: Subsections
    })
    await router.push(localePath({ name: 'sveden-url', params: { url: subsections.length ? subsections[0].url : 'edit' } }))
  }
})
</script>
