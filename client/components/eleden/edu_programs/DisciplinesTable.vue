<template lang="pug">
tree-data-table(
  :headers="headers"
  :search="search"
  :items="disciplinesTree"
  :loading="loading"
  :custom-filter="filter"
  :flat-filter="item => !item.children.length"
  :sort-by.sync="sortBy"
  hide-default-footer
  disable-pagination
  @items="itemsHandler"
)
  template(#item.name="{ item }")
    nuxt-link(v-if="item.children.length === 0" :to="toDiscipline(item)") {{ item.name }}
    span(v-else) {{ item.name }}
  template(#item.view.name="{ item }")
    span(v-if="item.children.length === 0") {{ item.view.name }}
    strong(v-else) &mdash;
  template(#item.users="{ item }")
    template(v-if="item.users.length")
      template(v-for="(user, i) in item.users")
        user-link(:key="user.id" :user="user")
        span(v-if="i !== item.users.length - 1") ,#{' '}
    strong(v-else) &mdash;
  template(#item.annotation="{ item }")
    v-tooltip(v-if="item.annotation" bottom)
      template(#activator="{ on }")
        v-btn(v-on="on" :href="`/${item.annotation}`" target="_blank" color="success" icon)
          v-icon mdi-download
      span {{ $t('eduPrograms.disciplines.open') }}
    strong(v-else) &mdash;
  template(#item.workProgram="{ item }")
    v-tooltip(v-if="item.workProgram" bottom)
      template(#activator="{ on }")
        v-btn(v-on="on" :href="`/${item.workProgram}`" target="_blank" color="success" icon)
          v-icon mdi-download
      span {{ $t('eduPrograms.disciplines.open') }}
    strong(v-else) &mdash;
  template(#item.actions="{ item }")
    mutation-modal-form(
      :header="$t('eduPrograms.disciplines.changeForm.header')"
      :subheader="$t('eduPrograms.disciplines.changeForm.subheader', { updatedAt: dateTimeHM(item.updatedAt) })"
      :mutation="require('~/gql/eleden/mutations/edu_programs/change_discipline.graphql')"
      :variables="changeVariables"
      :button-text="$t('eduPrograms.disciplines.changeForm.buttonText')"
      mutation-name="changeDiscipline"
    )
      template(#form)
        discipline-form(
          :edu-program="item.eduProgram"
          :discipline="inputDiscipline"
        )
      template(#activator="{ on: onChange }")
        v-tooltip(bottom)
          template(#activator="{ on: onTooltip}")
            v-btn(
              v-on="{ ...onChange, ...onTooltip }"
              @click="discipline = item; inputDiscipline = getInputDiscipline(discipline ? discipline : undefined)"
              color="success"
              icon
            )
              v-icon mdi-pencil
          span {{ $t('eduPrograms.disciplines.tooltips.change') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, useNuxtApp, toRef } from '#app'
import { DataTableHeader } from 'vuetify'
import {
  UserType,
  EduProgramType,
  DisciplineType,
  ChangeDisciplineMutationVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useFilters } from '~/composables'
import TreeDataTable, { ItemWithProps } from '~/components/common/tables/TreeDataTable.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DisciplineForm, { InputDiscipline } from '~/components/eleden/edu_programs/DisciplineForm.vue'
import { getInputDiscipline } from '~/services/eleden'

type DisciplineNodeType = DisciplineType & { children: DisciplineType[], isChild: boolean }

export default defineComponent({
  components: { TreeDataTable, UserLink, MutationModalForm, DisciplineForm },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true },
    loading: { type: Boolean, default: false },
    disciplines: { type: Array as PropType<DisciplineType[]>, default: () => ([]) },
    search: { type: String, default: '' }
  },
  setup (props, { emit }) {
    const { t, localePath } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { dateTimeHM } = useFilters()

    const discipline = ref<DisciplineType | undefined>(undefined)
    const sortBy = ref<string | string[]>([])

    const inputDiscipline =
      ref<InputDiscipline>(getInputDiscipline(discipline.value ? discipline.value : undefined))

    const sortedDisciplines = computed<DisciplineType[]>(() => {
      return props.disciplines ? props.disciplines!.sort((d1, d2) => d1.order - d2.order) : []
    })

    const disciplinesTree = computed<DisciplineNodeType[]>(() => {
      const tree: DisciplineNodeType[] = sortedDisciplines.value
        .map((discipline: DisciplineType) => ({ ...discipline, children: [], isChild: false }))
      tree.forEach((disciplineNode: DisciplineNodeType, _, disciplines) => {
        const children = getDisciplineChildren(disciplines, disciplineNode)
        children.forEach((child: DisciplineNodeType) => {
          child.isChild = true
        })
        disciplineNode.children = children
      })
      return tree.filter((disciplineNode: DisciplineNodeType) => !disciplineNode.isChild)
    })

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        {
          text: t('eduPrograms.disciplines.tableHeaders.code') as string,
          value: 'code',
          width: 200
        },
        {
          text: t('eduPrograms.disciplines.tableHeaders.name') as string,
          value: 'name'
        },
        {
          text: t('eduPrograms.disciplines.tableHeaders.view') as string,
          value: 'view.name'
        },
        {
          text: t('eduPrograms.disciplines.tableHeaders.users') as string,
          value: 'users',
          align: 'center'
        },
        {
          text: t('eduPrograms.disciplines.tableHeaders.annotation') as string,
          value: 'annotation',
          align: 'center',
          filterable: false,
          sortable: false
        },
        {
          text: t('eduPrograms.disciplines.tableHeaders.workProgram') as string,
          value: 'workProgram',
          align: 'center',
          filterable: false,
          sortable: false
        }
      ]
      if (hasPerm.value('eleden.change_discipline')) {
        headers.push({
          text: t('eduPrograms.disciplines.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers.filter((header: DataTableHeader) =>
        !['view.name'].includes(header.value) || hasPerm.value('eleden.view_discipline_additional_fields')
      )
    })

    const changeVariables = computed<ChangeDisciplineMutationVariables>(() => ({
      disciplineId: inputDiscipline.value.id,
      viewId: inputDiscipline.value.view ? inputDiscipline.value.view.id : '',
      userIds: inputDiscipline.value.users.map(user => user.id),
      deleteAnnotation: !inputDiscipline.value.annotation && !inputDiscipline.value.existingAnnotation,
      deleteWorkProgram: !inputDiscipline.value.workProgram && !inputDiscipline.value.existingWorkProgram,
      code: inputDiscipline.value.code,
      name: inputDiscipline.value.name,
      annotation: inputDiscipline.value.annotation,
      workProgram: inputDiscipline.value.workProgram,
      parentId: inputDiscipline.value.parent ? inputDiscipline.value.parent.id : undefined
    }))

    const itemsHandler = (items: ItemWithProps[], _: any, allItems: ItemWithProps[]): void => {
      emit('count-change', {
        count: items.reduce((acc, item) => item.children.length ? acc : acc + 1, 0),
        totalCount: allItems.reduce((acc, item) => item.children.length ? acc : acc + 1, 0)
      })
    }

    const toDiscipline = (discipline: DisciplineType): string => {
      return localePath({
        name: 'eleden-edu_programs-discipline-discipline_id',
        params: { edu_program_id: props.eduProgram.id, discipline_id: discipline.id }
      })
    }

    const getDisciplineChildren = (disciplines: DisciplineNodeType[], disciplineNode: DisciplineNodeType): DisciplineNodeType[] => {
      return disciplines.filter((filterDiscipline: DisciplineType) =>
        filterDiscipline.parent && filterDiscipline.parent.id === disciplineNode.id)
    }

    const filter = (value: string | UserType[] | null, search: string | null): boolean => {
      if (!search) {
        return true
      }
      if (!value) {
        return false
      }
      if (typeof value === 'string') {
        return value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      } else {
        return value.some((user: UserType) => [useNuxtApp().$getUserName(user), useNuxtApp().$getUserFullName(user)].some(
          v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        ))
      }
    }

    return {
      hasPerm,
      dateTimeHM,
      getInputDiscipline,
      inputDiscipline,
      discipline,
      sortBy,
      sortedDisciplines,
      disciplinesTree,
      headers,
      changeVariables,
      itemsHandler,
      toDiscipline,
      filter
    }
  }
})
</script>
