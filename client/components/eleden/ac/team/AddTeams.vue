<template lang="pug">
  v-menu(v-model="active" bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      mutation-modal-form(
        :header="t('addForm.header')"
        :buttonText="t('addForm.buttonText')"
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
            v-list-item-content {{ t('buttons.fillForm') }}
        template(#form)
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('form.name')"
            rules="required|min:4|max:1024"
          )
            v-text-field(
              v-model="name"
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
              v-model="shortName"
              :label="t('form.shortName')"
              :error-messages="errors"
              :success="valid"
            )
          validation-provider(
            v-slot="{ errors, valid }"
            :name="t('form.admission')"
            rules="required|min:4|max:4"
          )
            v-text-field(
              v-model="admission"
              :label="t('form.admission')"
              :error-messages="errors"
              :success="valid"
            )
          v-combobox(
            v-model="group"
            :items="groups"
            :label="t('form.groupId')"
            item-text="name"
            clearable
          )
          v-autocomplete(
            v-model="parent"
            v-stream:update:search-input="searchStreamTeams$"
            :items="teams"
            :loading="$apollo.queries.teams.loading"
            :filter="filterTeams"
            :label="t('form.parentId')"
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
        :header="t('fromFile.header')"
        :buttonText="t('fromFile.buttonText')"
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
            v-list-item-content {{ t('buttons.fromFile') }}
            v-list-item-action
              help-dialog(
                v-slot="{ on: onHelper }"
                :text="t('helpDialog.helpInstruction')"
                doc="help/add_teams"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip}")
                    v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                      v-icon mdi-help-circle-outline
                  span {{ t('buttons.helpInstruction') }}
        template(#form)
          validation-provider(v-slot="{ errors, valid }" :name="t('form.file')" rules="required")
            v-file-input(
              v-model="file"
              :label="t('form.file')"
              :success="valid"
              :error-messages="errors"
              accept=".xlsx,.csv,.json/*"
              clearable
            )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { GroupType, TeamType, AddTeamMutationVariables } from '~/types/graphql'
import ErrorValidateDialog from '~/components/common/dialogs/ErrorValidateDialog.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

type UpdateTeam = (store: any, result: any) => void
type UpdateTeams = (store: any, result: any) => void

@Component<AddTeams>({
  components: { ErrorValidateDialog, HelpDialog, MutationModalForm },
  computed: {
    addTeamVariables (): AddTeamMutationVariables {
      return {
        name: this.name,
        shortName: this.shortName,
        admission: this.admission,
        groupId: this.group ? this.group.id : null,
        parentId: this.parent ? this.parent!.id : null
      }
    }
  },
  domStreams: ['searchStreamTeams$'],
  subscriptions () {
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
        return teams.edges.map((e: { node?: TeamType}) => e.node)
      }
    }
  }
})
export default class AddTeams extends Vue {
  @Prop({ type: Function as PropType<UpdateTeam>, required: true }) readonly addTeamUpdate!: UpdateTeam
  @Prop({ type: Function as PropType<UpdateTeams>, required: true }) readonly addTeamsUpdate!: UpdateTeams

  readonly groups!: GroupType[] | undefined
  readonly teams!: TeamType[] | undefined

  searchTeams$: string = ''
  searchStreamTeams$: Subject<any> = new Subject<any>()

  active: boolean = false
  name: string = ''
  shortName: string = ''
  admission: number = new Date().getFullYear()
  group: GroupType | null = null
  parent: TeamType | null = null
  file: File | null = null

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.addMenu.${path}`, values) as string
  }

  /**
   * Фильтрация групп
   * @param item
   * @param queryText
   * @return
   */
  filterTeams (item: TeamType, queryText: string): boolean {
    const qt: string = queryText.toLowerCase()
    const name: string = item.name.toLowerCase()
    const shortName: string = item.shortName.toLowerCase()
    return name.includes(qt) || shortName.includes(qt)
  }

  /**
   * Закрытие формы добавления группы
   */
  close (): void {
    this.name = ''
    this.shortName = ''
    this.admission = new Date().getFullYear()
    this.group = null
    this.parent = null
  }
}
</script>
