<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      //- Блок добавления и фильтрации
      v-row
        v-col
          v-menu(v-if="canAdd" bottom)
            template(#activator="{ on }")
              v-btn.mr-3(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('addMenu.buttons.add') }}
            v-list
              mutation-modal-form(
                :header="t('addMenu.addForm.header')"
                :buttonText="t('addMenu.addForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/portfolio/add_portfolio_files.graphql')"
                :variables="{ teamId: team.id, describe, typeId, disciplineId, file, confirm }"
                :update="addPortfolioFilesUpdate"
                mutation-name="addPortfolioFiles"
                errors-in-alert
                @close="close"
              )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ t('addMenu.buttons.fillForm') }}
                    v-list-item-action
                      help-dialog(
                        v-slot="{ on: onHelper }"
                        :text="t('addMenu.helpDialog.helpInstruction')"
                        doc="help/add_portfolio_files"
                      )
                        v-tooltip(bottom)
                          template(#activator="{ on: onTooltip}")
                            v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                              v-icon mdi-help-circle-outline
                          span {{ t('addMenu.buttons.helpInstruction') }}
                template(#form)
                  //- Описание
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addMenu.form.describe')"
                    rules="required|min:2|max:512"
                  )
                    v-textarea(
                      v-model="describe"
                      :label="t('addMenu.form.describe')"
                      :error-messages="errors"
                      :success="valid"
                      rows="1"
                      auto-grow
                      counter
                    )
                  //- Дисциплина
                  v-autocomplete(
                    v-if="!!team.eduProgram"
                    v-model="disciplineId"
                    :items="disciplines"
                    :label="t('addMenu.form.disciplineId')"
                    :loading="$apollo.queries.disciplines.loading"
                    item-text="name"
                    item-value="id"
                    success
                    clearable
                  )
                  //- Тип файла
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addMenu.form.typeId')"
                    rules="required"
                  )
                    v-autocomplete(
                      v-model="typeId"
                      :items="fileKinds"
                      :label="t('addMenu.form.typeId')"
                      :loading="$apollo.queries.fileKinds.loading"
                      :error-messages="errors"
                      :success="valid"
                      item-text="name"
                      item-value="id"
                      clearable
                    )
                  //- Прикрепление файла
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addMenu.form.file')"
                    rules="required"
                  )
                    v-file-input(
                      v-model="file"
                      :label="t('addMenu.form.file')"
                      :success="valid"
                      :error-messages="errors"
                      accept=".zip,.rar/*"
                      clearable
                    )
                  //- Подтверждение файлов
                  v-checkbox(v-if="canChange" v-model="confirm" :label="t('addMenu.form.confirm')" success)
          users-data-filter(
            v-if="canViewPortfolio"
            v-model="selectedUsers"
            :users="users"
            message-container-class="mr-1 my-1"
            multiple
          )
          query-data-filter(
            v-if="team.eduProgram"
            v-model="selectedDiscipline"
            v-bind="getFilterMessages('disciplineFilter')"
            :query="require('~/gql/eleden/queries/education/disciplines.graphql')"
            :variables="{ eduProgramId: team.eduProgram.id }"
            :update="data => data.disciplines.edges.map(e => e.node)"
            :get-name="discipline => `${discipline.code} ${discipline.name}`"
            search-type="server"
            message-container-class="mr-1 my-1"
          )
          query-data-filter(
            v-model="selectedFileKind"
            v-bind="getFilterMessages('fileKindFilter')"
            :query="require('~/gql/eleden/queries/profile/file_kinds.graphql')"
            :update="data => data.fileKinds"
            :get-name="selectedFileKind => selectedFileKind.name"
            :search-function="(item, search) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())"
            search-type="client"
            message-container-class="mr-1 my-1"
          )
      //- Блок поиска
      v-row(align="center")
        v-col(cols="12" sm="6")
          v-text-field(v-stream:input="searchStream$" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6")
          | {{ t('shownOf', { count: portfolioFiles && portfolioFiles.length, totalCount }) }}
      //- Таблица
      v-row
        v-col
          portfolio-files(
            :items="portfolioFiles"
            :headers="portfolioFilesHeaders"
            :can-change="canChange"
            :loading="$apollo.queries.portfolioFiles.loading"
            :get-sub-item="getPortfolioFileSubItem"
            :delete-update="deleteUpdate"
          )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import {
  AddPortfolioFilesMutationPayload,
  DisciplineType,
  DeletePortfolioFileMutationPayload,
  FileKindType,
  PortfolioFilesQuery,
  PortfolioFilesQueryVariables,
  JobType,
  Maybe,
  PortfolioFileType,
  TeamType,
  UserType
} from '~/types/graphql'
import portfolioFilesQuery from '~/gql/eleden/queries/profile/portfolio_files.graphql'
import { FilterMessages } from '~/types/filters'
import PortfolioFiles from '~/components/eleden/ac/user/PortfolioFiles.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

type AddPortfolioFilesData = { data: { addPortfolioFiles: AddPortfolioFilesMutationPayload } }
type DeletePortfolioFileData = { data: { deletePortfolioFile: DeletePortfolioFileMutationPayload } }

@Component<AcTeamIdPortfolio>({
  components: { MutationModalForm, HelpDialog, UsersDataFilter, PortfolioFiles, ItemsDataFilter, QueryDataFilter },
  middleware: 'auth',
  beforeRouteEnter (_to, _from, next) {
    next((vm) => {
      if (!(vm.canViewPortfolio || vm.isMember)) {
        vm.$nuxt.error({
          statusCode: 403,
          message: vm.$t('permissionDenied') as string
        })
      }
    })
  },
  computed: {
    ...mapGetters({ user: 'auth/user', hasPerm: 'auth/hasPerm' }),
    canAdd (): boolean {
      return this.hasPerm('eleden.add_portfoliofile') || this.team.permissions.canChange
    },
    canChange (): boolean {
      return this.hasPerm('eleden.change_portfoliofile') || this.team.permissions.canChange
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_portfoliofile') || this.team.permissions.canChange
    },
    users (): UserType[] {
      return this.team.jobs.map(job => job.user)
    },
    userIds (): string[] {
      if (!this.canViewPortfolio) {
        return [this.user.id]
      }
      if (this.selectedUsers.length) {
        return this.selectedUsers.map((e: UserType) => e.id)
      }
      return this.team.jobs!.map((e: Maybe<JobType>) => e!.user.id)
    },
    portfolioFilesVariables (): PortfolioFilesQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        usersId: this.userIds,
        disciplineId: this.selectedDiscipline?.id,
        search: this.search$,
        kindId: Number(this.selectedFileKind?.id)
      }
    },
    portfolioFilesHeaders (): DataTableHeader[] {
      return [
        { text: this.t('tableHeaders.avatar'), value: 'file.user.avatar' },
        { text: this.t('tableHeaders.user'), value: 'file.user.name' },
        { text: this.t('tableHeaders.discipline'), value: 'discipline' },
        { text: this.t('tableHeaders.kind'), value: 'kind.name' }
      ]
    }
  },
  domStreams: ['searchStream$'],
  subscriptions () {
    const scroll$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.portfolioFiles.loading &&
        this.page * this.pageSize < this.totalCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMorePortfolioFiles()
      })
    )
    const search$ = this.searchStream$.pipe(
      pluck('event', 'msg'),
      debounceTime(700),
      distinctUntilChanged(),
      tap(() => { this.page = 1 }),
      startWith('')
    )
    return { scroll$, search$ }
  },
  apollo: {
    portfolioFiles: {
      query: portfolioFilesQuery,
      variables () { return this.portfolioFilesVariables },
      update ({ portfolioFiles }) {
        this.totalCount = portfolioFiles.totalCount
        this.page = Math.ceil(portfolioFiles.edges.length / this.pageSize)
        return portfolioFiles.edges.map((e: any) => e.node)
      }
    },
    disciplines: {
      query: require('~/gql/eleden/queries/education/disciplines.graphql'),
      variables () { return this.team.eduProgram ? { eduProgramId: this.team.eduProgram.id } : null },
      skip () {
        return !this.team.eduProgram
      },
      update ({ disciplines }) {
        return disciplines.edges.map((e: { node?: DisciplineType }) => e.node)
      }
    },
    fileKinds: require('~/gql/eleden/queries/profile/file_kinds.graphql')
  }
})
export default class AcTeamIdPortfolio extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Boolean, required: true }) readonly isMember!: boolean
  @Prop({ type: Boolean, required: true }) readonly canViewPortfolio!: boolean

  readonly user!: UserType
  readonly hasPerm!: (perm: string | string[]) => boolean
  readonly canAdd!: boolean
  readonly canChange!: boolean
  readonly canDelete!: boolean
  readonly users!: UserType[]
  readonly userIds!: string[]
  readonly portfolioFilesVariables!: PortfolioFilesQueryVariables
  readonly portfolioFilesHeaders!: DataTableHeader[]
  readonly portfolioFiles!: PortfolioFileType[] | undefined
  readonly disciplines!: DisciplineType[] | undefined
  readonly fileKinds!: FileKindType[] | undefined

  search$: string | null = ''
  searchStream$: Subject<any> = new Subject<any>()

  active: boolean = false
  totalCount: number = 0
  page: number = 0
  pageSize: number = 20
  selectedUsers: UserType[] = []
  selectedDiscipline: DisciplineType | null = null
  selectedFileKind: FileKindType | null = null
  describe: string = ''
  typeId: string | null = ''
  disciplineId: string | null = null
  file: File | null = null
  confirm: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.portfolio.${path}`, values) as string
  }

  /**
   * Подгрузка файлов портфолио
   */
  async fetchMorePortfolioFiles (): Promise<void> {
    await this.$apollo.queries.portfolioFiles.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        usersId: this.userIds,
        disciplineId: this.selectedDiscipline?.id,
        typeId: this.selectedFileKind?.id
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { portfolioFiles } }: any) => {
        return {
          portfolioFiles: {
            __typename: previousResult.portfolioFiles.__typename,
            totalCount: portfolioFiles.totalCount,
            edges: [...previousResult.portfolioFiles.edges, ...portfolioFiles.edges]
          }
        }
      }
    })
  }

  /**
   * Получение подъэлемента файла портфолио
   * @param item
   * @return
   */
  getPortfolioFileSubItem (item: PortfolioFileType): { key: string, value: string | UserType }[] {
    const items = [
      { key: 'describe', value: item.describe },
      { key: 'createdAt', value: item.createdAt },
      { key: 'updatedAt', value: item.updatedAt },
      { key: 'user', value: item.user },
      { key: 'file', value: `/${item.file.src}` }
    ]
    if (this.canDelete || (item.user === null && item.file.user?.id === this.user.id)) {
      items.push({ key: 'delete', value: item.id })
    }
    return items
  }

  /**
   * Обновление после добавления файлов в портфолио
   * @param store,
   * @param success,
   * @param portfolioFiles
   */
  addPortfolioFilesUpdate (
    store: DataProxy,
    { data: { addPortfolioFiles: { success, portfolioFiles } } }: AddPortfolioFilesData
  ): void {
    if (success) {
      const data: any = store.readQuery<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
        query: portfolioFilesQuery,
        variables: this.portfolioFilesVariables
      })!
      data.portfolioFiles.totalCount += portfolioFiles!.length
      data.portfolioFiles.edges = [
        ...portfolioFiles!
          .map((e: Maybe<PortfolioFileType>) => ({ node: e, __typename: 'PortfolioFileTypeEdge' })).reverse(),
        ...data.portfolioFiles.edges
      ]
      data.portfolioFiles.edges
        .splice(this.pageSize * Math.max(Math.floor(data.portfolioFiles.edges.length / this.pageSize), 1))
      store.writeQuery({ query: portfolioFilesQuery, variables: this.portfolioFilesVariables, data })
    }
  }

  /**
   * Обновление после удаления файла портфолио
   * @param store,
   * @param success,
   * @param pf
   */
  deleteUpdate (
    store: DataProxy,
    { data: { deletePortfolioFile: { success } } }: DeletePortfolioFileData,
    pf: PortfolioFileType
  ): void {
    if (success) {
      const data: PortfolioFilesQuery = store.readQuery<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
        query: portfolioFilesQuery,
        variables: this.portfolioFilesVariables
      })!
      data.portfolioFiles.edges = data.portfolioFiles.edges.filter((e: any) => e.node.id !== pf.id)
      data.portfolioFiles.totalCount -= 1
      store.writeQuery({ query: portfolioFilesQuery, variables: this.portfolioFilesVariables, data })
    }
  }

  /**
   * Получение сообщений для фильтра
   * @param filterName
   * @param multiple
   * @return
   */
  getFilterMessages (filterName: string, multiple: boolean = false): FilterMessages {
    return {
      title: this.$tc(`ac.filters.${filterName}.title`),
      noFiltrationMessage: this.$tc(`ac.filters.${filterName}.noFiltrationMessage`),
      multipleMessageFunction: multiple
        ? (name, restLength) =>
            this.$tc(`ac.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }

  /**
   * Поиск пользователя
   * @param user
   * @param search
   * @return
   */
  searchUser (user: UserType, search: string): boolean {
    return [this.$getUserName(user), this.$getUserFullName(user)].some(
      v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  }

  /**
   * Закрытие окна добавления файлов портфолио
   */
  close (): void {
    this.describe = ''
    this.typeId = null
    this.disciplineId = null
    this.file = null
    this.confirm = false
  }
}
</script>
