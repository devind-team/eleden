<template lang="pug">
mutation-form(
  header="changecip"
  :button-text="$t('save')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/change_child_item_prop.graphql')"
  :variables="{ input: { childItemPropId: cip.id, header: cip.header, itemProp: cip.itemProp, showPosition: cip.showPosition } }"
  mutation-name="changeChildItemProp"
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
    v-text-field(v-model="cip.header" :label="`${$t('sveden.header')}`" clearable)
    v-text-field(v-model="cip.itemProp" :label="`${$t('sveden.itemprop')}`" clearable)
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '#app'
import type { Ref } from '#app'
import { ChildItemPropType } from '~/types/graphql'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm },
  props: {
    childItemProp: {
      type: Object as PropType<ChildItemPropType>,
      required: true
    }
  },
  setup (props) {
    const cip: Ref<ChildItemPropType> = ref<ChildItemPropType>({ ...props.childItemProp })
    return {
      cip
    }
  }
})
</script>
