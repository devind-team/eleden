<template lang="pug">
  bread-crumbs(:items="bc")
    v-card
      v-card-title {{ $t('process.teams.name') }}
      v-card-text
        v-row(align="center")
          v-col(v-if="hasPerm('eleden.add_course')" cols="12" md="6")
            add-courses(v-slot="{ on }" :add-courses-update="addCoursesUpdate")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ $t('process.teams.buttons.add') }}
        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
          v-col.text-right(cols="12" sm="6")
            | {{ $t('shownOf', { count: processTeams && processTeams.length, totalCount }) }}
        v-row
          v-col(cols="12")
            v-data-table(
              :headers="processTeamsHeaders"
              :items="processTeams"
              :loading="loading"
              disable-pagination
              hide-default-footer
            )
              template(#item.name="{ item }")
                nuxt-link(:to="localePath({ name: 'eleden-process-team_id', params: { team_id: item.id } })")
                  | {{ item.name }}
              template(#item.responsibleUsers="{ item }")
                .font-italic(v-if="item.responsibleUsers.length === 0") {{ $t('process.teams.tableItem.noSet') }}
                template(v-else)
                  user-link(
                    v-for="(user, index) in item.responsibleUsers"
                    :key="user.id"
                    :user="user"
                    :link-class="['my-1', { 'mr-1': index !== item.responsibleUsers.length - 1 }]"
                    chip
                  )
              template(#item.actions="{ item }")
                change-courses(
                  v-if="hasPerm('eleden.change_course')"
                  v-slot="{ on: onChange }"
                  :team="item"
                  :change-courses-update="changeCoursesUpdate"
                )
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{ ...onChange, ...onTooltip }" color="success" icon)
                        v-icon mdi-pencil
                    span {{ $t('process.teams.tableItem.actions.change') }}
                apollo-mutation(
                  v-if="hasPerm('eleden.delete_course')"
                  v-slot="{ mutate, loading }"
                  :mutation="require('~/gql/eleden/mutations/process/delete_courses.graphql')"
                  :variables="{ teamId: item.id }"
                  :update="(store, result) => deleteCoursesUpdate(store, result, item)"
                  tag
                )
                  delete-menu(v-slot="{ on: onDelete }" :item-name="$t('process.teams.tableItem.deleteItemName')" @confirm="mutate")
                    v-tooltip(bottom)
                      template(#activator="{ on: onTooltip }")
                        v-btn(v-on="{ ...onDelete, ...onTooltip }" :loading="loading" color="error" icon)
                          v-icon mdi-delete
                      span {{ $t('process.teams.tableItem.actions.delete') }}
              template(#footer v-if="loading")
                v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, computed, toRef, useNuxt2Meta } from '#app'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import {
  TeamType,
  DeleteCoursesMutationPayload,
  UserType,
  ProcessTeamsQuery,
  ProcessTeamsQueryVariables
} from '~/types/graphql'
import { BreadCrumbsItem } from '~/types/devind'
import { useAuthStore } from '~/store'
import { useI18n, useFilters, useQueryRelay, useDebounceSearch, useCursorPagination } from '~/composables'
import processTeamsQuery from '~/gql/eleden/queries/process/process_teams.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import AddCourses, { AddCoursesDataType } from '~/components/eleden/process/AddCourses.vue'
import ChangeCourses, { ChangeCoursesDataType } from '~/components/eleden/process/ChangeCourses.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type DeleteCoursesData = { data: { deleteCourses: DeleteCoursesMutationPayload } }

export default defineComponent({
  components: { BreadCrumbs, AddCourses, ChangeCourses, UserLink, DeleteMenu },
  middleware: ['auth'],
  props: {
    breadCrumbs: { required: true, type: Array as PropType<BreadCrumbsItem[]> }
  },
  setup (props) {
    const userStore = useAuthStore()
    const hasPerm = toRef(userStore, 'hasPerm')
    const { t, localePath } = useI18n()
    const { getUserName } = useFilters()
    useNuxt2Meta({ title: t('process.teams.name') as string })

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      { text: t('process.teams.name') as string, to: localePath({ name: 'eleden-process' }), exact: true }
    ]))

    const processTeamsHeaders = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        { text: t('process.teams.tableHeaders.name') as string, value: 'name' },
        { text: t('process.teams.tableHeaders.shortName') as string, value: 'shortName' },
        {
          text: t('process.teams.tableHeaders.responsibleUsers') as string,
          value: 'responsibleUsers',
          sort: (u1: UserType[], u2: UserType[]): number => {
            if (u1.length === u2.length) {
              for (let i = 0; i < u1.length; i++) {
                const u1FullName = getUserName(u1[i])
                const u2FullName = getUserName(u2[i])
                const comparisonResult = u1FullName.localeCompare(u2FullName)
                if (comparisonResult !== 0) {
                  return comparisonResult
                }
              }
              return 0
            }
            return u1.length - u2.length
          }
        },
        { text: t('process.teams.tableHeaders.admission') as string, value: 'admission' }
      ]
      if (hasPerm.value(['eleden.change_course', 'eleden.delete_course'], true)) {
        headers.push({ text: t('process.teams.tableHeaders.actions') as string, value: 'actions', sortable: false, align: 'center' })
      }
      return headers
    })

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: processTeams,
      loading,
      pagination: { totalCount },
      update
    } = useQueryRelay<ProcessTeamsQuery, ProcessTeamsQueryVariables>({
      document: processTeamsQuery,
      variables: () => ({
        offset: 0,
        search: debounceSearch.value || '',
        courseCountGt: 0
      })
    }, {
      pagination: useCursorPagination(),
      fetchScroll: typeof document === 'undefined' ? null : document
    })

    const addCoursesUpdate = (cache: DataProxy, result: AddCoursesDataType, team: TeamType): void => {
      update(cache, result, (dataCache, { data: { addCourses: { success } } }) => {
        if (success && !processTeams.value.find((processTeam: TeamType) => processTeam.id === team.id)) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].totalCount += 1
          dataCache[dataKey].edges = [{ node: team, __typename: 'TeamTypeEdge' }, ...dataCache[dataKey].edges]
        }
      })
    }

    const changeCoursesUpdate = (cache: DataProxy, result: ChangeCoursesDataType, team: TeamType): void => {
      update(cache, result, (dataCache, { data: { changeCourses: { success, hasCourses } } }) => {
        if (success && !hasCourses) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].totalCount -= 1
          dataCache[dataKey].edges = dataCache[dataKey].edges.filter(({ node }: { node: TeamType}) => node.id !== team.id)
        }
      })
    }

    const deleteCoursesUpdate = (cache: DataProxy, result: DeleteCoursesData, team: TeamType): void => {
      update(cache, result, (dataCache, { data: { deleteCourses: { success } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].totalCount -= 1
          dataCache[dataKey].edges = dataCache[dataKey].edges.filter(({ node }: { node: TeamType}) => node.id !== team.id)
        }
      })
    }

    return {
      hasPerm,
      bc,
      processTeamsHeaders,
      search,
      processTeams,
      loading,
      totalCount,
      addCoursesUpdate,
      changeCoursesUpdate,
      deleteCoursesUpdate
    }
  }
})
</script>
