<template lang="pug">
v-menu(v-model="active" bottom)
  template(#activator="{ on }")
    v-btn(v-on="on" color="primary")
      v-icon(left) mdi-plus
      | {{ $t('eduPrograms.discipline.competences.buttons.add') }}
  v-list
    mutation-modal-form(
      :header="$t('eduPrograms.discipline.competences.addForm.header')"
      :button-text="$t('eduPrograms.discipline.competences.addForm.buttonText')"
      :mutation="require('~/gql/eleden/mutations/edu_programs/add_competences.graphql')"
      :variables="variables"
      :update="update"
      mutation-name="addCompetences"
      errors-in-alert
      @close="newCompetences = []"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-form-select
          v-list-item-content {{ $t('eduPrograms.discipline.competences.buttons.fillForm') }}
      template(#form)
        validation-provider(
          v-slot="{ errors, valid }"
          :name="$t('eduPrograms.discipline.competences.addForm.name')"
          rules="required"
        )
          v-autocomplete(
            v-model="newCompetences"
            :search-input.sync="search"
            :label="$t('eduPrograms.discipline.competences.addForm.name')"
            :items="competences"
            :loading="loading"
            item-text="name"
            return-object
            multiple
            chips
            deletable-chips
            hide-selected
          )
            template(#selection="{ item }")
              v-tooltip(bottom)
                template(#activator="{ on }")
                  v-chip(
                    v-on="on"
                    small
                    close
                    @click:close="removeCompetence(item)"
                  ) {{ textLength(item.name, 20) }}
                span {{ item.name }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed } from '#app'
import {
  CompetenceType,
  AddCompetencesMutationVariables,
  DisciplineType,
  CompetencesQuery,
  CompetencesQueryVariables
} from '~/types/graphql'
import { useDebounceSearch, useFilters, useQueryRelay, useOffsetPagination } from '~/composables'
import competencesQuery from '~/gql/eleden/queries/education/competences.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type UpdateType = (store: any, result: any) => void

export default defineComponent({
  components: { MutationModalForm },
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true },
    update: { type: Function as PropType<UpdateType>, required: true }
  },
  setup (props) {
    const { textLength } = useFilters()

    const active = ref<boolean>(false)
    const newCompetences = ref<CompetenceType[]>([])

    const variables = computed<AddCompetencesMutationVariables>(() => ({
      disciplineId: props.discipline.id,
      competenceIds: newCompetences.value.map((competence: CompetenceType) => competence.id)
    }))

    const { search, debounceSearch } = useDebounceSearch()
    const { data: competences, loading } = useQueryRelay<CompetencesQuery, CompetencesQueryVariables>({
      document: competencesQuery,
      variables: () => ({
        search: debounceSearch.value,
        excludeDisciplineId: props.discipline.id
      }),
      options: () => ({
        enabled: active.value
      })
    },
    {
      pagination: useOffsetPagination({ pageSize: 20 })
    })

    const removeCompetence = (competence: CompetenceType): void => {
      newCompetences.value = newCompetences.value
        .filter((newCompetence: CompetenceType) => competence.id !== newCompetence.id)
    }
    return { textLength, active, newCompetences, variables, competences, loading, search, removeCompetence }
  }
})
</script>
