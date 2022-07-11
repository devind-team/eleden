<template lang="pug">
div
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('eduPrograms.form.name')"
    rules="required|min:4|max:1024"
  )
    v-text-field(
      v-model="eduProgram.name"
      :label="$t('eduPrograms.form.name')"
      :error-messages="errors"
      :success="valid"
    )
  v-row
    v-col(cols="6")
      v-checkbox(v-model="eduProgram.adaptive" :label="$t('eduPrograms.form.adaptive')" success)
    v-col(cols="6")
      v-checkbox(v-model="eduProgram.expedited" :label="$t('eduPrograms.form.expedited')" success)
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('eduPrograms.form.admission')"
    rules="digits:4"
  )
    v-text-field(
      v-model="eduProgram.admission"
      :label="$t('eduPrograms.form.admission')"
      :error-messages="errors"
      :success="valid"
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('eduPrograms.form.eduFormId')"
    rules="required"
  )
    v-combobox(
      v-model="eduProgram.eduForm"
      :items="eduForms"
      :label="$t('eduPrograms.form.eduFormId')"
      :error-messages="errors"
      :success="valid"
      item-text="name"
      clearable
    )
  validation-provider(
    v-slot="{ errors, valid }"
    :name="$t('eduPrograms.form.directionId')"
    rules="required"
  )
    v-autocomplete(
      v-model="eduProgram.direction"
      :search-input="directionsSearch"
      :items="directions"
      :loading="directionsLoading"
      :label="$t('eduPrograms.form.directionId')"
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
    :label="$t('eduPrograms.form.description')"
    accept=".pdf"
    clearable
    success
  )
  file-field(
    v-model="eduProgram.syllabus"
    :existing-file.sync="eduProgram.existingSyllabus"
    :label="$t('eduPrograms.form.syllabus')"
    accept=".pdf"
    clearable
    success
  )
  file-field(
    v-model="eduProgram.calendar"
    :existing-file.sync="eduProgram.existingCalendar"
    :label="$t('eduPrograms.form.calendar')"
    accept=".pdf"
    clearable
    success
  )
  div(v-if="!eduProgram.id")
    v-autocomplete(
      v-model="eduProgram.donor"
      :search-input.sync="eduProgramsSearch"
      :label="$t('eduPrograms.form.donor')"
      :items="eduPrograms"
      :loading="eduProgramsLoading"
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
import type { PropType } from '#app'
import { computed, defineComponent, ref } from '#app'
import {
  EduProgramType,
  EduFormType,
  DirectionType,
  EduFormsQuery,
  EduFormsQueryVariables,
  DirectionsQuery,
  DirectionsQueryVariables,
  EduProgramsQuery,
  EduProgramsQueryVariables
} from '~/types/graphql'
import { useCommonQuery, useDebounceSearch, useQueryRelay } from '~/composables'
import eduFormsQuery from '~/gql/eleden/queries/education/edu_forms.graphql'
import directionsQuery from '~/gql/eleden/queries/education/directions.graphql'
import eduProgramsQuery from '~/gql/eleden/queries/education/edu_programs.graphql'
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

export default defineComponent({
  components: { FileField },
  props: {
    eduProgram: { type: Object as PropType<InputEduProgram>, default: undefined }
  },
  setup (props) {
    const { data: eduForms } = useCommonQuery<EduFormsQuery, EduFormsQueryVariables>({
      document: eduFormsQuery
    })

    const directionsSearch = ref<string>('')

    const {
      data: directions,
      loading: directionsLoading
    } = useCommonQuery<DirectionsQuery, DirectionsQueryVariables>({
      document: directionsQuery
    })

    const { search: eduProgramsSearch, debounceSearch: eduProgramsDebounceSearch } = useDebounceSearch()
    const {
      data: eduProgramsData,
      loading: eduProgramsLoading
    } = useQueryRelay<EduProgramsQuery, EduProgramsQueryVariables, EduProgramType>({
      document: eduProgramsQuery,
      variables: () => ({ search: eduProgramsDebounceSearch.value })
    })
    const eduPrograms = computed<EduProgramType[]>(() => (
      props.eduProgram.donor
        ? [props.eduProgram.donor, ...eduProgramsData.value.filter(
            (eduProgram: EduProgramType) => eduProgram.id !== props.eduProgram.donor!.id)]
        : eduProgramsData.value
    )
    )

    const getDonorText = (item: EduProgramType): string => {
      return `${item.direction.code} ${item.name} ${item.eduForm.shortName} ${item.direction.eduService.name}` +
      ` ${item.admission}`
    }

    const filterEduPrograms = (item: EduProgramType, queryText: string): boolean => {
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

    return {
      eduForms,
      directions,
      directionsLoading,
      directionsSearch,
      eduPrograms,
      eduProgramsLoading,
      eduProgramsSearch,
      getDonorText,
      filterEduPrograms
    }
  }
})
</script>
