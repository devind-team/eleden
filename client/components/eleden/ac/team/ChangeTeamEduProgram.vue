<template lang="pug">
  mutation-modal-form(
    :header="team.eduProgram ? t('form.changeHeader') : t('form.setHeader')"
    :subheader="team.name"
    :buttonText="team.eduProgram ? t('form.changeButtonText') : t('form.setButtonText')"
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
        v-btn(v-on="on" color="warning") {{ team.eduProgram ? t('change') : t('set') }}
    template(#form)
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('form.eduProgram')"
        :rules="team.eduProgram ? '' : 'required'"
      )
        v-autocomplete(
          v-model="eduProgram"
          v-stream:update:search-input="searchStreamEduProgram$"
          :items="eduPrograms"
          :loading="$apollo.queries.eduPrograms.loading"
          :filter="filterEduPrograms"
          :label="t('form.eduProgram')"
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
            v-text-field(v-model="search" :label="t('form.search')" prepend-icon="mdi-magnify" clearable)
          v-col.text-right(cols="12" sm="6") {{ t('form.shownOf', { count, totalCount }) }}
        v-row
          v-col
            disciplines-table(
              :edu-program="eduProgram"
              :disciplines="disciplines"
              :search="search"
              :loading="$apollo.queries.disciplines.loading"
              @count-change="countChange"
            )
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DataTableHeader } from 'vuetify'
import { debounceTime, pluck, startWith } from 'rxjs/operators'
import { Subject } from 'rxjs'
import {
  CoursesQueryVariables, CourseType,
  DisciplinesQueryVariables,
  EduProgramsQueryVariables,
  EduProgramType, TeamType
} from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DisciplinesTable from '~/components/eleden/edu_programs/DisciplinesTable.vue'

export default Vue.extend<any, any, any, any>({
  components: { MutationModalForm, DisciplinesTable },
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  data () {
    return {
      searchEduProgram$: null,
      searchStreamEduProgram$: new Subject<any>(),
      eduProgram: this.team.eduProgram,
      transferCourses: false,
      search: '',
      count: 0,
      totalCount: 0
    }
  },
  computed: {
    headers (): DataTableHeader[] {
      return [
        { text: this.t('form.tableHeaders.code'), value: 'code' },
        { text: this.t('form.tableHeaders.name'), value: 'name' }
      ]
    },
    canTransferCourses (): boolean {
      return !this.$apollo.queries.coursesCount.loading && this.coursesCount !== 0 &&
        this.team.eduProgram !== null && this.team.eduProgram !== this.eduProgram
    },
    transferCoursesMessage (): string {
      return this.eduProgram ? this.t('form.transferCourses') : this.t('form.deleteCourses')
    }
  },
  domStreams: ['searchStreamEduProgram$'],
  subscriptions () {
    // @ts-ignore
    const searchEduProgram$ = this.searchStreamEduProgram$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      startWith(null)
    )
    return { searchEduProgram$ }
  },
  apollo: {
    eduPrograms: {
      query: require('~/gql/eleden/queries/education/edu_programs.graphql'),
      variables (): EduProgramsQueryVariables {
        return { first: this.searchEduProgram$ ? undefined : 10, search: this.searchEduProgram$ }
      },
      update ({ eduPrograms }) {
        const result: EduProgramType[] = eduPrograms.edges.map((el: any) => el.node)
        if (this.team.eduProgram && !result.find(eduProgram => eduProgram.id === this.team.eduProgram!.id)) {
          result.unshift(this.team.eduProgram)
        }
        return result
      }
    },
    disciplines: {
      query: require('~/gql/eleden/queries/education/disciplines.graphql'),
      variables (): DisciplinesQueryVariables { return { eduProgramId: this.eduProgram!.id } },
      update ({ disciplines }) {
        return disciplines.edges.map((el: any) => el.node)
      },
      skip () { return this.eduProgram === null || this.eduProgram === undefined }
    },
    coursesCount: {
      query: require('~/gql/eleden/queries/process/courses.graphql'),
      variables (): CoursesQueryVariables {
        return { teamId: this.team.id }
      },
      update ({ courses }): CourseType[] {
        return courses.totalCount
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
      return this.$t(`ac.teams.settings.changeTeamEduProgram.${path}`, values) as string
    },
    /**
     * Фильтрация образовательных программ
     * @param item
     * @param queryText
     * @return
     */
    filterEduPrograms (item: EduProgramType, queryText: string): boolean {
      const qt: string = queryText.toLowerCase()
      const en: string = item.name.toLowerCase()
      const dn: string = item.direction.name.toLowerCase()
      const dc: string = item.direction.code!.toLowerCase()
      return en.includes(qt) || dn.includes(qt) || `${item.admission}`.includes(qt) || dc.includes(qt)
    },
    /**
     * Получение подзаголовка образовательной программы
     * @param eduProgram
     * @return
     */
    getEduProgramSubtitle (eduProgram: EduProgramType): string {
      return `${eduProgram.direction.name} ${eduProgram.direction.code} (${eduProgram.eduForm.name}` +
        (eduProgram.expedited ? `, ${this.t('form.expedited')})` : ')')
    },
    /**
     * Обработчик изменения количества показываемых дисциплин
     * @param count
     * @param totalCount
     */
    countChange ({ count, totalCount }: { count: number, totalCount: number }): void {
      this.count = count
      this.totalCount = totalCount
    },
    /**
     * Закрыте формы
     */
    close (): void {
      this.eduProgram = this.team.eduProgram
    }
  }
})
</script>
