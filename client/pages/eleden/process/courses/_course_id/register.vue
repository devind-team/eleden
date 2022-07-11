<template lang="pug">
v-card
  v-card-title
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    span {{t('name')}}
  v-card-text.process-register
    v-row
      v-col(cols="12")
        template(v-if="course.teachers.length")
          span {{ t('teachers') + ': ' }}
          user-link(
            v-for="(teacher, index) in course.teachers"
            :key="teacher.id"
            :user="teacher"
            :link-class="['my-1', { 'mr-1': index !== course.teachers.length - 1 }]"
            chip
          )
        template(v-if="course.team.responsibleUsers.length")
          span.ml-2 {{ t('responsibleUsers') + ': ' }}
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
              td(:class="isMobile ? 'v-data-table__mobile-row' : null") {{ t('handout') }}
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataTableHeader } from 'vuetify/types'
import { UserType, CourseType, PeriodType, AttestationType, AttachmentType, HandoutType } from '~/types/graphql'
import UserLink from '~/components/eleden/user/UserLink.vue'
import ChangeAttestations from '~/components/eleden/process/ChangeAttestations.vue'
import ChangeHandouts from '~/components/eleden/process/ChangeHandouts.vue'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'

type PeriodDataTableHeader = DataTableHeader & {
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
@Component<CourseIdRegister>({
  components: { UserLink, ChangeAttestations, ChangeHandouts },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    baseTableHeaders (): DataTableHeader[] {
      return [
        {
          text: this.t('baseTableHeaders.students'),
          value: 'student',
          sortable: false
        }
      ]
    },
    periodTableHeaders (): PeriodDataTableHeader[] {
      return this.course.periods!.map((period: PeriodType) => ({
        text: period.shortName,
        fullText: period.name,
        value: period.id,
        sortable: false,
        class: 'period',
        cellClass: 'period',
        align: 'center'
      }))
    },
    tableHeaders (): (DataTableHeader | PeriodDataTableHeader)[] {
      return [...this.baseTableHeaders, ...this.periodTableHeaders]
    },
    studentRows (): StudentRow[] {
      const students = [...this.course.team.users]
      students.sort((s1: UserType, s2: UserType) =>
        this.$getUserFullName(s1).localeCompare(this.$getUserFullName(s2)))
      return students.map((student: UserType) => ({
        student,
        attestations: Object.assign({}, ...this.course.periods!.map((period: PeriodType) => {
          return {
            [period.id]: (this.course.attestations as AttestationType[])
              .filter((attestation: AttestationType) =>
                attestation.period.id === period.id && attestation.user.id === student.id)
          }
        })),
        attachments: Object.assign({}, ...this.course.periods!.map((period: PeriodType) => {
          return {
            [period.id]: (this.course.attachments as AttachmentType[])
              .filter((attachment: AttachmentType) =>
                attachment.period.id === period.id && attachment.portfolioFile.file.user!.id === student.id)
          }
        }))
      }))
    },
    handoutRow (): HandoutRow {
      return Object.assign({}, ...this.course.periods!.map((period: PeriodType) => {
        return {
          [period.id]: (this.course.handouts as HandoutType[])
            .filter((handout: HandoutType) =>
              handout.period && handout.period.id === period.id)
        }
      }))
    },
    rows (): Row[] {
      return [...this.studentRows, this.handoutRow]
    },
    canEditHandouts () {
      return this.role === Role.Teacher || this.role === Role.Admin
    }
  }
})
export default class CourseIdRegister extends Vue {
  @Prop({ type: Number, required: true }) readonly role!: Role
  @Prop({ type: Object, required: true }) readonly course!: CourseType

  readonly baseTableHeaders!: DataTableHeader[]
  readonly periodTableHeaders!: PeriodDataTableHeader[]
  readonly tableHeaders!: (DataTableHeader | PeriodDataTableHeader)[]
  readonly studentRows!: StudentRow[]
  readonly handoutRow!: HandoutRow
  readonly rows!: Row[]
  readonly user!: UserType
  readonly canEditHandouts!: boolean

  DialogTypes = DialogTypes
  currentItemIndex: number | null = null
  currentHeaderValue: string = ''
  active: boolean = false
  dialogType: DialogTypes = DialogTypes.Handouts

  canEditMark (): boolean {
    return this.role === Role.Teacher || this.role === Role.Admin
  }

  canViewAllItems (student: UserType): boolean {
    return this.canEditMark() || this.isMe(student)
  }

  attestationsString (item: AttestationType[]): string {
    return item.map((attestation: AttestationType) => attestation.registration.shortName).join(', ')
  }

  isMe (student: UserType): boolean {
    return this.user.id === student.id
  }

  canViewDialog (student: UserType): boolean {
    return this.role !== Role.Student || this.isMe(student)
  }

  onDialogButtonClicked (index: number, headerValue: string, dialogType: DialogTypes) {
    this.currentItemIndex = index
    this.currentHeaderValue = headerValue
    this.dialogType = dialogType
    this.active = true
  }

  canOpenHandoutsDialog (handouts: HandoutType[]) {
    return this.canEditHandouts || handouts.length !== 0
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.${path}`, values) as string
  }
}
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
