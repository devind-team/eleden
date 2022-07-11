<template lang="pug">
v-container
  v-dialog(:value="!!dialogState" width="500" persistent scrollable)
    item-prop-container-add-dialog(
      v-if="dialogState === DialogState.TADD"
      :url-id="currentSubsection.id"
      :update="onTableAdded"
      @close="onDialogClosed"
      @done="onTableAdded"
    )
    add-subsection-dialog(
      v-else-if="dialogState === DialogState.SSADD"
      :update="onAddSubsection"
      @close="onDialogClosed"
    )
    change-subsection-dialog(
      v-else-if="dialogState === DialogState.SSEDIT"
      :subsection="currentSubsection"
      @close="onDialogClosed"
    )
    change-child-item-prop-dialog(
      v-else-if="dialogState === DialogState.CIPEDIT"
      :child-item-prop="currentChildItemProp"
      @close="onDialogClosed"
    )
    add-child-item-prop-dialog(
      v-else-if="dialogState === DialogState.CIPADD"
      :item-prop-id ="currentIPC.schema.id"
      @close="onDialogClosed"
    )
    change-item-prop-container(
        v-else-if="dialogState === DialogState.IPCEDIT"
        :item-prop-container="currentIPC"
        @close="onDialogClosed"
    )
  v-expansion-panels(multiple)
    v-expansion-panel(v-for="subsection in schema" :key="subsection.id")
      v-expansion-panel-header {{ subsection.header }}
      v-expansion-panel-content
        v-row
          v-col
            v-card
              v-card-title {{$t('sveden.subsectionParameters')}}
              v-card-text
                v-menu(
                  v-if="hasPerm(['sveden.delete_subsection', 'sveden.change_subsection', 'sveden.add_itempropcontainer'], true)"
                )
                  template(#activator="{ on }")
                    v-btn(v-on="on" absolute top right icon)
                      v-icon mdi-dots-horizontal
                  v-list
                    v-list-item(v-if="hasPerm('sveden.change_subsection')" @click="onSubsectionEditClicked(subsection)")
                      v-list-item-icon
                        v-icon mdi-pencil
                      v-list-item-content {{$t('edit')}}
                    apollo-mutation(
                        v-if="hasPerm('sveden.delete_subsection')"
                        :mutation="require('~/gql/sveden/mutations/subsection_mutations/delete_subsection.graphql')"
                        :variables="{ input: { subsectionId: subsection.id } }"
                        :update="(st, res) => onSubsectionDeleted(st, res, subsection.id)"
                      )
                        template(v-slot="{ mutate }")
                          delete-menu(v-slot="{ on }" @confirm="mutate" :item-name="$t('sveden.deleteSubsection')")
                            v-list-item(v-on="on")
                              v-list-item-icon
                                v-icon(color="error") mdi-delete
                              v-list-item-content
                                v-list-item-title {{ $t('delete') }}
                    v-list-item(v-if="hasPerm('sveden.add_itempropcontainer')" @click="onAddTableClick(subsection)")
                      v-list-item-icon
                        v-icon mdi-plus
                      v-list-item-content
                        v-list-item-title {{$t('sveden.addIPC')}}
                v-simple-table
                  tbody
                    tr
                      td {{$t('sveden.header')}}
                      td {{ subsection.header }}
                    tr
                      td {{$t('sveden.url')}}
                      td {{subsection.url}}
        v-row(v-for="ipc in subsection.itemPropContainers" :key="ipc.id")
          v-col
            v-card
              v-card-text
                v-row
                  v-col
                    v-simple-table
                      tbody
                          tr
                            td {{$t('sveden.rowIP')}}
                            td {{ipc.schema.itemProp ? ipc.schema.itemProp : $t('notFilled')}}
                          tr
                            td {{$t('sveden.header')}}
                            td {{ipc.header}}
                v-row
                  v-col
                    v-menu(v-if="hasPerm(['sveden.delete_itempropcontainer', 'sveden.change_itemprop'], true)")
                      template(#activator="{ on }")
                        v-btn(v-on="on" absolute top right icon)
                          v-icon mdi-dots-horizontal
                      v-list
                        v-list-item(v-if="hasPerm('sveden.change_itemprop')" @click="onEditIPCClicked(ipc)")
                          v-list-item-icon
                            v-icon mdi-pencil
                          v-list-item-content
                            v-list-item-title {{ $t('edit') }}
                        apollo-mutation(
                          v-if="hasPerm('sveden.delete_itempropcontainer')"
                          :mutation="require('~/gql/sveden/mutations/item_prop_mutations/delete_item_prop_container.graphql')"
                          :variables="{ input: { itemPropContainerId: ipc.id } }"
                          :update="(st, res) => onItemPropContainerDeleted(st, res, subsection.id, ipc.id)"
                        )
                          template(v-slot="{ mutate }")
                            delete-menu(v-slot="{ on }" @confirm="mutate" :item-name="$t('sveden.deleteIPC')")
                              v-list-item(v-on="on")
                                v-list-item-icon
                                  v-icon(color="error") mdi-delete
                                v-list-item-content
                                  v-list-item-title {{ $t('delete') }}
                    v-data-table(
                      :headers="headers"
                      :items="ipc.schema.children"
                      sort-by="showPosition"
                      disable-filtering
                      disable-pagination
                      hide-default-footer
                      disable-sort
                    )
                      template(#item.actions="{ item }")
                        v-btn(
                          v-if="hasPerm('sveden.change_childitemprop')"
                          @click="onEditChildItemPropClick(item)"
                          color="success"
                          icon
                        )
                          v-icon mdi-pencil
                        apollo-mutation(
                          v-if="hasPerm('sveden.delete_childitemprop')"
                          :mutation="require('~/gql/sveden/mutations/item_prop_mutations/delete_child_item_prop.graphql')"
                          :variables="{ input: { childItemPropId: item.id } }"
                          tag="span"
                        )
                          template(v-slot="{ mutate, loading }")
                            delete-menu(item-name="cip" @confirm="mutate" :item-name="$t('sveden.deleteCIP')")
                              template(#default="{ on }")
                                v-btn(v-on="on" :loading="loading" color="error" icon)
                                  v-icon mdi-delete
                    div.text-center(v-if="hasPerm('sveden.add_childitemprop')")
                      v-btn(@click="onAddChildItemPropClick(ipc)") {{ $t('add') }}
  v-btn(
    v-if="hasPerm('sveden.add_subsection')"
    @click="onAddSubsectionClick"
    ripple block outlined
  ).text-center {{ $t('add') }}
</template>

<script lang="ts">
import { defineComponent, ref, computed, useNuxt2Meta } from '#app'
import type { Ref } from '#app'
import { DataProxy } from 'apollo-cache'
import { useAuthStore } from '~/store/auth-store'
import { useI18n, useCommonQuery } from '~/composables'
import Schema from '~/gql/sveden/queries/schema.graphql'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import {
  ChildItemPropType,
  ItemPropContainerType,
  SubsectionType
} from '~/types/graphql'
import ItemPropContainerAddDialog from '~/components/sveden/ItemPropContainerAddDialog.vue'
import AddSubsectionDialog from '~/components/sveden/AddSubsectionDialog.vue'
import ChangeSubsectionDialog from '~/components/sveden/ChangeSubsectionDialog.vue'
import ChangeChildItemPropDialog from '~/components/sveden/ChangeChildItemPropDialog.vue'
import AddChildItemPropDialog from '~/components/sveden/AddChildItemPropDialog.vue'
import ChangeItemPropContainer from '~/components/sveden/ChangeItemPropContainer.vue'

enum DialogState {
    CLOSED, TADD, SSADD, SSEDIT, CIPADD, CIPEDIT, IPCEDIT
}

export default defineComponent({
  components: {
    ItemPropContainerAddDialog,
    AddSubsectionDialog,
    ChangeSubsectionDialog,
    DeleteMenu,
    ChangeChildItemPropDialog,
    AddChildItemPropDialog,
    ChangeItemPropContainer
  },
  middleware: 'auth',
  setup () {
    const { t } = useI18n()
    useNuxt2Meta({ title: t('sveden.editStructure') as string })
    const { hasPerm } = useAuthStore()
    const dialogState: Ref<DialogState> = ref<DialogState>(DialogState.CLOSED)
    const currentIPC: Ref<ItemPropContainerType> = ref<ItemPropContainerType>(null)
    const currentSubsection: Ref<SubsectionType> = ref<SubsectionType>(null)
    const currentChildItemProp: Ref<ChildItemPropType> = ref<ChildItemPropType>(null)
    const { data: schema, loading, addUpdate, update } = useCommonQuery({ document: Schema })

    const onAddSubsection = (store: DataProxy, result: any) => addUpdate(store, result, 'subsection', false) // todo: убрать any

    const onItemPropContainerDeleted = (store: DataProxy, result: any, subsectionId: string, ipcId: string) => update(store, result, (dataCache) => {
      const ind = dataCache.subsections.findIndex(x => x.id === subsectionId)
      dataCache.subsections[ind].itemPropContainers = dataCache.subsections[ind].itemPropContainers.filter(x => x.id !== ipcId)
      return dataCache
    })

    const onTableAdded = (store: DataProxy, result: any) => update(store, result, (dataCache) => {
      dataCache.subsections.find(x => x.id === currentSubsection.value.id).itemPropContainers.push(result.data.addItemPropContainer.itemPropContainer)
      return dataCache
    })

    const onSubsectionDeleted = (store: DataProxy, result: any, subsectionId: string) => update(store, result, (dataCache) => {
      const ind = dataCache.subsections.findIndex(x => x.id === subsectionId)
      dataCache.subsections.splice(ind, 1)
      return dataCache
    })

    const headers = computed(() => {
      const res = [
        { text: t('sveden.showPosition'), value: 'showPosition' },
        { text: t('sveden.itemprop'), value: 'itemProp' },
        { text: t('sveden.header'), value: 'header' }
      ]
      if (hasPerm(['sveden.change_childitemprop', 'sveden.delete_childitemprop'], true)) {
        res.push({ text: t('actions'), value: 'actions' })
      }
      return res
    })

    const onAddTableClick = (subsection: SubsectionType) => {
      currentSubsection.value = subsection
      dialogState.value = DialogState.TADD
    }
    const onDialogClosed = () => {
      dialogState.value = DialogState.CLOSED
    }
    const onAddSubsectionClick = () => {
      dialogState.value = DialogState.SSADD
    }

    const onSubsectionEditClicked = (subsection: SubsectionType) => {
      currentSubsection.value = subsection
      dialogState.value = DialogState.SSEDIT
    }
    const onAddChildItemPropClick = (ipc: ItemPropContainerType) => {
      currentIPC.value = ipc
      dialogState.value = DialogState.CIPADD
    }
    const onEditChildItemPropClick = (cip: ChildItemPropType) => {
      currentChildItemProp.value = cip
      dialogState.value = DialogState.CIPEDIT
    }
    const onEditIPCClicked = (ipc: ItemPropContainerType) => {
      currentIPC.value = ipc
      dialogState.value = DialogState.IPCEDIT
    }
    return {
      DialogState,
      dialogState,
      schema,
      loading,
      headers,
      currentSubsection,
      currentIPC,
      currentChildItemProp,
      hasPerm,
      onItemPropContainerDeleted,
      onAddTableClick,
      onDialogClosed,
      onTableAdded,
      onAddSubsectionClick,
      onAddSubsection,
      onSubsectionDeleted,
      onSubsectionEditClicked,
      onEditChildItemPropClick,
      onAddChildItemPropClick,
      onEditIPCClicked
    }
  }
})
</script>
