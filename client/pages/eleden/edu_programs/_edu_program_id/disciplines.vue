<template lang="pug">
  v-card
    v-card-title {{ $t('eduPrograms.disciplines.name') }}
    v-card-text
      v-row
        v-col(v-if="hasPerm('eleden.add_discipline')")
          add-disciplines(
            :edu-program="eduProgram"
            :add-discipline-update="(store, result) => addUpdate(store, result, 'discipline')"
          )
            template(#default="{ on }")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ $t('eduPrograms.disciplines.buttons.add') }}
      v-row(align="center")
        v-col(cols="12" md="6")
          v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count, totalCount }) }}
      v-row
        v-col
          disciplines-table(
            :edu-program="eduProgram"
            :disciplines="disciplines"
            :search="search"
            :loading="loading"
            @count-change="countChange"
          )
</template>

<script lang="ts">
import type { PropType, Ref } from '#app'
import { defineComponent, ref, toRef } from '#app'
import { useAuthStore } from '~/store'
import { useQueryRelay } from '~/composables'
import { EduProgramType, DisciplinesQuery, DisciplinesQueryVariables } from '~/types/graphql'
import AddDisciplines from '~/components/eleden/edu_programs/AddDisciplines.vue'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import DisciplinesTable from '~/components/eleden/edu_programs/DisciplinesTable.vue'

export default defineComponent({
  components: { AddDisciplines, DisciplinesTable },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')

    const search: Ref<string> = ref<string>('')
    const count: Ref<number> = ref<number>(0)
    const totalCount: Ref<number> = ref<number>(0)

    const {
      data: disciplines,
      loading,
      addUpdate
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => ({ eduProgramId: props.eduProgram.id })
    })

    const countChange = ({ count: countt, totalCount: totalCountt }: { count: number, totalCount: number }): void => {
      count.value = countt
      totalCount.value = totalCountt
    }

    return { hasPerm, search, count, totalCount, disciplines, loading, addUpdate, countChange }
  }
})
</script>
