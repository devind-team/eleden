<template lang="pug">
  v-container
    raai-carousel
    page-news
    raai-goals
</template>

<script lang="ts">
import RaaiCarousel from "~/components/raai/RaaiCarousel.vue";
import PageNews from "~/components/pages/index/PageNews.vue";
import RaaiGoals from "~/components/raai/RaaiGoals.vue";

export default defineComponent({
  components: {RaaiCarousel, RaaiGoals, PageNews},

})
</script>

