<template lang="pug">
  v-card
    v-card-title
      v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
      span {{ $t('process.course.handout.name') }}
    v-card-text
      v-row
        v-col
          v-menu(v-if="canChangeHandouts" bottom)
            template(#activator="{ on }")
              v-btn.mr-3(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ $t('process.course.handout.buttons.add') }}
            v-list
              mutation-modal-form(
                :header="$t('process.course.handout.addForm.header')"
                :button-text="$t('process.course.handout.addForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/process/add_handout.graphql')"
                :variables="addHandoutVariables"
                :update="(cache, result) => addUpdate(cache, result, 'handout')"
                i18n-path="process.course.handout.addForm"
                mutation-name="addHandout"
                @close="period = []; handoutFile = null; description = ''"
              )
                  template(#activator="{ on }")
                    v-list-item(v-on="on")
                      v-list-item-icon
                        v-icon mdi-form-select
                      v-list-item-content {{ $t('process.course.handout.buttons.fillForm') }}
                  template(#form)
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="$t('process.course.handout.addForm.period')"
                      rules="required"
                    )
                      v-autocomplete(
                        v-model="period"
                        :label="$t('process.course.handout.addForm.period')"
                        :items="periods"
                        :error-messages="errors"
                        :success="valid"
                        item-text="name"
                        hide-no-data
                        hide-selected
                        return-object
                      )
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="$t('process.course.handout.addForm.description')"
                      rules="required"
                    )
                      v-text-field(
                        v-model="description"
                        :label="$t('process.course.handout.addForm.description')"
                        :error-messages="errors"
                        :success="valid"
                      )
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="$t('process.course.handout.addForm.file')"
                      rules="required"
                    )
                      v-file-input(
                        v-model="handoutFile"
                        :label="$t('process.course.handout.addForm.file')"
                        :error-messages="errors"
                        :success="valid"
                      )
          query-data-filter(
            v-model="periodFilter"
            v-bind="getFilterMessages('periodFilter', true)"
            :query="require('~/gql/eleden/queries/process/periods.graphql')"
            :update="data => data.periods"
            :get-name="period => period.name"
            :search-function="(item, search) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())"
            search-type="client"
            message-container-class="mr-1 my-1"
            multiple
          )
      v-row(align="center")
        v-col(cols="12" sm="6")
          v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count, totalCount }) }}
      v-row
        v-col
          v-data-table(
            :headers="headers"
            :items="courseHandouts"
            :loading="loading"
            hide-default-footer
            disable-pagination
          )
            template(#item.user="{ item }")
              user-link(:user="item.user")
            template(#item.description="{ item }")
              a(:href="`/${item.file.src}`") {{ item.description }}
            template(#item.createdAt="{ item }")
                | {{ dateTimeHM(item.createdAt) }}
            template(#item.actions="{ item }")
              apollo-mutation(
                v-slot="{ mutate }"
                :mutation="require('~/gql/eleden/mutations/process/delete_handouts.graphql')"
                :variables="{ handoutIds: item.id }"
                :update="(cache, result) => deleteUpdate(cache, result)"
                tag
              )
                delete-menu(
                  v-slot="{ on: onDelete }"
                  :item-name="$t('process.course.handout.deleteItemName')"
                  @confirm="mutate"
                )
                  v-tooltip(bottom)
                    template(#activator="{ on: onTooltip }")
                      v-btn(v-on="{  ...onDelete, ...onTooltip }" color="error" icon)
                        v-icon mdi-delete
                    span {{ $t('process.course.handout.tooltips.delete') }}
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import type { PropType } from '#app'
import {
  CourseType,
  PeriodType,
  AddHandoutMutationVariables,
  PeriodsQuery,
  PeriodsQueryVariables,
  CourseHandoutsQuery,
  CourseHandoutsQueryVariables
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import {
  useI18n,
  useCommonQuery,
  useQueryRelay,
  useDebounceSearch,
  useFilters,
  useCursorPagination
} from '~/composables'
import courseHandoutsQuery from '~/gql/eleden/queries/process/course_handouts.graphql'
import periodsQuery from '~/gql/eleden/queries/process/periods.graphql'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

export default defineComponent({
  components: { QueryDataFilter, DeleteMenu, MutationModalForm, UserLink },
  props: {
    role: { type: Number, required: true },
    course: { type: Object as PropType<CourseType>, required: true }
  },
  setup (props) {
    const { t, tc } = useI18n()
    const { dateTimeHM } = useFilters()

    const periodFilter = ref<PeriodType[]>([])
    const period = ref<PeriodType | null>(null)
    const description = ref<string>('')
    const handoutFile = ref<File | null>(null)

    const canChangeHandouts = computed<boolean>(() => (props.role === Role.Teacher || props.role === Role.Admin))

    const headers = computed<DataTableHeader[]>(() => {
      const result: DataTableHeader[] = [
        {
          text: t('process.course.handout.tableHeaders.description') as string,
          value: 'description'
        },
        {
          text: t('process.course.handout.tableHeaders.user') as string,
          value: 'user'
        },
        {
          text: t('process.course.handout.tableHeaders.createdAt') as string,
          value: 'createdAt'
        },
        {
          text: t('process.course.handout.tableHeaders.period') as string,
          value: 'period.name',
          align: 'center'
        }
      ]
      if (canChangeHandouts.value) {
        result.push({
          text: t('process.course.handout.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center'
        })
      }
      return result
    })

    const addHandoutVariables = computed<AddHandoutMutationVariables>(() => ({
      courseId: props.course.id,
      periodId: period.value ? period.value.id : '',
      description: description.value,
      file: handoutFile.value
    }))

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: courseHandouts,
      loading,
      pagination: { count, totalCount },
      addUpdate,
      deleteUpdate
    } = useQueryRelay<CourseHandoutsQuery, CourseHandoutsQueryVariables>({
      document: courseHandoutsQuery,
      variables: () => ({
        courseId: props.course.id,
        periodIds: periodFilter.value.length
          ? periodFilter.value.map((period: PeriodType) => period.id)
          : undefined,
        search: debounceSearch.value || '',
        first: 10
      })
    },
    {
      pagination: useCursorPagination(),
      fetchScroll: typeof document === 'undefined' ? null : document
    }
    )

    const { data: periods } = useCommonQuery<PeriodsQuery, PeriodsQueryVariables>({
      document: periodsQuery
    })

    const getFilterMessages = (filterName: string, multiple: boolean = false): FilterMessages => {
      return {
        title: t(`process.course.handout.filters.${filterName}.title`) as string,
        noFiltrationMessage: t(`process.course.handout.filters.${filterName}.noFiltrationMessage`) as string,
        multipleMessageFunction: multiple
          ? (name, restLength) =>
              tc(`process.course.handout.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
          : undefined
      }
    }

    return {
      dateTimeHM,
      periodFilter,
      period,
      description,
      handoutFile,
      canChangeHandouts,
      headers,
      addHandoutVariables,
      courseHandouts,
      loading,
      count,
      totalCount,
      search,
      addUpdate,
      deleteUpdate,
      periods,
      getFilterMessages
    }
  }
})
</script>
