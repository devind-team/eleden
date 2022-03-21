<template lang="pug">
  div
    user-link(v-if="!!user" :user="user")
    template(v-else)
      v-menu(v-if="canChange" v-model="active" bottom)
        template(#activator="{ on }")
          v-btn(v-on="on" :loading="loading" text color="primary") {{ t('confirm') }}
        v-card(style="width: 400px")
          v-card-text {{ t('confirmQuestion') }}
          v-card-actions
            v-btn(@click="confirm" color="primary") {{ t('yes') }}
            v-spacer
            v-btn(@click="active = false" color="warning") {{ t('no') }}
      .font-italic(v-else) {{ t('notConfirmed') }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { UserType } from '~/types/graphql'
import UserLink from '~/components/eleden/user/UserLink.vue'

@Component<ConfirmedByUser>({ components: { UserLink } })
export default class ConfirmedByUser extends Vue {
  @Prop({ default: null }) readonly user!: UserType | null
  @Prop({ default: false }) readonly canChange!: boolean
  @Prop({ default: false }) readonly loading!: boolean

  active: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.portfolio.confirmation.${path}`, values) as string
  }

  /**
   * Подтвердить
   */
  confirm () {
    this.$emit('confirm')
    this.active = false
  }
}
</script>
