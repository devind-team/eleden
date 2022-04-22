<template lang="pug">
  div
    //новость в зависимости от типа блока: Новость или мероприятие
    slot(name="card")

</template>

<script>
export default {
  name: "RaaiNews"
}
</script>

<style scoped>

</style>
