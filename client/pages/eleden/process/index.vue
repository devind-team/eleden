<template lang="pug">
bread-crumbs(:items="bc")
  v-card
    v-card-title {{ $t('process.name') }}
    v-card-text
      v-row(align="center")
        v-col(v-if="hasPerm('eleden.add_course')" cols="12" md="6")
          add-courses(v-slot="{ on }" :add-courses-update="addCoursesUpdate")
            v-btn(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ t('buttons.add') }}
      v-row(align="center")
        v-col(cols="12" sm="6")
          v-text-field(v-stream:input="searchStream$" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6")
          | {{ t('shownOf', { count: processTeams && processTeams.length, totalCount }) }}
      v-row
        v-col(cols="12")
          v-data-table(
            :headers="processTeamsHeaders"
            :items="processTeams"
            :loading="$apollo.queries.processTeams.loading"
            disable-pagination
            hide-default-footer
          )
            template(#item.name="{ item }")
              nuxt-link(:to="localePath({ name: 'eleden-process-team_id', params: { team_id: item.id } })")
                | {{ item.name }}
            template(#item.responsibleUsers="{ item }")
              .font-italic(v-if="item.responsibleUsers.length === 0") {{ t('tableItem.noSet') }}
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
                  span {{ t('tableItem.actions.change') }}
              apollo-mutation(
                v-if="hasPerm('eleden.delete_course')"
                v-slot="{ mutate, loading }"
                :mutation="require('~/gql/eleden/mutations/process/delete_courses.graphql')"
                :variables="{ teamId: item.id }"
                :update="(store, result) => deleteCoursesUpdate(store, result, item)"
                tag
              )
                delete-menu(v-slot="{ on: onDelete }" :item-name="t('tableItem.deleteItemName')" @confirm="mutate")
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{ ...onDelete, ...onTooltip }" :loading="loading" color="error" icon)
                        v-icon mdi-delete
                    span {{ t('tableItem.actions.delete') }}
            template(#footer v-if="$apollo.queries.processTeams.loading")
              v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import { Subject, fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { DataTableHeader } from 'vuetify'
import { MetaInfo } from 'vue-meta'
import { TeamType, ProcessTeamsQueryVariables, DeleteCoursesMutationPayload, UserType } from '~/types/graphql'
import { BreadCrumbsItem } from '~/types/devind'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import AddCourses, { AddCoursesData } from '~/components/eleden/process/AddCourses.vue'
import ChangeCourses, { ChangeCoursesData } from '~/components/eleden/process/ChangeCourses.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import ProcessTeams from '~/gql/eleden/queries/process/process_teams.graphql'

type DeleteCoursesData = { data: { deleteCourses: DeleteCoursesMutationPayload } }

@Component<ProcessIndex>({
  components: { BreadCrumbs, AddCourses, ChangeCourses, UserLink, DeleteMenu },
  middleware: ['auth'],
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        { text: this.$t('process.name') as string, to: this.localePath({ name: 'eleden-process' }), exact: true }
      ]
    },
    processTeamsHeaders (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        { text: this.t('tableHeaders.name'), value: 'name' },
        { text: this.t('tableHeaders.shortName'), value: 'shortName' },
        {
          text: this.t('tableHeaders.responsibleUsers'),
          value: 'responsibleUsers',
          sort: (u1: UserType[], u2: UserType[]): number => {
            if (u1.length === u2.length) {
              for (let i = 0; i < u1.length; i++) {
                const u1FullName = this.$getUserName(u1[i])
                const u2FullName = this.$getUserName(u2[i])
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
        { text: this.t('tableHeaders.admission'), value: 'admission' }
      ]
      if (this.hasPerm(['eleden.change_course', 'eleden.delete_course'], true)) {
        headers.push({ text: this.t('tableHeaders.actions'), value: 'actions', sortable: false, align: 'center' })
      }
      return headers
    },
    processTeamsVariables (): ProcessTeamsQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        search: this.search$ || '',
        courseCountGt: 0
      }
    }
  },
  apollo: {
    processTeams: {
      query: ProcessTeams,
      variables () {
        return this.processTeamsVariables
      },
      update ({ processTeams }) {
        this.totalCount = processTeams.totalCount
        this.page = Math.ceil(processTeams.edges.length / this.pageSize)
        return processTeams.edges.map((e: { node?: TeamType }) => e.node)
      }
    }
  },
  domStreams: ['searchStream$'],
  subscriptions () {
    const search$ = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      distinctUntilChanged(),
      tap(() => { this.page = 1 }),
      startWith('')
    )
    const al$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.processTeams.loading &&
        this.page * this.pageSize < this.totalCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreProcessTeams()
      })
    )
    return { search$, al$ }
  },
  head (): MetaInfo {
    return { title: this.t('name') } as MetaInfo
  }
})
export default class ProcessIndex extends Vue {
  @Prop({ required: true, type: Array }) readonly breadCrumbs!: BreadCrumbsItem[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly bc!: BreadCrumbsItem[]
  readonly processTeamsVariables!: BreadCrumbsItem[]
  readonly processTeams!: TeamType[]

  page: number = 1
  pageSize: number = 20
  totalCount: number = 0
  search$: string = ''
  searchStream$: Subject<any> = new Subject()

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.teams.${path}`, values) as string
  }

  /**
   * Получение дополнительных групп
   */
  async fetchMoreProcessTeams (): Promise<void> {
    await this.$apollo.queries.processTeams.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.search$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { processTeams } }: any) => {
        return {
          processTeams: {
            __typename: previousResult.processTeams.__typename,
            totalCount: processTeams.totalCount,
            edges: [...previousResult.processTeams.edges, ...processTeams.edges]
          }
        }
      }
    })
  }

  /**
   * Обновление групп пользователей после добавления курсов
   * @param store
   * @param success
   * @param team
   */
  addCoursesUpdate (
    store: DataProxy,
    { data: { addCourses: { success } } }: AddCoursesData,
    team: TeamType
  ): void {
    if (success && !this.processTeams.find((processTeam: TeamType) => processTeam.id === team.id)) {
      const data: any = store.readQuery({ query: ProcessTeams, variables: this.processTeamsVariables })
      data.processTeams.totalCount += 1
      data.processTeams.edges = [{ node: team, __typename: 'TeamTypeEdge' }, ...data.processTeams.edges]
      data.processTeams.edges.splice(
        this.pageSize * Math.max(Math.floor(data.processTeams.edges.length / this.pageSize), 1)
      )
      store.writeQuery({ query: ProcessTeams, variables: this.processTeamsVariables, data })
    }
  }

  /**
   * Обновление групп пользователей после изменения курсов
   * @param store
   * @param success
   * @param hasCourses
   * @param team
   */
  changeCoursesUpdate (
    store: DataProxy,
    { data: { changeCourses: { success, hasCourses } } }: ChangeCoursesData,
    team: TeamType
  ): void {
    if (success && !hasCourses) {
      const data: any = store.readQuery({ query: ProcessTeams, variables: this.processTeamsVariables })
      data.processTeams.totalCount -= 1
      data.processTeams.edges = data.processTeams.edges.filter(({ node }: { node: TeamType}) => node.id !== team.id)
      store.writeQuery({ query: ProcessTeams, variables: this.processTeamsVariables, data })
    }
  }

  /**
   * Обновление групп пользователей после удаления курсов
   * @param store
   * @param success
   * @param team
   */
  deleteCoursesUpdate (
    store: DataProxy,
    { data: { deleteCourses: { success } } }: DeleteCoursesData,
    team: TeamType
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: ProcessTeams, variables: this.processTeamsVariables })
      data.processTeams.totalCount -= 1
      data.processTeams.edges = data.processTeams.edges.filter(({ node }: { node: TeamType}) => node.id !== team.id)
      store.writeQuery({ query: ProcessTeams, variables: this.processTeamsVariables, data })
    }
  }
}
</script>
