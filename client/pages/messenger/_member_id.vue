<template lang="pug">
messenger-card-resize(
  v-touch="{ right: () => $router.push(localePath({ name: 'messenger' })) }"
  ref="mcr"
  :loading="$apollo.queries.chatMessages.loading"
  :border-left="$vuetify.breakpoint.smAndDown"
  tile outlined
)
  template(#title)
    v-btn.mr-3(v-if="$vuetify.breakpoint.smAndDown" :to="localePath({ name: 'messenger' })" icon left)
      v-icon mdi-arrow-left
    | {{ params.name }}
    v-spacer
    v-tooltip(bottom)
      template(#activator="{ on }")
        v-btn(v-on="on" icon)
          v-icon mdi-magnify
      span Поиск по беседе
    member-control(v-slot="{ on }" :member="member")
      v-btn(v-on="on" icon)
        v-icon mdi-dots-vertical
  template(#actions)
    add-message(@add="() => $refs.mcr.scrollDown(true)" :chat-id="$toGlobalId('ChatType', Number(member.chat.id))")
  chat-messages(:items="chatMessages || []" :loading="$apollo.queries.chatMessages.loading")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { MetaInfo } from 'vue-meta'
import { mapGetters } from 'vuex'
import { Context } from '@nuxt/types'
import {
  ChatMessageType,
  ChatMessageTypeEdge,
  UserType,
  ChatMessagesQueryVariables, MemberType, ChatMessagesQuery, ChatMessagesSubscription, PageInfo
} from '~/types/graphql'
import { getMemberParams, MemberExtendedType, MemberParamsType } from '~/components/messenger/Member.vue'
import MessengerCardResize from '~/components/messenger/MessengerCardResize.vue'
import ChatMessages from '~/components/messenger/ChatMessages.vue'
import AddMessage from '~/components/messenger/AddMessage.vue'
import MemberControl from '~/components/messenger/MemberControl.vue'

export type ChatMessagesSubscriptionResultType = { subscriptionData: { data: { chatMessages: ChatMessagesSubscription } } }

@Component<MessengerChat>({
  middleware: 'auth',
  components: { MemberControl, AddMessage, ChatMessages, MessengerCardResize },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    params (): MemberParamsType {
      return getMemberParams(this.member, this.user)
    },
    chatMessagesVariables (): ChatMessagesQueryVariables {
      return {
        chat: this.$toGlobalId('ChatType', Number(this.member.chat.id)),
        user: this.user?.id,
        deleted: false,
        first: this.pageSize
      }
    }
  },
  watch: {
    chatMessages () {
      this.$nextTick(this.$refs.mcr.scrollDown)
    }
  },
  apollo: {
    chatMessages: {
      query: require('~/gql/messenger/queries/chat_messages.graphql'),
      variables (): ChatMessagesQueryVariables {
        return this.chatMessagesVariables
      },
      update ({ chatMessages }): ChatMessageType[] {
        this.totalCount = chatMessages.totalCount
        this.pageInto = chatMessages.pageInfo
        const cm: ChatMessageType[] = chatMessages.edges.map((e: ChatMessageTypeEdge) => e.node!)
        // # Поправить сообщение о прочтении
        // const changeStates: string[] = cm
        //   .filter((e: ChatMessageType) => (e.read === null && e.message?.user?.id !== this.user.id))
        //   .map((e: ChatMessageType) => e.id)
        // this.changeMessageState(changeStates) - со
        cm.sort((a, b) => (Date.parse(a.createdAt) - Date.parse(b.createdAt)))
        return cm
      },
      subscribeToMore: {
        document: require('~/gql/messenger/subscriptions/chat_messages.graphql'),
        variables () {
          return { chatId: this.$toGlobalId('ChatType', Number(this.member.chat.id)) }
        },
        updateQuery (previousResult: ChatMessagesQuery | any, { subscriptionData: { data: { chatMessages } } }: ChatMessagesSubscriptionResultType) {
          const { action, id, chatMessage } = chatMessages
          if (action === 'ADD') {
            previousResult.chatMessages.edges.push({ node: chatMessage, __typename: 'ChatMessageTypeEdge' })
            ++previousResult.chatMessages.totalCount
          } else if (action === 'CHANGE') {
            const cm: any | undefined = previousResult.chatMessages.edges.find((e: ChatMessageTypeEdge) => e.node!.id === chatMessage!.id)
            if (cm) { cm.node = chatMessage }
          } else if (action === 'DELETE') {
            previousResult.chatMessages.edges = previousResult.chatMessages.edges.filter((e: ChatMessageTypeEdge) => e.node!.id !== id)
            --previousResult.chatMessages.totalCount
          }
          return previousResult
        }
      }
    }
  },
  async asyncData (ctx: Context) {
    const apolloClient = ctx.app.apolloProvider.defaultClient
    const member: MemberType = await apolloClient.query({
      query: require('~/gql/messenger/queries/member.graphql'),
      variables: { memberId: ctx.route.params.member_id }
    }).then(({ data }) => (data.member))
    return { member }
  },
  head (): MetaInfo {
    this.$emit('change-title', this.params.name)
    return { title: this.params.name }
  }
})
export default class MessengerChat extends Vue {
  $refs!: {
    mcr: MessengerCardResize
  }

  member!: MemberExtendedType
  readonly chatMessages!: ChatMessageType[]
  readonly chatMessagesVariables!: ChatMessagesQueryVariables
  readonly user!: UserType
  readonly params!: MemberParamsType

  pageInfo: PageInfo = { hasNextPage: true, hasPreviousPage: true }
  pageSize: number = 30
  totalCount: number = 0

  activated () {
    this.$nextTick(() => this.$refs.mcr.scrollDown(true))
  }

  /***
   * Отправляем мутацию о прочитанности сообщений
   * @param messagesIds
   */
  async changeMessageState (messagesIds: string[]) {
    if (messagesIds.length) {
      await this.$apollo.mutate({
        mutation: require('~/gql/messenger/mutations/change_message_state.graphql'),
        variables: { messageIds: messagesIds, state: 'read' }
      })
    }
  }

  async fetchModeChatMessages (): Promise<void> {
    if (!this.pageInfo.hasNextPage) { return }
    await this.$apollo.queries.chatMessages.fetchMore({
      variables: {
        chat: this.$toGlobalId('ChatType', Number(this.member.chat.id)),
        user: this.user.id,
        deleted: false,
        first: this.pageSize,
        after: this.$cursor(this.chatMessages.length - 1)
      },
      updateQuery (previousQueryResult: ChatMessagesQuery, { fetchMoreResult: { chatMessages } }: any) {
        return {
          chatMessages: {
            __typename: previousQueryResult.chatMessages.__typename,
            totalCount: chatMessages.totalCount,
            pageInfo: chatMessages.pageInfo,
            edges: [...previousQueryResult.chatMessages.edges, ...chatMessages.edges]
          }
        }
      }
    })
  }
}
</script>
