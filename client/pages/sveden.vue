<template lang="pug">
v-container
  left-navigator-driver(v-if="!loading" v-model="active" :items="sections")
    template(#items)
      template(v-for="item in sections")
        v-list-item(:to="localePath({ name: item.to, params: item.params })" link)
          v-list-item-content
            v-list-item-title {{item.title}}
      template(v-if="hasPerm('sveden.view_itempropcontainer')")
        v-divider
        v-list-item(:to="localePath({ name: 'sveden-edit' })" link)
          v-list-item-content
            v-list-item-title {{$t('sveden.editStructure')}}
  nuxt-child(:key="$route.params.url")
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '#app'
import type { Ref } from '#app'
import { useAuthStore } from '~/store/auth-store'
import { useCommonQuery } from '~/composables'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'
import AddSubsectionDialog from '~/components/sveden/AddSubsectionDialog.vue'
import Subsections from '~/gql/sveden/queries/subsections.graphql'

export default defineComponent({
  components: { LeftNavigatorDriver, AddSubsectionDialog },
  setup () {
    const { hasPerm } = useAuthStore()
    const active: Ref<boolean> = ref<boolean>(true)
    const { data: subsections, loading } = useCommonQuery({ document: Subsections })
    const sections = computed(() => {
      return subsections.value
        ? subsections.value.map(x => ({
          title: x.header,
          to: 'sveden-url',
          params: { url: x.url }
        }))
        : []
    })
    return {
      hasPerm,
      active,
      sections,
      loading
    }
  }
})
</script>
