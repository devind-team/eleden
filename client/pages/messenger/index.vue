<template lang="pug">
v-card.content-center(style="border-left: none" tile outlined)
  v-sheet.text-center
    v-icon.mb-4(size="100") mdi-chat-plus-outline
    div Выберите чат или#{' '}
      a(@click.prevent="state.view = 'add'" :href="localePath({ name: 'messenger' })") создайте новый
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from 'vue-property-decorator'
import MessengerCardResize from '~/components/messenger/MessengerCardResize.vue'
import { MessengerStateType } from '~/pages/messenger.vue'

@Component<MessengerIndex>({
  components: { MessengerCardResize }
})
export default class MessengerIndex extends Vue {
  @InjectReactive() state!: MessengerStateType

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`messenger.addChat.${path}`, values) as string
  }
}
</script>
<style lang="sass">
.content-center
  width: 100%
  height: 100%
  display: flex
  align-items: center
  align-content: center
  justify-content: center
  overflow: auto
</style>
