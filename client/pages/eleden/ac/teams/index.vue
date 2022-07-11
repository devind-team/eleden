<template lang="pug">
left-navigator-container(:bread-crumbs="bc" @update-drawer="$emit('update-drawer')")
  template(#header) {{ $t('ac.teams.name') }}
  v-row(v-if="hasPerm('eleden.add_team')" align="center")
    v-col(cols="12" sm="6")
      add-teams(
        v-if="hasPerm('eleden.add_team')"
        v-slot="{ on }"
        :add-team-update="((cache, result) => addUpdate(cache, result, 'team'))"
        :add-teams-update="(cache, result) => addUpdate(cache, result, 'teams')"
      )
        v-btn(v-on="on" color="primary")
          v-icon(left) mdi-plus
          | {{ $t('ac.teams.buttons.add') }}
    v-col.text-right(v-if="hasPerm('core.view_experimental')" cols="12" sm="6")
      unload-teams(v-slot="{ on }")
        v-btn(v-on="on" color="success" @click="")
          v-icon(left) mdi-upload
          | {{ $t('ac.teams.buttons.upload') }}
  v-row(align="center")
    v-col(cols="12" sm="6")
      v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
    v-col.text-right(cols="12" sm="6")
      | {{ $t('shownOf', { count: teams && teams.length, totalCount }) }}
  v-row
    v-col
      v-data-table(
        :headers="teamHeaders"
        :items="teams"
        :loading="loading"
        disable-pagination
        hide-default-footer
      )
        template(#item.name="{ item }")
          nuxt-link(:to="localePath({ name: 'eleden-ac-teams-team_id', params: { team_id: item.id } })")
            | {{ item.name }}
        template(#item.responsibleUsers="{ item }")
          .font-italic(v-if="item.responsibleUsers.length === 0") {{ $t('ac.teams.noSet') }}
          template(v-else)
            span(v-for="(user, i) in item.responsibleUsers" :key="user.id")
              | {{ `${user.lastName} ${user.firstName[0]}. ${user.sirName[0]}.` }}
              | {{ item.responsibleUsers.length - 1 === i ? '' : ', '  }}
        template(#footer v-if="loading")
          v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent, onMounted, toRef, useNuxt2Meta, useRoute, useRouter } from '#app'
import { DocumentNode } from 'graphql'
import { DataTableHeader } from 'vuetify'
import { BreadCrumbsItem } from '~/types/devind'
import { TeamsQueryVariables, TeamsQuery } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useDebounceSearch, useQueryRelay, useCursorPagination, useApolloHelpers } from '~/composables'
import teamsQuery from '~/gql/eleden/queries/team/teams.graphql'
import relativeTeamsQuery from '~/gql/eleden/queries/team/relative_teams.graphql'
import LeftNavigatorContainer from '~/components/common/grid/LeftNavigatorContainer.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import TextMenu from '~/components/common/menu/TextMenu.vue'
import AddGroupDialog from '~/components/panel/AddGroupDialog.vue'
import UnloadTeams from '~/components/eleden/ac/team/UnloadTeams.vue'
import AddTeams from '~/components/eleden/ac/team/AddTeams.vue'

export default defineComponent({
  components: { AddTeams, UnloadTeams, AddGroupDialog, TextMenu, DeleteMenu, LeftNavigatorContainer },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    useNuxt2Meta({ title: t('ac.teams.name') as string })
    const route = useRoute()
    const router = useRouter()
    const { defaultClient } = useApolloHelpers()

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      { text: t('ac.teams.name') as string, to: localePath({ name: 'eleden-ac-teams' }), exact: true }
    ]))

    const canView = computed<boolean>(() => ([
      hasPerm.value('eleden.view_team'),
      hasPerm.value('eleden.view_course'),
      hasPerm.value('eleden.add_course'),
      hasPerm.value('eleden.change_course'),
      hasPerm.value('eleden.delete_course')
    ].some(p => p)))

    const query = computed<DocumentNode>(() => (canView.value ? teamsQuery : relativeTeamsQuery))

    const teamHeaders = computed<DataTableHeader[]>(() => ([
      { text: t('ac.teams.tableHeaders.name') as string, value: 'name' },
      { text: t('ac.teams.tableHeaders.shortName') as string, value: 'shortName' },
      { text: t('ac.teams.tableHeaders.responsibleUsers') as string, value: 'responsibleUsers' },
      { text: t('ac.teams.tableHeaders.admission') as string, value: 'admission' }
    ]))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: teams,
      loading,
      pagination: { totalCount },
      update,
      addUpdate
    } = useQueryRelay<TeamsQuery, TeamsQueryVariables>({
      document: query.value,
      variables: () => ({ first: 30, offset: 0, search: debounceSearch.value || '' })
    },
    {
      pagination: useCursorPagination(),
      fetchScroll: typeof document === 'undefined' ? null : document
    })

    onMounted(() => {
      if (route.query.teamId) {
        if (teams.value.map(team => team.id).includes(route.query.teamId)) {
          update(
            defaultClient.cache,
            { data: { deleteTeam: { id: route.query.teamId } } },
            (cacheData, { data: { deleteTeam: { id: teamId } } }) => {
              cacheData.teams.edges =
                cacheData.teams.edges.filter(e => e.node.id !== teamId)
              --cacheData.teams.totalCount
              return cacheData
            }
          )
        }
        router.push(localePath({ name: 'eleden-ac-teams' }))
      }
    })

    return { hasPerm, bc, teamHeaders, search, teams, loading, totalCount, addUpdate }
  }
})
</script>
