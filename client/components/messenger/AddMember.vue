<template lang="pug">
apollo-mutation(
  v-slot="{ mutate, loading, error }"
  :mutation="require('~/gql/messenger/mutations/add_chat.graphql')"
  :variables="{ userIds: users.map(e => e.id), avatar: avatarFile, name }"
  @done="addChatDone"
  tag
)
  messenger-card-resize(:loading="loading" border-left tile outlined)
    template(#title) {{ $t('messenger.addChat.header') }}
      v-spacer
      v-tooltip(bottom)
        template(#activator="{ on }")
          v-btn(v-on="on" @click="state.view = 'default'" icon)
            v-icon mdi-close
        span Отмена
    template(#actions)
      v-btn(@click="state.view = 'default'" text) Отмена
      v-spacer
      v-btn(@click="mutate" :disabled="!valid" color="primary") Добавить
    v-alert(type="error" :value="!!error" dismissible) {{ error }}
    v-row.flex.align-center(v-if="users.filter(e => e.id !== user.id).length > 1")
      v-tooltip(bottom)
        template(#activator="{ on }")
          v-avatar.mx-2.bg-gray-200(v-on="on" @click="changeAvatar" style="cursor: pointer;")
            v-img(v-if="avatarSrc" :src="avatarSrc")
            v-icon(v-else) mdi-camera
        span Аватар группы
      v-text-field(v-model="name" :rules="[rules.required, rules.min]" label="Название группы" clearable)
    change-users-list(v-model="users")
</template>

<script lang="ts">
import { Vue, Component, InjectReactive } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { UserType, AddChatMutationPayload } from '~/types/graphql'
import { MessengerStateType } from '~/pages/messenger.vue'
import MessengerCardResize from '~/components/messenger/MessengerCardResize.vue'
import ChangeUsersList from '~/components/users/ChangeUsersList.vue'

export type AddChatMutationPayloadType = { data: { addChat: AddChatMutationPayload } }

@Component<AddMember>({
  components: { ChangeUsersList, MessengerCardResize },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    valid (): boolean {
      return Boolean((this.users.length === 1) || (this.users.length > 1 && this.name && this.name.length >= 3))
    }
  }
})
export default class AddMember extends Vue {
  @InjectReactive() state!: MessengerStateType

  user!: UserType
  valid!: boolean

  rules: any = {
    required: (value: string | null) => !!value || 'Поле обязательно для заполнения',
    min: (v: string | null) => (!!v && v.length >= 3) || 'Минимальная длина группы 3 символа'
  }

  name: string = ''
  avatarFile: File | null = null
  avatarSrc: string | ArrayBuffer | null = null
  users: UserType[] = []

  addChatDone ({ data: { addChat: { success, member } } }: AddChatMutationPayloadType) {
    if (success) {
      this.state.view = 'default'
      setTimeout(() => {
        this.$router.push(this.localePath({ name: 'messenger-member_id', params: { member_id: member!.id } }))
      }, 0)
    }
  }

  changeAvatar () {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/png, image/jpeg, image/bmp'
    fileInput.onchange = () => {
      if (fileInput.files![0]) {
        this.avatarFile = fileInput.files![0]
        const reader = new FileReader()
        reader.onloadend = () => { this.avatarSrc = reader.result }
        reader.readAsDataURL(this.avatarFile)
      }
    }
    fileInput.click()
  }
}
</script>
