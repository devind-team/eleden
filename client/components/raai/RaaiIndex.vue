<template lang="pug">
  v-container
    v-carousel(height="700")
      v-carousel-item(v-for="(item,i) in items" :key="i" :src="item.src")
    v-row.justify-center
      v-col(cols="12" sm="4")
        v-card(flat)
          v-card-title.headline.justify-center Новости
          v-card-subtitle.py-0 Дата
          v-card-title.py-0 Заголовок новости
      v-col(cols="12" sm="4")
        v-card(flat)
          v-card-title.headline.justify-center Мероприятия
          v-card-subtitle.py-0 Дата
          v-card-title.py-0 Заголовок мероприятия
    pre Бонусы РАИИ
</template>

<script lang="ts">

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
  }
})
</script>

