<template lang="pug">
  mutation-modal-form(
    :header="t('generatingNewPasswords')"
    :subheader="team.name"
    :buttonText="t('generatePasswords')"
    :mutation="require('~/gql/eleden/mutations/team/generate_team_new_passwords.graphql')"
    :variables="{ teamId: team.id, usersId: selectedJobs.map((e) => e.user.id), date }"
    mutation-name="generateTeamNewPasswords"
    width="1000"
    errors-in-alert
    @done="generatePasswordsDone"
    @close="close"
  )
    template(#activator="{ on }")
      slot(:on="on")
    template(#form)
      v-text-field(v-model="search" :label="t('search')" prepend-icon="mdi-magnify" clearable)
      validation-provider(rules="required")
        v-data-table.mb-3(
          v-model="selectedJobs"
          :headers="headers"
          :items="team.jobs"
          :search="search"
          item-key="user.id"
          disable-pagination
          hide-default-footer
          show-select
        )
          template(#item.user.avatar="{ item }")
            avatar-dialog(:item="item.user")
          template(#item.user.username="{ item }")
            v-tooltip(bottom)
              template(#activator="{ on }")
                span(v-on="on") {{ item.user.username }}
              span {{ item.user.email }}
      v-menu(
        v-model="dateMenuActive"
        :close-on-content-click="false"
        :nudge-right="35"
        transition="scale-transition"
        min-width="auto"
        offset-y
      )
        template(#activator="{ on, attrs }")
          v-text-field(
            v-bind="attrs"
            v-on="on"
            v-model="formattingDate"
            :label= "t('generationDate')"
            prepend-icon="mdi-calendar"
            hide-details
            readonly
            success
          )
        v-date-picker(
          v-model="date"
          first-day-of-week="1"
          no-title
          @input="dateMenuActive = false"
        )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'
import { TeamType, JobType, GenerateTeamNewPasswordsMutationPayload } from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

type GenerateTeamNewPasswordsData = { data: { generateTeamNewPasswords: GenerateTeamNewPasswordsMutationPayload } }

@Component<GenerateNewPasswords>({
  components: { MutationModalForm, AvatarDialog },
  computed: {
    headers (): DataTableHeader[] {
      return [
        {
          text: this.t('tableHeaders.avatar'),
          value: 'user.avatar'
        },
        {
          text: this.t('tableHeaders.username'),
          value: 'user.username'
        },
        {
          text: this.t('tableHeaders.lastName'),
          value: 'user.lastName'
        },
        {
          text: this.t('tableHeaders.firstName'),
          value: 'user.firstName'
        },
        {
          text: this.t('tableHeaders.sirName'),
          value: 'user.sirName'
        }
      ]
    },
    formattingDate (): string {
      return new Date(this.date).toLocaleDateString()
    }
  }
})
export default class GenerateNewPasswords extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType

  readonly headers!: DataTableHeader[]
  readonly formattingDate!: string

  search: string = ''
  selectedJobs: JobType[] = []
  date: string = this.$getNowDate()
  dateMenuActive: boolean = false

  /**
   * Получение перевода относительно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.teamActions.generateNewPasswords.${path}`, values) as string
  }

  /**
   * Открытие файла с новыми паролями после генерации
   * @param success
   * @param src
   */
  generatePasswordsDone ({ data: { generateTeamNewPasswords: { success, src } } }: GenerateTeamNewPasswordsData): void {
    if (success) {
      window.open(`/${src}`, '_blank')
    }
  }

  /**
   * Закрыте формы
   */
  close (): void {
    this.search = ''
    this.selectedJobs = []
    this.date = this.$getNowDate()
    this.dateMenuActive = false
  }
}
</script>
