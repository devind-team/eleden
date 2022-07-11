<template lang="pug">
v-carousel(height="100%")
  v-carousel-item(v-for="item in images" :key="item.src" :src="item.src")
</template>

<script lang="ts">
export default defineComponent({
  setup () {
    const images: { src: string }[] = [
      { src: '/LogoCarousel.svg' }
    ]
    return { images }
  }
})
</script>
