<template lang="pug">
v-container
  v-card.text-center.py-16(flat)
      v-row.justify-center
        v-col(cols="12" md="8")
          v-card-title.justify-center.display-1 Российская ассоциация искусственного интеллекта (РАИИ)
          v-card-text.headline Общероссийская общественная организация «Российская ассоциация искусственного интеллекта» является общественным объединением, основанным на членстве лиц, профессиональная деятельность которых связана с теоретическими и прикладными исследованиями и разработками в области искусственного интеллекта.
  v-card.py-16(flat)
    v-row.justify-center
      v-card-title.display-1 Основные цели РАИИ
    v-item-group
      v-row.justify-center
        v-col.text-center(cols="12" sm="4" v-for="(item, i) in goals" :key="i")
          v-icon.indigo--text.text--accent-4.outlined(size="100" color="indigo accent-4" center="true") mdi-{{ item.icon }}
          v-card-text.headline {{ item.text }}
</template>

<script lang="ts">
export default defineComponent({
  setup () {
    const goals: { icon: string, text: string }[] = [
      {
        icon: 'human-capacity-decrease',
        text: 'Объединение и развитие плодотворного сотрудничества отечественных ученых и специалистов.'
      },
      {
        icon: 'account-voice',
        text: 'Анализ состояния, обсуждение проблем и путей решения, систематизация результатов.'
      },
      {
        icon: 'chart-bell-curve-cumulative',
        text: 'Мониторинг тенденций и определение перспектив развития теории, прикладных исследований и разработок.'
      },
      {
        icon: 'handshake',
        text: 'Развитие международного сотрудничества в области искусственного интеллекта.'
      },
      {
        icon: 'book-account',
        text: 'Популяризация знаний в области искусственного интеллекта.'
      },
      {
        icon: 'professional-hexagon',
        text: 'Содействие в профессиональной деятельности членов РАИИ.'
      },
      {
        icon: 'book-arrow-up',
        text: 'Поддержка и продвижение отечественных теоретических и прикладных исследований и разработок.'
      },
      {
        icon: 'feature-search',
        text: 'Независимая профессиональная экспертиза проектов и результатов теоретических и прикладных исследований и разработок.'
      },
      {
        icon: 'chat-question',
        text: 'Консультативная и экспертная поддержка, участие в разработке отечественных и международных нормативных документов по тематике искусственного интеллекта (по запросам или проактивно) для органов государственной власти, бизнеса, других институтов и организаций.'
      }
    ]
    return { goals }
  }
})
</script>
