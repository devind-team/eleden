<template lang="pug">
  div
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('eduPrograms.discipline.form.code')"
      rules="required|min:4|max:1024"
    )
      v-text-field(
        v-model="discipline.code"
        :label="$t('eduPrograms.discipline.form.code')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="$t('eduPrograms.discipline.form.name')"
      rules="required|min:4|max:1024"
    )
      v-text-field(
        v-model="discipline.name"
        :label="$t('eduPrograms.discipline.form.name')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-if="hasPerm('eleden.change_discipline_additional_fields')"
      v-slot="{ errors, valid }"
      :name="$t('eduPrograms.discipline.form.viewId')"
      rules="required"
    )
      v-select(
        v-model="discipline.view"
        :loading="disciplineViewsLoading"
        :items="disciplineViews"
        :label="$t('eduPrograms.discipline.form.viewId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        item-value="id"
        return-object
      )
    v-autocomplete(
      v-if="hasPerm('eleden.change_discipline_additional_fields')"
      v-model="discipline.parent"
      :search-input="parentDisciplinesSearch"
      :loading="parentDisciplinesLoading"
      :label="$t('eduPrograms.discipline.form.parentId')"
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
      :search-input.sync="usersSearch"
      :loading="usersLoading"
      :label="$t('eduPrograms.discipline.form.userIds')"
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
          | {{ getUserFullName(item) }}
      template(#item="{ item }")
        v-list-item-avatar
          avatar-dialog(:item="item")
        v-list-item-content
          v-list-item-title {{ getUserFullName(item) }}
          v-list-item-subtitle {{ item.username }}
    file-field(
      v-model="discipline.workProgram"
      :existing-file="discipline.existingWorkProgram"
      :label="$t('eduPrograms.discipline.form.workProgram')"
      success
      clearable
    )
    file-field(
      v-model="discipline.annotation"
      :existing-file="discipline.existingAnnotation"
      :label="$t('eduPrograms.discipline.form.annotation')"
      success
      clearable
    )
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent, toRef } from '#app'
import {
  DisciplineType,
  UserType,
  DisciplineViewType,
  EduProgramType,
  DisciplineViewsQuery,
  DisciplineViewsQueryVariables,
  DisciplinesQuery,
  DisciplinesQueryVariables,
  SearchUsersQuery,
  SearchUsersQueryVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useCommonQuery, useDebounceSearch, useQueryRelay, useFilters } from '~/composables'
import disciplineViewsQuery from '~/gql/eleden/queries/education/discipline_views.graphql'
import disciplinesQuery from '~/gql/eleden/queries/education/disciplines.graphql'
import searchUsersQuery from '~/gql/eleden/queries/core/search_users.graphql'
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

export default defineComponent({
  components: { AvatarDialog, FileField },
  props: {
    eduProgram: { type: Object as PropType<EduProgramType>, required: true },
    discipline: { type: Object as PropType<InputDiscipline>, default: undefined }
  },
  setup (props) {
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { getUserFullName } = useFilters()

    const {
      data: disciplineViews,
      loading: disciplineViewsLoading
    } = useCommonQuery<DisciplineViewsQuery, DisciplineViewsQueryVariables>({
      document: disciplineViewsQuery,
      options: () => ({
        enabled: hasPerm.value('eleden.change_discipline_additional_fields')
      })
    })

    const { search: parentDisciplinesSearch, debounceSearch: parentDisciplinesDebounceSearch } = useDebounceSearch()
    const {
      data: parentDisciplinesData,
      loading: parentDisciplinesLoading
    } = useQueryRelay<DisciplinesQuery, DisciplinesQueryVariables, DisciplineType>({
      document: disciplinesQuery,
      variables: () => ({
        eduProgramId: props.eduProgram.id,
        search: parentDisciplinesDebounceSearch.value
      }),
      options: () => ({
        fetchPolicy: 'cache-and-network',
        enabled: hasPerm.value('eleden.change_discipline_additional_fields')
      })
    })
    const parentDisciplines = computed<DisciplineType[]>(() => (
      props.discipline
        ? parentDisciplinesData.value.filter(discipline => discipline.id !== props.discipline!.id)
        : parentDisciplinesData.value
    ))

    const { search: usersSearch, debounceSearch: usersDebounceSearch } = useDebounceSearch()
    const {
      data: usersData,
      loading: usersLoading
    } = useQueryRelay<SearchUsersQuery, SearchUsersQueryVariables, UserType>({
      document: searchUsersQuery,
      variables: () => ({ search: usersDebounceSearch.value })
    })
    const users = computed<UserType[]>(() => ([...props.discipline.users, ...usersData.value]))

    const filterParentDisciplines = (item: DisciplineType, queryText: string): boolean => {
      const qt: string = queryText.toLocaleLowerCase()
      const code: string = item.code.toLocaleLowerCase()
      const name: string = item.name.toLocaleLowerCase()
      return code.includes(qt) || name.includes(qt)
    }

    const filterUsers = (item: UserType, queryText: string): boolean => {
      const qt: string = queryText.toLocaleLowerCase()
      const ln: string = item.lastName.toLocaleLowerCase()
      const fn: string = item.firstName.toLocaleLowerCase()
      const sn: string = item.sirName!.toLocaleLowerCase()
      const un: string = item.username.toLocaleLowerCase()
      const em: string = item.email.toLocaleLowerCase()
      return ln.includes(qt) || fn.includes(qt) || un.includes(qt) || em.includes(qt) || sn.includes(qt)
    }

    return {
      hasPerm,
      disciplineViews,
      disciplineViewsLoading,
      parentDisciplines,
      parentDisciplinesLoading,
      parentDisciplinesSearch,
      users,
      usersLoading,
      usersSearch,
      filterParentDisciplines,
      filterUsers,
      getUserFullName
    }
  }
})
</script>
