<template lang="pug">
v-card
  v-card-title {{ $t('eduPrograms.discipline.competences.name') }}
  v-card-text
    v-row
      v-col(v-if="hasPerm('eleden.add_competence')")
        add-competences(:update="(cache, result) => addUpdate(cache, result, 'competences')" :discipline="discipline")
    v-row(align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-model="search" :label="$t('eduPrograms.discipline.competences.search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6") {{ $t('eduPrograms.discipline.competences.shownOf', { count: competencesCount, totalCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :search="search"
          :items="disciplineCompetences"
          :loading="loading"
          hide-default-footer
          disable-pagination
          @pagination="({ itemsLength }) => competencesCount = itemsLength"
        )
          template(#item.category="{ item }")
            span(v-if="item.category") {{ item.category }}
            v-icon(v-else) mdi-minus
          template(#item.actions="{ item }")
            delete-menu(
              v-if="hasPerm('eleden.delete_competence')"
              v-slot="{ on: onDelete }"
              :item-name="$t('eduPrograms.discipline.competences.deleteItemName')"
              @confirm="deleteCompetenceMutate({ disciplineId: discipline.id, competenceId: item.id }).then()"
            )
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip }")
                  v-btn(v-on="{  ...onDelete, ...onTooltip }" color="error" icon)
                    v-icon mdi-delete
                span {{ $t('eduPrograms.discipline.competences.tooltips.delete') }}
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { useMutation } from '@vue/apollo-composable'
import type { PropType } from '#app'
import { defineComponent, computed, ref, toRef } from '#app'
import {
  DisciplineType,
  CompetenceQuery,
  CompetenceQueryVariables,
  DeleteCompetenceMutation,
  DeleteCompetenceMutationVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useCommonQuery } from '~/composables'
import deleteCompetenceMutation from '~/gql/eleden/mutations/edu_programs/delete_competence.graphql'
import disciplineCompetencesQuery from '~/gql/eleden/queries/education/discipline_competences.graphql'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import AddCompetences from '~/components/eleden/edu_programs/AddCompetences.vue'

export default defineComponent({
  components: { DeleteMenu, AddCompetences },
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true }
  },
  setup (props) {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')

    const search = ref<string>('')
    const competencesCount = ref<number>(0)

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        { text: t('eduPrograms.discipline.competences.tableHeaders.name') as string, value: 'name' },
        { text: t('eduPrograms.discipline.competences.tableHeaders.code') as string, value: 'code' },
        { text: t('eduPrograms.discipline.competences.tableHeaders.category') as string, value: 'category' }
      ]
      if (hasPerm.value('eleden.delete_competence')) {
        headers.push({
          text: t('eduPrograms.discipline.competences.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    })

    const totalCount = computed<number>(() => (
      disciplineCompetences.value ? disciplineCompetences.value.length : 0
    ))

    const {
      data: disciplineCompetences,
      loading,
      addUpdate,
      deleteUpdate
    } = useCommonQuery<CompetenceQuery, CompetenceQueryVariables>({
      document: disciplineCompetencesQuery,
      variables: () => ({ disciplineId: props.discipline.id })
    })

    const { mutate: deleteCompetenceMutate } = useMutation<DeleteCompetenceMutation, DeleteCompetenceMutationVariables>(
      deleteCompetenceMutation,
      { update: deleteUpdate }
    )

    return {
      hasPerm,
      search,
      competencesCount,
      headers,
      totalCount,
      disciplineCompetences,
      loading,
      addUpdate,
      deleteCompetenceMutate
    }
  }
})
</script>
