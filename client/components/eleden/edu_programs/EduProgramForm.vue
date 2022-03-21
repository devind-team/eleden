<template lang="pug">
  div
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('name')"
      rules="required|min:4|max:1024"
    )
      v-text-field(
        v-model="eduProgram.name"
        :label="t('name')"
        :error-messages="errors"
        :success="valid"
      )
    v-row
      v-col(cols="6")
        v-checkbox(v-model="eduProgram.adaptive" :label="t('adaptive')" success)
      v-col(cols="6")
        v-checkbox(v-model="eduProgram.expedited" :label="t('expedited')" success)
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('admission')"
      rules="digits:4"
    )
      v-text-field(
        v-model="eduProgram.admission"
        :label="t('admission')"
        :error-messages="errors"
        :success="valid"
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('eduFormId')"
      rules="required"
    )
      v-combobox(
        v-model="eduProgram.eduForm"
        :items="eduForms"
        :label="t('eduFormId')"
        :error-messages="errors"
        :success="valid"
        item-text="name"
        clearable
      )
    validation-provider(
      v-slot="{ errors, valid }"
      :name="t('directionId')"
      rules="required"
    )
      v-autocomplete(
        v-model="eduProgram.direction"
        v-stream:update:search-input="searchStreamDirections$"
        :items="directions"
        :loading="$apollo.queries.directions.loading"
        :label="t('directionId')"
        :error-messages="errors"
        :success="valid"
        item-value="id"
        item-text="name"
        clearable
        hide-no-data
        hide-selected
        return-object
      )
        template(#selection="{ item }") {{ item.code }} {{ item.name }}
        template(#item="{ item }") {{ item.code }} {{ item.name }}
    file-field(
      v-model="eduProgram.description"
      :existing-file.sync="eduProgram.existingDescription"
      :label="t('description')"
      accept=".pdf"
      clearable
      success
    )
    file-field(
      v-model="eduProgram.syllabus"
      :existing-file.sync="eduProgram.existingSyllabus"
      :label="t('syllabus')"
      accept=".pdf"
      clearable
      success
    )
    file-field(
      v-model="eduProgram.calendar"
      :existing-file.sync="eduProgram.existingCalendar"
      :label="t('calendar')"
      accept=".pdf"
      clearable
      success
    )
    div(v-if="!eduProgram.id")
      v-autocomplete(
        v-model="eduProgram.donor"
        v-stream:update:search-input="searchStreamEduPrograms$"
        :label="t('donor')"
        :items="eduPrograms"
        :loading="$apollo.queries.eduPrograms.loading"
        :filter="filterEduPrograms"
        item-value="id"
        clearable
        success
        hide-no-data
        hide-selected
        return-object
      )
        template(#selection="{ item }") {{ item.name }} {{ item.admission }}
        template(#item="{ item }") {{ getDonorText(item) }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Subject } from 'rxjs'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import { EduProgramType, EduFormType, DirectionType } from '~/types/graphql'
import FileField, { ExistingFile } from '~/components/common/FileField.vue'

export type InputEduProgram = {
  id?: string,
  name: string,
  adaptive: boolean,
  admission: number | string,
  expedited: boolean,
  eduForm?: EduFormType | null,
  direction?: DirectionType | null,
  description?: File | null,
  existingDescription?: ExistingFile,
  syllabus?: File | null,
  existingSyllabus?: ExistingFile,
  calendar?: File | null,
  existingCalendar?: ExistingFile,
  donor?: EduProgramType | null
}

@Component<EduProgramForm>({
  components: { FileField },
  domStreams: ['searchStreamDirections$', 'searchStreamEduPrograms$'],
  subscriptions () {
    const searchDirections$ = this.searchStreamDirections$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    const searchEduPrograms$ = this.searchStreamEduPrograms$.pipe(
      pluck('event', 'msg'),
      filter((e: any) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchDirections$, searchEduPrograms$ }
  },
  apollo: {
    eduForms: require('~/gql/eleden/queries/education/edu_forms.graphql'),
    directions: require('~/gql/eleden/queries/education/directions.graphql'),
    eduPrograms: {
      query: require('~/gql/eleden/queries/education/edu_programs.graphql'),
      variables () { return { first: 5, search: this.searchEduPrograms$ } },
      update ({ eduPrograms }) {
        return this.eduProgram.donor
          ? [this.eduProgram.donor, ...eduPrograms.edges
              .map((e: { node?: EduProgramType}) => e.node)
              .filter((eduProgram: EduProgramType) => eduProgram.id !== this.eduProgram.donor!.id)]
          : eduPrograms.edges.map((e: { node?: EduProgramType}) => e.node)
      }
    }
  }
})
export default class EduProgramForm extends Vue {
  @Prop({ type: Object as PropType<InputEduProgram> }) readonly eduProgram!: InputEduProgram

  readonly eduForms!: EduFormType[]
  readonly directions!: DirectionType[]
  readonly eduPrograms!: EduProgramType[]

  searchEduPrograms$: string = ''
  searchStreamEduPrograms$: Subject<any> = new Subject<any>()
  searchDirections$: string = ''
  searchStreamDirections$: Subject<any> = new Subject<any>()

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`eduPrograms.form.${path}`, values) as string
  }

  /**
   * Получение текста донорской образовательной программы
   * @param item
   * @return
   */
  getDonorText (item: EduProgramType): string {
    return `${item.direction.code} ${item.name} ${item.eduForm.shortName} ${item.direction.eduService.name}` +
      ` ${item.admission}`
  }

  /**
   * Фильтрация доноров
   * @param item
   * @param queryText
   * @return
   */
  filterEduPrograms (item: EduProgramType, queryText: string): boolean {
    const qt: string = queryText.toLocaleLowerCase()
    const name: string = item.name.toLocaleLowerCase()
    const admission: string = String(item.admission).toLocaleLowerCase()
    const directionCode: string | undefined = item.direction.code?.toLocaleLowerCase()
    const directionName: string = item.direction.name.toLocaleLowerCase()
    return name.includes(qt) ||
      admission.includes(qt) ||
      (directionCode && directionCode.includes(qt)) ||
      directionName.includes(qt)
  }
}
</script>
