<template lang="pug">
v-list-item(:to="localePath({ name: 'messenger-member_id', params: { member_id: member.id } })")
  v-list-item-avatar.bg-gray-200
    v-img(v-if="params.avatar" :src="`/${params.avatar}`")
    v-icon(v-else) mdi-{{ member.chat.users.length === 1 ? 'bookmark-outline' : 'camera' }}
  v-list-item-content
    v-list-item-title {{ params.name }}
    v-list-item-subtitle.flex(v-if="member.chat.lastMessage")
      div(v-if="member.chat.lastMessage.user.id !== user.id")
        | {{ member.chat.lastMessage.user.firstName }} {{ member.chat.lastMessage.user.lastName }} &mdash;&nbsp;
      .caption {{ member.chat.lastMessage.text }}
  v-list-item-action
    v-list-item-action-text {{ $filters.timeHM(member.updatedAt) }}
  apollo-mutation(
    v-slot="{ mutate, loading }"
    :mutation="require('~/gql/messenger/mutations/change_member_property.graphql')"
    :variables="{ memberId: member.id, field: 'favorite', value: !member.favorite }"
    tag
  )
    v-list-item-action
      v-btn(@click.prevent="mutate" icon :color="member.favorite ? 'primary' : undefined" )
        v-icon mdi-{{ member.favorite ? 'star' : 'star-outline' }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { ChatType, MemberType, MessageType, UserType } from '~/types/graphql'

export type MemberExtendedType = MemberType & { chat: ChatType & { lastMessage: MessageType & { user: UserType } } }
export type MemberParamsType = { name: string, avatar?: string | null }

export function getMemberParams (member: MemberExtendedType, user: UserType): MemberParamsType {
  if (member.chat.users.length === 2) {
    const u: UserType | undefined = member.chat.users.find((e: UserType) => e.id !== user.id)
    if (u !== undefined) {
      return { name: `${u.firstName} ${u.lastName}`, avatar: u.avatar }
    }
  }
  return { name: member.chat.name!, avatar: member.chat.avatar }
}

@Component<Member>({
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    params (): MemberParamsType {
      return getMemberParams(this.member, this.user)
    }
  }
})
export default class Member extends Vue {
  @Prop({ required: true, type: Object as PropType<MemberType> }) readonly member!: MemberExtendedType

  readonly user!: UserType
  readonly params!: MemberParamsType
}
</script>
