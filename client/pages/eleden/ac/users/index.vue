<template lang="pug">
  left-navigator-container(:bread-crumbs="bc" @update-drawer="$emit('update-drawer')")
    template(#header) {{ t('name') }}
    v-row(align="center")
      v-col(cols="12" sm="6")
        add-users(v-if="hasPerm('core.add_user')" v-slot="{ on }" :update="updateUsers")
          v-btn(v-on="on" color="primary")
            v-icon(left) mdi-plus
            | {{ t('buttons.add') }}
      v-col.text-right(cols="12" sm="6")
        unload-teams(v-if="hasPerm('core.view_experimental')" v-slot="{ on }")
          v-btn(v-on="on" @click="" color="success")
            v-icon(left) mdi-upload
            | {{ t('buttons.upload') }}
    v-row(align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-stream:input="searchStream$" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6")
        | {{ t('shownOf', { count: users && users.length, totalCount: usersCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :items="users"
          :loading="$apollo.queries.users.loading"
          hide-default-footer
          disable-pagination
        )
          template(#item.avatar="{ item }")
            v-avatar(color="primary" size="46")
              v-dialog(v-if="!!item.avatar" width="520")
                template(#activator="{ on }")
                  v-img(v-on="on" :src="`/${item.avatar}`")
                v-card
                  v-card-title {{ t('userAvatar') }}: {{ item.lastName }} {{ item.firstName }}
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
          template(#item.createdAt="{ item }") {{ $filters.dateTimeHM(item.createdAt) }}
          template(#footer v-if="$apollo.queries.users.loading")
            v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { DataProxy } from 'apollo-cache'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, pluck, startWith, tap, distinctUntilChanged, map, filter } from 'rxjs/operators'
import { DataTableHeader } from 'vuetify/types'
import { UserType, EledenUsersQueryVariables } from '~/types/graphql'
import { BreadCrumbsItem } from '~/types/devind'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import LeftNavigatorContainer from '~/components/common/grid/LeftNavigatorContainer.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'
import ResetPassword from '~/components/users/ResetPassword.vue'
import SendNotification from '~/components/users/SendNotification.vue'
import ChangeGroupDialog from '~/components/panel/ChangeGroupDialog.vue'
import AddUsers from '~/components/eleden/ac/team/AddUsers.vue'
import UnloadTeams from '~/components/eleden/ac/team/UnloadTeams.vue'
import EledenUsers from '~/gql/eleden/queries/core/users.graphql'

@Component<EledenAcUsersIndex>({
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
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        { text: this.t('name'), to: this.localePath({ name: 'eleden-ac-users' }), exact: true }
      ]
    },
    headers (): DataTableHeader[] {
      return [
        { text: this.t('tableHeaders.avatar'), value: 'avatar', align: 'center', sortable: false },
        { text: this.t('tableHeaders.name'), value: 'name' },
        { text: this.t('tableHeaders.username'), value: 'username' },
        { text: this.t('tableHeaders.email'), value: 'email' },
        { text: this.t('tableHeaders.groups'), value: 'groups' },
        { text: this.t('tableHeaders.createdAt'), value: 'createdAt' }
      ]
    },
    usersVariables (): EledenUsersQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        search: this.search$
      }
    }
  },
  domStreams: ['searchStream$'],
  subscriptions () {
    const search$ = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      distinctUntilChanged(),
      tap(() => { this.page = 1 }),
      startWith('')
    )
    const al$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.users.loading &&
        this.page * this.pageSize < this.usersCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreUsers()
      })
    )
    return { al$, search$ }
  },
  apollo: {
    users: {
      query: EledenUsers,
      variables () { return this.usersVariables },
      update ({ users }) {
        this.usersCount = users.totalCount
        this.page = Math.ceil(users.edges.length / this.pageSize)
        return users.edges.map((e: { node?: UserType }) => e.node)
      }
    }
  },
  head (): MetaInfo {
    return { title: this.t('name') } as MetaInfo
  }
})
export default class EledenAcUsersIndex extends Vue {
  @Prop({ required: true, type: Array as PropType<BreadCrumbsItem[]> }) breadCrumbs!: BreadCrumbsItem[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly bc!: BreadCrumbsItem[]
  readonly usersVariables!: EledenUsersQueryVariables
  readonly users!: UserType[] | undefined

  search$: string | null = ''
  searchStream$: Subject<any> = new Subject<any>()
  page: number = 1
  pageSize: number = 20
  usersCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.${path}`, values) as string
  }

  async fetchMoreUsers () {
    await this.$apollo.queries.users.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.search$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { users } }: any) => {
        return {
          users: {
            __typename: previousResult.users.__typename,
            totalCount: users.totalCount,
            edges: [...previousResult.users.edges, ...users.edges]
          }
        }
      }
    })
  }

  updateUsers (store: DataProxy, { data: { uploadUsers: { success, users } } }: any) {
    if (success) {
      const data: any = store.readQuery({ query: EledenUsers, variables: this.usersVariables })
      data.users.totalCount += users.length
      data.users.edges = [
        ...users.map((user: UserType) => ({ node: user, __typename: 'UserType' })).reverse(),
        ...data.users.edges
      ]
      data.users.edges.splice(this.pageSize * Math.max(Math.floor(data.users.edges.length / this.pageSize), 1))
      store.writeQuery({ query: EledenUsers, variables: this.usersVariables, data })
    }
  }
}
</script>
