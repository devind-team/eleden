<template lang="pug">
mutation-form(
  header="changecip"
  :button-text="$t('save')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/add_child_item_prop.graphql')"
  :variables="{ input: { itemPropId, header: cip.header, itemProp: cip.itemProp, showPosition: cip.showPosition } }"
  mutation-name="addChildItemProp"
  @done="$emit('close')"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="$emit('close')" icon)
      v-icon mdi-close
  template(#form)
    validation-provider(v-slot="{ errors, valid }" name="position" rules="min_value:0")
      v-text-field(v-model="cip.showPosition" type="number" :error-messages="errors" :success="valid" label="position"  clearable)
    v-text-field(v-model="cip.header" :label="$t('sveden.header')" clearable)
    v-text-field(v-model="cip.itemProp" :label="$t('sveden.itemprop')" clearable)
</template>

<script lang="ts">
import { defineComponent, ref } from '#app'
import type { Ref } from '#app'
import MutationForm from '~/components/common/forms/MutationForm.vue'

type AddItemPropInput = { itemProp: string, header: string, showPosition: number }

export default defineComponent({
  components: { MutationForm },
  props: {
    itemPropId: {
      type: String,
      required: true
    }
  },
  setup () {
    const cip: Ref<AddItemPropInput> = ref<AddItemPropInput>({
      itemProp: '',
      header: '',
      showPosition: 0
    })
    return {
      cip
    }
  }
})
</script>
