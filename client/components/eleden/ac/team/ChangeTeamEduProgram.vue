<template lang="pug">
mutation-modal-form(
  :header="String($t( team.eduProgram ? 'ac.teams.settings.changeTeamEduProgram.form.changeHeader' : 'ac.teams.settings.changeTeamEduProgram.form.setHeader'))"
  :subheader="team.name"
  :buttonText="String($t(team.eduProgram ? 'ac.teams.settings.changeTeamEduProgram.form.changeButtonText' : 'ac.teams.settings.changeTeamEduProgram.form.setButtonText'))"
  :mutation="require('~/gql/eleden/mutations/team/change_team_edu_program.graphql')"
  :variables="{ teamId: team.id, transferCourses: transferCourses, eduProgramId: eduProgram ? eduProgram.id : null }"
  mutation-name="changeTeamEduProgram"
  width="1000"
  errors-in-alert
  @close="close"
)
  template(#activator="{ on }")
    .d-flex
      v-spacer
      v-btn(v-on="on" color="warning")
        | {{ team.eduProgram ? $t('ac.teams.settings.changeTeamEduProgram.change') : $t('ac.teams.settings.changeTeamEduProgram.set') }}
  template(#form)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="String($t('ac.teams.settings.changeTeamEduProgram.form.eduProgram'))"
      :rules="team.eduProgram ? '' : 'required'"
    )
      v-autocomplete(
        v-model="eduProgram"
        :search-input.sync="eduProgramsSearch"
        :items="eduPrograms"
        :loading="eduProgramsLoading"
        :filter="filterEduPrograms"
        :label="$t('ac.teams.settings.changeTeamEduProgram.form.eduProgram')"
        :error-messages="errors"
        :success="!!team.eduProgram || valid"
        :menu-props="{ maxWidth: 1000 }"
        item-value="id"
        return-object
        hide-no-data
        clearable
      )
        template(#selection="{ item }") {{ item.name }} ({{ item.admission }})
        template(#item="{ item }")
          v-list-item-content
            v-list-item-title {{ item.name }} ({{ item.admission }})
            v-list-item-subtitle {{ getEduProgramSubtitle(item) }}
    v-switch(v-if="canTransferCourses" v-model="transferCourses" :label="transferCoursesMessage" success)
    template(v-if="eduProgram && disciplines")
      v-row(align="center")
        v-col(cols="12" sm="6")
          v-text-field(
            v-model="search"
            :label="$t('ac.teams.settings.changeTeamEduProgram.form.search')"
            prepend-icon="mdi-magnify"
            clearable
          )
        v-col.text-right(cols="12" sm="6")
          | {{ $t('ac.teams.settings.changeTeamEduProgram.form.shownOf', { count, totalCount }) }}
      v-row
        v-col
          disciplines-table(
            :edu-program="eduProgram"
            :disciplines="disciplines"
            :search="search"
            :loading="disciplinesLoading"
            @count-change="countChange"
          )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent, ref } from '#app'
import { DataTableHeader } from 'vuetify'
import {
  CoursesQueryVariables,
  DisciplinesQueryVariables,
  EduProgramsQueryVariables,
  EduProgramType, TeamType, EduProgramsQuery, DisciplinesQuery, CoursesQuery
} from '~/types/graphql'
import { useI18n, useQueryRelay, useDebounceSearch } from '~/composables'
import eduProgramsQuery from '~/gql/eleden/queries/education/edu_programs.graphql'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import coursesQuery from '~/gql/eleden/queries/process/courses.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DisciplinesTable from '~/components/eleden/edu_programs/DisciplinesTable.vue'

export default defineComponent({
  components: { MutationModalForm, DisciplinesTable },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const { t } = useI18n()

    const eduProgram = ref<EduProgramType>(props.team.eduProgram)
    const transferCourses = ref<boolean>(false)
    const search = ref<string>('')
    const count = ref<number>(0)
    const totalCount = ref<number>(0)

    const headers = computed<DataTableHeader[]>(() => ([
      { text: t('ac.teams.settings.changeTeamEduProgram.form.tableHeaders.code') as string, value: 'code' },
      { text: t('ac.teams.settings.changeTeamEduProgram.form.tableHeaders.name') as string, value: 'name' }
    ]))

    const transferCoursesMessage = computed<string>(() => (
      t(`ac.teams.settings.changeTeamEduProgram.form.${eduProgram.value ? 'transferCourses' : 'deleteCourses'}`) as string
    ))

    const { search: eduProgramsSearch, debounceSearch } = useDebounceSearch()
    const {
      data: eduProgramsData,
      loading: eduProgramsLoading
    } = useQueryRelay<EduProgramsQuery, EduProgramsQueryVariables>({
      document: eduProgramsQuery,
      variables: () => ({ first: debounceSearch.value ? undefined : 10, search: debounceSearch.value })
    })
    const eduPrograms = computed<EduProgramType[]>(() => {
      if (props.team.eduProgram && !eduProgramsData.value.find(eduProgram => eduProgram.id === props.team.eduProgram!.id)) {
        eduProgramsData.value.unshift(props.team.eduProgram)
      }
      return eduProgramsData.value
    })

    const {
      data: disciplines,
      loading: disciplinesLoading
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => ({ eduProgramId: eduProgram.value?.id }),
      options: () => ({
        enabled: Boolean(eduProgram.value)
      })
    })

    const {
      data: coursesCount,
      loading: coursesCountLoading
    } = useQueryRelay<CoursesQuery, CoursesQueryVariables>({
      document: coursesQuery,
      variables: () => ({ teamId: props.team.id })
    })

    const canTransferCourses = computed<boolean>(() => {
      return !coursesCountLoading.value && coursesCount.value.length &&
        props.team.eduProgram !== null && props.team.eduProgram !== eduProgram.value
    })

    const filterEduPrograms = (item: EduProgramType, queryText: string): boolean => {
      const qt: string = queryText.toLowerCase()
      const en: string = item.name.toLowerCase()
      const dn: string = item.direction.name.toLowerCase()
      const dc: string = item.direction.code!.toLowerCase()
      return en.includes(qt) || dn.includes(qt) || `${item.admission}`.includes(qt) || dc.includes(qt)
    }

    const getEduProgramSubtitle = (eduProgram: EduProgramType): string => {
      return `${eduProgram.direction.name} ${eduProgram.direction.code} (${eduProgram.eduForm.name}` +
        (eduProgram.expedited ? `, ${t('ac.teams.settings.changeTeamEduProgram.form.expedited')})` : ')')
    }

    const countChange = ({ count: _count, totalCount: _totalCount }: { count: number, totalCount: number }): void => {
      count.value = _count
      totalCount.value = _totalCount
    }

    const close = (): void => {
      eduProgram.value = props.team.eduProgram
    }

    return {
      eduProgram,
      transferCourses,
      search,
      count,
      totalCount,
      headers,
      canTransferCourses,
      transferCoursesMessage,
      eduProgramsSearch,
      eduPrograms,
      eduProgramsLoading,
      disciplines,
      disciplinesLoading,
      filterEduPrograms,
      getEduProgramSubtitle,
      countChange,
      close
    }
  }
})
</script>
