<template lang="pug">
v-card
  v-card-title {{ $getUserName(student) }}
    v-spacer
    v-btn(@click="close" icon)
      v-icon mdi-close
  v-card-subtitle {{ period.name }}
  v-card-text(v-if="error || success")
    v-alert(v-if="error" type="error") {{ t('mutationBusinessLogicError', { error: error.value }) }}
    v-alert(v-else-if="success" type="success") {{ success.value }}
  v-card-text.ma-0.pa-0(style="max-height: 600px")
    template(v-if="showAttendanceBlock")
      v-divider
      change-attendance(
        ref="changeAttendanceVNode"
        :attendance="attendance"
        :registrations="attendanceRegistrations"
        :can-confirm="canEditMark"
        :can-edit="canEditAttendance"
        :save-loading="saveAttendanceLoading"
        :delete-loading="deleteAttendanceLoading"
        @save="saveAttendance"
        @delete="deleteAttendance"
      )
    template(v-if="showMarkBlock")
      v-divider
      change-mark(
        ref="changeMarkVNode"
        :mark="mark"
        :registrations="markRegistrations"
        :can-edit="canEditMark"
        :save-loading="saveMarkLoading"
        :delete-loading="deleteMarkLoading"
        @save="saveMark"
        @delete="deleteMark"
      )
    template(v-if="showAttachmentsBlock")
      v-divider
      change-attachments(
        ref="changeAttachmentsVNode"
        :course="course"
        :student="student"
        :attachments="attachments"
        :can-edit="canEditAttachment"
        :can-confirm="canEditMark"
        :save-loading="saveAttachmentsLoading"
        @save="saveAttachments"
      )
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { DataProxy } from 'apollo-cache'
import { WithTimer } from '~/types/devind'
import {
  CourseType,
  AttestationType,
  AttachmentType,
  PeriodType,
  UserType,
  RegistrationType,
  PortfolioFileType,
  ErrorFieldType,
  CourseQueryVariables,
  AddAttestationMutation,
  AddAttestationMutationVariables,
  ChangeAttestationMutation,
  ChangeAttestationMutationVariables,
  DeleteAttestationMutation,
  DeleteAttestationMutationVariables,
  AddPortfolioFileAttachmentsMutation,
  AddPortfolioFileAttachmentsMutationVariables,
  AddFileAttachmentsMutation,
  AddFileAttachmentsMutationVariables,
  DeleteAttachmentsMutation,
  DeleteAttachmentsMutationVariables
} from '~/types/graphql'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'
import ChangeAttendance from '~/components/eleden/process/ChangeAttendance.vue'
import ChangeMark from '~/components/eleden/process/ChangeMark.vue'
import ChangeAttachments, { AttachmentFiles } from '~/components/eleden/process/ChangeAttachments.vue'
import AddAttestation from '~/gql/eleden/mutations/process/add_attestation.graphql'
import ChangeAttestation from '~/gql/eleden/mutations/process/change_attestation.graphql'
import DeleteAttestation from '~/gql/eleden/mutations/process/delete_attestation.graphql'
import AddPortfolioFileAttachments from '~/gql/eleden/mutations/process/add_portfolio_file_attachments.graphql'
import AddFileAttachments from '~/gql/eleden/mutations/process/add_file_attachments.graphql'
import DeleteAttachments from '~/gql/eleden/mutations/process/delete_attachments.graphql'
import AttestationCourse from '~/gql/eleden/queries/process/attestation_course.graphql'

@Component<ChangeAttestations>({
  components: { ChangeAttendance, ChangeMark, ChangeAttachments },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    isMe (): boolean {
      return this.user.id === this.student.id
    },
    canViewAllItems (): boolean {
      return this.canEditMark || this.isMe
    },
    canEditAttendance (): boolean {
      return this.canEditMark ||
        (this.role === Role.ResponsibleUser && (this.attendance === null || this.attendance.confirmedBy === null))
    },
    canEditMark (): boolean {
      return this.role === Role.Teacher || this.role === Role.Admin
    },
    canEditAttachment (): boolean {
      return this.canEditMark || (this.isMe && !this.mark)
    },
    attestationsString (): string {
      return this.attestations.map((attestation: AttestationType) => attestation.registration.shortName).join(', ')
    },
    attendanceRegistrations (): RegistrationType[] {
      return this.period.registrations.filter((registration: RegistrationType) => registration.kind === 'A_0')
    },
    markRegistrations (): RegistrationType[] {
      return this.period.registrations.filter((registration: RegistrationType) => registration.kind === 'A_1')
    },
    showAttendanceBlock (): boolean {
      return Boolean(this.attendanceRegistrations.length)
    },
    showMarkBlock (): boolean {
      return this.canViewAllItems && Boolean(this.markRegistrations.length)
    },
    showAttachmentsBlock (): boolean {
      return this.canViewAllItems
    },
    attendance (): AttestationType | null {
      return this.attestations.find((attestation: AttestationType) => attestation.registration.kind === 'A_0') || null
    },
    mark (): AttestationType | null {
      return this.attestations.find((attestation: AttestationType) => attestation.registration.kind === 'A_1') || null
    }
  }
})
export default class ChangeAttestations extends Vue {
  @Prop({ type: Number, required: true }) readonly role!: Role
  @Prop({ type: Object, required: true }) readonly course!: CourseType
  @Prop({ type: Array, required: true }) readonly attestations!: AttestationType[]
  @Prop({ type: Array, required: true }) readonly attachments!: AttachmentType[]
  @Prop({ type: Object, required: true }) readonly student!: UserType
  @Prop({ type: Object, required: true }) readonly period!: PeriodType

  @Ref() readonly changeAttendanceVNode!: InstanceType<typeof ChangeAttendance>
  @Ref() readonly changeMarkVNode!: InstanceType<typeof ChangeMark>
  @Ref() readonly changeAttachmentsVNode!: InstanceType<typeof ChangeAttachments>

  readonly user!: UserType
  readonly isMe!: boolean
  readonly canViewAllItems!: boolean
  readonly canEditAttendance!: boolean
  readonly canEditMark!: boolean
  readonly canEditAttachment!: boolean
  readonly attestationsString!: string
  readonly attendanceRegistrations!: RegistrationType[]
  readonly markRegistrations!: RegistrationType[]
  readonly showAttendanceBlock!: boolean
  readonly showMarkBlock!: boolean
  readonly showAttachmentsBlock!: boolean
  readonly attendance!: AttestationType | null
  readonly mark!: AttestationType | null

  hideAlertTimeout: number = 5000
  success: WithTimer<string> | null = null
  error: WithTimer<string> | null = null
  saveAttendanceLoading: boolean = false
  deleteAttendanceLoading: boolean = false
  saveMarkLoading: boolean = false
  deleteMarkLoading: boolean = false
  saveAttachmentsLoading: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.changeAttestations.${path}`, values) as string
  }

  /**
   * Объединение ошибок
   * @param errors
   * @return
   */
  joinErrors (errors: ErrorFieldType[]): string {
    return errors.reduce((a: string, c: ErrorFieldType) => a.concat(c.messages.join(', ')), '')
  }

  /**
   * Установка ошибки
   * @param error
   */
  setError (error: string): void {
    this.success = null
    if (this.error) {
      clearTimeout(this.error.timerId!)
    }
    this.error = {
      value: error,
      timerId: setTimeout(() => { this.error = null }, this.hideAlertTimeout)
    }
  }

  /**
   * Установка успеха
   */
  setSuccess (success: string): void {
    this.error = null
    if (this.success) {
      clearTimeout(this.success.timerId!)
    }
    this.success = {
      value: success,
      timerId: setTimeout(() => { this.success = null }, this.hideAlertTimeout)
    }
  }

  /**
   * Закрытие диалога
   */
  close (): void {
    if (this.showAttendanceBlock) {
      this.changeAttendanceVNode.cancelEdit()
    }
    if (this.showMarkBlock) {
      this.changeMarkVNode.cancelEdit()
    }
    if (this.showAttachmentsBlock) {
      this.changeAttachmentsVNode.cancelEdit()
    }
    this.error = null
    this.success = null
    this.$emit('close')
  }

  /**
   * Одновление аттестаций после успешного добавления аттестации
   * @param store
   * @param attestation
   */
  addAttestationsSuccessUpdate (store: DataProxy, attestation: AttestationType): void {
    const variables: CourseQueryVariables = {
      courseId: this.course.id
    }
    const data: { course: CourseType } = store.readQuery({
      query: AttestationCourse,
      variables
    }) as { course: CourseType }
    data.course.attestations!.push(attestation as AttestationType)
    data.course.attestations!.sort(
      (a1: AttestationType, a2: AttestationType) => a1.registration.kind.localeCompare(a2.registration.kind)
    )
    store.writeQuery({ query: AttestationCourse, variables, data })
  }

  /**
   * Одновление аттестаций после успешного удаления аттестации
   * @param store
   * @param attestation
   */
  deleteAttestationsSuccessUpdate (store: DataProxy, attestation: AttestationType): void {
    const variables: CourseQueryVariables = {
      courseId: this.course.id
    }
    const data: { course: CourseType } = store.readQuery({
      query: AttestationCourse,
      variables
    }) as { course: CourseType }
    data.course.attestations = data.course.attestations!
      .filter((existAttestation: AttestationType) => existAttestation.id !== attestation.id)
    store.writeQuery({ query: AttestationCourse, variables, data })
  }

  /**
   * Добавление отсутствия на занятии
   * @param registration
   * @param confirm
   */
  async addAttendance (registration: RegistrationType, confirm: boolean): Promise<void> {
    const { data } = await this.$apollo.mutate<AddAttestationMutation, AddAttestationMutationVariables>({
      mutation: AddAttestation,
      variables: {
        description: '',
        registrationId: registration.id,
        courseId: this.course.id,
        periodId: this.period.id,
        setById: this.user.id,
        userId: this.student.id,
        confirmedById: confirm ? this.user.id : undefined
      },
      update: (store, { data }) => {
        const { success, attestation } = data!.addAttestation
        if (success) {
          this.addAttestationsSuccessUpdate(store, attestation as AttestationType)
        }
      }
    })
    if (!data!.addAttestation.success) {
      throw new Error(this.joinErrors(data!.addAttestation.errors))
    }
  }

  /**
   * Изменение отсутствия на занятии
   * @param registration
   * @param confirm
   */
  async changeAttendance (registration: RegistrationType, confirm: boolean): Promise<void> {
    const { data } = await this.$apollo.mutate<ChangeAttestationMutation, ChangeAttestationMutationVariables>({
      mutation: ChangeAttestation,
      variables: {
        attestationId: this.attendance!.id,
        registrationId: registration.id,
        setById: this.attendance!.registration.id !== registration.id ? this.user.id : undefined,
        confirmedById: confirm ? this.user.id : undefined
      }
    })
    if (!data!.changeAttestation.success) {
      throw new Error(this.joinErrors(data!.changeAttestation.errors))
    }
  }

  /**
   * Сохранение отсутствия на занятии
   * @param registration
   * @param confirm
   */
  async saveAttendance (registration: RegistrationType, confirm: boolean): Promise<void> {
    this.saveAttendanceLoading = true
    try {
      if (this.attendance) {
        await this.changeAttendance(registration, confirm)
      } else {
        await this.addAttendance(registration, confirm)
      }
      this.changeAttendanceVNode.cancelEdit()
      this.setSuccess(this.t('mutationSuccess'))
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.saveAttendanceLoading = false
    }
  }

  /**
   * Удаление отсутствия на занятии
   */
  async deleteAttendance (): Promise<void> {
    this.deleteAttendanceLoading = true
    try {
      const { data } = await this.$apollo.mutate<DeleteAttestationMutation, DeleteAttestationMutationVariables>({
        mutation: DeleteAttestation,
        variables: {
          attestationId: this.attendance!.id
        },
        update: (store, { data }) => {
          const { success } = data!.deleteAttestation
          if (success) {
            this.deleteAttestationsSuccessUpdate(store, this.attendance as AttestationType)
          }
        }
      })
      if (data!.deleteAttestation.success) {
        this.changeAttendanceVNode.cancelEdit()
        this.setSuccess(this.t('deleteSuccess'))
      } else {
        throw new Error(this.joinErrors(data!.deleteAttestation.errors))
      }
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.deleteAttendanceLoading = false
    }
  }

  /**
   * Добавление оценки
   * @param registration
   * @param description
   */
  async addMark (registration: RegistrationType, description: string): Promise<void> {
    const { data } = await this.$apollo.mutate<AddAttestationMutation, AddAttestationMutationVariables>({
      mutation: AddAttestation,
      variables: {
        description: description || '',
        registrationId: registration.id,
        courseId: this.course.id,
        periodId: this.period.id,
        setById: this.user.id,
        userId: this.student.id
      },
      update: (store, { data }) => {
        const { success, attestation } = data!.addAttestation
        if (success) {
          this.addAttestationsSuccessUpdate(store, attestation as AttestationType)
        }
      }
    })
    if (!data!.addAttestation.success) {
      throw new Error(this.joinErrors(data!.addAttestation.errors))
    }
  }

  /**
   * Изменение оценки
   * @param registration
   * @param description
   */
  async changeMark (registration: RegistrationType, description: string): Promise<void> {
    const { data } = await this.$apollo.mutate<ChangeAttestationMutation, ChangeAttestationMutationVariables>({
      mutation: ChangeAttestation,
      variables: {
        attestationId: this.mark!.id,
        description,
        registrationId: registration.id,
        setById: this.user.id
      }
    })
    if (!data!.changeAttestation.success) {
      throw new Error(this.joinErrors(data!.changeAttestation.errors))
    }
  }

  /**
   * Сохранение оценки
   * @param registration
   * @param description
   */
  async saveMark (registration: RegistrationType, description: string): Promise<void> {
    this.saveMarkLoading = true
    try {
      if (this.mark) {
        await this.changeMark(registration, description)
      } else {
        await this.addMark(registration, description)
      }
      this.changeMarkVNode.cancelEdit()
      this.setSuccess(this.t('mutationSuccess'))
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.saveMarkLoading = false
    }
  }

  /**
   * Удаление оценки
   */
  async deleteMark (): Promise<void> {
    this.deleteMarkLoading = true
    try {
      const { data } = await this.$apollo.mutate<DeleteAttestationMutation, DeleteAttestationMutationVariables>({
        mutation: DeleteAttestation,
        variables: {
          attestationId: this.mark!.id
        },
        update: (store, { data }) => {
          const { success } = data!.deleteAttestation
          if (success) {
            this.deleteAttestationsSuccessUpdate(store, this.mark as AttestationType)
          }
        }
      })
      if (data!.deleteAttestation.success) {
        this.changeMarkVNode.cancelEdit()
        this.setSuccess(this.t('deleteSuccess'))
      } else {
        throw new Error(this.joinErrors(data!.deleteAttestation.errors))
      }
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.deleteMarkLoading = false
    }
  }

  /**
   * Удаление прикрепленных файлов
   * @param attachments
   */
  async deleteAttachments (attachments: AttachmentType[]): Promise<void> {
    const { data } = await this.$apollo.mutate<DeleteAttachmentsMutation, DeleteAttachmentsMutationVariables>({
      mutation: DeleteAttachments,
      variables: {
        attachmentIds: attachments.map((attachment: AttachmentType) => attachment.id)
      }
    })
    if (!data!.deleteAttachments.success) {
      throw new Error(this.joinErrors(data!.deleteAttachments.errors))
    }
  }

  /**
   * Добавление прикрепленных файлов из файлов портофолио
   * @param newPortfolioFiles
   * @param confirm
   * @return
   */
  async addPortfolioFileAttachments (
    newPortfolioFiles: PortfolioFileType[],
    confirm: boolean
  ): Promise<AttachmentType[]> {
    const { data } = await this.$apollo
      .mutate<AddPortfolioFileAttachmentsMutation, AddPortfolioFileAttachmentsMutationVariables>({
        mutation: AddPortfolioFileAttachments,
        variables: {
          courseId: this.course.id,
          periodId: this.period.id,
          userId: this.student.id,
          portfolioFileIds: newPortfolioFiles.map((portfolioFile: PortfolioFileType) => portfolioFile.id),
          confirmedById: confirm ? this.user.id : undefined
        }
      })
    if (data!.addPortfolioFileAttachments.success) {
      return data!.addPortfolioFileAttachments.attachments as AttachmentType[]
    }
    throw new Error(this.joinErrors(data!.addPortfolioFileAttachments.errors))
  }

  /**
   * Добавление прикрепленных файлов из файлов
   * @param newFiles
   * @param confirm
   * @return
   */
  async addFileAttachments (
    newFiles: AttachmentFiles,
    confirm: boolean
  ): Promise<AttachmentType[]> {
    const { data } = await this.$apollo.mutate<AddFileAttachmentsMutation, AddFileAttachmentsMutationVariables>({
      mutation: AddFileAttachments,
      variables: {
        courseId: this.course.id,
        periodId: this.period.id,
        userId: this.student.id,
        files: newFiles.files,
        describe: newFiles.describe,
        fileKindId: newFiles.kind!.id,
        confirmedById: confirm ? this.user.id : undefined
      }
    })
    if (data!.addFileAttachments.success) {
      return data!.addFileAttachments.attachments as AttachmentType[]
    }
    throw new Error(this.joinErrors(data!.addFileAttachments.errors))
  }

  /**
   * Одновление прикрепленных файлов после успешного измененеия
   * @param deletedAttachments
   * @param newAttachments
   */
  changeAttachmentsSuccessUpdate (deletedAttachments: AttachmentType[], newAttachments: AttachmentType[]): void {
    const variables: CourseQueryVariables = {
      courseId: this.course.id
    }
    const store: DataProxy = this.$apolloProvider.defaultClient.cache
    const data: { course: CourseType } = store.readQuery({
      query: AttestationCourse,
      variables
    }) as { course: CourseType }
    data.course.attachments = data.course.attachments!.filter((attachment: AttachmentType) =>
      !deletedAttachments.find((deletedAttachment: AttachmentType) => deletedAttachment.id === attachment.id))
    newAttachments.forEach((attachment: AttachmentType) => data.course.attachments!.push(attachment))
    store.writeQuery({ query: AttestationCourse, variables, data })
  }

  /**
   * Сохранение прикрепленных файлов
   * @param editAttachments
   * @param newPortfolioFiles
   * @param newFiles
   * @param confirm
   */
  async saveAttachments (
    editAttachments: AttachmentType[],
    newPortfolioFiles: PortfolioFileType[],
    newFiles: AttachmentFiles,
    confirm: boolean
  ): Promise<void> {
    this.saveAttachmentsLoading = true
    try {
      const attachmentsToDelete = this.attachments.filter((attachment: AttachmentType) =>
        !editAttachments.find((editAttachment: AttachmentType) => editAttachment.id === attachment.id))
      if (attachmentsToDelete.length) {
        await this.deleteAttachments(attachmentsToDelete)
      }
      const newAttachments = [
        ...newPortfolioFiles.length ? await this.addPortfolioFileAttachments(newPortfolioFiles, confirm) : [],
        ...newFiles.files.length ? await this.addFileAttachments(newFiles, confirm) : []
      ]
      this.changeAttachmentsSuccessUpdate(attachmentsToDelete, newAttachments)
      await this.$nextTick()
      this.changeAttachmentsVNode.cancelEdit()
      this.changeAttachmentsVNode.refetchPortfolioFiles()
      this.setSuccess(this.t('mutationSuccess'))
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.saveAttachmentsLoading = false
    }
  }
}
</script>

<style lang="sass" scoped>
  .cell-button
    display: block
    width: 100%
    height: 100%
  .cell-button:focus,
  .cell-button-edit
    outline: none
    background: rgba(0, 0, 0, 0.15)
</style>
