<template lang="pug">
v-card
  v-card-title {{ $t('ac.teams.portfolio.name') }}
  v-card-text
    //- Блок добавления и фильтрации
    v-row
      v-col
        v-menu(v-if="canAdd" bottom)
          template(#activator="{ on }")
            v-btn.mr-3(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('ac.teams.portfolio.addMenu.buttons.add') }}
          v-list
            mutation-modal-form(
              :header="$t('ac.teams.portfolio.addMenu.addForm.header')"
              :buttonText="$t('ac.teams.portfolio.addMenu.addForm.buttonText')"
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
                  v-list-item-content {{ $t('ac.teams.portfolio.addMenu.buttons.fillForm') }}
                  v-list-item-action
                    help-dialog(
                      v-slot="{ on: onHelper }"
                      :text="$t('ac.teams.portfolio.addMenu.helpDialog.helpInstruction')"
                      doc="help/add_portfolio_files"
                    )
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip}")
                          v-btn(v-on="{ ...onTooltip, ...onHelper}" icon)
                            v-icon mdi-help-circle-outline
                        span {{ $t('ac.teams.portfolio.addMenu.buttons.helpInstruction') }}
              template(#form)
                //- Описание
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('ac.teams.portfolio.addMenu.form.describe')"
                  rules="required|min:2|max:512"
                )
                  v-textarea(
                    v-model="describe"
                    :label="$t('ac.teams.portfolio.addMenu.form.describe')"
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
                  :label="$t('ac.teams.portfolio.addMenu.form.disciplineId')"
                  :loading="disciplinesLoading"
                  item-text="name"
                  item-value="id"
                  success
                  clearable
                )
                //- Тип файла
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('ac.teams.portfolio.addMenu.form.typeId')"
                  rules="required"
                )
                  v-autocomplete(
                    v-model="typeId"
                    :items="fileKinds"
                    :label="$t('ac.teams.portfolio.addMenu.form.typeId')"
                    :loading="fileKindsLoading"
                    :error-messages="errors"
                    :success="valid"
                    item-text="name"
                    item-value="id"
                    clearable
                  )
                //- Прикрепление файла
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('ac.teams.portfolio.addMenu.form.file')"
                  rules="required"
                )
                  v-file-input(
                    v-model="file"
                    :label="$t('ac.teams.portfolio.addMenu.form.file')"
                    :success="valid"
                    :error-messages="errors"
                    accept=".zip,.rar/*"
                    clearable
                  )
                //- Подтверждение файлов
                v-checkbox(v-if="canChange" v-model="confirm" :label="$t('ac.teams.portfolio.addMenu.form.confirm')" success)
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
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6")
        | {{ $t('shownOf', { count: portfolioFiles && portfolioFiles.length, totalCount }) }}
    //- Таблица
    v-row
      v-col
        portfolio-files(
          :items="portfolioFiles"
          :headers="portfolioFilesHeaders"
          :can-change="canChange"
          :loading="portfolioFilesLoading"
          :get-sub-item="getPortfolioFileSubItem"
          :delete-update="deletePortfolioFileUpdate"
        )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, toRefs } from '#app'
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
  UserType,
  FileKindsQueryVariables,
  FileKindsQuery,
  DisciplinesQuery,
  DisciplinesQueryVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useCommonQuery, useQueryRelay, useDebounceSearch } from '~/composables'
import portfolioFilesQuery from '~/gql/eleden/queries/profile/portfolio_files.graphql'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import fileKindsQuery from '~/gql/eleden/queries/profile/file_kinds.graphql'
import { FilterMessages } from '~/types/filters'
import PortfolioFiles from '~/components/eleden/ac/user/PortfolioFiles.vue'
import HelpDialog from '~/components/common/dialogs/HelpDialog.vue'
import UsersDataFilter from '~/components/core/filters/UsersDataFilter.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import ItemsDataFilter from '~/components/common/filters/ItemsDataFilter.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

type AddPortfolioFilesData = { data: { addPortfolioFiles: AddPortfolioFilesMutationPayload } }
type DeletePortfolioFileData = { data: { deletePortfolioFile: DeletePortfolioFileMutationPayload } }

export default defineComponent({
  components: { MutationModalForm, HelpDialog, UsersDataFilter, PortfolioFiles, ItemsDataFilter, QueryDataFilter },
  beforeRouteEnter (_to, _from, next) {
    next((vm) => {
      if (!(vm.$props.canViewPortfolio || vm.$props.isMember)) {
        vm.$nuxt.error({
          statusCode: 403,
          message: vm.$t('permissionDenied') as string
        })
      }
    })
  },
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true },
    isMember: { type: Boolean, required: true },
    canViewPortfolio: { type: Boolean, required: true }
  },
  setup (props) {
    const userStore = useAuthStore()
    const { hasPerm, user } = toRefs(userStore)
    const { t, tc } = useI18n()

    const active = ref<boolean>(false)
    const selectedUsers = ref<UserType[]>([])
    const selectedDiscipline = ref<DisciplineType | null>(null)
    const selectedFileKind = ref<FileKindType | null>(null)
    const describe = ref<string>('')
    const typeId = ref<string | null>('')
    const disciplineId = ref<string | null>('')
    const file = ref<File | null>(null)
    const confirm = ref<boolean>(false)

    const canAdd = computed<boolean>(() => (
      hasPerm.value('eleden.add_portfoliofile') || props.team.permissions.canChange
    ))

    const canChange = computed<boolean>(() => (
      hasPerm.value('eleden.change_portfoliofile') || props.team.permissions.canChange
    ))

    const canDelete = computed<boolean>(() => (
      hasPerm.value('eleden.delete_portfoliofile') || props.team.permissions.canChange
    ))

    const users = computed<UserType[]>(() => (props.team.jobs.map(job => job.user)))

    const userIds = computed<string[]>(() => {
      if (!props.canViewPortfolio) {
        return [user.value.id]
      }
      if (selectedUsers.value.length) {
        return selectedUsers.value.map((e: UserType) => e.id)
      }
      return props.team.jobs!.map((e: Maybe<JobType>) => e!.user.id)
    })

    const portfolioFilesHeaders = computed<DataTableHeader[]>(() => ([
      { text: t('ac.teams.portfolio.tableHeaders.avatar') as string, value: 'file.user.avatar' },
      { text: t('ac.teams.portfolio.tableHeaders.user') as string, value: 'file.user.name' },
      { text: t('ac.teams.portfolio.tableHeaders.discipline') as string, value: 'discipline' },
      { text: t('ac.teams.portfolio.tableHeaders.kind') as string, value: 'kind.name' }
    ]))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: portfolioFiles,
      loading: portfolioFilesLoading,
      pagination: { totalCount },
      update,
      addUpdate
    } = useQueryRelay<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
      document: portfolioFilesQuery,
      variables: () => ({
        first: 20,
        offset: 0,
        usersId: userIds.value,
        disciplineId: selectedDiscipline.value?.id,
        search: debounceSearch.value,
        kindId: Number(selectedFileKind.value?.id)
      })
    })

    const {
      data: disciplines,
      loading: disciplinesLoading
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => { return props.team.eduProgram ? { eduProgramId: props.team.eduProgram.id } : null },
      options: () => ({
        enabled: props.team.eduProgram
      })
    })

    const {
      data: fileKinds,
      loading: fileKindsLoading
    } = useCommonQuery<FileKindsQuery, FileKindsQueryVariables>({ document: fileKindsQuery })

    const getPortfolioFileSubItem = (item: PortfolioFileType): { key: string, value: string | UserType }[] => {
      const items = [
        { key: 'describe', value: item.describe },
        { key: 'createdAt', value: item.createdAt },
        { key: 'updatedAt', value: item.updatedAt },
        { key: 'user', value: item.user },
        { key: 'file', value: `/${item.file.src}` }
      ]
      if (canDelete.value || (item.user === null && item.file.user?.id === user.value.id)) {
        items.push({ key: 'delete', value: item.id })
      }
      return items
    }

    const getFilterMessages = (filterName: string, multiple: boolean = false): FilterMessages => {
      return {
        title: tc(`ac.filters.${filterName}.title`),
        noFiltrationMessage: tc(`ac.filters.${filterName}.noFiltrationMessage`),
        multipleMessageFunction: multiple
          ? (name, restLength) =>
              tc(`ac.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
          : undefined
      }
    }

    const close = (): void => {
      describe.value = ''
      typeId.value = null
      disciplineId.value = null
      file.value = null
      confirm.value = false
    }

    const addPortfolioFilesUpdate = (cache: DataProxy, result: AddPortfolioFilesData): void => {
      update(cache, result, (dataCache, { data: { addPortfolioFiles: { success, portfolioFiles } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].totalCount += portfolioFiles!.length
          dataCache[dataKey].edges = [
            ...portfolioFiles!
              .map((e: Maybe<PortfolioFileType>) => ({ node: e, __typename: 'PortfolioFileTypeEdge' })).reverse(),
            ...dataCache[dataKey].edges
          ]
        }
      })
    }

    const deletePortfolioFileUpdate = (cache: DataProxy, result: DeletePortfolioFileData, pf: PortfolioFileType): void => {
      update(cache, result, (dataCache, { data: { deletePortfolioFile: { success } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].edges = dataCache[dataKey].edges.filter((e: any) => e.node.id !== pf.id)
          dataCache[dataKey].totalCount -= 1
        }
      })
    }

    return {
      active,
      selectedUsers,
      selectedDiscipline,
      selectedFileKind,
      describe,
      typeId,
      disciplineId,
      file,
      confirm,
      canAdd,
      canChange,
      canDelete,
      users,
      portfolioFilesHeaders,
      portfolioFiles,
      portfolioFilesLoading,
      search,
      totalCount,
      addUpdate,
      disciplines,
      disciplinesLoading,
      fileKinds,
      fileKindsLoading,
      getPortfolioFileSubItem,
      getFilterMessages,
      close,
      addPortfolioFilesUpdate,
      deletePortfolioFileUpdate
    }
  }
})
</script>
