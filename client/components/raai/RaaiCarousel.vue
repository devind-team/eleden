<template lang="pug">
  v-carousel
    v-carousel-item(v-for="(item, i) in images" :key="i" :src="item.src" height="100%")
</template>

<script lang="ts">
export default defineComponent({

  setup () {
    const images = [
        { src: '/LogoCarousel.svg' }
    ]

    return { images }
  }
})
</script>

