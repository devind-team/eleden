<template lang="pug">
bread-crumbs(v-if="!loading" :items="bc")
  .title
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    | {{ fullName }}
  two-columns(:links="links")
    nuxt-child(:viewUser="user")
</template>

<script lang="ts">
import type { PropType, ComputedRef } from '#app'
import { defineComponent, useNuxt2Meta, computed, useRoute, useNuxtApp, provide } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { UserQuery, UserQueryVariables } from '~/types/graphql'
import { useI18n, useCommonQuery } from '~/composables'
import userQuery from '~/gql/eleden/queries/core/user.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'

export default defineComponent({
  components: { TwoColumns, BreadCrumbs },
  middleware: ['auth'],
  props: {
    breadCrumbs: { required: true, type: Array as PropType<BreadCrumbsItem[]> }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: 'Группа пользователей' as string })

    const route = useRoute()

    const links: ComputedRef<LinksType[]> = computed<LinksType[]>(() => ([
      {
        title: t('ac.users.menu.personalities') as string,
        to: 'eleden-ac-users-user_id-personalities',
        icon: 'face-man'
      },
      { title: t('ac.users.menu.profile') as string, to: 'eleden-ac-users-user_id-profile', icon: 'face-man-profile' },
      { title: t('ac.users.menu.portfolio') as string, to: 'eleden-ac-users-user_id-portfolio', icon: 'folder-open' },
      { title: t('ac.users.menu.articles') as string, to: 'eleden-ac-users-user_id-articles', icon: 'script-outline' }
    ]))

    const fullName: ComputedRef<string> = computed<string>(() => (useNuxtApp().$getUserFullName(user.value)))

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      { text: t('ac.users.name') as string, to: localePath({ name: 'eleden-ac-users' }), exact: true },
      {
        text: fullName.value,
        to: localePath({ name: 'eleden-ac-users-user_id', params: { team_id: user.value.id } }),
        exact: true
      }
    ]))

    const { data: user, loading, update } = useCommonQuery<UserQuery, UserQueryVariables>({
      document: userQuery,
      variables: () => ({
        userId: route.params.user_id
      })
    })
    provide('userUpdate', update)

    return { links, fullName, bc, user, loading }
  }
})
</script>
