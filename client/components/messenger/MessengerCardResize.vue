<template lang="pug">
.v-dialog--scrollable(style="height: calc(100vh - 145px)")
  v-card(v-bind="$attrs" :style="`border-left: ${borderLeft ? undefined : 'none'}`")
    v-card-title
      slot(name="title")
    v-divider
    v-card-text(v-stream:scroll="scrollStream$" ref="area")
      slot
    v-divider
    v-card-actions
      slot(name="actions")
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator'
import { Subject } from 'rxjs'
import { debounceTime, pluck, tap } from 'rxjs/operators'

export type ScrollResizeType = {
  height: number
  scrollHeight: number
  scrollTop: number
  scrollBottom: number
}

@Component<MessengerCardResize>({
  domStreams: ['scrollStream$'],
  subscriptions () {
    const scroll$ = this.scrollStream$.pipe(
      pluck('event', 'target'),
      debounceTime(500),
      tap((e: any) => {
        const scrollBottom: number = e.scrollHeight - (e.offsetHeight + e.scrollTop)
        this.canScrollDown = scrollBottom === 0
        this.$emit('scroll', {
          height: e.offsetHeight,
          scrollHeight: e.scrollHeight,
          scrollTop: e.scrollTop,
          scrollBottom
        } as ScrollResizeType)
      })
    )
    return { scroll$ }
  }
})
export default class MessengerCardResize extends Vue {
  @Ref() readonly area!: HTMLElement
  @Prop({ required: false, type: Boolean, default: false }) readonly borderLeft!: boolean
  scrollStream$: Subject<any> = new Subject<any>()

  canScrollDown: boolean = true

  scrollDown (forceDown: boolean = false): void {
    if (forceDown || this.canScrollDown) {
      this.area.scrollTop = this.area.scrollHeight
    }
  }
}
</script>
