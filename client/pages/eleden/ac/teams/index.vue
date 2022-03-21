<template lang="pug">
  left-navigator-container(:bread-crumbs="bc" @update-drawer="$emit('update-drawer')")
    template(#header) {{ t('name') }}
    v-row(v-if="hasPerm('eleden.add_team')" align="center")
      v-col(cols="12" sm="6")
        add-teams(
          v-if="hasPerm('eleden.add_team')"
          v-slot="{ on }"
          :add-team-update="addTeamUpdate"
          :add-teams-update="addTeamsUpdate"
        )
          v-btn(v-on="on" color="primary")
            v-icon(left) mdi-plus
            | {{ t('buttons.add') }}
      v-col.text-right(v-if="hasPerm('core.view_experimental')" cols="12" sm="6")
        unload-teams(v-slot="{ on }")
          v-btn(v-on="on" color="success" @click="")
            v-icon(left) mdi-upload
            | {{ t('buttons.upload') }}
    v-row(align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-stream:input="searchStream$" :label="t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6")
        | {{ t('shownOf', { count: teams && teams.length, totalCount: teamsCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="teamHeaders"
          :items="teams"
          :loading="$apollo.queries.teams.loading"
          disable-pagination
          hide-default-footer
        )
          template(#item.name="{ item }")
            nuxt-link(:to="localePath({ name: 'eleden-ac-teams-team_id', params: { team_id: item.id } })")
              | {{ item.name }}
          template(#item.responsibleUsers="{ item }")
            .font-italic(v-if="item.responsibleUsers.length === 0") {{ t('noSet') }}
            template(v-else)
              span(v-for="(user, i) in item.responsibleUsers" :key="user.id")
                | {{ `${user.lastName} ${user.firstName[0]}. ${user.sirName[0]}.` }}
                | {{ item.responsibleUsers.length - 1 === i ? '' : ', '  }}
          template(#footer v-if="$apollo.queries.teams.loading")
            v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { DocumentNode } from 'graphql'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import { BreadCrumbsItem } from '~/types/devind'
import { TeamType, UploadTeamsMutationPayload, AddTeamMutationPayload, TeamsQueryVariables } from '~/types/graphql'
import LeftNavigatorContainer from '~/components/common/grid/LeftNavigatorContainer.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import TextMenu from '~/components/common/menu/TextMenu.vue'
import AddGroupDialog from '~/components/panel/AddGroupDialog.vue'
import UnloadTeams from '~/components/eleden/ac/team/UnloadTeams.vue'
import AddTeams from '~/components/eleden/ac/team/AddTeams.vue'
import Teams from '~/gql/eleden/queries/team/teams.graphql'
import RelativeTeams from '~/gql/eleden/queries/team/relative_teams.graphql'

@Component<EledenAcTeamsIndex>({
  components: { AddTeams, UnloadTeams, AddGroupDialog, TextMenu, DeleteMenu, LeftNavigatorContainer },
  middleware: ['auth'],
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        { text: this.t('name'), to: this.localePath({ name: 'eleden-ac-teams' }), exact: true }
      ]
    },
    canView (): boolean {
      return [
        this.hasPerm('eleden.view_team'),
        this.hasPerm('eleden.view_course'),
        this.hasPerm('eleden.add_course'),
        this.hasPerm('eleden.change_course'),
        this.hasPerm('eleden.delete_course')
      ].some(p => p)
    },
    query (): DocumentNode {
      return this.canView ? Teams : RelativeTeams
    },
    teamHeaders (): DataTableHeader[] {
      return [
        { text: this.t('tableHeaders.name'), value: 'name' },
        { text: this.t('tableHeaders.shortName'), value: 'shortName' },
        { text: this.t('tableHeaders.responsibleUsers'), value: 'responsibleUsers' },
        { text: this.t('tableHeaders.admission'), value: 'admission' }
      ]
    },
    teamsVariables (): TeamsQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        search: this.search$ || ''
      }
    }
  },
  apollo: {
    teams: {
      query (): DocumentNode {
        return this.query
      },
      variables () { return this.teamsVariables },
      update (data): TeamType[] {
        const teams = data.teams || data.relativeTeams
        this.teamsCount = teams.totalCount
        this.page = Math.ceil(teams.edges.length / this.pageSize)
        return teams.edges.map((el: any) => el.node)
      }
    }
  },
  domStreams: ['searchStream$'],
  subscriptions () {
    const search$ = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      tap(() => { this.page = 1 }),
      startWith('')
    )
    const al$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.teams.loading &&
        this.page * this.pageSize < this.teamsCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreTeams()
      })
    )
    return { search$, al$ }
  },
  head (): MetaInfo {
    return { title: this.t('name') as string } as MetaInfo
  }
})
export default class EledenAcTeamsIndex extends Vue {
  @Prop({ type: Array as PropType<BreadCrumbsItem[]>, required: true }) readonly breadCrumbs!: BreadCrumbsItem[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly bc!: BreadCrumbsItem[]
  readonly canView!: boolean
  readonly query!: DocumentNode
  readonly teamHeaders!: DataTableHeader[]
  readonly teamsVariables!: TeamsQueryVariables
  readonly teams!: TeamType[] | undefined

  search$: string = ''
  searchStream$: Subject<any> = new Subject<any>()

  page: number = 1
  pageSize: number = 20
  teamsCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.${path}`, values) as string
  }

  /**
   * Подгрузка групп
   */
  async fetchMoreTeams (): Promise<void> {
    await this.$apollo.queries.teams.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.search$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { teams } }: any) => {
        return {
          teams: {
            __typename: previousResult.teams.__typename,
            totalCount: teams.totalCount,
            edges: [...previousResult.teams.edges, ...teams.edges]
          }
        }
      }
    })
  }

  /**
   * Обновление групп после добавления новой группы
   * @param store
   * @param success
   * @param team
   */
  addTeamUpdate (
    store: DataProxy,
    { data: { addTeam: { success, team } } }: { data: { addTeam: AddTeamMutationPayload } }
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: this.query, variables: this.teamsVariables })
      ++data.teams.totalCount
      data.teams.edges = [{ node: team, __typename: 'TeamTypeEdge' }, ...data.teams.edges]
      data.teams.edges.splice(this.pageSize * Math.max(Math.floor(data.teams.edges.length / this.pageSize), 1))
      store.writeQuery({ query: this.query, variables: this.teamsVariables, data })
    }
  }

  /**
   * Обновление групп после добавления новых групп
   * @param store
   * @param success
   * @param teams
   */
  addTeamsUpdate (
    store: DataProxy,
    { data: { uploadTeams: { success, teams } } }: { data: { uploadTeams: UploadTeamsMutationPayload } }
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: this.query, variables: this.teamsVariables })
      data.teams.totalCount += teams!.length
      data.teams.edges = [...teams!.map((team: any) => ({
        node: team,
        __typename: 'TeamTypeEdge'
      })).reverse(), ...data.teams.edges]
      // Удаляем количество страниц, кратно pageSize
      data.teams.edges.splice(this.pageSize * Math.max(Math.floor(data.teams.edges.length / this.pageSize), 1))
      store.writeQuery({ query: this.query, variables: this.teamsVariables, data })
    }
  }
}
</script>
