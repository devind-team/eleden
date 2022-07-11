<template lang="pug">
v-footer(padless dark)
  v-container
    v-row
      v-col(cols="12" md="9")
        .body-2 Email:&nbsp;
          strong {{ $getSettingValue('APP_EMAIL') }}
      v-col(cols="12" md="3")
        v-list(width="280" style="background: inherit;" dense)
          theme-color(v-slot="{ on }")
            v-list-item(v-on="on")
              v-list-item-icon
                v-icon mdi-theme-light-dark
              v-list-item-content
                v-list-item-title {{ $t('index.theme.change') }}
    v-row
      v-col(cols="12" md="9")
        .body-2.gray-text &copy; {{ $t('index.rights') }}. {{ new Date().getFullYear() }}&nbsp;
          strong #[a(href="https://devind.ru" style="text-decoration: none") {{ $t('index.support') }}.]
      v-col.text-right(cols="12" md="3" style="height: 88px")
        a(href="https://www.liveinternet.ru/click" style="display: block; width: 88px; height: 31px;" target="_blank")
          img(:src="counterSrc" alt="" width="88" height="31")
  v-btn(v-show="upVisible" @click="$vuetify.goTo(0)" size="small" fab fixed bottom right color="primary")
    v-icon mdi-chevron-up
</template>
<script lang="ts">
import { useScroll } from '@vueuse/core'
import type { Ref } from '#app'
import { defineComponent, ref, onMounted, watchEffect } from '#app'
import ThemeColor from '~/components/global/ThemeColor.vue'

export default defineComponent({
  components: { ThemeColor },
  setup () {
    const counterSrc: Ref<string | null> = ref<string | null>(null)
    const upVisible: Ref<boolean> = ref<boolean>(false)

    onMounted(() => {
      const { y } = useScroll(document, { throttle: 500 })
      watchEffect(() => {
        upVisible.value = y.value > 200
      })

      const s: number = screen.colorDepth ? screen.colorDepth : screen.pixelDepth
      counterSrc.value = 'https://counter.yadro.ru/hit?t11.6;r' + encodeURIComponent(document.referrer) +
      (typeof screen === 'undefined' ? '' : ';s' + screen.width + '*' + screen.height + '*' + s) +
      ';u' + encodeURIComponent(document.URL) + ';h' +
      encodeURIComponent(document.title.substring(0, 150)) + ';' + Math.random() as string
    })

    return { counterSrc, upVisible }
  }
})
</script>
