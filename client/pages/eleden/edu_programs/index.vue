<template lang="pug">
  bread-crumbs(:items="bc")
    v-card
      v-card-title {{ t('name') }}
      v-card-text
        v-row(align="center")
          v-col(v-if="hasPerm('eleden.add_eduprogram')" cols="12" md="6")
            add-edu-programs(
              v-slot="{ on }"
              :add-edu-program-update="addEduProgramUpdate"
              :add-edu-program-from-plx-update="addEduProgramFromPlxUpdate"
              :add-edu-programs-update="addEduProgramsUpdate"
            )
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('buttons.add') }}
          v-col.text-right(v-if="hasPerm('eleden.view_eduprogram')" cols="12" md="6")
            unload-edu-programs(v-slot="{ on }")
              v-btn(v-on="on" color="success")
                v-icon(left) mdi-upload
                | {{ t('buttons.unload') }}
        v-row(align="center")
          v-col(cols="12" sm="6")
            v-text-field(
              v-stream:input="searchStream$"
              :value="search$"
              :label="t('search')"
              prepend-icon="mdi-magnify"
              clearable
            )
          v-col.text-right(cols="12" sm="6")
            | {{ t('shownOf', { count: eduPrograms && eduPrograms.length, totalCount }) }}
        v-row
          v-col
            v-data-table(
              :headers="headers"
              :items="eduPrograms"
              :loading="$apollo.queries.eduPrograms.loading"
              disable-pagination
              hide-default-footer
            )
              template(#item.direction.name="{ item }")
                nuxt-link(
                  :to="localePath({ name: 'eleden-edu_programs-edu_program_id', params: { edu_program_id: item.id } })"
                ) {{ item.direction.name }} ({{ item.eduForm.shortName }})
              template(#footer v-if="$apollo.queries.eduPrograms.loading")
                v-progress-linear(color="primary" indeterminate)
</template>

<script lang="ts">
import { PropType, AsyncComponent } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { DataTableHeader } from 'vuetify/types'
import { DataProxy } from 'apollo-cache'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, tap } from 'rxjs/operators'
import { BreadCrumbsItem } from '~/types/devind'
import {
  EduProgramType,
  EduProgramsQueryVariables,
  AddEduProgramMutationPayload,
  AddEduProgramFromPlxMutationPayload,
  AddEduProgramsMutationPayload
} from '~/types/graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import AddEduPrograms from '~/components/eleden/edu_programs/AddEduPrograms.vue'
import EduPrograms from '~/gql/eleden/queries/education/edu_programs.graphql'

const UnloadEduPrograms: AsyncComponent = () => import('~/components/eleden/edu_programs/UnloadEduPrograms.vue')

type AddEduProgramData = { data: { addEduProgram: AddEduProgramMutationPayload } }
type AddEduProgramFromPlxData = { data: { addEduProgramFromPlx: AddEduProgramFromPlxMutationPayload } }
type AddEduProgramsData = { data: { addEduPrograms: AddEduProgramsMutationPayload } }

@Component<EduProgramsIndex>({
  components: { BreadCrumbs, AddEduPrograms, UnloadEduPrograms },
  middleware: ['auth'],
  watchQuery: ['search'],
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    headers (): DataTableHeader[] {
      return [
        { text: this.t('tableHeaders.directionCode'), value: 'direction.code' },
        { text: this.t('tableHeaders.directionName'), value: 'direction.name' },
        { text: this.t('tableHeaders.admission'), value: 'admission' },
        { text: this.t('tableHeaders.name'), value: 'name' },
        { text: this.t('tableHeaders.eduLevel'), value: 'direction.eduService.name' }
      ]
    },
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        {
          text: this.t('name'),
          to: this.localePath({ name: 'eleden-edu_programs' }),
          exact: true
        }
      ]
    },
    eduProgramVariables (): EduProgramsQueryVariables {
      return {
        first: this.pageSize,
        offset: 0,
        search: this.search$ || ''
      }
    }
  },
  apollo: {
    eduPrograms: {
      query: EduPrograms,
      variables () {
        return this.eduProgramVariables
      },
      update ({ eduPrograms }) {
        this.totalCount = eduPrograms.totalCount
        this.page = Math.ceil(eduPrograms.edges.length / this.pageSize)
        return eduPrograms.edges.map((e: { node?: EduProgramType }) => e.node)
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
      startWith(this.$route.query.search || '')
    )
    const al$ = fromEvent(document, 'scroll').pipe(
      pluck('target', 'documentElement'),
      debounceTime(100),
      map((target: any) => ({ top: target.scrollTop + window.innerHeight, height: target.offsetHeight })),
      filter(({ top, height }: { top: number, height: number }) => (
        top + 200 >= height &&
        !this.$apollo.queries.eduPrograms.loading &&
        this.page * this.pageSize < this.totalCount)
      ),
      tap(async () => {
        ++this.page
        await this.fetchMoreEduPrograms()
      })
    )
    return { search$, al$ }
  },
  head (): MetaInfo {
    return { title: this.t('name') } as MetaInfo
  }
})
export default class EduProgramsIndex extends Vue {
  @Prop({ type: Array as PropType<BreadCrumbsItem[]>, required: true }) readonly breadCrumbs!: BreadCrumbsItem[]

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly headers!: DataTableHeader[]
  readonly bc!: BreadCrumbsItem[]
  readonly eduProgramVariables!: EduProgramsQueryVariables
  readonly eduPrograms!: EduProgramType[] | undefined

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
    return this.$t(`eduPrograms.${path}`, values) as string
  }

  /**
   * Получение дополнительных образовательных программ
   */
  async fetchMoreEduPrograms () {
    await this.$apollo.queries.eduPrograms.fetchMore({
      variables: {
        first: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
        search: this.search$ || ''
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { eduPrograms } }: any) => {
        return {
          eduPrograms: {
            __typename: previousResult.eduPrograms.__typename,
            totalCount: eduPrograms.totalCount,
            edges: [...previousResult.eduPrograms.edges, ...eduPrograms.edges]
          }
        }
      }
    })
  }

  /**
   * Добавление образовательной программы
   * @param store
   * @param eduProgram
   */
  addEduProgram (store: DataProxy, eduProgram: EduProgramType): void {
    const data: any = store.readQuery({ query: EduPrograms, variables: this.eduProgramVariables })
    ++data.eduPrograms.totalCount
    data.eduPrograms.edges = [{ node: eduProgram, __typename: 'EduProgramTypeEdge' }, ...data.eduPrograms.edges]
    data.eduPrograms.edges.splice(
      this.pageSize * Math.max(Math.floor(data.eduPrograms.edges.length / this.pageSize), 1)
    )
    store.writeQuery({ query: EduPrograms, variables: this.eduProgramVariables, data })
  }

  /**
   * Обновление образовательных программ после добавления образовательной программы
   * @param store
   * @param success
   * @param eduProgram
   */
  addEduProgramUpdate (
    store: DataProxy,
    { data: { addEduProgram: { success, eduProgram } } }: AddEduProgramData
  ): void {
    if (success) {
      this.addEduProgram(store, eduProgram as EduProgramType)
    }
  }

  /**
   * Обновление образовательных программ после добавления образовательной программы из plx файла
   * @param store
   * @param success
   * @param eduProgram
   */
  addEduProgramFromPlxUpdate (
    store: DataProxy,
    { data: { addEduProgramFromPlx: { success, eduProgram } } }: AddEduProgramFromPlxData
  ): void {
    if (success) {
      this.addEduProgram(store, eduProgram as EduProgramType)
    }
  }

  /**
   * Обновление образовательных программ после загрузки образовательных программ
   * @param store
   * @param success
   * @param eduProgram
   */
  addEduProgramsUpdate (
    store: DataProxy,
    { data: { addEduPrograms: { success, eduPrograms } } }: AddEduProgramsData
  ): void {
    if (success) {
      const data: any = store.readQuery({ query: EduPrograms, variables: this.eduProgramVariables })
      data.eduPrograms.totalCount += eduPrograms!.length
      data.eduPrograms.edges = [
        ...eduPrograms!
          .map((eduProgram: any) => ({ node: eduProgram, __typename: 'EduProgramTypeEdge' }))
          .reverse(),
        ...data.eduPrograms.edges
      ]
      data.eduPrograms.edges.splice(
        this.pageSize * Math.max(Math.floor(data.eduPrograms.edges.length / this.pageSize), 1)
      )
      store.writeQuery({ query: EduPrograms, variables: this.eduProgramVariables, data })
    }
  }
}
</script>
