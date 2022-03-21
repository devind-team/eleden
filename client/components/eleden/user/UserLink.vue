<template lang="pug">
  v-tooltip(bottom)
    template(#activator="{ on }")
      v-chip(v-if="chip" v-on="on" :class="linkClass" :to="getUserPath(user)" small) {{ getUserName(user) }}
      nuxt-link(v-else :class="linkClass" :to="getUserPath(user)") {{ getUserName(user) }}
    span {{ t('goToUser') }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { UserType } from '~/types/graphql'

@Component<UserLink>({})
export default class UserLink extends Vue {
  @Prop({ type: Object, required: true }) user!: UserType
  @Prop({ type: Boolean, default: false }) chip!: boolean
  @Prop({ type: Boolean, default: false }) full!: boolean
  @Prop({ type: Boolean, default: true }) showSirName!: boolean
  @Prop({ type: [Array, Object, String], default: '' }) linkClass!: object[] | object | string

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`user.userChip.${path}`, values) as string
  }

  /**
   * Получение имени пользователя
   * @param user
   * @return
   */
  getUserName (user: UserType): string {
    return this.full ? this.$getUserFullName(user, this.showSirName) : this.$getUserName(user, this.showSirName)
  }

  /**
   * Получение пути к пользователю
   * @param user
   * @return
   */
  getUserPath (user: UserType): string {
    return this.localePath({ name: 'eleden-ac-users-user_id-personalities', params: { user_id: user.id } })
  }
}
</script>
