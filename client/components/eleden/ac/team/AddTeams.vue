<template lang="pug">
v-menu(v-model="active" bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    mutation-modal-form(
      :header="String($t('ac.teams.addMenu.addForm.header'))"
      :buttonText="String($t('ac.teams.addMenu.addForm.buttonText'))"
      :mutation="require('~/gql/eleden/mutations/team/add_team.graphql')"
      :variables="addTeamVariables"
      :update="addTeamUpdate"
      mutation-name="addTeam"
      errors-in-alert
      @close="close"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-form-select
          v-list-item-content {{ $t('ac.teams.addMenu.buttons.fillForm') }}
      template(#form)
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.teams.addMenu.form.name'))"
          rules="required|min:4|max:1024"
        )
          v-text-field(
            v-model="name"
            :label="$t('ac.teams.addMenu.form.name')"
            :error-messages="errors"
            :success="valid"
          )
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.teams.addMenu.form.shortName'))"
          rules="required|min:2|max:50"
        )
          v-text-field(
            v-model="shortName"
            :label="$t('ac.teams.addMenu.form.shortName')"
            :error-messages="errors"
            :success="valid"
          )
        validation-provider(
          v-slot="{ errors, valid }"
          :name="String($t('ac.teams.addMenu.form.admission'))"
          rules="required|min:4|max:4"
        )
          v-text-field(
            v-model="admission"
            :label="$t('ac.teams.addMenu.form.admission')"
            :error-messages="errors"
            :success="valid"
          )
        v-combobox(
          v-model="group"
          :items="groups"
          :label="$t('ac.teams.addMenu.form.groupId')"
          item-text="name"
          clearable
        )
        v-autocomplete(
          v-model="parent"
          :search-input.sync="search"
          :items="teams"
          :loading="loading"
          :filter="filterTeams"
          :label="$t('ac.teams.addMenu.form.parentId')"
          item-text="name"
          item-value="id"
          clearable
          return-object
          hide-no-data
          hide-selected
        )
          template(#selection="{ item }") {{ item.name }} ({{ item.admission }})
          template(#item="{ item }")
            v-list-item-content
              v-list-item-title {{ item.name }} ({{ item.admission }})
              v-list-item-subtitle {{ item.shortName }}
    mutation-modal-form(
      :header="String($t('ac.teams.addMenu.fromFile.header'))"
      :buttonText="String($t('ac.teams.addMenu.fromFile.buttonText'))"
      :mutation="require('~/gql/eleden/mutations/team/upload_teams.graphql')"
      :variables="{ file }"
      :update="addTeamsUpdate"
      mutation-name="uploadTeams"
      errors-in-alert
      @close="file = null"
    )
      template(#activator="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-microsoft-excel
          v-list-item-content {{ $t('ac.teams.addMenu.buttons.fromFile') }}
          v-list-item-action
            help-dialog(
              v-slot="{ on: onHelper }"
              :text="String($t('ac.teams.addMenu.helpDialog.helpInstruction'))"
              doc="help/add_teams"
            )
              v-tooltip(bottom)
                template(#activator="{ on: onTooltip}")
                  v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                    v-icon mdi-help-circle-outline
                span {{ $t('ac.teams.addMenu.buttons.helpInstruction') }}
      template(#form)
        validation-provider(v-slot="{ errors, valid }" :name="String($t('ac.teams.addMenu.form.file'))" rules="required")
          v-file-input(
            v-model="file"
            :label="$t('ac.teams.addMenu.form.file')"
            :success="valid"
            :error-messages="errors"
            accept=".xlsx,.csv,.json/*"
            clearable
          )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent, ref } from '#app'
import {
  GroupType,
  TeamType,
  AddTeamMutationVariables,
  GroupsQuery,
  GroupsQueryVariables,
  TeamsQuery,
  TeamsQueryVariables
} from '~/types/graphql'
import { useDebounceSearch, useCommonQuery, useQueryRelay } from '~/composables'
import groupsQuery from '~/gql/eleden/queries/core/groups.graphql'
import teamsQuery from '~/gql/eleden/queries/team/teams.graphql'
import ErrorValidateDialog from '~/components/common/dialogs/ErrorValidateDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type UpdateTeamType = (store: any, result: any) => void
type UpdateTeamsType = (store: any, result: any) => void

export default defineComponent({
  components: { ErrorValidateDialog, HelpDialog, MutationModalForm },
  props: {
    addTeamUpdate: { type: Function as PropType<UpdateTeamType>, required: true },
    addTeamsUpdate: { type: Function as PropType<UpdateTeamsType>, required: true }
  },
  setup () {
    const active = ref<boolean>(false)
    const name = ref<string>('')
    const shortName = ref<string>('')
    const admission = ref<number>(new Date().getFullYear())
    const group = ref<GroupType | null>(null)
    const parent = ref<TeamType | null>(null)
    const file = ref<File | null>(null)

    const addTeamVariables = computed<AddTeamMutationVariables>(() => ({
      name: name.value,
      shortName: shortName.value,
      admission: admission.value,
      groupId: group.value ? group.value.id : null,
      parentId: parent.value ? parent.value!.id : null
    }))

    const { data: groups } = useCommonQuery<GroupsQuery, GroupsQueryVariables>({ document: groupsQuery })

    const { search, debounceSearch } = useDebounceSearch()
    const { data: teams, loading } = useQueryRelay<TeamsQuery, TeamsQueryVariables>({
      document: teamsQuery,
      variables: () => ({ first: debounceSearch.value ? undefined : 10, search: debounceSearch.value })
    })

    const filterTeams = (item: TeamType, queryText: string): boolean => {
      const qt: string = queryText.toLowerCase()
      const name: string = item.name.toLowerCase()
      const shortName: string = item.shortName.toLowerCase()
      return name.includes(qt) || shortName.includes(qt)
    }

    const close = (): void => {
      name.value = ''
      shortName.value = ''
      admission.value = new Date().getFullYear()
      group.value = null
      parent.value = null
    }

    return {
      active,
      name,
      shortName,
      admission,
      group,
      parent,
      file,
      addTeamVariables,
      groups,
      teams,
      loading,
      search,
      filterTeams,
      close
    }
  }
})
</script>
