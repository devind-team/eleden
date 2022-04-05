<template lang="pug">
  v-card
    v-card-title
      v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
      span {{ $t('process.course.register.name') }}
    v-card-text.process-register
      v-row
        v-col(cols="12")
          template(v-if="course.teachers.length")
            span {{ $t('process.course.register.teachers') + ': ' }}
            user-link(
              v-for="(teacher, index) in course.teachers"
              :key="teacher.id"
              :user="teacher"
              :link-class="['my-1', { 'mr-1': index !== course.teachers.length - 1 }]"
              chip
            )
          template(v-if="course.team.responsibleUsers.length")
            span.ml-2 {{ $t('process.course.register.responsibleUsers') + ': ' }}
            user-link(
              v-for="(user, index) in course.team.responsibleUsers"
              :key="user.id"
              :user="user"
              :link-class="['my-1', { 'mr-1': index !== course.team.responsibleUsers.length - 1 }]"
              chip
            )
      v-row
        v-col(cols="12")
          v-dialog(v-if="currentItemIndex !== null" v-model="active" width="500" scrollable)
            change-attestations(
              v-if="dialogType === DialogTypes.Attestations"
              :role="role"
              :course="course"
              :attestations="rows[currentItemIndex].attestations[currentHeaderValue]"
              :attachments="rows[currentItemIndex].attachments[currentHeaderValue]"
              :student="rows[currentItemIndex].student"
              :period="course.periods.find(period => period.id === currentHeaderValue)"
              @close="active = false"
            )
            change-handouts(
              v-else-if="dialogType === DialogTypes.Handouts"
              :role="role"
              :course="course"
              :period="course.periods.find(period => period.id === currentHeaderValue)"
              :handouts="rows[currentItemIndex][currentHeaderValue]"
              @close="active = false"
            )
          v-data-table(
            :headers="tableHeaders"
            :items="rows"
            disable-pagination
            hide-default-footer
            dense
          )
            template(v-for="header in periodTableHeaders" v-slot:[`header.${header.value}`])
              v-tooltip(bottom)
                template(#activator="{ on }")
                  span(v-on="on") {{ header.text }}
                span {{ header.fullText }}
            template(#item="{ item, index, isMobile, headers }")
              tr(v-if="'student' in item" :class="isMobile ? 'v-data-table__mobile-table-row' : null")
                td.pl-1(:class="isMobile ? 'v-data-table__mobile-row' : null")
                  div(v-if="isMobile" class="v-data-table__mobile-row__header") {{ headers[0].text }}
                  user-link(:user="item.student" :class="isMobile ? 'v-data-table__mobile-row__cell' : null")
                td(
                  v-for="header in periodTableHeaders"
                  :class="`${header.cellClass} ${isMobile ? 'v-data-table__mobile-row': ''}`"
                )
                  div(v-if="isMobile" class="v-data-table__mobile-row__header") {{ header.text }}
                  v-hover(v-slot="{ hover }" :disabled="!canViewDialog(item.student)")
                    button.cell-button(
                      :disabled="!canViewDialog"
                      :class="{ 'cell-button-edit': hover }"
                      @click="onDialogButtonClicked(index, header.value, DialogTypes.Attestations)"
                    )
                      span(v-if="attestationsString(item.attestations[header.value])")
                        | {{ attestationsString(item.attestations[header.value]) }}
                      v-icon(v-else-if="item.attachments[header.value].length && canViewAllItems(item.student)" small)
                        | mdi-file-alert
                      strong(v-else) &mdash;
              tr(v-else :class="isMobile ? 'v-data-table__mobile-table-row' : null")
                td(:class="isMobile ? 'v-data-table__mobile-row' : null") {{ $t('process.course.register.handout') }}
                td(
                  v-for="header in periodTableHeaders"
                  :class="`${header.cellClass} ${isMobile ? 'v-data-table__mobile-row': ''}`"
                )
                  div(v-if="isMobile" class="v-data-table__mobile-row__header") {{ header.text }}
                  v-hover(v-slot="{ hover }")
                    button.cell-button(
                      :disabled="!canOpenHandoutsDialog(item[header.value])"
                      :class="{ 'cell-button-edit': hover }"
                      @click="onDialogButtonClicked(index, header.value, DialogTypes.Handouts)"
                    )
                      v-icon(v-if="item[header.value].length" small) mdi-file
                      strong(v-else) &mdash;
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify/types'
import type { PropType } from '#app'
import { UserType, CourseType, PeriodType, AttestationType, AttachmentType, HandoutType } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useFilters } from '~/composables'
import UserLink from '~/components/eleden/user/UserLink.vue'
import ChangeAttestations from '~/components/eleden/process/ChangeAttestations.vue'
import ChangeHandouts from '~/components/eleden/process/ChangeHandouts.vue'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'

type PeriodDataTableHeaderType = DataTableHeader & {
  fullText: string
}
type StudentRow = {
  student: UserType
  attestations: {
    [periodId: string]: AttestationType[]
  },
  attachments: {
    [periodId: string]: AttachmentType[]
  }
}
type HandoutRow = {
  [periodId: string]: HandoutType[]
}
type Row = StudentRow | HandoutRow
enum DialogTypes {
  Handouts,
  Attestations
}

export default defineComponent({
  components: { UserLink, ChangeAttestations, ChangeHandouts },
  props: {
    role: { type: Number, required: true },
    course: { type: Object as PropType<CourseType>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const user = toRef(authStore, 'user')
    const { t } = useI18n()
    const { getUserFullName } = useFilters()

    const currentItemIndex = ref<number | null>(null)
    const currentHeaderValue = ref<string>('')
    const active = ref<boolean>(false)
    const dialogType = ref<DialogTypes>(DialogTypes.Handouts)

    const baseTableHeaders = computed<DataTableHeader[]>(() => ([
      {
        text: t('process.course.register.baseTableHeaders.students') as string,
        value: 'student',
        sortable: false
      }
    ]))

    const periodTableHeaders = computed<PeriodDataTableHeaderType[]>(() => {
      return props.course.periods!.map((period: PeriodType) => ({
        text: period.shortName,
        fullText: period.name,
        value: period.id,
        sortable: false,
        class: 'period',
        cellClass: 'period',
        align: 'center'
      }))
    })

    const tableHeaders = computed<(DataTableHeader | PeriodDataTableHeaderType)[]>(() => (
      [...baseTableHeaders.value, ...periodTableHeaders.value]
    ))

    const studentRows = computed<StudentRow[]>(() => {
      const students = [...props.course.team.users]
      students.sort((s1: UserType, s2: UserType) =>
        getUserFullName(s1).localeCompare(getUserFullName(s2)))
      return students.map((student: UserType) => ({
        student,
        attestations: Object.assign({}, ...props.course.periods!.map((period: PeriodType) => {
          return {
            [period.id]: (props.course.attestations as AttestationType[])
              .filter((attestation: AttestationType) =>
                attestation.period.id === period.id && attestation.user.id === student.id)
          }
        })),
        attachments: Object.assign({}, ...props.course.periods!.map((period: PeriodType) => {
          return {
            [period.id]: (props.course.attachments as AttachmentType[])
              .filter((attachment: AttachmentType) =>
                attachment.period.id === period.id && attachment.portfolioFile.file.user!.id === student.id)
          }
        }))
      }))
    })

    const handoutRow = computed<HandoutRow>(() => {
      return Object.assign({}, ...props.course.periods!.map((period: PeriodType) => {
        return {
          [period.id]: (props.course.handouts as HandoutType[])
            .filter((handout: HandoutType) =>
              handout.period && handout.period.id === period.id)
        }
      }))
    })

    const rows = computed<Row[]>(() => ([...studentRows.value, handoutRow.value]))

    const canEditHandouts = computed<boolean>(() => (props.role === Role.Teacher || props.role === Role.Admin))

    const canEditMark = (): boolean => { return props.role === Role.Teacher || props.role === Role.Admin }

    const canViewAllItems = (student: UserType): boolean => { return canEditMark() || isMe(student) }

    const attestationsString = (item: AttestationType[]): string => {
      return item.map((attestation: AttestationType) => attestation.registration.shortName).join(', ')
    }

    const isMe = (student: UserType): boolean => { return user.value.id === student.id }

    const canViewDialog = (student: UserType): boolean => { return props.role !== Role.Student || isMe(student) }

    const onDialogButtonClicked = (index: number, headerValue: string, dialogTypeValue: DialogTypes): void => {
      currentItemIndex.value = index
      currentHeaderValue.value = headerValue
      dialogType.value = dialogTypeValue
      active.value = true
    }

    const canOpenHandoutsDialog = (handouts: HandoutType[]) => {
      return canEditHandouts.value || handouts.length !== 0
    }

    return {
      user,
      DialogTypes,
      periodTableHeaders,
      tableHeaders,
      rows,
      currentItemIndex,
      currentHeaderValue,
      active,
      dialogType,
      canViewAllItems,
      attestationsString,
      isMe,
      canViewDialog,
      onDialogButtonClicked,
      canOpenHandoutsDialog
    }
  }
})
</script>

<style lang="sass">
  .cell-button
    display: block
    width: 100%
    height: 100%
  .cell-button:focus,
  .cell-button-edit
    outline: none
    background: rgba(0, 0, 0, 0.15)
  .process-register
    .period
      padding: 0 6px !important
      min-width: 45px
</style>
