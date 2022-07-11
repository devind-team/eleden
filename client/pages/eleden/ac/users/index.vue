<template lang="pug">
left-navigator-container(:bread-crumbs="bc" @update-drawer="$emit('update-drawer')")
  template(#header) {{ $t('ac.users.name') }}
  v-row(align="center")
    v-col(cols="12" sm="6")
      add-users(
        v-if="hasPerm('core.add_user')"
        v-slot="{ on }"
        :update="(cache, result) => addUpdate(cache, result, 'users')"
      )
        v-btn(v-on="on" color="primary")
          v-icon(left) mdi-plus
          | {{ $t('ac.users.buttons.add') }}
    v-col.text-right(cols="12" sm="6")
      unload-teams(v-if="hasPerm('core.view_experimental')" v-slot="{ on }")
        v-btn(v-on="on" @click="" color="success")
          v-icon(left) mdi-upload
          | {{ $t('ac.users.buttons.upload') }}
  v-row(align="center")
    v-col(cols="12" sm="6")
      v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
    v-col.text-right(cols="12" sm="6")
      | {{ $t('shownOf', { count: users && users.length, totalCount }) }}
  v-row
    v-col
      v-data-table(
        :headers="headers"
        :items="users"
        :loading="loading"
        hide-default-footer
        disable-pagination
      )
        template(#item.avatar="{ item }")
          v-avatar(color="primary" size="46")
            v-dialog(v-if="!!item.avatar" width="520")
              template(#activator="{ on }")
                v-img(v-on="on" :src="`/${item.avatar}`")
              v-card
                v-card-title {{ $t('ac.users.userAvatar') }}: {{ item.lastName }} {{ item.firstName }}
                v-card-subtitle {{ item.username }}
                v-card-text
                  v-img(:src="`/${item.avatar}`" width="500")
            .headline(v-else) {{ item.lastName[0] }}{{ item.firstName[0] }}
        template(#item.name="{ item }")
          nuxt-link(
            :to="localePath({ name: 'eleden-ac-users-user_id-personalities', params: { user_id: item.id }})"
          ) {{ item.lastName }} {{ item.firstName }} {{ item.sirName }}
        template(#item.groups="{ item }")
          template(v-for="(team, index) in item.teams")
            v-tooltip(bottom)
              template(#activator="{ on }")
                span(v-on="on") {{ team.shortName }}
              span {{ team.name }}
            span(v-if="index !== item.teams.length - 1") ,&nbsp;
        template(#item.createdAt="{ item }") {{ dateTimeHM(item.createdAt) }}
        template(#footer v-if="loading")
          v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, toRef, useNuxt2Meta, computed } from '#app'
import { DataTableHeader } from 'vuetify/types'
import { EledenUsersQueryVariables, EledenUsersQuery } from '~/types/graphql'
import { BreadCrumbsItem } from '~/types/devind'
import { useAuthStore } from '~/store'
import { useI18n, useFilters, useDebounceSearch, useQueryRelay, useCursorPagination } from '~/composables'
import eledenUsersQuery from '~/gql/eleden/queries/core/users.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import LeftNavigatorContainer from '~/components/common/grid/LeftNavigatorContainer.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'
import ResetPassword from '~/components/users/ResetPassword.vue'
import SendNotification from '~/components/users/SendNotification.vue'
import ChangeGroupDialog from '~/components/panel/ChangeGroupDialog.vue'
import AddUsers from '~/components/eleden/ac/team/AddUsers.vue'
import UnloadTeams from '~/components/eleden/ac/team/UnloadTeams.vue'

export default defineComponent({
  components: {
    UnloadTeams,
    AddUsers,
    ChangeGroupDialog,
    SendNotification,
    ResetPassword,
    LeftNavigatorContainer,
    TwoColumns,
    BreadCrumbs
  },
  middleware: ['auth'],
  props: {
    breadCrumbs: { required: true, type: Array as PropType<BreadCrumbsItem[]> }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    const { dateTimeHM } = useFilters()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    useNuxt2Meta({ title: t('ac.users.name') as string })

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      { text: t('ac.users.name') as string, to: localePath({ name: 'eleden-ac-users' }), exact: true }
    ]))

    const headers = computed<DataTableHeader[]>(() => ([
      { text: t('ac.users.tableHeaders.avatar') as string, value: 'avatar', align: 'center', sortable: false },
      { text: t('ac.users.tableHeaders.name') as string, value: 'name' },
      { text: t('ac.users.tableHeaders.username') as string, value: 'username' },
      { text: t('ac.users.tableHeaders.email') as string, value: 'email' },
      { text: t('ac.users.tableHeaders.groups') as string, value: 'groups' },
      { text: t('ac.users.tableHeaders.createdAt') as string, value: 'createdAt' }
    ]))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: users,
      loading,
      pagination: { totalCount },
      addUpdate
    } = useQueryRelay<EledenUsersQuery, EledenUsersQueryVariables>({
      document: eledenUsersQuery,
      variables: () => ({
        offset: 0,
        search: debounceSearch.value
      })
    },
    {
      pagination: useCursorPagination(),
      fetchScroll: typeof document === 'undefined' ? null : document
    })

    return { dateTimeHM, hasPerm, bc, headers, search, users, loading, totalCount, addUpdate }
  }
})
</script>
