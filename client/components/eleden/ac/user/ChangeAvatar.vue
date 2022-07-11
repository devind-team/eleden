<template lang="pug">
.d-flex.flex-column.align-center
  avatar-dialog(:item="user" size="200")
  mutation-modal-form(
    :mutation="require('~/gql/core/mutations/user/change_avatar.graphql')"
    :variables="{ userId: user.id, file }"
    :update="update"
    :header="String($t('ac.users.personalities.changeAvatar.chooseAvatar'))"
    :button-text="String($t('ac.users.personalities.changeAvatar.buttons.load'))"
    mutation-name="changeAvatar"
    i18n-path="ac.users.personalities.changeAvatar"
  )
    template(#activator="{ on }")
      v-btn(
        v-if="user.change"
        v-on="on"
        color="success"
      ).mt-3 {{ $t('ac.users.personalities.changeAvatar.buttons.changeAvatar') }}
    template(#form)
      ValidationProvider(
        :name="String($t('ac.users.personalities.changeAvatar.avatar'))"
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
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref } from '#app'
import { DataProxy } from 'apollo-cache'
import { ValidationObserver } from 'vee-validate'
import { UserType } from '~/types/graphql'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type UpdateAvatarType = (store: DataProxy, result: any) => void
type ChangeAvatarType = InstanceType<typeof ValidationObserver> | null

export default defineComponent({
  components: { MutationModalForm, AvatarDialog },
  props: {
    update: { required: true, type: Function as PropType<UpdateAvatarType> },
    user: { required: true, type: Object as PropType<UserType> }
  },
  setup () {
    const changeAvatar = ref<ChangeAvatarType>(null)
    const file = ref<File | null>(null)
    return { changeAvatar, file }
  }
})
</script>
