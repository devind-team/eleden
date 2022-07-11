<template lang="pug">
mutation-form(
  :header="$t('sveden.addRow')"
  :button-text="$t('add')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/add_row.graphql')"
  :variables="{ input: { itemPropContainerId, index, values } }"
  mutation-name="addRow"
  @done="onDone"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="onClose" icon)
      v-icon mdi-close
  template(#form)
    template(v-for="(header, i) in headers")
      v-textarea(v-model="values[i]" :label="header" auto-grow clearable)
  template(#actions="{ invalid, loading, buttonText }")
    v-spacer
    v-btn(:disabled="invalid" :loading="loading" type="submit" color="primary") {{ buttonText }}
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from '#app'
import type { Ref } from '#app'
import { PropType } from 'vue'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm },
  props: {
    itemPropContainerId: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    headers: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  setup (props, { emit }: SetupContext) {
    const values: Ref<string[]> = ref<string[]>(Array(props.headers.length).fill(''))
    const onClose = (): void => emit('close')
    const onDone = (v: any): void => {
      onClose()
      emit('done', v)
    }
    return {
      values,
      onClose,
      onDone
    }
  }
})
</script>
