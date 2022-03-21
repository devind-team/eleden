<template lang="pug">
  tree-data-table(
    :headers="headers"
    :search="search"
    :items="disciplinesTree"
    :loading="loading"
    :custom-filter="filter"
    :flat-filter="item => !item.children.length"
    :sort-by.sync="sortBy"
    hide-default-footer
    disable-pagination
    @items="itemsHandler"
  )
    template(#item.name="{ item }")
      nuxt-link(v-if="item.children.length === 0" :to="toDiscipline(item)") {{ item.name }}
      span(v-else) {{ item.name }}
    template(#item.view.name="{ item }")
      span(v-if="item.children.length === 0") {{ item.view.name }}
      strong(v-else) &mdash;
    template(#item.users="{ item }")
      template(v-if="item.users.length")
        template(v-for="(user, i) in item.users")
          user-link(:key="user.id" :user="user")
          span(v-if="i !== item.users.length - 1") ,#{' '}
      strong(v-else) &mdash;
    template(#item.annotation="{ item }")
      v-tooltip(v-if="item.annotation" bottom)
        template(#activator="{ on }")
          v-btn(v-on="on" :href="`/${item.annotation}`" target="_blank" color="success" icon)
            v-icon mdi-download
        span {{ t('open') }}
      strong(v-else) &mdash;
    template(#item.workProgram="{ item }")
      v-tooltip(v-if="item.workProgram" bottom)
        template(#activator="{ on }")
          v-btn(v-on="on" :href="`/${item.workProgram}`" target="_blank" color="success" icon)
            v-icon mdi-download
        span {{ t('open') }}
      strong(v-else) &mdash;
    template(#item.actions="{ item }")
      mutation-modal-form(
        :header="t('changeForm.header')"
        :subheader="t('changeForm.subheader', { updatedAt: $filters.dateTimeHM(item.updatedAt) })"
        :mutation="require('~/gql/eleden/mutations/edu_programs/change_discipline.graphql')"
        :variables="changeVariables"
        :button-text="t('changeForm.buttonText')"
        mutation-name="changeDiscipline"
      )
        template(#form)
          discipline-form(
            :edu-program="item.eduProgram"
            :discipline="inputDiscipline"
          )
        template(#activator="{ on: onChange }")
          v-tooltip(bottom)
            template(#activator="{ on: onTooltip}")
              v-btn(
                v-on="{ ...onChange, ...onTooltip }"
                @click="discipline = item; inputDiscipline = getInputDiscipline()"
                color="success"
                icon
              )
                v-icon mdi-pencil
            span {{ t('tooltips.change') }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify'
import {
  UserType,
  EduProgramType,
  DisciplineType,
  ChangeDisciplineMutationVariables
} from '~/types/graphql'
import TreeDataTable, { ItemWithProps } from '~/components/common/tables/TreeDataTable.vue'
import UserLink from '~/components/eleden/user/UserLink.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import DisciplineForm, { InputDiscipline } from '~/components/eleden/edu_programs/DisciplineForm.vue'

type DisciplineNode = DisciplineType & { children: DisciplineType[], isChild: boolean }

@Component<DisciplinesTable>({
  components: { TreeDataTable, UserLink, MutationModalForm, DisciplineForm },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    sortedDisciplines (): DisciplineType[] {
      return this.disciplines ? this.disciplines.sort((d1, d2) => d1.order - d2.order) : []
    },
    disciplinesTree (): DisciplineNode[] {
      const tree: DisciplineNode[] = this.sortedDisciplines
        .map((discipline: DisciplineType) => ({ ...discipline, children: [], isChild: false }))
      tree.forEach((disciplineNode: DisciplineNode, _, disciplines) => {
        const children = this.getDisciplineChildren(disciplines, disciplineNode)
        children.forEach((child: DisciplineNode) => {
          child.isChild = true
        })
        disciplineNode.children = children
      })
      return tree.filter((disciplineNode: DisciplineNode) => !disciplineNode.isChild)
    },
    headers (): DataTableHeader[] {
      const headers: DataTableHeader[] = [
        {
          text: this.t('tableHeaders.code'),
          value: 'code',
          width: 200
        },
        {
          text: this.t('tableHeaders.name'),
          value: 'name'
        },
        {
          text: this.t('tableHeaders.view'),
          value: 'view.name'
        },
        {
          text: this.t('tableHeaders.users'),
          value: 'users',
          align: 'center'
        },
        {
          text: this.t('tableHeaders.annotation'),
          value: 'annotation',
          align: 'center',
          filterable: false,
          sortable: false
        },
        {
          text: this.t('tableHeaders.workProgram'),
          value: 'workProgram',
          align: 'center',
          filterable: false,
          sortable: false
        }
      ]
      if (this.hasPerm('eleden.change_discipline')) {
        headers.push({
          text: this.t('tableHeaders.actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
          filterable: false
        })
      }
      return headers.filter((header: DataTableHeader) =>
        !['view.name'].includes(header.value) || this.hasPerm('eleden.view_discipline_additional_fields')
      )
    },
    changeVariables (): ChangeDisciplineMutationVariables {
      return {
        disciplineId: this.inputDiscipline.id,
        viewId: this.inputDiscipline.view ? this.inputDiscipline.view.id : '',
        userIds: this.inputDiscipline.users.map(user => user.id),
        deleteAnnotation: !this.inputDiscipline.annotation && !this.inputDiscipline.existingAnnotation,
        deleteWorkProgram: !this.inputDiscipline.workProgram && !this.inputDiscipline.existingWorkProgram,
        code: this.inputDiscipline.code,
        name: this.inputDiscipline.name,
        annotation: this.inputDiscipline.annotation,
        workProgram: this.inputDiscipline.workProgram,
        parentId: this.inputDiscipline.parent ? this.inputDiscipline.parent.id : undefined
      }
    }
  }
})
export default class DisciplinesTable extends Vue {
  @Prop({ type: Object as PropType<EduProgramType>, required: true }) readonly eduProgram!: EduProgramType
  @Prop({ type: Boolean, default: false }) readonly loading!: boolean
  @Prop({ type: Array as PropType<DisciplineType[]> }) readonly disciplines!: DisciplineType[] | undefined
  @Prop({ type: String }) readonly search!: string | undefined

  readonly hasPerm!: (perm: string | string[], or?: boolean) => boolean
  readonly sortedDisciplines!: DisciplineType[]
  readonly disciplinesTree!: DisciplineNode[]
  readonly headers!: DataTableHeader[]
  readonly changeVariables!: ChangeDisciplineMutationVariables

  sortBy: string | string[] = []

  discipline: DisciplineType | undefined = undefined
  inputDiscipline: InputDiscipline

  data () {
    return {
      inputDiscipline: this.getInputDiscipline()
    }
  }

  /**
   * Получение текущей дисциплины
   * @return
   */
  getInputDiscipline (): InputDiscipline {
    if (this.discipline === undefined) {
      return {
        id: '',
        code: '',
        name: '',
        annotation: null,
        workProgram: null,
        existingAnnotation: undefined,
        existingWorkProgram: undefined,
        view: undefined,
        parent: undefined,
        users: [],
        methodologicalSupport: undefined
      }
    } else {
      return {
        id: this.discipline.id,
        code: this.discipline.code,
        name: this.discipline.name,
        annotation: null,
        workProgram: null,
        existingAnnotation: this.discipline.annotation ? { src: this.discipline.annotation } : undefined,
        existingWorkProgram: this.discipline.workProgram ? { src: this.discipline.workProgram } : undefined,
        view: this.discipline.view,
        parent: this.discipline.parent,
        users: this.discipline.users,
        methodologicalSupport: undefined
      }
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.disciplines.${path}`, values) as string
  }

  /**
   * Обработчик изменения количества показываемых дисциплин
   * @param items
   * @param _
   * @param allItems
   */
  itemsHandler (items: ItemWithProps[], _: any, allItems: ItemWithProps[]): void {
    this.$emit('count-change', {
      count: items.reduce((acc, item) => item.children.length ? acc : acc + 1, 0),
      totalCount: allItems.reduce((acc, item) => item.children.length ? acc : acc + 1, 0)
    })
  }

  /**
   * Получение пути к дисциплине
   * @param discipline
   * @return
   */
  toDiscipline (discipline: DisciplineType): string {
    return this.localePath({
      name: 'eleden-edu_programs-discipline-discipline_id',
      params: { edu_program_id: this.eduProgram.id, discipline_id: discipline.id }
    })
  }

  /**
   * Получение дочерних дисциплин дисциплины
   * @param disciplines
   * @param disciplineNode
   */
  getDisciplineChildren (disciplines: DisciplineNode[], disciplineNode: DisciplineNode): DisciplineNode[] {
    return disciplines.filter((filterDiscipline: DisciplineType) =>
      filterDiscipline.parent && filterDiscipline.parent.id === disciplineNode.id)
  }

  /**
   * Фильтрация дисциплин
   * @param value
   * @param search
   * @return
   */
  filter (value: string | UserType[] | null, search: string | null): boolean {
    if (!search) {
      return true
    }
    if (!value) {
      return false
    }
    if (typeof value === 'string') {
      return value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    } else {
      return value.some((user: UserType) => [this.$getUserName(user), this.$getUserFullName(user)].some(
        v => v.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ))
    }
  }
}
</script>
