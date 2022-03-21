<template lang="pug">
  v-card
    v-card-title {{ t('name') }}
    v-card-text
      v-row
        v-col(v-if="canAdd")
          v-menu(bottom)
            template(#activator="{ on }")
              v-btn(v-on="on" color="primary")
                v-icon(left) mdi-plus
                | {{ t('buttons.add') }}
            v-list
              mutation-modal-form(
                :header="t('addForm.header')"
                :button-text="t('addForm.buttonText')"
                :mutation="require('~/gql/eleden/mutations/edu_programs/add_edu_hours.graphql')"
                :variables="addEduHoursVariables"
                :update="addEduHourUpdate"
                mutation-name="addEduHours"
                errors-in-alert
                @close="workKind = []; course = 0; semester = 0; value = 0; hoursKind = []"
              )
                  template(#activator="{ on }")
                    v-list-item(v-on="on")
                      v-list-item-icon
                        v-icon mdi-form-select
                      v-list-item-content {{ t('buttons.fillForm') }}
                  template(#form)
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="t('addForm.workKind')"
                      rules="required"
                    )
                      v-autocomplete(
                        v-model="workKind"
                        :label="t('addForm.workKind')"
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
                      :name="t('addForm.courseNumber')"
                      rules="required"
                    )
                      v-select(
                        v-model="course"
                        :label="t('addForm.courseNumber')"
                        :items="courses"
                        :error-messages="errors"
                        :success="valid"
                        hide-no-data
                        hide-selected
                        return-object
                      )
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="t('addForm.semesterNumber')"
                      rules="required"
                    )
                      v-select(
                        v-model="semester"
                        :label="t('addForm.semesterNumber')"
                        :items="semesters"
                        :error-messages="errors"
                        :success="valid"
                        hide-no-data
                        hide-selected
                        return-object
                      )
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="t('addForm.value')"
                      rules="required|numeric|min:1|max:1024"
                    )
                      v-text-field(
                        v-model="value"
                        :label="t('addForm.value')"
                        :error-messages="errors"
                        :success="valid"
                      )
                    validation-provider(
                      v-slot="{ errors, valid }"
                      :name="t('addForm.hoursKind')"
                      rules="required"
                    )
                      v-select(
                        v-model="hoursKind"
                        :label="t('addForm.hoursKind')"
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
          v-text-field(v-model="search" :label="t('search')" prepend-icon="mdi-magnify" clearable)
        v-col.text-right(cols="12" sm="6") {{ t('shownOf', { count: eduHoursCount, totalCount }) }}
      v-row
        v-col
          v-data-table(
            :headers="headers"
            :search="search"
            :items="disciplineEduHours"
            :loading="$apollo.queries.disciplineEduHours.loading"
            hide-default-footer
            disable-pagination
            @pagination="({ itemsLength }) => eduHoursCount = itemsLength"
          )
            template(#item.actions="{ item }")
              apollo-mutation(
                v-if="canDelete"
                v-slot="{ mutate }"
                :mutation="require('~/gql/eleden/mutations/edu_programs/delete_edu_hour.graphql')"
                :variables="{ eduHourId: item.id }"
                :update="(store, result) => deleteEduHourUpdate(store, result, item)"
                tag="span"
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
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DataProxy } from 'apollo-cache'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify'
import DisciplineEduHoursQuery from '~/gql/eleden/queries/education/discipline_edu_hours.graphql'
import {
  DisciplineType,
  EduHoursType,
  DisciplineEduHoursQueryVariables,
  HoursKindsQueryVariables,
  HoursKindType,
  WorkKindsQueryVariables,
  WorkKindType,
  AddEduHoursMutationVariables,
  DeleteEduHourMutationPayload,
  AddEduHoursMutationPayload
} from '~/types/graphql'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DeleteMenu from '~/components/common/menu/DeleteMenu.vue'

type AddEduHoursData = {
  data: { addEduHours: AddEduHoursMutationPayload }
}
type DeleteEduHoursData = {
  data: { deleteEduHour: DeleteEduHourMutationPayload }
}

@Component<DisciplineIdEduHours>({
  components: { MutationModalForm, DeleteMenu },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    canAdd (): boolean {
      return this.hasPerm('eleden.add_eduhours')
    },
    canDelete (): boolean {
      return this.hasPerm('eleden.delete_eduhours')
    },
    headers (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        {
          text: this.t('tableHeaders.workKind.name'),
          value: 'workKind.name'
        },
        {
          text: this.t('tableHeaders.courseNumber'),
          value: 'courseNumber',
          align: 'center'
        },
        {
          text: this.t('tableHeaders.semesterNumber'),
          value: 'semesterNumber',
          align: 'center'
        },
        {
          text: this.t('tableHeaders.value'),
          value: 'value',
          align: 'center'
        },
        {
          text: this.t('tableHeaders.hoursKind.name'),
          value: 'hoursKind.name'
        }
      ]
      if (this.canDelete) {
        headers.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers
    },
    disciplineEduHoursVariables (): DisciplineEduHoursQueryVariables {
      return { disciplineId: this.discipline.id }
    },
    addEduHoursVariables (): AddEduHoursMutationVariables {
      return {
        disciplineId: this.discipline.id,
        workKindId: this.workKind ? this.workKind.id : '',
        courseNumber: this.course!,
        semesterNumber: this.semester!,
        value: this.value!,
        hoursKindId: this.hoursKind ? this.hoursKind.id : ''
      }
    },
    totalCount (): number {
      return this.disciplineEduHours ? this.disciplineEduHours.length : 0
    }
  },
  apollo: {
    disciplineEduHours: {
      query: DisciplineEduHoursQuery,
      variables (): DisciplineEduHoursQueryVariables {
        return this.disciplineEduHoursVariables
      }
    },
    hoursKinds: {
      query: require('~/gql/eleden/queries/education/hours_kinds.graphql'),
      variables (): HoursKindsQueryVariables {
        return this.hoursKindsVariables
      }
    },
    workKinds: {
      query: require('~/gql/eleden/queries/process/work_kinds.graphql'),
      variables (): WorkKindsQueryVariables {
        return this.workKindsVariables
      }
    }
  }
})
export default class DisciplineIdEduHours extends Vue {
  @Prop({ type: Object as PropType<DisciplineType>, required: true }) readonly discipline!: DisciplineType

  readonly hasPerm!: (perm: string | string[], or?: boolean) => boolean
  readonly canAdd!: boolean
  readonly canDelete!: boolean
  readonly headers!: DataTableHeader[]
  readonly disciplineEduHoursVariables!: DisciplineEduHoursQueryVariables
  readonly disciplineEduHours!: EduHoursType[] | undefined
  readonly hoursKinds!: HoursKindType | undefined
  readonly workKinds!: WorkKindType | undefined
  readonly totalCount!: number

  search: string = ''
  courses: number[] = [1, 2, 3, 4, 5, 6]
  course: number | null = null
  semesters: number[] = [1, 2]
  semester: number | null = null
  value: number | null = null
  hoursKind: HoursKindType | null = null
  workKind: WorkKindType | null = null
  eduHoursCount: number = 0

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.discipline.eduHours.${path}`, values) as string
  }

  /**
   * Обновление часов по плану после добавления новых часов по плану
   * @param store
   * @param success
   * @param eduHour
   */
  addEduHourUpdate (
    store: DataProxy,
    { data: { addEduHours: { success, eduHour } } }: AddEduHoursData
  ): void {
    if (success) {
      const data: any = store.readQuery({
        query: DisciplineEduHoursQuery,
        variables: this.disciplineEduHoursVariables
      })
      data.disciplineEduHours = [
        eduHour,
        ...data.disciplineEduHours
      ]
      store.writeQuery({
        query: DisciplineEduHoursQuery,
        variables: this.disciplineEduHoursVariables,
        data
      })
    }
  }

  /**
   * Обновление часов по плану после удаление часов по плану
   * @param store
   * @param success
   * @param disciplineEduHours
   */
  deleteEduHourUpdate (
    store: DataProxy,
    { data: { deleteEduHour: { success } } }: DeleteEduHoursData,
    disciplineEduHours: EduHoursType
  ): void {
    if (success) {
      const data: any = store.readQuery({
        query: DisciplineEduHoursQuery,
        variables: this.disciplineEduHoursVariables
      })
      data.disciplineEduHours = data.disciplineEduHours.filter((e: any) =>
        e.id !== disciplineEduHours.id)
      store.writeQuery({
        query: DisciplineEduHoursQuery,
        variables: this.disciplineEduHoursVariables,
        data
      })
    }
  }
}
</script>
