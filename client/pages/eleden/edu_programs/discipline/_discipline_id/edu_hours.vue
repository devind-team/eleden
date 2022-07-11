<template lang="pug">
v-card
  v-card-title {{ $t('eduPrograms.discipline.eduHours.name') }}
  v-card-text
    v-row
      v-col(v-if="hasPerm('eleden.add_eduhours')")
        v-menu(bottom)
          template(#activator="{ on }")
            v-btn(v-on="on" color="primary")
              v-icon(left) mdi-plus
              | {{ $t('eduPrograms.discipline.eduHours.buttons.add') }}
          v-list
            mutation-modal-form(
              :header="$t('eduPrograms.discipline.eduHours.addForm.header')"
              :button-text="$t('eduPrograms.discipline.eduHours.addForm.buttonText')"
              :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_hours.graphql')"
              :variables="addEduHoursVariables"
              :update="(cache, result) => addUpdate(cache, result, 'eduHour')"
              mutation-name="addEduHours"
              errors-in-alert
              @close="workKind = []; course = 0; semester = 0; value = 0; hoursKind = []"
            )
                template(#activator="{ on }")
                  v-list-item(v-on="on")
                    v-list-item-icon
                      v-icon mdi-form-select
                    v-list-item-content {{ $t('eduPrograms.discipline.eduHours.buttons.fillForm') }}
                template(#form)
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="$t('eduPrograms.discipline.eduHours.addForm.workKind')"
                    rules="required"
                  )
                    v-autocomplete(
                      v-model="workKind"
                      :label="$t('eduPrograms.discipline.eduHours.addForm.workKind')"
                      :items="workKinds"
                      :error-messages="errors"
                      :success="valid"
                      item-text="name"
                      hide-no-data
                      hide-selected
                      return-object
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="$t('eduPrograms.discipline.eduHours.addForm.courseNumber')"
                    rules="required"
                  )
                    v-select(
                      v-model="course"
                      :label="$t('eduPrograms.discipline.eduHours.addForm.courseNumber')"
                      :items="courses"
                      :error-messages="errors"
                      :success="valid"
                      hide-no-data
                      hide-selected
                      return-object
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="$t('eduPrograms.discipline.eduHours.addForm.semesterNumber')"
                    rules="required"
                  )
                    v-select(
                      v-model="semester"
                      :label="$t('eduPrograms.discipline.eduHours.addForm.semesterNumber')"
                      :items="semesters"
                      :error-messages="errors"
                      :success="valid"
                      hide-no-data
                      hide-selected
                      return-object
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="$t('eduPrograms.discipline.eduHours.addForm.value')"
                    rules="required|numeric|min:1|max:1024"
                  )
                    v-text-field(
                      v-model="value"
                      :label="$t('eduPrograms.discipline.eduHours.addForm.value')"
                      :error-messages="errors"
                      :success="valid"
                    )
                  validation-provider(
                    v-slot="{ errors, valid }"
                    :name="$t('eduPrograms.discipline.eduHours.addForm.hoursKind')"
                    rules="required"
                  )
                    v-select(
                      v-model="hoursKind"
                      :label="$t('eduPrograms.discipline.eduHours.addForm.hoursKind')"
                      :items="hoursKinds"
                      :error-messages="errors"
                      :success="valid"
                      item-text="name"
                      hide-no-data
                      hide-selected
                      return-object
                    )
    v-row(align="center")
      v-col(cols="12" sm="6")
        v-text-field(v-model="search" :label="$t('search')" prepend-icon="mdi-magnify" clearable)
      v-col.text-right(cols="12" sm="6") {{ $t('shownOf', { count: eduHoursCount, totalCount }) }}
    v-row
      v-col
        v-data-table(
          :headers="headers"
          :search="search"
          :items="disciplineEduHours"
          :loading="loading"
          hide-default-footer
          disable-pagination
          @pagination="({ itemsLength }) => eduHoursCount = itemsLength"
        )
          template(#item.actions="{ item }")
            apollo-mutation(
              v-if="hasPerm('eleden.delete_eduhours')"
              v-slot="{ mutate }"
              :mutation="require('~/gql/eleden/mutations/edu_programs/delete_edu_hour.graphql')"
              :variables="{ eduHourId: item.id }"
              :update="(cache, result) => deleteUpdate(cache, result)"
              tag="span"
            )
              delete-menu(
                v-slot="{ on: onDelete }"
                :item-name="$t('eduPrograms.discipline.eduHours.deleteItemName')"
                @confirm="mutate"
              )
                v-tooltip(bottom)
                  template(#activator="{ on: onTooltip }")
                    v-btn(v-on="{  ...onDelete, ...onTooltip }" color="error" icon)
                      v-icon mdi-delete
                  span {{ $t('eduPrograms.discipline.eduHours.tooltips.delete') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, ref, computed, toRef } from '#app'
import { DataTableHeader } from 'vuetify'
import {
  DisciplineType,
  HoursKindType,
  WorkKindType,
  AddEduHoursMutationVariables,
  DisciplineEduHoursQuery,
  DisciplineEduHoursQueryVariables,
  WorkKindsQuery,
  WorkKindsQueryVariables,
  HoursKindsQuery,
  HoursKindsQueryVariables
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useCommonQuery } from '~/composables'
import disciplineEduHoursQuery from '~/gql/eleden/queries/education/discipline_edu_hours.graphql'
import hoursKindsQuery from '~/gql/eleden/queries/education/hours_kinds.graphql'
import workKindsQuery from '~/gql/eleden/queries/process/work_kinds.graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

export default defineComponent({
  components: { MutationModalForm, DeleteMenu },
  props: {
    discipline: { type: Object as PropType<DisciplineType>, required: true }
  },
  setup (props) {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')

    const search = ref<string>('')
    const course = ref<number | null>(null)
    const semester = ref<number | null>(null)
    const value = ref<number | null>(null)
    const hoursKind = ref<HoursKindType | null>(null)
    const workKind = ref<WorkKindType | null>(null)
    const eduHoursCount = ref<number>(0)

    const courses: number[] = [1, 2, 3, 4, 5, 6]
    const semesters: number[] = [1, 2]

    const headers = computed<DataTableHeader[]>(() => {
      const headers: DataTableHeader[] = [
        {
          text: t('eduPrograms.discipline.eduHours.tableHeaders.workKind.name') as string,
          value: 'workKind.name'
        },
        {
          text: t('eduPrograms.discipline.eduHours.tableHeaders.courseNumber') as string,
          value: 'courseNumber',
          align: 'center'
        },
        {
          text: t('eduPrograms.discipline.eduHours.tableHeaders.semesterNumber') as string,
          value: 'semesterNumber',
          align: 'center'
        },
        {
          text: t('eduPrograms.discipline.eduHours.tableHeaders.value') as string,
          value: 'value',
          align: 'center'
        },
        {
          text: t('eduPrograms.discipline.eduHours.tableHeaders.hoursKind.name') as string,
          value: 'hoursKind.name'
        }
      ]
      if (hasPerm.value('eleden.delete_eduhours')) {
        headers.push({
          text: t('eduPrograms.discipline.eduHours.tableHeaders.actions') as string,
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    })

    const addEduHoursVariables = computed<AddEduHoursMutationVariables>(() => ({
      disciplineId: props.discipline.id,
      workKindId: workKind.value ? workKind.value.id : '',
      courseNumber: course.value!,
      semesterNumber: semester.value!,
      value: value.value!,
      hoursKindId: hoursKind.value ? hoursKind.value.id : ''
    }))

    const totalCount = computed<number>(() => (
      disciplineEduHours.value ? disciplineEduHours.value.length : 0
    ))

    const {
      data: disciplineEduHours,
      loading,
      addUpdate,
      deleteUpdate
    } = useCommonQuery<DisciplineEduHoursQuery, DisciplineEduHoursQueryVariables>({
      document: disciplineEduHoursQuery,
      variables: () => ({ disciplineId: props.discipline.id })
    })

    const { data: hoursKinds } = useCommonQuery<HoursKindsQuery, HoursKindsQueryVariables>({
      document: hoursKindsQuery
    })

    const { data: workKinds } = useCommonQuery<WorkKindsQuery, WorkKindsQueryVariables>({
      document: workKindsQuery
    })

    return {
      hasPerm,
      search,
      courses,
      course,
      semesters,
      semester,
      value,
      hoursKind,
      workKind,
      eduHoursCount,
      headers,
      addEduHoursVariables,
      totalCount,
      disciplineEduHours,
      loading,
      addUpdate,
      deleteUpdate,
      hoursKinds,
      workKinds
    }
  }
})
</script>
