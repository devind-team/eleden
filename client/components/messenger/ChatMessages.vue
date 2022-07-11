<template lang="pug">
.messages(:style="cssProps")
  .messages-wrapper(v-for="(cms, date) in messages" :key="date")
    .messages-wrapper-timeline
      v-chip(small) {{ date === now ? 'Сегодня' : date }}
    .messages-wrapper-message(v-for="cm in cms" :key="cm.id")
      .messages-wrapper-message-avatar(v-if="$vuetify.breakpoint.mdAndUp")
        v-avatar(size="45")
          v-img(v-if="cm.message.user.avatar" :src="`/${cm.message.user.avatar}`")
          v-icon(v-else) mdi-camera
      .messages-wrapper-message-text
        .message-text-info
          nuxt-link.message-text-info(:to="localePath({ name: 'users-user_id', params: { user_id: cm.message.user.id } })")
            | {{ `${cm.message.user.firstName} ${cm.message.user.lastName}` }}
          span.caption &nbsp;&mdash; {{ $filters.timeHM(cm.createdAt) }}
        .message-text
          .text--primary(v-html="cm.message.text")
          .message-text-forwarded(v-if="cm.message.forwarded.length")
            pre {{ cm.message.forwarded }}
          .message-text-attachments(v-if="cm.message.attachedFiles.length")
            pre {{ cm.message.attachedFiles }}
        .message-text-state(v-if="user.id === cm.message.user.id")
          v-icon(
            :color="!!cm.read ? 'primary' : undefined"
          ) mdi-{{ !cm.delivered && !cm.read ? 'check' : 'check-all' }}
  v-alert(v-if="items.length === 0 && !loading" type="info") В беседе еще нет сообщений
  v-progress-linear(v-if="loading" color="primary" indeterminate)
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import moment from 'moment'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { ChatMessageType, UserType } from '~/types/graphql'

@Component<ChatMessages>({
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    messages () {
      return this.items.reduce((a: any, c: ChatMessageType) => {
        const k: string = moment(c.createdAt).format('DD.MM.YYYY')
        a[k] = [...(a[k] || []), c]
        return a
      }, {})
    },
    now (): string {
      return moment().format('DD.MM.YYYY')
    },
    cssProps (): any {
      return {
        '--background-color': `rgba(${this.$vuetify.theme.dark ? '255, 255, 255' : '0, 0, 0'}, 0.05)`
      }
    }
  }
})
export default class ChatMessages extends Vue {
  @Prop({ required: true, type: Array as PropType<ChatMessageType[]> }) items!: ChatMessageType[]
  @Prop({ required: false, type: Boolean, default: false }) loading!: boolean

  readonly now!: string
  readonly user!: UserType
}
</script>
<style lang="sass">
.messages
  &-wrapper
    &-timeline
      top: -5px
      position: sticky
      margin: 10px 0
      width: 100%
      text-align: center
      span.caption
        color: var(--v-primary-base)
    &-message
      margin: 8px 0
      padding: 5px
      border-radius: 3px
      display: flex
      flex-direction: row
      &:hover
        background-color: var(--background-color)
      &-avatar
        width: 50px
        margin: 3px 8px 3px 3px
      &-text
        text-align: justify
        width: 100%
        position: relative

        .message-text-info
          margin: 3px 0
        //.message-text
        //  &-forwarded
        //  &-attachments
        .message-text-state
          position: absolute
          bottom: 0
          right: 0

  .v-progress-circular
    text-align: center
</style>
