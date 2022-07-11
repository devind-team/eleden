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
          :name="String($t('ac.teams.settings.changeTeam.form.name'))"
          rules="required|min:4|max:1024"
        )
          v-text-field(
            v-model="tmpTeam.name"
            :label="$t('ac.teams.settings.changeTeam.form.name')"
            :error-messages="errors"
            :success="valid"
          )
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.teams.settings.changeTeam.form.shortName'))"
          rules="required|min:2|max:50"
        )
          v-text-field(
            v-model="tmpTeam.shortName"
            :label="$t('ac.teams.settings.changeTeam.form.shortName')"
            :error-messages="errors"
            :success="valid"
          )
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.teams.settings.changeTeam.form.admission'))"
          rules="required|numeric|min:4|max:4"
        )
          v-text-field(
            v-model="tmpTeam.admission"
            :label="$t('ac.teams.settings.changeTeam.form.admission')"
            :error-messages="errors"
            :success="valid"
          )
        v-combobox(
          v-model="tmpTeam.group"
          :items="groups"
          :label="$t('ac.teams.settings.changeTeam.form.groupId')"
          item-text="name"
          item-value="id"
          return-object
          clearable
          success
        )
        v-autocomplete(
          v-model="tmpTeam.parent"
          :search-input.sync="search"
          :items="teams"
          :loading="loading"
          :filter="filterTeams"
          :label="$t('ac.teams.settings.changeTeam.form.parentId')"
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
          ) {{ $t('ac.teams.settings.changeTeam.save') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { ApolloError } from 'apollo-client'
import {
  TeamType,
  ChangeTeamMutationVariables,
  ChangeTeamMutationPayload,
  GroupsQuery,
  GroupsQueryVariables,
  TeamsQuery,
  TeamsQueryVariables
} from '~/types/graphql'
import { ErrorType } from '~/types/devind'
import { useCommonQuery, useQueryRelay, useDebounceSearch } from '~/composables'
import groupsQuery from '~/gql/eleden/queries/core/groups.graphql'
import teamsQuery from '~/gql/eleden/queries/team/teams.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import MutationResultAlert from '~/components/common/MutationResultAlert.vue'

type ChangeTeamDataType = { data: { changeTeam: ChangeTeamMutationPayload } }
type MutationResultAlertType = InstanceType<typeof MutationResultAlert> | null

export default defineComponent({
  components: { MutationModalForm, MutationResultAlert },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const mutationResultAlert = ref<MutationResultAlertType>(null)
    const tmpTeam = ref<TeamType>(props.team)

    const variables = computed<ChangeTeamMutationVariables>(() => ({
      teamId: props.team.id,
      name: tmpTeam.value.name === props.team.name ? undefined : tmpTeam.value.name,
      shortName: tmpTeam.value.shortName === props.team.shortName ? undefined : tmpTeam.value.shortName,
      admission: tmpTeam.value.admission === props.team.admission ? undefined : tmpTeam.value.admission,
      groupId: tmpTeam.value.group?.id,
      parentId: tmpTeam.value.parent?.id
    }))

    const { data: groups } = useCommonQuery<GroupsQuery, GroupsQueryVariables>({ document: groupsQuery })

    const { search, debounceSearch } = useDebounceSearch()
    const { data: teamsData, loading } = useQueryRelay<TeamsQuery, TeamsQueryVariables>({
      document: teamsQuery,
      variables: () => ({ first: debounceSearch.value ? undefined : 10, search: debounceSearch.value })
    })
    const teams = computed<TeamType[]>(() => {
      if (props.team.parent) {
        return [props.team.parent, ...teamsData.value]
      }
      return teamsData.value.filter(e => e.id !== props.team.id)
    })

    const changeTeamDone = ({ data: { changeTeam: { success, errors } } }: ChangeTeamDataType): void => {
      if (success) {
        setSuccess()
      } else {
        setError(errors[0].messages[0], 'BusinessLogicError')
      }
    }

    const filterTeams = (item: TeamType, queryText: string): boolean => {
      const qt = queryText.toLocaleLowerCase()
      return item.name.toLocaleLowerCase().includes(qt) ||
        item.shortName.toLocaleLowerCase().includes(qt) ||
        String(item.admission).includes(qt)
    }

    const setApolloError = (error: ApolloError): void => {
      mutationResultAlert.value.setApolloError(error)
    }

    const setError = (message: string, type: ErrorType): void => {
      mutationResultAlert.value.setError(message, type)
    }

    const setSuccess = (): void => {
      mutationResultAlert.value.setSuccess()
    }

    return {
      mutationResultAlert,
      tmpTeam,
      variables,
      groups,
      teams,
      loading,
      search,
      changeTeamDone,
      filterTeams,
      setApolloError
    }
  }
})
</script>
