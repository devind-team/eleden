<template lang="pug">
mutation-form(
  :header="$t('sveden.changeRow')"
  :button-text="$t('save')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/change_row.graphql')"
  :variables="{ input: { itemPropContainerId, index, values: fieldsArr } }"
  mutation-name="changeRow"
  @done="onDone"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="onClose" icon)
      v-icon mdi-close
  template(#form)
    template(v-for="field in fields")
      v-textarea(v-model="field.value" :label="field.header" auto-grow clearable)
  template(#actions="{ invalid, loading, buttonText }")
    v-spacer
    v-btn(:disabled="invalid" :loading="loading" @click="() => fieldsArr=fields.map(x=>x.value)" type="submit" color="primary") {{ buttonText }}
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from '#app'
import type { Ref } from '#app'
import { PropType } from 'vue'
import MutationForm from '~/components/common/forms/MutationForm.vue'

interface TableRowEditType {
  header: string,
  value: string
}

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
    fields: {
      type: Array as PropType<TableRowEditType[]>,
      required: true
    }
  },
  setup (_, { emit }: SetupContext) {
    const fieldsArr: Ref<string[]> = ref<string[]>(null)
    const onClose = (): void => emit('close')
    const onDone = (v: any): void => {
      onClose()
      fieldsArr.value = null
      emit('done', v)
    }
    return {
      fieldsArr,
      onClose,
      onDone
    }
  }
})
</script>
