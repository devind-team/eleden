<template lang="pug">
  v-menu(v-model="active" bottom)
    template(#activator="{ on }")
      v-btn(v-on="on" color="primary")
        v-icon(left) mdi-plus
        | {{ t('buttons.add') }}
    v-list
      mutation-modal-form(
        :header="t('addForm.header')"
        :button-text="t('addForm.buttonText')"
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
            v-list-item-content {{ t('buttons.fillForm') }}
        template(#form)
          validation-provider(v-slot="{ errors, valid }" :name="t('addForm.name')" rules="required")
            v-autocomplete(
              v-model="newCompetences"
              v-stream:update:search-input="searchStreamCompetences$"
              :label="t('addForm.name')"
              :items="competences"
              :loading="$apollo.queries.competences.loading"
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
                    ) {{ $filters.textLength(item.name, 20) }}
                  span {{ item.name }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { CompetenceType, CompetenceTypeEdge, AddCompetencesMutationVariables, DisciplineType } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type Update = (store: any, result: any) => void

@Component<AddCompetences>({
  components: { MutationModalForm },
  computed: {
    variables (): AddCompetencesMutationVariables {
      return {
        disciplineId: this.discipline.id,
        competenceIds: this.newCompetences.map((competence: CompetenceType) => competence.id)
      }
    }
  },
  domStreams: ['searchStreamCompetences$'],
  subscriptions () {
    const searchCompetences$ = this.searchStreamCompetences$.pipe(
      pluck('event', 'msg'),
      filter((e: string | null) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchCompetences$ }
  },
  apollo: {
    competences: {
      query: require('~/gql/eleden/queries/education/competences.graphql'),
      variables () {
        return {
          first: 5,
          search: this.searchCompetences$,
          excludeDisciplineId: this.discipline.id
        }
      },
      skip () { return !this.active },
      update ({ competences }): CompetenceType[] {
        return [...competences.edges.map((e: CompetenceTypeEdge) => e.node), ...this.newCompetences]
      }
    }
  }
})
export default class AddCompetences extends Vue {
  @Prop({ type: Object as PropType<DisciplineType>, required: true }) readonly discipline!: DisciplineType
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update

  readonly variables!: AddCompetencesMutationVariables
  readonly competences!: CompetenceType[] | undefined

  searchStreamCompetences$: Subject<any> = new Subject<any>()
  searchCompetences$: string = ''

  active: boolean = false
  newCompetences: CompetenceType[] = []

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.discipline.competences.${path}`, values) as string
  }

  /**
   * Удаление компетенции из списка на добавление
   * @param competence
   */
  removeCompetence (competence: CompetenceType): void {
    this.newCompetences = this.newCompetences
      .filter((newCompetence: CompetenceType) => competence.id !== newCompetence.id)
  }
}
</script>
