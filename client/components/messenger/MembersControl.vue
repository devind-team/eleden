<template lang="pug">
.flex.align-center
  v-text-field(
    v-stream:input="searchStream$"
    :label="$t('search')"
    prepend-inner-icon="mdi-magnify"
    clearable
    dense
    hide-details
  )
  v-tooltip(bottom)
    template(#activator="{ on }")
      v-btn(v-on="on" @click="state.view = 'add'" icon)
        v-icon mdi-square-edit-outline
    span {{ t('addChat.header') }}
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from 'vue-property-decorator'
import { Subject, Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged, pluck, tap } from 'rxjs/operators'
import { MessengerStateType } from '~/pages/messenger.vue'

@Component<MembersControl>({
  domStreams: ['searchStream$'],
  subscriptions () {
    const search$: Observable<string> = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      distinctUntilChanged(),
      tap((search) => { this.state.search = search })
    )
    return { search$ }
  }
})
export default class MembersControl extends Vue {
  @InjectReactive() state!: MessengerStateType
  searchStream$: Subject<any> = new Subject<any>()

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
