<template lang="pug">
v-container
  raai-carousel
  slot
  raai-goals
</template>

<script lang="ts">
import RaaiCarousel from '~/components/raai/RaaiCarousel.vue'
import RaaiGoals from '~/components/raai/RaaiGoals.vue'

export default defineComponent({
  components: { RaaiCarousel, RaaiGoals }
})
</script>
