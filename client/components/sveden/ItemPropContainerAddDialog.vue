<template lang="pug">
mutation-form(
  :header="$t('sveden.addIPC')"
  :button-text="$t('add')"
  :mutation="require('~/gql/sveden/mutations/item_prop_mutations/add_item_prop_container.graphql')"
  :variables="{ input: { urlId, itemPropContainer: ipc } }"
  :update="update"
  mutation-name="addItemPropContainer"
  @done="$emit('close')"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="$emit('close')" icon)
      v-icon mdi-close
  template(#form)
    v-select(v-model="isTable" :label="$t('sveden.presentMode')" :items="items" @input="onIsTableChanged")
    v-text-field(v-model="ipc.header" :label="$t('sveden.ipcHeader')" clearable)
    validation-provider(v-if="isTable" v-slot="{ errors, valid }" :name="$t('sveden.rowIP')" rules="required")
      v-text-field(v-model="ipc.schema.itemProp" :success="valid" :label="$t('sveden.rowIP')" clearable)
    validation-provider(v-slot="{ errors, valid }" :name="$t('sveden.colCnt')" rules="min_value:1")
      v-text-field(v-model="colsCnt" type="number" :error-messages="errors" :success="valid" :label="$t('sveden.colCnt')" @input="onColsCntChanged")
    template(v-for="(item, i) in ipc.schema.childItemProps")
      v-text-field(v-model="item.header" :label="`${$t('sveden.header')} ${i+1}`" clearable)
      v-text-field(v-model="item.itemProp" :label="`${$t('sveden.itemprop')} ${i+1}`" clearable)
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '#app'
import type { Ref, ComputedRef } from '#app'
import { useI18n } from '~/composables'
import { ItemPropContainerInputType } from '~/types/graphql'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm },
  props: {
    urlId: { type: String, required: true },
    update: { type: Function, required: true }
  },
  setup () {
    const { t } = useI18n()
    const isTable: Ref<boolean> = ref<boolean>(true)
    const colsCnt: Ref<number> = ref<number>(1)
    const ipc: Ref<ItemPropContainerInputType> = ref<ItemPropContainerInputType>({
      header: '',
      schema: { itemProp: '', childItemProps: [{ header: '', itemProp: '' }] }
    })
    const items: ComputedRef<{text: string, value: boolean}[]> = computed(() => [
      { text: t('sveden.wMainIP') as string, value: true },
      { text: t('sveden.woMainIP') as string, value: false }
    ])
    const onIsTableChanged = () => {
      if (!isTable) {
        ipc.value.schema.itemProp = ''
      }
    }
    const onColsCntChanged = () => {
      const cip = ipc.value.schema.childItemProps
      if (cip.length < colsCnt.value) {
        cip.push(...Array(colsCnt.value - cip.length).fill({ header: '', itemProp: '' }))
      } else if (colsCnt.value > 0) {
        cip.length = colsCnt.value
      }
    }
    return {
      isTable,
      colsCnt,
      ipc,
      items,
      onIsTableChanged,
      onColsCntChanged
    }
  }
})
</script>
