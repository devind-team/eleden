c.<template lang="pug">
v-card
  v-card-title {{ $t('eduPrograms.discipline.methodologicalSupport.name') }}
  v-card-text
    v-row
      v-col(v-if="hasPerm('eleden.add_methodologicalsupport')")
        v-menu(bottom)
          template(#activator="{ on }")
            v-btn(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('eduPrograms.discipline.methodologicalSupport.buttons.add') }}
          v-list
            mutation-modal-form(
              :header="$t('eduPrograms.discipline.methodologicalSupport.addForm.header')"
              :button-text="$t('eduPrograms.discipline.methodologicalSupport.addForm.buttonText')"
              :mutation="require('~/gql/eleden/mutations/edu_programs/add_methodological_support.graphql')"
              :variables="addMethodologicalSupportVariables"
              :update="(cache, result) => addUpdate(cache, result, 'methodologicalSupport')"
              mutation-name="addMethodologicalSupport"
              i18n-path="eduPrograms.discipline.methodologicalSupport.addForm"
              @close="addMethodologicalSupportVariables = getAddMethodologicalSupportVariables()"
            )
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-form-select
                  v-list-item-content {{ $t('eduPrograms.discipline.methodologicalSupport.addMenu.buttons.fillForm') }}
              template(#form)
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('eduPrograms.discipline.methodologicalSupport.addForm.name')"
                  rules="required|min:4|max:1024"
                )
                  v-text-field(
                    v-model="addMethodologicalSupportVariables.name"
                    :label="$t('eduPrograms.discipline.methodologicalSupport.addForm.name')"
                    :error-messages="errors"
                    :success="valid"
                  )
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('eduPrograms.discipline.methodologicalSupport.addForm.src')"
                  rules="required"
                )
                  v-file-input(
                    v-model="addMethodologicalSupportVariables.src"
                    :label="$t('eduPrograms.discipline.methodologicalSupport.addForm.src')"
                    clearable
                  )
            mutation-modal-form(
              :header="$t('eduPrograms.discipline.methodologicalSupport.addFromArchiveForm.header')"
              :button-text="$t('eduPrograms.discipline.methodologicalSupport.addFromArchiveForm.buttonText')"
              :mutation="require('~/gql/eleden/mutations/edu_programs/add_discipline_methodological_supports.graphql')"
              :variables="{ disciplineId: this.discipline.id, file: methodologicalSupportsArchive }"
              :update="(cache, result) => addUpdate(cache, result, 'methodologicalSupports')"
              mutation-name="addDisciplineMethodologicalSupports"
              i18n-path="eduPrograms.discipline.methodologicalSupport.addFromArchiveForm"
              @close="methodologicalSupportsArchive = null"
            )
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-archive-outline
                  v-list-item-content {{ $t('eduPrograms.discipline.methodologicalSupport.addMenu.buttons.addFromArchive') }}
              template(#form)
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('eduPrograms.discipline.methodologicalSupport.addFromArchiveForm.file')"
                  rules="required"
                )
                  v-file-input(
                    v-model="methodologicalSupportsArchive"
                    :label="$t('eduPrograms.discipline.methodologicalSupport.addFromArchiveForm.file')"
                    :error-messages="errors"
                    :success="valid"
                  )
    v-row(align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count: methodologicalSupportsCount, totalCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :search="search"
          :items="methodologicalSupportsItems"
          :loading="loading"
          hide-default-footer
          disable-pagination
          @pagination="({ itemsLength }) => methodologicalSupportsCount = itemsLength"
        )
          template(#item.name="{ item }")
            nuxt-link(
              :to="`/${item.src}`"
              :title="$t('eduPrograms.discipline.methodologicalSupport.tooltips.open')"
              target="_blank"
            ) {{ item.name }}
          template(#item.updatedAt="{ item }") {{ dateTimeHM(item.createdAt) }}
          template(#item.actions="{ item }")
            mutation-modal-form(
              v-if="hasPerm('eleden.change_methodologicalsupport')"
              :header="$t('eduPrograms.discipline.methodologicalSupport.changeForm.header')"
              :button-text="$t('eduPrograms.discipline.methodologicalSupport.changeForm.buttonText')"
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
                  span {{ $t('eduPrograms.discipline.methodologicalSupport.tooltips.change') }}
              template(#form)
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('eduPrograms.discipline.methodologicalSupport.changeForm.name')"
                  rules="required|min:4|max:1024"
                )
                  v-text-field(
                    v-model="item.newName"
                    :label="t('changeForm.name')"
                    :error-messages="errors"
                    :success="valid"
                  )
            apollo-mutation(
              v-if="hasPerm('eleden.delete_methodologicalsupport')"
              v-slot="{ mutate }"
              :mutation="require('~/gql/eleden/mutations/edu_programs/delete_methodological_support.graphql')"
              :variables="{ methodologicalSupportId: item.id }"
              :update="(cache, result) => deleteUpdate(cache, result)"
              tag="span"
            )
              delete-menu(
                v-slot="{ on: onDelete }"
                :item-name="$t('eduPrograms.discipline.methodologicalSupport.deleteItemName')"
                @confirm="mutate"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip }")
                    v-btn(v-on="{ ...onDelete, ...onTooltip }" color="error" icon)
                      v-icon mdi-delete
                  span {{ $t('eduPrograms.discipline.methodologicalSupport.tooltips.delete') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, toRef } from '#app'
import { DataTableHeader } from 'vuetify'
import {
  DisciplineType,
  MethodologicalSupportType,
  MethodologicalSupportsQuery,
  MethodologicalSupportsQueryVariables,
  AddMethodologicalSupportMutationVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useFilters, useI18n, useQueryRelay } from '~/composables'
import methodologicalSupportsQuery from '~/gql/eleden/queries/education/methodological_supports.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type MethodologicalSupportItem = MethodologicalSupportType & { newName: string }

export default defineComponent({
  components: { MutationModalForm, HelpDialog, DeleteMenu },
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true }
  },
  setup (props) {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { dateTimeHM } = useFilters()

    const search = ref<string>('')
    const methodologicalSupportsArchive = ref<File | null>(null)
    const methodologicalSupportsCount = ref<number>(0)

    const getAddMethodologicalSupportVariables = (): AddMethodologicalSupportMutationVariables => ({
      disciplineId: props.discipline.id,
      name: '',
      src: null
    })

    const addMethodologicalSupportVariables =
      ref<AddMethodologicalSupportMutationVariables>(getAddMethodologicalSupportVariables())

    const {
      data: methodologicalSupports,
      loading,
      addUpdate,
      deleteUpdate
    } = useQueryRelay<MethodologicalSupportsQuery, MethodologicalSupportsQueryVariables>({
      document: methodologicalSupportsQuery,
      variables: () => ({ disciplineId: props.discipline.id }),
      options: { fetchPolicy: 'cache-and-network' }
    })

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        { text: t('eduPrograms.discipline.methodologicalSupport.tableHeaders.name') as string, value: 'name' }
      ]
      if (hasPerm.value('eleden.view_methodologicalsupport')) {
        headers.push({
          text: t('eduPrograms.discipline.methodologicalSupport.tableHeaders.updatedAt') as string,
          value: 'updatedAt'
        })
      }
      if (hasPerm.value('eleden.change_methodologicalsupport') ||
        hasPerm.value('eleden.delete_methodologicalsupport')) {
        headers.push({
          text: t('eduPrograms.discipline.methodologicalSupport.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    })

    const methodologicalSupportsItems = computed<MethodologicalSupportItem[]>(() => {
      return methodologicalSupports.value
        ? methodologicalSupports.value.map((methodologicalSupport: MethodologicalSupportType) => {
          return { ...methodologicalSupport, newName: methodologicalSupport.name }
        })
        : []
    })

    const totalCount = computed<number>(() => (methodologicalSupportsItems.value.length))

    return {
      hasPerm,
      dateTimeHM,
      search,
      methodologicalSupportsArchive,
      methodologicalSupportsCount,
      getAddMethodologicalSupportVariables,
      addMethodologicalSupportVariables,
      methodologicalSupports,
      loading,
      addUpdate,
      deleteUpdate,
      headers,
      methodologicalSupportsItems,
      totalCount
    }
  }
})
</script>
