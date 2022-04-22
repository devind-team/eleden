<template lang="pug">
  v-container
    v-carousel(height="700")
      v-carousel-item(v-for="(item,i) in items" :key="i" :src="item.src")
    v-row.justify-center
      v-col(cols="12" sm="4")
        v-card(flat)
          v-card-title.headline Новости
          //выводится новость в зависимости от типа блока
          raai-news
            v-card-subtitle.py-0(slot="card") Дата
            v-card-title.py-0(slot="card") Заголовок новости
      v-col(cols="12" sm="4")
        v-card(flat)
          v-card-title.headline Мероприятия
          //выводится новость в зависимости от типа блока
          raai-news
            v-card-subtitle.py-0(slot="card") Дата
            v-card-title.py-0(slot="card") Заголовок мероприятия
    raai-goals
    pre Бонусы РАИИ
</template>

<script lang="ts">
import RaaiNews from './RaaiNews'
import RaaiGoals from './RaaiGoals'

export default defineComponent({
  data () {
    return {
      items: [
        { src: '/LogoCarousel.svg' },
        { src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg' },
        { src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg' },
        { src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg' },
        { src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg' }
      ]
    }
  },
  components: {
    RaaiNews, RaaiGoals
  }
})
</script>

