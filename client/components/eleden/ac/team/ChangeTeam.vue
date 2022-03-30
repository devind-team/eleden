<template lang="pug">
  apollo-mutation(
    :mutation="require('~/gql/eleden/mutations/team/change_team.graphql')"
    :variables="variables"
    @error="setApolloError"
    @done="changeTeamDone"
  )
    template(v-slot="{ mutate, error, loading }")
      validation-observer(v-slot="{ handleSubmit, invalid }")
        form(@submit.prevent="handleSubmit(mutate)")
          mutation-result-alert(ref="mutationResultAlert")
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('form.name')"
            rules="required|min:4|max:1024"
          )
            v-text-field(
              v-model="tmpTeam.name"
              :label="t('form.name')"
              :error-messages="errors"
              :success="valid"
            )
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('form.shortName')"
            rules="required|min:2|max:50"
          )
            v-text-field(
              v-model="tmpTeam.shortName"
              :label="t('form.shortName')"
              :error-messages="errors"
              :success="valid"
            )
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('form.admission')"
            rules="required|numeric|min:4|max:4"
          )
            v-text-field(
              v-model="tmpTeam.admission"
              :label="t('form.admission')"
              :error-messages="errors"
              :success="valid"
            )
          v-combobox(
            v-model="tmpTeam.group"
            :items="groups"
            :label="t('form.groupId')"
            item-text="name"
            item-value="id"
            return-object
            clearable
            success
          )
          v-autocomplete(
            v-model="tmpTeam.parent"
            v-stream:update:search-input="searchStreamTeams$"
            :items="teams"
            :loading="$apollo.queries.teams.loading"
            :filter="filterTeams"
            :label="t('form.parentId')"
            item-text="name"
            item-value="id"
            return-object
            clearable
            success
            hide-no-data
            hide-selected
          )
            template(#selection="{ item }") {{ item.name }} ({{ item.shortName }}, {{ item.admission }})
            template(#item="{ item }")
              v-list-item-content
                v-list-item-title {{ item.name }} ({{ item.shortName }}, {{ item.admission }})
          .d-flex
            v-spacer
            v-btn(
              :disabled="invalid"
              :loading="loading"
              type="submit"
              color="primary"
            ) {{ t('save') }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ApolloError } from 'apollo-client'
import { Subject } from 'rxjs'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import {
  TeamType,
  ChangeTeamMutationVariables,
  ChangeTeamMutationPayload
} from '~/types/graphql'
import { ErrorType } from '~/types/devind'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'

type ChangeTeamData = { data: { changeTeam: ChangeTeamMutationPayload } }

export default Vue.extend<any, any, any, any>({
  components: { MutationModalForm, MutationResultAlert },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  data () {
    return {
      searchStreamTeams$: new Subject<any>(),
      searchTeams$: '',
      tmpTeam: this.team
    }
  },
  computed: {
    variables (): ChangeTeamMutationVariables {
      return {
        teamId: this.team.id,
        name: this.tmpTeam.name === this.team.name ? undefined : this.tmpTeam.name,
        shortName: this.tmpTeam.shortName === this.team.shortName ? undefined : this.tmpTeam.shortName,
        admission: this.tmpTeam.admission === this.team.admission ? undefined : this.tmpTeam.admission,
        groupId: this.tmpTeam.group?.id,
        parentId: this.tmpTeam.parent?.id
      }
    }
  },
  domStreams: ['searchStreamTeams$'],
  subscriptions () {
    // @ts-ignore
    const searchTeams$ = this.searchStreamTeams$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchTeams$ }
  },
  apollo: {
    groups: require('~/gql/eleden/queries/core/groups.graphql'),
    teams: {
      query: require('~/gql/eleden/queries/team/teams.graphql'),
      variables () { return { first: this.searchTeams$ ? undefined : 10, search: this.searchTeams$ } },
      update ({ teams }) {
        if (this.team.parent) {
          return [this.team.parent, ...teams.edges.map((e: { node?: TeamType}) => e.node)]
        }
        return teams.edges.map((e: { node?: TeamType }) => e.node).filter((e: TeamType) => e.id !== this.team.id)
      }
    }
  },
  methods: {
    /**
     * Получение перевода относильно локального пути
     * @param path
     * @param values
     * @return
     */
    t (path: string, values: any = undefined): string {
      return this.$t(`ac.teams.settings.changeTeam.${path}`, values) as string
    },
    /**
     * Установка успеха или ошибки после завершения мутации
     * @param success
     * @param errors
     */
    changeTeamDone ({ data: { changeTeam: { success, errors } } }: ChangeTeamData): void {
      if (success) {
        this.setSuccess()
      } else {
        this.setError(errors[0].messages[0], 'BusinessLogicError')
      }
    },
    /**
     * Фильтрация групп
     * @param item
     * @param queryText
     * @return
     */
    filterTeams (item: TeamType, queryText: string): boolean {
      const qt = queryText.toLocaleLowerCase()
      return item.name.toLocaleLowerCase().includes(qt) ||
        item.shortName.toLocaleLowerCase().includes(qt) ||
        String(item.admission).includes(qt)
    },
    /**
     * Установка ошибки Apollo
     * @param error
     */
    setApolloError (error: ApolloError): void {
      this.$refs.mutationResultAlert.setApolloError(error)
    },
    /**
     * Установка ошибки
     * @param message
     * @param type
     */
    setError (message: string, type: ErrorType): void {
      this.$refs.mutationResultAlert.setError(message, type)
    },
    /**
     * Установка успеха
     */
    setSuccess (): void {
      this.$refs.mutationResultAlert.setSuccess()
    }
  }
})
</script>
