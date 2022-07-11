<template lang="pug">
v-menu(v-model="active" bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    mutation-modal-form(
      :header="String($t('ac.users.addMenu.addForm.header'))"
      :button-text="String($t('ac.users.addMenu.addForm.buttonText'))"
      :mutation="require('~/gql/eleden/mutations/core/upload_eleden_users.graphql')"
      :variables="{ file, groupsId: selectGroups.map((e) => Number(e.id)) }"
      :update="update"
      mutation-name="uploadUsers"
      errors-in-alert
      @close="file = null; selectGroups = []"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-file
          v-list-item-content {{ $t('ac.users.addMenu.buttons.fromFile') }}
          v-list-item-action
            help-dialog(
              v-slot="{ on: onHelper }"
              :text="String($t('ac.users.addMenu.helpDialog.helpInstruction'))"
              doc="help/add_users"
            )
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip}")
                  v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                    v-icon mdi-help-circle-outline
                span {{ $t('ac.users.addMenu.buttons.helpInstruction') }}
      template(#form)
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.users.addMenu.form.file'))"
          rules="required"
        )
          v-file-input(
            v-model="file"
            :label="$t('ac.users.addMenu.form.file')"
            :error-messages="errors"
            :success="valid"
            accept=".xlsx,.csv,.json"
            clearable
          )
        v-select(
          v-model="selectGroups"
          :items="groups"
          :label="$t('ac.users.addMenu.form.groups')"
          item-text="name"
          multiple
          return-object
          clearable
        )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { DataProxy } from 'apollo-cache'
import { defineComponent, ref } from '#app'
import { GroupType, GroupsQuery, GroupsQueryVariables } from '~/types/graphql'
import { useCommonQuery } from '~/composables'
import groupsQuery from '~/gql/core/queries/groups.graphql'
import ErrorValidateDialog from '~/components/common/dialogs/ErrorValidateDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type UpdateType = (store: DataProxy, result: any) => void

export default defineComponent({
  components: { MutationModalForm, HelpDialog, ErrorValidateDialog },
  props: {
    update: { type: Function as PropType<UpdateType>, required: true }
  },
  setup () {
    const active = ref<boolean>(false)
    const file = ref<File | null>(null)
    const selectGroups = ref<GroupType[]>([])

    const { data: groups } = useCommonQuery<GroupsQuery, GroupsQueryVariables>({ document: groupsQuery })

    return { active, file, selectGroups, groups }
  }
})
</script>
