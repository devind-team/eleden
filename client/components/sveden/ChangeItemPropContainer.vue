<template lang="pug">
mutation-form(
  :header="$t('sveden.changeIPC')"
  :button-text="$t('change')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/change_item_prop_container.graphql')"
  :variables="{ input: { itemPropContainerId: ipc.id, header: ipc.header, isGenerated: ipc.isGenerated, itemProp: ipc.schema.itemProp } }"
  mutation-name="changeItemPropContainer"
  @done="onClose"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="onClose" icon)
      v-icon mdi-close
  template(#form)
    v-text-field(v-model="ipc.header" :label="$t('sveden.ipcHeader')" clearable)
    v-text-field(v-model="ipc.schema.itemProp" :label="$t('sveden.rowIP')" clearable)
</template>

<script lang="ts">
import type { Ref } from '#app'
import { defineComponent, ref, PropType } from '#app'
import MutationForm from '~/components/common/forms/MutationForm.vue'
import { ItemPropContainerType } from '~/types/graphql'

export default defineComponent({
  components: { MutationForm },
  props: {
    itemPropContainer: {
      type: Object as PropType<ItemPropContainerType>,
      required: true
    }
  },
  setup (props, { emit }) {
    const onClose = () => emit('close')
    const ipc: Ref<ItemPropContainerType> = ref({ ...props.itemPropContainer })
    return { ipc, onClose }
  }
})
</script>
