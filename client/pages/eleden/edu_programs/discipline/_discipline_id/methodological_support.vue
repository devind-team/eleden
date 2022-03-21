<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      v-row
        v-col(v-if="canAdd")
          v-menu(bottom)
            template(#activator="{ on }")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('buttons.add') }}
            v-list
              mutation-modal-form(
                :header="t('addForm.header')"
                :button-text="t('addForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/edu_programs/add_methodological_support.graphql')"
                :variables="addMethodologicalSupportVariables"
                :update="addMethodologicalSupportUpdate"
                mutation-name="addMethodologicalSupport"
                i18n-path="eduPrograms.discipline.methodologicalSupport.addForm"
                @close="addMethodologicalSupportVariables = getAddMethodologicalSupportVariables()"
              )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ t('addMenu.buttons.fillForm') }}
                template(#form)
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addForm.name')"
                    rules="required|min:4|max:1024"
                  )
                    v-text-field(
                      v-model="addMethodologicalSupportVariables.name"
                      :label="t('addForm.name')"
                      :error-messages="errors"
                      :success="valid"
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addForm.src')"
                    rules="required"
                  )
                    v-file-input(
                      v-model="addMethodologicalSupportVariables.src"
                      :label="t('addForm.src')"
                      clearable
                    )
              mutation-modal-form(
                :header="t('addFromArchiveForm.header')"
                :button-text="t('addFromArchiveForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/edu_programs/add_discipline_methodological_supports.graphql')"
                :variables="{ disciplineId: this.discipline.id, file: methodologicalSupportsArchive }"
                :update="addDisciplineMethodologicalSupportsUpdate"
                mutation-name="addDisciplineMethodologicalSupports"
                i18n-path="eduPrograms.discipline.methodologicalSupport.addFromArchiveForm"
                @close="methodologicalSupportsArchive = null"
              )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-archive-outline
                    v-list-item-content {{ t('addMenu.buttons.addFromArchive') }}
                template(#form)
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addFromArchiveForm.file')"
                    rules="required"
                  )
                    v-file-input(
                      v-model="methodologicalSupportsArchive"
                      :label="t('addFromArchiveForm.file')"
                      :error-messages="errors"
                      :success="valid"
                    )
      v-row(align="center")
        v-col(cols="12" sm="6")
          v-text-field(v-model="search" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ t('shownOf', { count: methodologicalSupportsCount, totalCount }) }}
      v-row
        v-col
          v-data-table(
            :headers="headers"
            :search="search"
            :items="methodologicalSupportsItems"
            :loading="$apollo.queries.methodologicalSupports.loading"
            hide-default-footer
            disable-pagination
            @pagination="({ itemsLength }) => methodologicalSupportsCount = itemsLength"
          )
            template(#item.name="{ item }")
              nuxt-link(:to="`/${item.src}`" :title="t('tooltips.open')" target="_blank") {{ item.name }}
            template(#item.updatedAt="{ item }") {{ $filters.dateTimeHM(item.createdAt) }}
            template(#item.actions="{ item }")
              mutation-modal-form(
                v-if="canChange"
                :header="t('changeForm.header')"
                :button-text="t('changeForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/edu_programs/change_methodological_support.graphql')"
                :variables="{ methodologicalSupportId: item.id, name: item.newName }"
                i18n-path="eduPrograms.discipline.methodologicalSupport.changeForm"
                mutation-name="changeMethodologicalSupport"
                @close="item.newName = item.name"
              )
                template(#activator="{ on: onChange }")
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip}")
                      v-btn(v-on="{ ...onChange, ...onTooltip }" color="success" icon)
                        v-icon mdi-pencil
                    span {{ t('tooltips.change') }}
                template(#form)
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('changeForm.name')"
                    rules="required|min:4|max:1024"
                  )
                    v-text-field(
                      v-model="item.newName"
                      :label="t('changeForm.name')"
                      :error-messages="errors"
                      :success="valid"
                    )
              apollo-mutation(
                v-if="canDelete"
                v-slot="{ mutate }"
                :mutation="require('~/gql/eleden/mutations/edu_programs/delete_methodological_support.graphql')"
                :variables="{ methodologicalSupportId: item.id }"
                :update="(store, result) => deleteMethodologicalSupportUpdate(store, result, item)"
                tag="span"
              )
                delete-menu(
                  v-slot="{ on: onDelete }"
                  :item-name="t('deleteItemName')"
                  @confirm="mutate"
                )
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{ ...onDelete, ...onTooltip }" color="error" icon)
                        v-icon mdi-delete
                    span {{ t('tooltips.delete') }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import {
  DisciplineType,
  MethodologicalSupportType,
  MethodologicalSupportsQueryVariables,
  AddMethodologicalSupportMutationVariables,
  AddMethodologicalSupportMutationPayload,
  AddDisciplineMethodologicalSupportsMutationPayload,
  DeleteMethodologicalSupportMutationPayload
} from '~/types/graphql'
import MethodologicalSupportsQuery from '~/gql/eleden/queries/education/methodological_supports.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type MethodologicalSupportItem = MethodologicalSupportType & { newName: string }
type AddMethodologicalSupportData = { data: { addMethodologicalSupport: AddMethodologicalSupportMutationPayload } }
type AddDisciplineMethodologicalSupportsData = {
  data: { addDisciplineMethodologicalSupports: AddDisciplineMethodologicalSupportsMutationPayload }
}
type DeleteMethodologicalSupportData = {
  data: { deleteMethodologicalSupport: DeleteMethodologicalSupportMutationPayload }
}

@Component<DisciplineIdMethodologicalSupport>({
  components: { MutationModalForm, HelpDialog, DeleteMenu },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    canAdd (): boolean {
      return this.hasPerm('eleden.add_methodologicalsupport')
    },
    canChange (): boolean {
      return this.hasPerm('eleden.change_methodologicalsupport')
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_methodologicalsupport')
    },
    headers (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        { text: this.t('tableHeaders.name'), value: 'name' }
      ]
      if (this.hasPerm('eleden.view_methodologicalsupport')) {
        headers.push({ text: this.t('tableHeaders.updatedAt'), value: 'updatedAt' })
      }
      if (this.canChange || this.canDelete) {
        headers.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    },
    methodologicalSupportsVariables (): MethodologicalSupportsQueryVariables {
      return { disciplineId: this.discipline.id }
    },
    methodologicalSupportsItems (): MethodologicalSupportItem[] {
      return this.methodologicalSupports
        ? this.methodologicalSupports.map((methodologicalSupport: MethodologicalSupportType) => {
          return { ...methodologicalSupport, newName: methodologicalSupport.name }
        })
        : []
    },
    totalCount (): number {
      return this.methodologicalSupportsItems.length
    }
  },
  apollo: {
    methodologicalSupports: {
      query: MethodologicalSupportsQuery,
      fetchPolicy: 'cache-and-network',
      variables (): MethodologicalSupportsQueryVariables {
        return this.methodologicalSupportsVariables
      },
      update ({ methodologicalSupports }): MethodologicalSupportType[] {
        return methodologicalSupports.edges.map((e: { node?: MethodologicalSupportType }) => e.node)
      }
    }
  }
})
export default class DisciplineIdMethodologicalSupport extends Vue {
  @Prop({ type: Object as PropType<DisciplineType>, required: true }) readonly discipline!: DisciplineType

  readonly hasPerm!: (perm: string | string[], or?: boolean) => boolean
  readonly canAdd!: boolean
  readonly canChange!: boolean
  readonly canDelete!: boolean
  readonly headers!: DataTableHeader[]
  readonly methodologicalSupportsVariables!: MethodologicalSupportsQueryVariables
  readonly methodologicalSupportsItems!: MethodologicalSupportItem[]
  readonly methodologicalSupports!: MethodologicalSupportType[]
  readonly totalCount!: number

  addMethodologicalSupportVariables: AddMethodologicalSupportMutationVariables =
    this.getAddMethodologicalSupportVariables()

  search: string = ''
  methodologicalSupportsArchive: File | null = null
  methodologicalSupportsCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.discipline.methodologicalSupport.${path}`, values) as string
  }

  /**
   * Получение пустого объекта переменных для мутации добавления методологического обеспечения
   * @return
   */
  getAddMethodologicalSupportVariables (): AddMethodologicalSupportMutationVariables {
    return {
      disciplineId: this.discipline.id,
      name: '',
      src: null
    }
  }

  /**
   * Добавление методического обеспечения
   * @param store
   * @param methodologicalSupports
   */
  addMethodologicalSupports (store: DataProxy, methodologicalSupports: MethodologicalSupportType[]): void {
    const data: any = store.readQuery({
      query: MethodologicalSupportsQuery,
      variables: this.methodologicalSupportsVariables
    })
    data.methodologicalSupports.edges = [
      ...methodologicalSupports.map((methodologicalSupport: MethodologicalSupportType) => ({
        node: methodologicalSupport, __typename: 'MethodologicalSupportTypeEdge'
      })),
      ...data.methodologicalSupports.edges
    ]
    store.writeQuery({
      query: MethodologicalSupportsQuery,
      variables: this.methodologicalSupportsVariables,
      data
    })
  }

  /**
   * Обновление после добавления методического обеспечения
   * @param store
   * @param success
   * @param methodologicalSupport
   */
  addMethodologicalSupportUpdate (
    store: DataProxy,
    { data: { addMethodologicalSupport: { success, methodologicalSupport } } }: AddMethodologicalSupportData
  ): void {
    if (success) {
      this.addMethodologicalSupports(store, [methodologicalSupport as MethodologicalSupportType])
    }
  }

  /**
   * Обновление после добавления методического обеспечения
   * @param store
   * @param success
   * @param methodologicalSupports
   */
  addDisciplineMethodologicalSupportsUpdate (
    store: DataProxy,
    {
      data: { addDisciplineMethodologicalSupports: { success, methodologicalSupports } }
    }: AddDisciplineMethodologicalSupportsData
  ): void {
    if (success) {
      this.addMethodologicalSupports(store, methodologicalSupports as MethodologicalSupportType[])
    }
  }

  /**
   * Обновление после удаления методического обеспечения
   * @param store
   * @param success
   * @param methodologicalSupport
   */
  deleteMethodologicalSupportUpdate (
    store: DataProxy,
    { data: { deleteMethodologicalSupport: { success } } }: DeleteMethodologicalSupportData,
    methodologicalSupport: MethodologicalSupportType
  ): void {
    if (success) {
      const data: any = store.readQuery({
        query: MethodologicalSupportsQuery,
        variables: this.methodologicalSupportsVariables
      })
      data.methodologicalSupports.edges = data.methodologicalSupports.edges.filter((e: any) =>
        e.node.id !== methodologicalSupport.id)
      data.methodologicalSupports.totalCount -= 1
      store.writeQuery({
        query: MethodologicalSupportsQuery,
        variables: this.methodologicalSupportsVariables,
        data
      })
    }
  }
}
</script>
