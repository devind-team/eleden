<template lang="pug">
  .d-flex.flex-column.align-center
    avatar-dialog(:item="user" size="200")
    v-dialog(v-model="active" width="600")
      template(#activator="{ on }")
        v-btn(v-if="user.change" v-on="on" color="success").mt-3 {{ t('buttons.changeAvatar') }}
      apollo-mutation(
        :mutation="require('~/gql/core/mutations/user/change_avatar.graphql')"
        :variables="{ userId: user.id, file }"
        :update="update"
        @done="changeAvatarDone")
        template(v-slot="{ mutate, error, loading }")
          ValidationObserver(v-slot="{ handleSubmit, invalid }" ref="changeAvatar")
            form(@submit.prevent="handleSubmit(mutate)")
              v-card
                v-card-title {{ t('chooseAvatar') }}
                  v-spacer
                  v-btn(@click="active = false" icon)
                    v-icon mdi-close
                v-card-text
                  ValidationProvider(
                    :name="t('avatar')"
                    rules="required"
                    v-slot="{ errors, valid }"
                    tag="div"
                    )
                    v-file-input(
                      v-model="file"
                      :label="t('avatar')"
                      :error-messages="errors"
                      :success="valid"
                      prepend-icon="mdi-camera"
                      show-size
                      )
                v-card-actions
                  v-spacer
                  v-btn(type="submit" :loading="loading" :disabled="invalid" color="primary") {{ t('buttons.load') }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { ValidationObserver } from 'vee-validate'
import { ChangeAvatarMutationPayload, ErrorFieldType, UserType } from '~/types/graphql'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

@Component<ChangeAvatar>({
  components: { AvatarDialog }
})
export default class ChangeAvatar extends Vue {
  file: File | null = null
  active: boolean = false

  @Prop() update!: (store: DataProxy, result: any) => void
  @Prop({ required: true, type: Object as PropType<UserType> }) user!: UserType

  $refs!: {
    changeAvatar: InstanceType<typeof ValidationObserver>
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.personalities.changeAvatar.${path}`, values) as string
  }

  changeAvatarDone ({ data: { changeAvatar: { success, errors } } }: { data: { changeAvatar: ChangeAvatarMutationPayload } }) {
    this.file = null
    if (success) {
      this.active = false
    } else {
      this.$refs.changeAvatar.setErrors(errors.reduce(
        (a: { [key: string]: string[] }, c: ErrorFieldType) => {
          return { ...a, [this.$t(`profile.${this.$snakeToCamel(c.field)}`) as string]: c.messages }
        }, {}))
    }
  }
}
</script>
