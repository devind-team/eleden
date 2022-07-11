<template lang="pug">
mutation-form(
  :header="$t('sveden.changeSubsection')"
  :button-text="$t('save')"
  :mutation="require('~/gql/sveden/mutations/subsection_mutations/change_subsection.graphql')"
  :variables="{ input: { subsectionId: subsection.id, url: sectionAddress, header: sectionHeader } }"
  mutation-name="changeSubsection"
  @done="$emit('close')"
)
  template(#header="{ header }")
    span {{ header }}
    v-spacer
    v-btn(@click="$emit('close')" icon)
      v-icon mdi-close
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('sveden.subsectionAddress')"
      rules="required"
    )
      v-text-field(v-model="sectionAddress" :label="$t('sveden.subsectionAddress')" :success="valid" :error-messages="errors" )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('sveden.subsectionName')"
      rules="required"
    )
      v-text-field(v-model="sectionHeader" :label="$t('sveden.subsectionName')" :success="valid" :error-messages="errors" )
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '#app'
import type { Ref } from '#app'
import { SubsectionType } from '~/types/graphql'
import MutationForm from '~/components/common/forms/MutationForm.vue'

export default defineComponent({
  components: { MutationForm },
  props: {
    subsection: {
      type: Object as PropType<SubsectionType>,
      required: true
    }
  },
  setup (props) {
    const sectionAddress: Ref<string> = ref<string>(props.subsection.url)
    const sectionHeader: Ref<string> = ref<string>(props.subsection.header)
    return {
      sectionAddress,
      sectionHeader
    }
  }
})
</script>
