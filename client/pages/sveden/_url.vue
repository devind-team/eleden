<template lang="pug">
v-container(v-if="!loading")
  v-dialog(:value="!!dialogState" width="500" persistent scrollable)
    table-row-edit-dialog(
      v-if="dialogState === DialogState.TREDIT"
      :fields="currentIPC.schema.children.map(x =>  ({ header: x.header, value: currentIPC.values[currentIndex][x.valuePosition] }))"
      :index="currentIndex"
      :item-prop-container-id="currentIPC.id"
      @close="onDialogClosed"
    )
    table-row-add-dialog(
      v-else-if="dialogState === DialogState.TRADD"
      :headers="currentIPC.schema.children.map(x => x.header)"
      :index="currentIPC.values.length"
      :item-prop-container-id="currentIPC.id"
      @close="onDialogClosed"
    )
  v-row(v-if="subsection" v-for="table in subsection.itemPropContainers" :key="table.id" style="position: relative")
    v-col
      v-card
        v-card-title {{table.header}}
        v-card-text
          v-menu(v-if="hasPerm('sveden.change_itempropcontainer') && !table.schema.itemProp")
            template(#activator="{ on }")
              v-btn(v-on="on" absolute top right icon)
                v-icon mdi-dots-horizontal
            v-list
              v-list-item(@click="onEditClick(0, table)")
                v-list-item-icon
                  v-icon mdi-pencil
                v-list-item-content
                  v-list-item-title {{ $t('edit') }}
          v-simple-table(v-if="table.schema.itemProp")
            template
              thead
                tr
                  th(v-for="col in table.schema.children" :key="col.id") {{col.header}}
                  th(v-if="hasPerm('sveden.change_itempropcontainer')") {{ $t('actions') }}
              tbody
                tr(v-for="(row, ri) in table.values" :itemprop="table.schema.itemProp" :key="ri")
                  td(
                    v-for="col in table.schema.children"
                    v-html="row[col.valuePosition] ? handleLinks(row[col.valuePosition]) : $t('sveden.noData')"
                    :itemprop="col.itemProp"
                    :key="col.id"
                  )
                  td
                    v-btn(v-if="hasPerm('sveden.change_itempropcontainer')" @click="onEditClick(ri, table)" color="success" icon)
                      v-icon mdi-pencil
                    apollo-mutation(
                      v-if="hasPerm('sveden.change_itempropcontainer')"
                      :mutation="require('~/gql/sveden/mutations/item_prop_mutations/delete_row.graphql')"
                      :variables="{ input: { itemPropContainerId: table.id, index: ri } }"
                      tag="span"
                    )
                      template(v-slot="{ mutate, loading }")
                        delete-menu(:item-name="$t('sveden.deleteRow')" @confirm="mutate")
                          template(#default="{ on }")
                            v-btn(v-on="on" :loading="loading" color="error" icon)
                              v-icon mdi-delete
                tr(v-if="!table.values.length")
                  td(:colspan="table.schema.children.length+1").text-center {{$t('sveden.noData')}}
                tr(v-if="hasPerm('sveden.change_itempropcontainer')")
                  td(:colspan="table.schema.children.length+1").text-center
                    v-btn(@click="onAddClick(table)") {{ $t('add') }}
          template(v-else)
            v-row(v-for="(col, i) in table.schema.children" :key="i")
              v-col(:itemprop="col.itemProp" )
                strong {{`${col.header}: `}}
                div(v-html="table.values[0] && table.values[0][col.valuePosition] ? handleLinks(table.values[0][col.valuePosition]) : $t('sveden.noData')")
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useNuxt2Meta } from '#app'
import type { Ref } from '#app'
import { DataProxy } from 'apollo-cache'
import { useAuthStore } from '~/store/auth-store'
import { useCommonQuery, useI18n } from '~/composables'
import {
  ItemPropContainerType,
  SubsectionType
} from '~/types/graphql'
import Subsections from '~/gql/sveden/queries/subsections.graphql'
import Subsection from '~/gql/sveden/queries/subsection.graphql'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import TableRowEditDialog from '~/components/sveden/TableRowEditDialog.vue'
import TableRowAddDialog from '~/components/sveden/TableRowAddDialog.vue'

enum DialogState {
    CLOSED, TREDIT, TRADD
}

export default defineComponent({
  components: {
    TableRowAddDialog,
    TableRowEditDialog,
    DeleteMenu,
    MutationResultAlert
  },
  async validate ({ app, params }) { // https://github.com/nuxt/framework/discussions/559
    const subsections: SubsectionType[] = await app.apolloProvider.defaultClient.query({
      query: Subsections
    }).then(({ data }) => data && data.subsections)
    return !!subsections.find((x: SubsectionType) => x.url === params.url)
  },
  setup () {
    const { hasPerm } = useAuthStore()
    const { params } = useRoute()
    const { t } = useI18n()
    const { data: subsection, loading, addUpdate, onResult } = useCommonQuery({ document: Subsection, variables: { url: params.url } })
    const active: Ref<boolean> = ref<boolean>(true)
    const isDialogActive: Ref<boolean> = ref<boolean>(false)
    const currentIndex: Ref<number> = ref<number>(0)
    const currentIPC: Ref<ItemPropContainerType> = ref<ItemPropContainerType>(null)
    const dialogState: Ref<DialogState> = ref<DialogState>(DialogState.CLOSED)
    const title: Ref<string> = ref<string>(params.url)
    useNuxt2Meta({ title })

    onResult((res) => {
      title.value = res.data.subsection.header
    })

    const onAddSubsection = (store: DataProxy, result: any) => addUpdate(store, result, 'subsection', false)

    const onEditClick = (index: number, ipc: ItemPropContainerType) => {
      currentIndex.value = index
      currentIPC.value = ipc
      dialogState.value = DialogState.TREDIT
    }

    const onDialogClosed = () => {
      dialogState.value = DialogState.CLOSED
      currentIPC.value = null
    }

    const onAddClick = (ipc: ItemPropContainerType) => {
      currentIPC.value = ipc
      dialogState.value = DialogState.TRADD
    }

    const handleLinks = (input: string) => {
      const Rexp = /(\b(https?):\/\/([-A-Za-zА-Яа-яёЁ0-9+&@#%?=~_|!:,.;()]*)([-A-Za-zА-Яа-яёЁ0-9+&@#%?/=~_|!:,.;()]*)[-A-Za-zА-Яа-яёЁ0-9+&@#/%=~_|()])/ig
      return input.replace(Rexp, `<a href="$1" target="_blank">${t('sveden.link')}</a>`)
    }
    return {
      active,
      isDialogActive,
      currentIndex,
      currentIPC,
      dialogState,
      DialogState,
      subsection,
      loading,
      hasPerm,
      onAddClick,
      onDialogClosed,
      onEditClick,
      onAddSubsection,
      handleLinks
    }
  }
})
</script>
