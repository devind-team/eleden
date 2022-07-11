<template lang="pug">
messenger-card-resize(:loading="loading" @scroll="scrollMembers" border-left tile outlined)
  template(#title)
    members-control
  template(#actions)
    .caption Показано диалогов {{ members.length }} из {{ totalCount }}
  v-list(v-if="members.length" dense)
    member(v-for="member in members" :key="member.id" :member="member")
  v-alert(v-else-if="!loading" type="info" dense) {{ state.search ? 'Поиск не дал результатов' : 'У Вас еще нет сообщений' }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, InjectReactive, Prop } from 'vue-property-decorator'
import { MemberType } from '~/types/graphql'
import MessengerCardResize, { ScrollResizeType } from '~/components/messenger/MessengerCardResize.vue'
import Member from '~/components/messenger/Member.vue'
import MembersControl from '~/components/messenger/MembersControl.vue'
import { MessengerStateType } from '~/pages/messenger.vue'

@Component<Members>({
  components: { MessengerCardResize, MembersControl, Member }
})
export default class Members extends Vue {
  @InjectReactive() state!: MessengerStateType

  @Prop({ required: false, default: false, type: Boolean }) loading!: boolean
  @Prop({ required: true, type: Array as PropType<MemberType[]> }) members!: MemberType[]
  @Prop({ required: true, type: Number }) totalCount!: number
  @Prop({ required: true, type: Function }) fetchMoreMembers!: () => Promise<void>

  async scrollMembers (scrollEvent: ScrollResizeType) {
    if (scrollEvent.scrollBottom < scrollEvent.scrollHeight * 0.25) {
      await this.fetchMoreMembers()
    }
  }
}
</script>
