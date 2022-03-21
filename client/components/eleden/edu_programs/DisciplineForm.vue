<template lang="pug">
  div
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('code')"
      rules="required|min:4|max:1024"
    )
      v-text-field(
        v-model="discipline.code"
        :label="t('code')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('name')"
      rules="required|min:4|max:1024"
    )
      v-text-field(
        v-model="discipline.name"
        :label="t('name')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-if="hasPerm('eleden.change_discipline_additional_fields')"
      v-slot="{ errors, valid }"
      :name="t('viewId')"
      rules="required"
    )
      v-select(
        v-model="discipline.view"
        :loading="$apollo.queries.disciplineViews.loading"
        :items="disciplineViews"
        :label="t('viewId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
        return-object
      )
    v-autocomplete(
      v-if="hasPerm('eleden.change_discipline_additional_fields')"
      v-model="discipline.parent"
      v-stream:update:search-input="searchStreamParentDisciplines$"
      :loading="$apollo.queries.parentDisciplines.loading"
      :label="t('parentId')"
      :items="parentDisciplines"
      :filter="filterParentDisciplines"
      item-value="id"
      success
      hide-no-data
      hide-selected
      clearable
      return-object
    )
      template(#selection="{ item }") {{ item.code }} {{ item.name }}
      template(#item="{ item }") {{ item.code }} {{ item.name }}
    v-autocomplete(
      v-model="discipline.users"
      v-stream:update:search-input="searchStreamUsers$"
      :loading="$apollo.queries.users.loading"
      :label="t('userIds')"
      :items="users"
      :filter="filterUsers"
      item-value="id"
      multiple
      chips
      deletable-chips
      success
      hide-no-data
      hide-selected
      clearable
      return-object
    )
      template(#selection="{ item }")
        v-chip(close @click:close="discipline.users = discipline.users.filter(user => user !== item)")
          | {{ $getUserFullName(item) }}
      template(#item="{ item }")
        v-list-item-avatar
          avatar-dialog(:item="item")
        v-list-item-content
          v-list-item-title {{ $getUserFullName(item) }}
          v-list-item-subtitle {{ item.username }}
    file-field(
      v-model="discipline.workProgram"
      :existing-file.sync="discipline.existingWorkProgram"
      :label="t('workProgram')"
      success
      clearable
    )
    file-field(
      v-model="discipline.annotation"
      :existing-file.sync="discipline.existingAnnotation"
      :label="t('annotation')"
      success
      clearable
    )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import { Subject } from 'rxjs'
import {
  DisciplineType,
  UserType,
  DisciplineViewType,
  EduProgramType,
  DisciplinesQueryVariables
} from '~/types/graphql'
import AvatarDialog from '~/components/users/AvatarDialog.vue'
import FileField, { ExistingFile } from '~/components/common/FileField.vue'

export type InputDiscipline = {
  id?: string,
  code: string,
  name: string,
  annotation?: File | null,
  workProgram?: File | null,
  existingAnnotation?: ExistingFile,
  existingWorkProgram?: ExistingFile,
  view?: DisciplineViewType | null,
  parent?: DisciplineType | null,
  users: UserType[],
  methodologicalSupport?: File[]
}

@Component<DisciplineForm>({
  components: { AvatarDialog, FileField },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' })
  },
  domStreams: ['searchStreamParentDisciplines$', 'searchStreamUsers$'],
  subscriptions () {
    const searchParentDisciplines$ = this.searchStreamParentDisciplines$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    const searchUsers$ = this.searchStreamUsers$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchParentDisciplines$, searchUsers$ }
  },
  apollo: {
    disciplineViews: {
      query: require('~/gql/eleden/queries/education/discipline_views.graphql'),
      skip () {
        return !this.hasPerm('eleden.change_discipline_additional_fields')
      }
    },
    parentDisciplines: {
      query: require('~/gql/eleden/queries/education/disciplines.graphql'),
      fetchPolicy: 'cache-and-network',
      variables (): DisciplinesQueryVariables {
        return {
          eduProgramId: this.eduProgram.id,
          search: this.searchParentDisciplines$
        }
      },
      update ({ disciplines }): DisciplineType[] {
        const allDisciplines = disciplines.edges.map((e: { node?: DisciplineType }) => e.node)
        return this.discipline!.id
          ? allDisciplines.filter((discipline: DisciplineType) => discipline.id !== this.discipline!.id)
          : allDisciplines
      },
      skip () {
        return !this.hasPerm('eleden.change_discipline_additional_fields')
      }
    },
    users: {
      query: require('~/gql/eleden/queries/core/search_users.graphql'),
      variables () { return { first: 10, search: this.searchUsers$ } },
      update ({ users }): UserType[] {
        return [...this.discipline!.users, ...users.edges
          .map((e: { node?: UserType }) => e.node)
          .filter((user: UserType) => !this.discipline!.users.find(disciplineUser => user.id === disciplineUser.id))]
      }
    }
  }
})

export default class DisciplineForm extends Vue {
  @Prop({ type: Object as PropType<EduProgramType>, required: true }) readonly eduProgram!: EduProgramType
  @Prop({ type: Object as PropType<InputDiscipline> }) readonly discipline!: InputDiscipline | undefined

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly disciplineViews!: DisciplineViewType[]
  readonly parentDisciplines!: DisciplineType[]
  readonly users!: UserType[]

  searchParentDisciplines$: string = ''
  searchStreamParentDisciplines$: Subject<any> = new Subject()
  searchUsers$: string = ''
  searchStreamUsers$: Subject<any> = new Subject()

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.discipline.form.${path}`, values) as string
  }

  /**
   * Фильтрация родительских дисциплин
   * @param item
   * @param queryText
   * @return
   */
  filterParentDisciplines (item: DisciplineType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const code: string = item.code.toLocaleLowerCase()
    const name: string = item.name.toLocaleLowerCase()
    return code.includes(qt) || name.includes(qt)
  }

  /**
   * Фильтрация пользователей
   * @param item
   * @param queryText
   * @return
   */
  filterUsers (item: UserType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const ln: string = item.lastName.toLocaleLowerCase()
    const fn: string = item.firstName.toLocaleLowerCase()
    const sn: string = item.sirName!.toLocaleLowerCase()
    const un: string = item.username.toLocaleLowerCase()
    const em: string = item.email.toLocaleLowerCase()
    return ln.includes(qt) || fn.includes(qt) || un.includes(qt) || em.includes(qt) || sn.includes(qt)
  }
}
</script>
