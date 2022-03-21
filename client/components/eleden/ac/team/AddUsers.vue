<template lang="pug">
  v-menu(v-model="active" bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="t('addForm.header')"
        :button-text="t('addForm.buttonText')"
        :mutation="require('~/gql/eleden/mutations/core/upload_eleden_users.graphql')"
        :variables="{ file, groupsId: this.selectGroups.map((e) => Number(e.id)) }"
        :update="update"
        mutation-name="uploadUsers"
        errors-in-alert
        @close="file = null; selectGroups = []"
      )
        template(#activator="{ on }")
          v-list-item(v-on="on")
            v-list-item-icon
              v-icon mdi-file
            v-list-item-content {{ t('buttons.fromFile') }}
            v-list-item-action
              help-dialog(v-slot="{ on: onHelper }" :text="t('helpDialog.helpInstruction')" doc="help/add_users")
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ t('buttons.helpInstruction') }}
        template(#form)
          validation-provider(v-slot="{ errors, valid }" :name="t('form.file')" rules="required")
            v-file-input(
              v-model="file"
              :label="t('form.file')"
              :error-messages="errors"
              :success="valid"
              accept=".xlsx,.csv,.json"
              clearable
            )
          v-select(
            v-model="selectGroups"
            :items="groups"
            :label="t('form.groups')"
            item-text="name"
            multiple
            return-object
            clearable
          )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { GroupType } from '~/types/graphql'
import ErrorValidateDialog from '~/components/common/dialogs/ErrorValidateDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type Update = (store: DataProxy, result: any) => void

@Component<AddUsers>({
  components: { MutationModalForm, HelpDialog, ErrorValidateDialog },
  apollo: {
    groups: require('~/gql/core/queries/groups.graphql')
  }
})
export default class AddUsers extends Vue {
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update

  readonly groups!: GroupType[] | undefined

  active: boolean = false
  file: File | null = null
  selectGroups: GroupType[] = []

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.users.addMenu.${path}`, values) as string
  }
}
</script>
