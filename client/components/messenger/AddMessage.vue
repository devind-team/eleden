<template lang="pug">
apollo-mutation(
  v-slot="{ mutate, loading }"
  :mutation="require('~/gql/messenger/mutations/add_message.graphql')"
  :variables="{ chatId, text, files }"
  @done="addMessageDone"
  tag
)
  validation-observer.row(v-slot="{ handleSubmit, invalid }" ref="messageForm" tag="div")
    validation-provider.col(v-slot="{ errors, valid }" :name="t('text')" rules="required" tag="div")
      v-textarea(
        v-model="text"
        @keydown.prevent.ctrl.enter="handleSubmit(mutate)"
        :label="t('text')"
        :error-messages="errors"
        :success="valid"
        rows="1"
        auto-grow outlined hide-details
      )
        template(#append-outer)
          v-btn(@click="handleSubmit(mutate)" :disabled="invalid" :loading="loading" icon)
            v-icon(color="success") mdi-send
        //template(#prepend)
        //  v-btn(@click="attachFiles" icon)
        //    v-icon mdi-paperclip
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ValidationObserver } from 'vee-validate'
import { AddMessageMutationPayload } from '~/types/graphql'

export type AddMessageMutationType = { data: { addMessage: AddMessageMutationPayload } }

@Component<AddMessage>({})
export default class AddMessage extends Vue {
  @Prop({ required: true, type: String }) chatId!: string
  $refs!: {
    messageForm: InstanceType<typeof ValidationObserver>
  }

  text: string = ''
  files: File[] = []

  addMessageDone ({ data: { addMessage: { success } } }: AddMessageMutationType): void {
    if (success) {
      this.text = ''
      this.files = []
      this.$refs.messageForm.reset()
      this.$emit('add')
    }
  }

  attachFiles () {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.onchange = () => {
      if (fileInput.files !== null) {
        this.files.push(...Array.from(fileInput!.files))
      }
    }
    fileInput.click()
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`messenger.${path}`, values) as string
  }
}
</script>
