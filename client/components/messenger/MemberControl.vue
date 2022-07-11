<template lang="pug">
v-menu(v-model="active")
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    apollo-mutation(
      v-slot="{ mutate, loading }"
      :mutation="require('~/gql/messenger/mutations/delete_member.graphql')"
      :variables="{ memberId: member.id }"
      @done="deleteMemberDone"
      tag)
      v-list-item(@click="mutate")
        v-list-item-icon
          v-icon mdi-delete
        v-list-item-content
          v-list-item-title Удалить
        v-list-item-action(v-if="loading")
          v-progress-circular(color="primary" indeterminate)
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { DeleteMemberMutationPayload } from '~/types/graphql'
import { MemberExtendedType } from '~/components/messenger/Member.vue'

@Component<MemberControl>({})
export default class MemberControl extends Vue {
  @Prop({ required: true, type: Object as PropType<MemberExtendedType> }) member!: MemberExtendedType

  active: boolean = false

  deleteMemberDone ({ data: { deleteMember: { success } } }: { data: { deleteMember: DeleteMemberMutationPayload } }) {
    if (success) {
      this.$router.push(this.localePath({ name: 'messenger' }))
    }
  }
}
</script>
