<template lang="pug">
  .d-flex.flex-column.align-center
    avatar-dialog(:item="user" size="200")
    v-dialog(v-model="active" width="600")
      template(#activator="{ on }")
        v-btn(
          v-if="user.change"
          v-on="on"
          color="success"
        ).mt-3 {{ $t('ac.users.personalities.changeAvatar.buttons.changeAvatar') }}
      apollo-mutation(
        :mutation="require('~/gql/core/mutations/user/change_avatar.graphql')"
        :variables="{ userId: user.id, file }"
        :update="update"
        @done="changeAvatarDone")
        template(v-slot="{ mutate, error, loading }")
          ValidationObserver(v-slot="{ handleSubmit, invalid }" ref="changeAvatar")
            form(@submit.prevent="handleSubmit(mutate)")
              v-card
                v-card-title {{ $t('ac.users.personalities.changeAvatar.chooseAvatar') }}
                  v-spacer
                  v-btn(@click="active = false" icon)
                    v-icon mdi-close
                v-card-text
                  ValidationProvider(
                    :name="$t('ac.users.personalities.changeAvatar.avatar')"
                    rules="required"
                    v-slot="{ errors, valid }"
                    tag="div"
                    )
                    v-file-input(
                      v-model="file"
                      :label="$t('ac.users.personalities.changeAvatar.avatar')"
                      :error-messages="errors"
                      :success="valid"
                      prepend-icon="mdi-camera"
                      show-size
                      )
                v-card-actions
                  v-spacer
                  v-btn(
                    type="submit"
                    :loading="loading"
                    :disabled="invalid"
                    color="primary"
                  ) {{ $t('ac.users.personalities.changeAvatar.buttons.load') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataProxy } from 'apollo-cache'
import { ValidationObserver } from 'vee-validate'
import { camelCase } from 'scule'
import { ChangeAvatarMutationPayload, ErrorFieldType, UserType } from '~/types/graphql'
import { useI18n } from '~/composables'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

type UpdateAvatarType = (store: DataProxy, result: any) => void
type ChangeAvatarType = InstanceType<typeof ValidationObserver> | null

export default defineComponent({
  components: { AvatarDialog },
  props: {
    update: { required: true, type: Function as PropType<UpdateAvatarType> },
    user: { required: true, type: Object as PropType<UserType> }
  },
  setup () {
    const { t } = useI18n()

    const changeAvatar = ref<ChangeAvatarType>(null)
    const file = ref<File | null>(null)
    const active = ref<boolean>(false)

    const changeAvatarDone =
      ({ data: { changeAvatar: { success, errors } } }: { data: { changeAvatar: ChangeAvatarMutationPayload } }) => {
        file.value = null
        if (success) {
          active.value = false
        } else {
          changeAvatar.value.setErrors(errors.reduce(
            (a: { [key: string]: string[] }, c: ErrorFieldType) => {
              return { ...a, [t(`profile.${camelCase(c.field)}`) as string]: c.messages }
            }, {}))
        }
      }

    return { file, active, changeAvatarDone }
  }
})
</script>
