<template lang="pug">
v-card
  v-card-title
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    span {{ t('name') }}
  v-card-text
    v-row
      v-col
        v-menu(v-if="canChangeHandouts" bottom)
          template(#activator="{ on }")
            v-btn.mr-3(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ t('buttons.add') }}
          v-list
            mutation-modal-form(
              :header="t('addForm.header')"
              :button-text="t('addForm.buttonText')"
              :mutation="require('~/gql/eleden/mutations/process/add_handout.graphql')"
              :variables="addHandoutVariables"
              :update="addHandoutUpdate"
              i18n-path="process.course.handout.addForm"
              mutation-name="addHandout"
              @close="period = []; handoutFile = null; description = ''"
            )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ t('buttons.fillForm') }}
                template(#form)
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addForm.period')"
                    rules="required"
                  )
                    v-autocomplete(
                      v-model="period"
                      :label="t('addForm.period')"
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
                    :name="t('addForm.description')"
                    rules="required"
                  )
                    v-text-field(
                      v-model="description"
                      :label="t('addForm.description')"
                      :error-messages="errors"
                      :success="valid"
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="t('addForm.file')"
                    rules="required"
                  )
                    v-file-input(
                      v-model="handoutFile"
                      :label="t('addForm.file')"
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
        v-text-field(v-stream:input="searchStreamHandouts$" :label="t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6")
        | {{ t('shownOf', { count: courseHandouts && courseHandouts.length, totalCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :items="courseHandouts"
          :loading="$apollo.queries.courseHandouts.loading"
          hide-default-footer
          disable-pagination
        )
          template(#item.user="{ item }")
            user-link(:user="item.user")
          template(#item.description="{ item }")
            a(:href="`/${item.file.src}`") {{ item.description }}
          template(#item.createdAt="{ item }")
              | {{ $filters.dateTimeHM(item.createdAt) }}
          template(#item.actions="{ item }")
            apollo-mutation(
              v-slot="{ mutate }"
              :mutation="require('~/gql/eleden/mutations/process/delete_handouts.graphql')"
              :variables="{ handoutIds: item.id }"
              :update="(store, result) => deleteHandoutsUpdate(store, result, item)"
              tag
            )
              delete-menu(
                v-slot="{ on: onDelete }"
                :item-name="t('deleteItemName')"
                @confirm="mutate"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip }")
                    v-btn(v-on="{  ...onDelete, ...onTooltip }" color="error" icon)
                      v-icon mdi-delete
                  span {{ t('tooltips.delete') }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { DataTableHeader } from 'vuetify'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import {
  CourseType,
  HandoutType,
  CourseHandoutsQueryVariables,
  PeriodType,
  HandoutTypeEdge,
  DeleteHandoutsMutationPayload,
  AddHandoutMutationVariables,
  AddHandoutMutationPayload
} from '~/types/graphql'
import { FilterMessages } from '~/types/filters'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'
import QueryDataFilter from '~/components/common/filters/QueryDataFilter.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'
import ChangeHandouts from '~/components/eleden/process/ChangeHandouts.vue'
import CourseHandoutsQuery from '~/gql/eleden/queries/process/course_handouts.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'

type DeleteHandoutsData = {
  data: { deleteHandouts: DeleteHandoutsMutationPayload }
}
type AddHandoutData = {
  data: { addHandout: AddHandoutMutationPayload }
}

@Component<CourseIdHandout>({
  components: { QueryDataFilter, DeleteMenu, ChangeHandouts, MutationModalForm, UserLink },
  computed: {
    canChangeHandouts (): boolean {
      return this.role === Role.Teacher || this.role === Role.Admin
    },
    headers (): DataTableHeader[] {
      const result: DataTableHeader[] = [
        {
          text: this.t('tableHeaders.description'),
          value: 'description'
        },
        {
          text: this.t('tableHeaders.user'),
          value: 'user'
        },
        {
          text: this.t('tableHeaders.createdAt'),
          value: 'createdAt'
        },
        {
          text: this.t('tableHeaders.period'),
          value: 'period.name',
          align: 'center'
        }
      ]
      if (this.canChangeHandouts) {
        result.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center'
        })
      }
      return result
    },
    courseHandoutsVariables (): CourseHandoutsQueryVariables {
      return {
        courseId: this.course.id,
        periodIds: this.periodFilter.length
          ? this.periodFilter.map((period: PeriodType) => period.id)
          : undefined,
        search: this.searchHandouts$ || '',
        first: this.pageSize
      }
    },
    addHandoutVariables (): AddHandoutMutationVariables {
      return {
        courseId: this.course.id,
        periodId: this.period ? this.period.id : '',
        description: this.description,
        file: this.handoutFile
      }
    }
  },
  domStreams: ['searchStreamHandouts$'],
  subscriptions () {
    const searchHandouts$ = this.searchStreamHandouts$.pipe(
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
        !this.$apollo.queries.courseHandouts.loading &&
        this.page * this.pageSize < this.totalCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreHandouts()
      })
    )
    return { searchHandouts$, al$ }
  },
  apollo: {
    courseHandouts: {
      query: CourseHandoutsQuery,
      variables (): CourseHandoutsQueryVariables {
        return this.courseHandoutsVariables
      },
      update ({ courseHandouts }): HandoutType[] {
        this.totalCount = courseHandouts.totalCount
        this.page = Math.ceil(courseHandouts.edges.length / this.pageSize)
        return [...courseHandouts.edges.map((e: HandoutTypeEdge) => e.node)]
      }
    },
    periods: {
      query: require('~/gql/eleden/queries/process/periods.graphql')
    }
  }
})
export default class CourseIdHandout extends Vue {
  @Prop({ type: Number, required: true }) readonly role!: Role
  @Prop({ type: Object, required: true }) readonly course!: CourseType

  readonly canChangeHandouts!: boolean
  readonly courseHandouts!: HandoutType[]
  readonly courseHandoutsVariables!: CourseHandoutsQueryVariables
  readonly periods!: PeriodType
  readonly addHandoutVariables!: AddHandoutMutationVariables

  searchStreamHandouts$: Subject<any> = new Subject()
  searchHandouts$: string = ''
  periodFilter: PeriodType[] = []
  period: PeriodType | null = null
  description: string = ''
  handoutFile: File | null = null
  page: number = 1
  pageSize: number = 10
  totalCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.handout.${path}`, values) as string
  }

  /**
   * Получение сообщений для фильтра
   * @param filterName
   * @param multiple
   * @return
   */
  getFilterMessages (filterName: string, multiple: boolean = false): FilterMessages {
    return {
      title: this.t(`filters.${filterName}.title`),
      noFiltrationMessage: this.t(`filters.${filterName}.noFiltrationMessage`),
      multipleMessageFunction: multiple
        ? (name, restLength) =>
            this.$tc(`process.course.handout.filters.${filterName}.multipleMessage`, restLength, { name, restLength })
        : undefined
    }
  }

  /**
   * Получение дополнительных методических рекомендаций
   */
  async fetchMoreHandouts () {
    await this.$apollo.queries.courseHandouts.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.searchHandouts$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { courseHandouts } }: any) => {
        return {
          courseHandouts: {
            __typename: previousResult.courseHandouts.__typename,
            totalCount: courseHandouts.totalCount,
            edges: [...previousResult.courseHandouts.edges, ...courseHandouts.edges]
          }
        }
      }
    })
  }

  /**
   * Обновление часов по плану после добавления новых часов по плану
   * @param store
   * @param success
   * @param handout
   */
  addHandoutUpdate (
    store: DataProxy,
    { data: { addHandout: { success, handout } } }: AddHandoutData
  ): void {
    if (success) {
      const data: any = store.readQuery({
        query: CourseHandoutsQuery,
        variables: this.courseHandoutsVariables
      })
      data.courseHandouts.edges = [
        { node: handout, __typename: 'HandoutTypeEdge' },
        ...data.courseHandouts.edges
      ]
      data.courseHandouts.edges.splice(
        this.pageSize * Math.max(Math.floor(data.courseHandouts.edges.length / this.pageSize), 1)
      )
      data.courseHandouts.totalCount += 1
      store.writeQuery({
        query: CourseHandoutsQuery,
        variables: this.courseHandoutsVariables,
        data
      })
    }
  }

  /**
   * Обновление часов по плану после удаления часов по плану
   * @param store
   * @param success
   * @param courseHandouts
   */
  deleteHandoutsUpdate (
    store: DataProxy,
    { data: { deleteHandouts: { success } } }: DeleteHandoutsData,
    courseHandouts: HandoutType
  ): void {
    if (success) {
      const data: any = store.readQuery({
        query: CourseHandoutsQuery,
        variables: this.courseHandoutsVariables
      })
      data.courseHandouts.edges = data.courseHandouts.edges.filter((e: any) =>
        e.node.id !== courseHandouts.id)
      data.courseHandouts.totalCount -= 1
      store.writeQuery({
        query: CourseHandoutsQuery,
        variables: this.courseHandoutsVariables,
        data
      })
    }
  }
}
</script>
