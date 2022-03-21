<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      //- Блок фильтрации и добавления
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
                :button-text="t('addMenu.addForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/portfolio/add_portfolio_file.graphql')"
                :variables="{ userId: viewUser.id, describe, typeId, disciplineId, file, confirm }"
                :update="addPortfolioFileUpdate"
                mutation-name="addPortfolioFile"
                errors-in-alert
                @close="close"
              )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ t('addMenu.buttons.fillForm') }}
                template(#form)
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
                    v-if="!!eduProgram"
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
                      clearable
                    )
                  //- Подтверждение файла
                  v-checkbox(v-if="canChange" v-model="confirm" :label="t('addMenu.form.confirm')" success)
          query-data-filter(
            v-if="eduProgram"
            v-model="selectedDiscipline"
            v-bind="getFilterMessages('disciplineFilter')"
            :query="require('~/gql/eleden/queries/education/disciplines.graphql')"
            :variables="{ eduProgramId: eduProgram.id }"
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
            :can-change="viewUser.change"
            :loading="$apollo.queries.portfolioFiles.loading"
            :get-sub-item="getPortfolioFileSubItem"
            :delete-update="deleteUpdate"
          )
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import portfolioFilesQuery from '~/gql/eleden/queries/profile/portfolio_files.graphql'
import {
  UserType,
  PortfolioFilesQuery,
  PortfolioFileType,
  FileKindType,
  PortfolioFilesQueryVariables,
  DeletePortfolioFileMutationPayload,
  JobType,
  EduProgramType,
  DisciplineType,
  AddPortfolioFileMutationPayload
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import PortfolioFiles from '~/components/eleden/ac/user/PortfolioFiles.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

type AddPortfolioFileData = { data: { addPortfolioFile: AddPortfolioFileMutationPayload } }
type DeletePortfolioFileData = { data: { deletePortfolioFile: DeletePortfolioFileMutationPayload } }

@Component<AcUserIdPortfolio>({
  middleware: 'auth',
  components: { PortfolioFiles, MutationModalForm, QueryDataFilter },
  computed: {
    ...mapGetters({ user: 'auth/user', hasPerm: 'auth/hasPerm' }),
    canAdd (): boolean {
      return this.hasPerm('eleden.add_portfoliofile') || this.viewUser.change
    },
    canChange (): boolean {
      return this.hasPerm('eleden.change_portfoliofile') || this.viewUser.change
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_portfoliofile') || this.viewUser.change
    },
    portfolioFilesVariables (): PortfolioFilesQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        usersId: [this.viewUser.id],
        disciplineId: this.selectedDiscipline ? this.selectedDiscipline.id : undefined,
        search: this.search$,
        kindId: Number(this.selectedFileKind?.id)
      }
    },
    eduProgram (): EduProgramType | null {
      return this.viewUser.jobs
        ? (this.viewUser.jobs as JobType[])
            .reduce((acc: EduProgramType | null, current: JobType) => current.team.eduProgram || acc, null)
        : null
    },
    portfolioFilesHeaders (): DataTableHeader[] {
      return [
        { text: this.t('tableHeaders.describe'), value: 'describe' },
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
      variables () { return this.eduProgram ? { eduProgramId: this.eduProgram.id } : null },
      skip () {
        return !this.eduProgram
      },
      update ({ disciplines }) {
        return disciplines.edges.map((e: { node?: DisciplineType }) => e.node)
      }
    },
    fileKinds: require('~/gql/eleden/queries/profile/file_kinds.graphql')
  }
})
export default class AcUserIdPortfolio extends Vue {
  @Prop({ type: Object as PropType<UserType>, required: true }) readonly viewUser!: UserType

  readonly user!: UserType
  readonly hasPerm!: (perm: string | string[]) => boolean
  readonly canAdd!: boolean
  readonly canChange!: boolean
  readonly canDelete!: boolean
  readonly portfolioFilesVariables!: PortfolioFilesQueryVariables
  readonly eduProgram!: EduProgramType | null
  readonly portfolioFilesHeaders!: DataTableHeader[]
  readonly portfolioFiles!: PortfolioFileType[] | undefined
  readonly disciplines!: DisciplineType[] | undefined
  readonly fileKinds!: FileKindType[] | undefined

  search$: string | null = ''
  searchStream$: Subject<any> = new Subject<any>()

  totalCount: number = 0
  page: number = 0
  pageSize: number = 20
  selectedDiscipline: DisciplineType | null = null
  selectedFileKind: FileKindType | null = null
  active: boolean = false
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
    return this.$t(`ac.users.portfolio.${path}`, values) as string
  }

  /**
   * Подгрузка файлов портфолио
   */
  async fetchMorePortfolioFiles (): Promise<void> {
    await this.$apollo.queries.portfolioFiles.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        usersId: [this.viewUser.id],
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
   * Обновление после добавления файла в портфолио
   * @param store,
   * @param success,
   * @param portfolioFiles
   */
  addPortfolioFileUpdate (
    store: DataProxy,
    { data: { addPortfolioFile: { success, portfolioFile } } }: AddPortfolioFileData
  ): void {
    if (success) {
      const data: any = store.readQuery<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
        query: portfolioFilesQuery,
        variables: this.portfolioFilesVariables
      })!
      data.portfolioFiles.totalCount += 1
      data.portfolioFiles.edges = [
        { node: portfolioFile, __typename: 'PortfolioFileTypeEdge' },
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
   * Закрытие окна добавления файла портфолио
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
