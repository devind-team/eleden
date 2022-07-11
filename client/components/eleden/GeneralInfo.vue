<template lang="pug">
v-card(outlined)
  v-card-title Занятия (ВТ, ЭЭС)
    v-spacer
    nuxt-link.body-2.text-decoration-none(:to="localePath({ name: 'eleden-schedule' })") Расписание
  v-card-subtitle Идет 12 неделя (контрольная)
  v-tabs(grow vertical center-active)
    v-tab Пн
    v-tab Вт
    v-tab Ср
    v-tab Чт
    v-tab Пт
    v-tab-item
      v-list(tile)
        v-list-item(@click="" two-line)
          v-list-item-title Программирование. ИВТ-1 (лб)
            v-list-item-subtitle 1 пара с 8.30 до 10.30
        v-list-item(@click="" two-line)
          v-list-item-title Программирование. ИВТ-2 (лб)
            v-list-item-subtitle 2 пара с 10.00 до 11.45
        v-list-item(@click="" two-line)
          v-list-item-title Программирование. ИВТ-3 (лб)
            v-list-item-subtitle 3 пара с 12.00 до 13.30
    v-tab-item
      v-list(tile)
        v-list-item(@click="" two-line)
          v-list-item-title Программирование. ИВТ-1, ИВТ-2, ИВТ-3 (лк)
            v-list-item-subtitle 2 пара с 10.00 до 11.45
        v-list-item(@click="" two-line)
          v-list-item-title Информационные технологоии. ЭС-20 (лб)
            v-list-item-subtitle 3 пара с 12.00 до 13.30
    v-tab-item(v-for="i in 3" :key="i")
      v-card-text
        v-alert(type="info") Занятий нет
  v-card-actions
    v-btn(@click="" color="info") Календарный график
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component<GeneralInfo>({})
export default class GeneralInfo extends Vue {}
</script>
