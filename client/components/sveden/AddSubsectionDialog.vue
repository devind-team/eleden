<template lang="pug">
mutation-form(
  :header="$t('sveden.addSubsection')"
  :button-text="$t('add')"
  :mutation="require('~/gql/sveden/mutations/subsection_mutations/add_subsection.graphql')"
  :variables="{ input: { url: newSectionAddress, header: newSectionHeader } }"
  :update="update"
  mutation-name="addSubsection"
  @done="onClose"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="onClose" icon)
      v-icon mdi-close
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('sveden.subsectionAddress')"
      rules="required"
    )
      v-text-field(v-model="newSectionAddress" :label="$t('sveden.subsectionAddress')" :success="valid" :error-messages="errors" )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('sveden.subsectionName')"
      rules="required"
    )
      v-text-field(v-model="newSectionHeader" :label="$t('sveden.subsectionName')" :success="valid" :error-messages="errors" )
</template>

<script lang="ts">
import { defineComponent, ref } from '#app'
import type { Ref } from '#app'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm },
  props: {
    update: {
      type: Function,
      required: true
    }
  },
  setup (_, { emit }) {
    const newSectionAddress: Ref<string> = ref<string>('')
    const newSectionHeader: Ref<string> = ref<string>('')
    const onClose = () => emit('close')
    return {
      newSectionAddress,
      newSectionHeader,
      onClose
    }
  }
})
</script>
