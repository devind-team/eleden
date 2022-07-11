<template lang="pug">
v-card
  v-card-title {{ $t('ac.users.portfolio.name') }}
  v-card-text
    //- Блок фильтрации и добавления
    v-row
      v-col
        v-menu(v-if="canAdd" bottom)
          template(#activator="{ on }")
            v-btn.mr-3(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('ac.users.portfolio.addMenu.buttons.add') }}
          v-list
            mutation-modal-form(
              :header="$t('ac.users.portfolio.addMenu.addForm.header')"
              :button-text="$t('ac.users.portfolio.addMenu.addForm.buttonText')"
              :mutation="require('~/gql/eleden/mutations/portfolio/add_portfolio_file.graphql')"
              :variables="{ userId: viewUser.id, describe, typeId, disciplineId, file, confirm }"
              :update="(store, result) => addUpdate(store, result, 'portfolioFile')"
              mutation-name="addPortfolioFile"
              errors-in-alert
              @close="close"
            )
              template(#activator="{ on }")
                v-list-item(v-on="on")
                  v-list-item-icon
                    v-icon mdi-form-select
                  v-list-item-content {{ $t('ac.users.portfolio.addMenu.buttons.fillForm') }}
              template(#form)
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('ac.users.portfolio.addMenu.form.describe')"
                  rules="required|min:2|max:512"
                )
                  v-textarea(
                    v-model="describe"
                    :label="$t('ac.users.portfolio.addMenu.form.describe')"
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
                  :label="$t('ac.users.portfolio.addMenu.form.disciplineId')"
                  :loading="disciplinesLoading"
                  item-text="name"
                  item-value="id"
                  success
                  clearable
                )
                //- Тип файла
                validation-provider(
                  v-slot="{ errors, valid }"
                  :name="$t('ac.users.portfolio.addMenu.form.typeId')"
                  rules="required"
                )
                  v-autocomplete(
                    v-model="typeId"
                    :items="fileKinds"
                    :label="$t('ac.users.portfolio.addMenu.form.typeId')"
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
                  :name="$t('ac.users.portfolio.addMenu.form.file')"
                  rules="required"
                )
                  v-file-input(
                    v-model="file"
                    :label="$t('ac.users.portfolio.addMenu.form.file')"
                    :success="valid"
                    :error-messages="errors"
                    clearable
                  )
                //- Подтверждение файла
                v-checkbox(v-if="canChange" v-model="confirm" :label="$t('ac.users.portfolio.addMenu.form.confirm')" success)
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
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6")
        | {{ $t('shownOf', { count: portfolioFiles && portfolioFiles.length, totalCount }) }}
    //- Таблица
    v-row
      v-col
        portfolio-files(
          :items="portfolioFiles"
          :headers="portfolioFilesHeaders"
          :can-change="viewUser.change"
          :loading="portfolioFilesLoading"
          :get-sub-item="getPortfolioFileSubItem"
          :delete-update="deleteUpdate"
        )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, toRefs, ref, computed } from '#app'
import { DataTableHeader } from 'vuetify'
import { DataProxy } from 'apollo-cache'
import {
  UserType,
  PortfolioFilesQuery,
  PortfolioFileType,
  FileKindType,
  PortfolioFilesQueryVariables,
  JobType,
  EduProgramType,
  DisciplineType,
  DisciplinesQuery,
  DisciplinesQueryVariables,
  FileKindsQuery,
  FileKindsQueryVariables,
  DeletePortfolioFileMutationPayload
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import { useAuthStore } from '~/store'
import { useI18n, useDebounceSearch, useQueryRelay, useCommonQuery, useCursorPagination } from '~/composables'
import portfolioFilesQuery from '~/gql/eleden/queries/profile/portfolio_files.graphql'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import fileKindsQuery from '~/gql/eleden/queries/profile/file_kinds.graphql'
import PortfolioFiles from '~/components/eleden/ac/user/PortfolioFiles.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'

type DeletePortfolioFileData = { data: { deletePortfolioFile: DeletePortfolioFileMutationPayload } }

export default defineComponent({
  components: { PortfolioFiles, MutationModalForm, QueryDataFilter },
  middleware: 'auth',
  props: {
    viewUser: { type: Object as PropType<UserType>, required: true }
  },
  setup (props) {
    const userStore = useAuthStore()
    const { hasPerm, user } = toRefs(userStore)
    const { t, tc } = useI18n()

    const active = ref<boolean>(false)
    const selectedDiscipline = ref<DisciplineType | null>(null)
    const selectedFileKind = ref<FileKindType | null>(null)
    const describe = ref<string>('')
    const typeId = ref<string | null>('')
    const disciplineId = ref<string | null>(null)
    const file = ref<File | null>(null)
    const confirm = ref<boolean>(false)

    const canAdd = computed<boolean>(() => (
      hasPerm.value('eleden.add_portfoliofile') || props.viewUser.change
    ))

    const canChange = computed<boolean>(() => (
      hasPerm.value('eleden.change_portfoliofile') || props.viewUser.change
    ))

    const canDelete = computed<boolean>(() => (
      hasPerm.value('eleden.delete_portfoliofile') || props.viewUser.change
    ))

    const eduProgram = computed<EduProgramType | null>(() => (props.viewUser.jobs
      ? (props.viewUser.jobs as JobType[])
          .reduce((acc: EduProgramType | null, current: JobType) => current.team.eduProgram || acc, null)
      : null))

    const portfolioFilesHeaders = computed<DataTableHeader[]>(() => ([
      { text: t('ac.users.portfolio.tableHeaders.describe') as string, value: 'describe' },
      { text: t('ac.users.portfolio.tableHeaders.discipline') as string, value: 'discipline' },
      { text: t('ac.users.portfolio.tableHeaders.kind') as string, value: 'kind.name' }
    ]))

    const portfolioFilesVariables = computed<PortfolioFilesQueryVariables>(() => ({
      first: 20,
      offset: 0,
      usersId: [props.viewUser.id],
      disciplineId: selectedDiscipline.value ? selectedDiscipline.value.id : undefined,
      search: debounceSearch.value,
      kindId: Number(selectedFileKind.value?.id)
    }))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: portfolioFiles,
      loading: portfolioFilesLoading,
      pagination: { totalCount },
      addUpdate,
      update: portfolioFilesUpdate
    } = useQueryRelay<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
      document: portfolioFilesQuery,
      variables: () => (portfolioFilesVariables.value)
    },
    {
      pagination: useCursorPagination(),
      fetchScroll: typeof document === 'undefined' ? null : document
    })

    const {
      data: disciplines,
      loading: disciplinesLoading
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables>({
      document: disciplinesQuery,
      variables: () => { return eduProgram.value ? { eduProgramId: eduProgram.value.id } : null },
      options: () => ({
        enabled: eduProgram.value
      })
    })

    const {
      data: fileKinds,
      loading: fileKindsLoading
    } = useCommonQuery<FileKindsQuery, FileKindsQueryVariables>({ document: fileKindsQuery })

    const getPortfolioFileSubItem = (item: PortfolioFileType): { key: string, value: string | UserType }[] => {
      const items = [
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

    const deleteUpdate = (
      cache: DataProxy,
      result: DeletePortfolioFileData,
      pf: PortfolioFileType
    ): void => {
      portfolioFilesUpdate(cache, result, (dataCache, { data: { deletePortfolioFile: { success } } }) => {
        if (success) {
          dataCache.portfolioFiles.edges = dataCache.portfolioFiles.edges.filter((e: any) => e.node.id !== pf.id)
          dataCache.portfolioFiles.totalCount -= 1
        }
      })
    }

    return {
      active,
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
      eduProgram,
      portfolioFilesHeaders,
      portfolioFiles,
      portfolioFilesLoading,
      totalCount,
      addUpdate,
      deleteUpdate,
      search,
      disciplines,
      disciplinesLoading,
      fileKinds,
      fileKindsLoading,
      getPortfolioFileSubItem,
      getFilterMessages,
      close
    }
  }
})
</script>
