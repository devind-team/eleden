<template lang="pug">
  v-card
    v-card-title {{ $t('ac.teams.eduProgram.name') }}
    template(v-if="team.eduProgram")
      v-card-subtitle
        nuxt-link(:to="eduProgramPath") {{ eduProgramName }}
      v-card-text
        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
          v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count, totalCount }) }}
        v-row
          v-col
            disciplines-table(
              :edu-program="team.eduProgram"
              :disciplines="disciplines"
              :search="search"
              :loading="loading"
              @count-change="countChange"
            )
    v-card-text(v-else) {{ $t('ac.teams.eduProgram.eduProgramNotSet') }}&nbsp;
      nuxt-link(:to="localePath({ name: 'eleden-ac-teams-team_id-settings' })") {{ $t('ac.teams.eduProgram.setEduProgram') }}
</template>

<script lang="ts">
import type { ComputedRef, PropType, Ref } from '#app'
import { defineComponent, computed, ref } from '#app'
import { TeamType, DisciplinesQuery, DisciplinesQueryVariables } from '~/types/graphql'
import { useQueryRelay, useI18n } from '~/composables'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import DisciplinesTable from '~/components/eleden/edu_programs/DisciplinesTable.vue'

export default defineComponent({
  components: { DisciplinesTable },
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const { localePath } = useI18n()

    const search: Ref<string> = ref<string>('')
    const count: Ref<number> = ref<number>(0)
    const totalCount: Ref<number> = ref<number>(0)

    const eduProgramPath: ComputedRef<string> = computed<string>(() => (
      localePath({
        name: 'eleden-edu_programs-edu_program_id',
        params: { edu_program_id: props.team.eduProgram!.id }
      })
    ))

    const eduProgramName: ComputedRef<string> = computed<string>(() => (
      `${props.team.eduProgram!.direction.code} ${props.team.eduProgram!.name} ` +
        `(${props.team.eduProgram!.admission}, ${props.team.eduProgram!.eduForm.name})`
    ))

    const { data: disciplines, loading } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => ({ eduProgramId: props.team.eduProgram!.id }),
      options: {
        enabled: props.team.eduProgram !== null
      }
    })

    /**
   * Обработчик изменения количества показываемых дисциплин
   * @param count
   * @param totalCount
   */
    const countChange = ({ count: countt, totalCount: totalCountt }: { count: number, totalCount: number }): void => {
      totalCount.value = totalCountt
      count.value = countt
    }

    return { search, eduProgramPath, eduProgramName, disciplines, loading, totalCount, count, countChange }
  }
})
</script>
