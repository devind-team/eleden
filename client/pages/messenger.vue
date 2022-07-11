<template lang="pug">
bread-crumbs(:items="breadCrumbs" fluid)
  v-row(no-gutters)
    v-col(v-if="$vuetify.breakpoint.mdAndUp || !('member_id' in $route.params)" cols="12" md="5" lg="4")
      add-member(v-if="state.view === 'add'")
      members(
        v-else
        :loading="$apollo.queries.members.loading"
        :fetch-more-members="fetchMoreMembers"
        :members="members || []"
        :totalCount="totalCount"
      )
    v-col(v-if="$vuetify.breakpoint.mdAndUp || 'member_id' in $route.params" cols="12" md="7" lg="8")
      nuxt-child(@change-title="chatName = $event" :key="$route.fullPath" :keep-alive="'member_id' in $route.params")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Inject, ProvideReactive } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { BreadCrumbsItem } from '~/types/devind'
import {
  MembersQuery,
  MembersQueryVariables,
  MemberType,
  UserType,
  PageInfo, MembersSubscription, MemberTypeEdge
} from '~/types/graphql'
import membersQuery from '~/gql/messenger/queries/members.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import Chat from '~/components/messenger/Member.vue'
import MembersControl from '~/components/messenger/MembersControl.vue'
import Members from '~/components/messenger/Members.vue'
import AddMember from '~/components/messenger/AddMember.vue'

export type MessengerStateType = { search: string, view: string }
export type MembersSubscriptionResultType = { subscriptionData: { data: { members: MembersSubscription } } }

@Component<Messenger>({
  middleware: 'auth',
  components: { AddMember, Members, MembersControl, BreadCrumbs, Chat },
  computed: {
    ...mapGetters({ user: 'auth/user', loginIn: 'auth/loginIn' }),
    breadCrumbs (): BreadCrumbsItem[] {
      const bc: BreadCrumbsItem[] = [
        { text: this.t('name'), to: this.localePath({ name: 'messenger' }), exact: true }
      ]
      if ('member_id' in this.$route.params) {
        bc.push({
          text: this.chatName,
          to: this.localePath({ name: 'messenger-member_id', params: this.$route.params }),
          exact: true
        })
      }
      return bc
    },
    membersVariable (): MembersQueryVariables | any {
      return {
        first: this.pageSize,
        userId: this.user.id,
        chatNameIcontains: this.state.search
      }
    }
  },
  head (): MetaInfo {
    return { title: this.t('name') as string }
  },
  apollo: {
    members: {
      query: membersQuery,
      variables (): MembersQueryVariables {
        return this.membersVariable
      },
      update ({ members }: MembersQuery): MemberType[] {
        this.totalCount = members.totalCount
        this.pageInfo = members.pageInfo
        const m: MemberType[] = members.edges.map((e: any) => e.node)
        m.sort((a, b) => (Date.parse(b.updatedAt) - Date.parse(a.updatedAt)))
        return m
      },
      subscribeToMore: {
        document: require('~/gql/messenger/subscriptions/members.graphql'),
        updateQuery (previousResult: any, { subscriptionData: { data: { members: { action, id, member, update } } } }: MembersSubscriptionResultType) {
          if (action === 'ADD') {
            previousResult.members.edges = [
              { node: member, __typename: 'MemberTypeEdge' },
              ...previousResult.members.edges
            ]
            ++previousResult.members.totalCount
          } else if (action === 'CHANGE') {
            const m: any | undefined = previousResult.members.edges.find((e: MemberTypeEdge) => e.node!.id === member!.id)
            if (m) {
              m.node = member
            } else if (update) {
              previousResult.members.edges = [
                { node: member, __typename: 'MemberTypeEdge' },
                ...previousResult.members.edges
              ]
            }
          } else if (action === 'DELETE') {
            previousResult.members.edges = previousResult.members.edges.filter((e: MemberTypeEdge) => e.node!.id !== id)
            --previousResult.members.totalCount
            if ('member_id' in this.$route.params && this.$route.params.member_id === id) {
              this.$router.push(this.localePath({ name: 'messenger' }))
            }
          }
          return previousResult
        }
      }
    }
  }
})
export default class Messenger extends Vue {
  @ProvideReactive() state: MessengerStateType = { search: '', view: 'default' }
  @Inject() setFooter!: (state?: boolean) => void

  membersVariable!: MembersQueryVariables
  readonly user!: UserType
  readonly loginIn!: boolean
  members!: MemberType[]

  pageInfo: PageInfo = { hasNextPage: true, hasPreviousPage: true }
  pageSize: number = 30
  totalCount: number = 0
  chatName: string = ''

  created () {
    this.setFooter(false)
  }

  destroyed () {
    this.setFooter()
  }

  async fetchMoreMembers (): Promise<void> {
    if (!this.pageInfo.hasNextPage) { return }
    await this.$apollo.queries.members.fetchMore({
      variables: {
        first: this.pageSize,
        userId: this.user.id,
        after: this.$cursor(this.members.length - 1),
        chatNameIcontains: this.state.search
      },
      updateQuery: (previousQueryResult: MembersQuery, { fetchMoreResult: { members } }: any) => {
        return {
          members: {
            __typename: previousQueryResult.members.__typename,
            totalCount: members.totalCount,
            pageInfo: members.pageInfo,
            edges: [...members.edges, ...previousQueryResult.members.edges]
          }
        }
      }
    })
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`messenger.${path}`, values) as string
  }
}
</script>
