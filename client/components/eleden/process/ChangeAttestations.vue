<template lang="pug">
  v-card
    v-card-title {{ getUserName(student) }}
      v-spacer
      v-btn(@click="close" icon)
        v-icon mdi-close
    v-card-subtitle {{ period.name }}
    v-card-text(v-if="error || success")
      v-alert(v-if="error" type="error") {{ $t('process.course.register.changeAttestations.mutationBusinessLogicError', { error: error.value }) }}
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
import type { PropType } from '#app'
import { defineComponent, ref, computed, toRef, nextTick } from '#app'
import { DataProxy } from 'apollo-cache'
import { useMutation } from '@vue/apollo-composable'
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
  AddAttestationMutationPayload,
  ChangeAttestationMutation,
  ChangeAttestationMutationVariables,
  ChangeAttestationMutationPayload,
  DeleteAttestationMutation,
  DeleteAttestationMutationVariables,
  AddPortfolioFileAttachmentsMutation,
  AddPortfolioFileAttachmentsMutationVariables,
  AddFileAttachmentsMutation,
  AddFileAttachmentsMutationVariables,
  DeleteAttachmentsMutation,
  DeleteAttachmentsMutationVariables,
  AttestationCourseQuery,
  AttestationCourseQueryVariables,
  DeleteAttestationMutationPayload,
  DeleteAttachmentsMutationPayload,
  AddPortfolioFileAttachmentsMutationPayload,
  AddFileAttachmentsMutationPayload
} from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useFilters, useCommonQuery } from '~/composables'
import addAttestationMutation from '~/gql/eleden/mutations/process/add_attestation.graphql'
import changeAttestationMutation from '~/gql/eleden/mutations/process/change_attestation.graphql'
import deleteAttestationMutation from '~/gql/eleden/mutations/process/delete_attestation.graphql'
import addPortfolioFileAttachmentsMutation from '~/gql/eleden/mutations/process/add_portfolio_file_attachments.graphql'
import addFileAttachmentsMutation from '~/gql/eleden/mutations/process/add_file_attachments.graphql'
import deleteAttachmentsMutation from '~/gql/eleden/mutations/process/delete_attachments.graphql'
import attestationCourseQuery from '~/gql/eleden/queries/process/attestation_course.graphql'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'
import ChangeAttendance from '~/components/eleden/process/ChangeAttendance.vue'
import ChangeMark from '~/components/eleden/process/ChangeMark.vue'
import ChangeAttachments, { AttachmentFiles } from '~/components/eleden/process/ChangeAttachments.vue'

type ChangeAttendanceType = InstanceType<typeof ChangeAttendance> | null
type ChangeMarkType = InstanceType<typeof ChangeMark> | null
type ChangeAttachmentsType = InstanceType<typeof ChangeAttachments> | null

type AddAttestationMutationResult = { data: { addAttestation: { AddAttestationMutationPayload } } }
type ChangeAttestationMutationType = { data: { changeAttestation: { ChangeAttestationMutationPayload } } }
type DeleteAttestationMutationType = { data: { deleteAttestation: { DeleteAttestationMutationPayload } } }
type DeleteAttachmentsMutationType = { data: { deleteAttachments: { DeleteAttachmentsMutationPayload } } }
type AddPortfolioFileAttachmentsType = { data: { addPortfolioFileAttachments: { AddPortfolioFileAttachmentsMutationPayload } } }
type AddFileAttachmentsType = { data: { addFileAttachments: { AddFileAttachmentsMutationPayload } } }

export default defineComponent({
  components: { ChangeAttendance, ChangeMark, ChangeAttachments },
  props: {
    role: { type: Number, required: true },
    course: { type: Object as PropType<CourseType>, required: true },
    attestations: { type: Array as PropType<AttestationType[]>, required: true },
    attachments: { type: Array as PropType<AttachmentType[]>, required: true },
    student: { type: Object as PropType<UserType>, required: true },
    period: { type: Object as PropType<PeriodType>, required: true }
  },
  setup (props, { emit }) {
    const authStore = useAuthStore()
    const user = toRef(authStore, 'user')
    const { t } = useI18n()
    const { getUserName } = useFilters()

    const changeAttendanceVNode = ref<ChangeAttendanceType>(null)
    const changeMarkVNode = ref<ChangeMarkType>(null)
    const changeAttachmentsVNode = ref<ChangeAttachmentsType>(null)

    const hideAlertTimeout = ref<number>(5000)
    const success = ref<WithTimer<string> | null>(null)
    const error = ref<WithTimer<string> | null>(null)
    const saveAttendanceLoading = ref<boolean>(false)
    const deleteAttendanceLoading = ref<boolean>(false)
    const saveMarkLoading = ref<boolean>(false)
    const deleteMarkLoading = ref<boolean>(false)
    const saveAttachmentsLoading = ref<boolean>(false)

    const isMe = computed<boolean>(() => (user.value.id === props.student.id))
    const canViewAllItems = computed<boolean>(() => (canEditMark.value || isMe.value))
    const canEditAttendance = computed<boolean>(() => (
      canEditMark.value ||
        (props.role === Role.ResponsibleUser && (attendance.value === null || attendance.value.confirmedBy === null))
    ))
    const canEditMark = computed<boolean>(() => (props.role === Role.Teacher || props.role === Role.Admin))
    const canEditAttachment = computed<boolean>(() => (canEditMark.value || (isMe.value && !mark.value)))
    const attendanceRegistrations = computed<RegistrationType[]>(() => (
      props.period.registrations.filter((registration: RegistrationType) => registration.kind === 'A_0')
    ))
    const markRegistrations = computed<RegistrationType[]>(() => (
      props.period.registrations.filter((registration: RegistrationType) => registration.kind === 'A_1')
    ))
    const showAttendanceBlock = computed<boolean>(() => (Boolean(attendanceRegistrations.value.length)))
    const showMarkBlock = computed<boolean>(() => (
      canViewAllItems.value && Boolean(markRegistrations.value.length)
    ))
    const showAttachmentsBlock = computed<boolean>(() => (canViewAllItems.value))
    const attendance = computed<AttestationType | null>(() => (
      props.attestations.find((attestation: AttestationType) => attestation.registration.kind === 'A_0') || null
    ))
    const mark = computed<AttestationType | null>(() => (
      props.attestations.find((attestation: AttestationType) => attestation.registration.kind === 'A_1') || null
    ))

    const joinErrors = (errors: ErrorFieldType[]): string => {
      return errors.reduce((a: string, c: ErrorFieldType) => a.concat(c.messages.join(', ')), '')
    }

    const setError = (_error: string): void => {
      success.value = null
      if (error.value) {
        clearTimeout(error.value.timerId!)
      }
      error.value = {
        value: _error,
        timerId: setTimeout(() => { error.value = null }, hideAlertTimeout.value)
      }
    }

    const setSuccess = (_success: string): void => {
      error.value = null
      if (success.value) {
        clearTimeout(success.value.timerId!)
      }
      success.value = {
        value: _success,
        timerId: setTimeout(() => { success.value = null }, hideAlertTimeout.value)
      }
    }

    const close = (): void => {
      if (showAttendanceBlock.value) {
        changeAttendanceVNode.value.cancelEdit()
      }
      if (showMarkBlock.value) {
        changeMarkVNode.value.cancelEdit()
      }
      if (showAttachmentsBlock.value) {
        changeAttachmentsVNode.value.cancelEdit()
      }
      error.value = null
      success.value = null
      emit('close')
    }

    const { update } = useCommonQuery<AttestationCourseQuery, AttestationCourseQueryVariables>({
      document: attestationCourseQuery,
      variables: { courseId: props.course.id }
    })

    const deleteAttestationsSuccessUpdate = (cache: DataProxy, result: DeleteAttestationMutationType): void => {
      update(cache, result, (dataCache, { data: { deleteAttestation: { success, id } } }) => {
        if (success) {
          const dataKey: string = Object.keys(dataCache)[0]
          dataCache[dataKey].attestations = dataCache[dataKey].attestations!
            .filter((existAttestation: AttestationType) => existAttestation.id !== id)
        }
      })
    }

    const addAttestationsSuccessUpdate = (
      cache: DataProxy,
      result: AddAttestationMutationResult
    ): void => {
      update(cache, result, (dataCache, { data: { addAttestation: { success, attestation } } }) => {
        if (success) {
          dataCache.course.attestations!.push(attestation)
          dataCache.course.attestations!.sort(
            (a1, a2) => a1.registration.kind.localeCompare(a2.registration.kind)
          )
        }
      })
    }

    const changeAttestationsSuccessUpdate = (
      cache: DataProxy,
      result: ChangeAttestationMutationType
    ): void => {
      update(cache, result, (dataCache, { data: { changeAttestation: { success, attestation } } }) => {
        if (success) {
          const dataKey = Object.keys(dataCache)[0]
          const index: number = dataCache[dataKey].attestations.findIndex((e: any) => e.id === attestation.id)
          dataCache[dataKey].attestations.splice(index, 1, attestation)
        }
      })
    }

    const { mutate: addAttestationMutate } = useMutation<AddAttestationMutation, AddAttestationMutationVariables>(
      addAttestationMutation,
      { update: (store: DataProxy, data: AddAttestationMutationResult) => { addAttestationsSuccessUpdate(store, data) } }
    )

    const addAttendance = (registration: RegistrationType, confirm: boolean): void => {
      addAttestationMutate({
        description: '',
        registrationId: registration.id,
        courseId: props.course.id,
        periodId: props.period.id,
        setById: user.value.id,
        userId: props.student.id,
        confirmedById: confirm ? user.value.id : undefined
      })
    }

    const {
      mutate: changeAttestationMutate,
      onDone: changeAttestationMutateOnDone
    } = useMutation<ChangeAttestationMutation, ChangeAttestationMutationVariables>(
      changeAttestationMutation,
      { update: (store: DataProxy, data: ChangeAttestationMutationType) => { changeAttestationsSuccessUpdate(store, data) } }
    )
    changeAttestationMutateOnDone(({ data: { changeAttestation: { success, errors } } }: ChangeAttestationMutationType) => {
      if (!success) {
        throw new Error(joinErrors(errors))
      }
    })

    const changeAttendance = (registration: RegistrationType, confirm: boolean): void => {
      changeAttestationMutate({
        attestationId: attendance.value!.id,
        registrationId: registration.id,
        setById: attendance.value!.registration.id !== registration.id ? user.value.id : undefined,
        confirmedById: confirm ? user.value.id : undefined
      })
    }

    const saveAttendance = async (registration: RegistrationType, confirm: boolean): Promise<void> => {
      saveAttendanceLoading.value = true
      try {
        if (attendance.value) {
          await changeAttendance(registration, confirm)
        } else {
          await addAttendance(registration, confirm)
        }
        changeAttendanceVNode.value.cancelEdit()
        setSuccess(t('process.course.register.changeAttestations.mutationSuccess') as string)
      } catch (error) {
        setError(error.message)
      } finally {
        saveAttendanceLoading.value = false
      }
    }

    const { mutate: addMarkMutate, onDone: addMarkMutateOnDone } = useMutation<AddAttestationMutation, AddAttestationMutationVariables>(
      addAttestationMutation,
      { update: (store: DataProxy, data: AddAttestationMutationResult) => { addAttestationsSuccessUpdate(store, data) } }
    )

    addMarkMutateOnDone(({ data: { addAttestation: { success, errors } } }: AddAttestationMutationResult) => {
      if (!success) {
        throw new Error(joinErrors(errors))
      }
    })

    const addMark = (registration: RegistrationType, description: string): void => {
      addMarkMutate({
        description: description || '',
        registrationId: registration.id,
        courseId: props.course.id,
        periodId: props.period.id,
        setById: user.value.id,
        userId: props.student.id
      })
    }

    const {
      mutate: changeMarkMutate,
      onDone: changeMarkMutateOnDone
    } = useMutation<ChangeAttestationMutation, ChangeAttestationMutationVariables>(
      changeAttestationMutation,
      { update: (store: DataProxy, data: ChangeAttestationMutationPayload) => { changeAttestationsSuccessUpdate(store, data) } }
    )

    changeMarkMutateOnDone(({ data: { changeAttestation: { success, errors } } }: ChangeAttestationMutationType) => {
      if (!success) {
        throw new Error(joinErrors(errors))
      }
    })

    const changeMark = (registration: RegistrationType, description: string): void => {
      changeMarkMutate({
        attestationId: mark.value!.id,
        description,
        registrationId: registration.id,
        setById: user.value.id
      })
    }

    const saveMark = async (registration: RegistrationType, description: string): Promise<void> => {
      saveMarkLoading.value = true
      try {
        if (mark.value) {
          await changeMark(registration, description)
        } else {
          await addMark(registration, description)
        }
        changeMarkVNode.value.cancelEdit()
        setSuccess(t('process.course.register.changeAttestations.mutationSuccess') as string)
      } catch (error) {
        setError(error.message)
      } finally {
        saveMarkLoading.value = false
      }
    }

    const {
      mutate: deleteMarkMutate,
      onDone: deleteMarkMutateOnDone
    } = useMutation<DeleteAttestationMutation, DeleteAttestationMutationVariables>(
      deleteAttestationMutation,
      {update: (store: DataProxy, data: DeleteAttestationMutationType) => { deleteAttestationsSuccessUpdate(store, data) } }
    )
    deleteMarkMutateOnDone(({ data: { deleteAttestation: { success, errors } } }: DeleteAttestationMutationType) => {
      if (success) {
        changeMarkVNode.value.cancelEdit()
        setSuccess(t('process.course.register.changeAttestations.deleteSuccess') as string)
      } else {
        throw new Error(joinErrors(errors))
      }
    })

    const deleteMark = (): void => {
      deleteMarkLoading.value = true
      try {
        deleteMarkMutate({ attestationId: mark.value!.id })
      } catch (error) {
        setError(error.message)
      } finally {
        deleteMarkLoading.value = false
      }
    }

    const {
      mutate: deleteAttachmentsMutate,
      onDone: deleteAttachmentsMutateOnDone
    } = useMutation<DeleteAttachmentsMutation, DeleteAttachmentsMutationVariables>(deleteAttachmentsMutation)
    deleteAttachmentsMutateOnDone(({ data: { deleteAttachments: { success, errors } } }: DeleteAttachmentsMutationType) => {
      if (!success) {
        throw new Error(joinErrors(errors))
      }
    })

    const deleteAttachments = (attachments: AttachmentType[]): void => {
      deleteAttachmentsMutate({ attachmentIds: attachments.map((attachment: AttachmentType) => attachment.id) })
    }

    const {
      mutate: addPortfolioFileAttachmentsMutate,
      onDone: addPortfolioFileAttachmentsMutateOnDone
    } = useMutation<AddPortfolioFileAttachmentsMutation, AddPortfolioFileAttachmentsMutationVariables>(
      addPortfolioFileAttachmentsMutation
    )
    addPortfolioFileAttachmentsMutateOnDone((
      { data: { addPortfolioFileAttachments: { success, errors, attachments } } }: AddPortfolioFileAttachmentsType
    ) => {
      if (success) {
        return attachments
      }
      throw new Error(joinErrors(errors))
    })

    const addPortfolioFileAttachments = (
      newPortfolioFiles: PortfolioFileType[],
      confirm: boolean
    ): Promise<AttachmentType[]> => {
      addPortfolioFileAttachmentsMutate({
        courseId: props.course.id,
        periodId: props.period.id,
        userId: props.student.id,
        portfolioFileIds: newPortfolioFiles.map((portfolioFile: PortfolioFileType) => portfolioFile.id),
        confirmedById: confirm ? user.value.id : undefined
      })
    }

    const {
      mutate: addFileAttachmentsMutate,
      onDone: addFileAttachmentsMutateOnDone
    } = useMutation<AddFileAttachmentsMutation, AddFileAttachmentsMutationVariables>(
      addFileAttachmentsMutation
    )
    addFileAttachmentsMutateOnDone((
      { data: { addFileAttachments: { success, errors, attachments } } }: AddFileAttachmentsType
    ) => {
      if (success) {
        return attachments
      }
      throw new Error(joinErrors(errors))
    })
    const addFileAttachments = (
      newFiles: AttachmentFiles,
      confirm: boolean
    ): Promise<AttachmentType[]> => {
      addFileAttachmentsMutate({
        courseId: props.course.id,
        periodId: props.period.id,
        userId: props.student.id,
        files: newFiles.files,
        describe: newFiles.describe,
        fileKindId: newFiles.kind!.id,
        confirmedById: confirm ? user.value.id : undefined
      })
    }
    const {
      mutate: deleteAttendanceMutate,
      onDone: deleteAttendanceMutateOnDone
    } = useMutation<DeleteAttestationMutation, DeleteAttestationMutationVariables>(
      deleteAttestationMutation,
      { update: (store: DataProxy, data: DeleteAttestationMutationType) => { deleteAttestationsSuccessUpdate(store, data) } }
    )
    deleteAttendanceMutateOnDone(({ data: { deleteAttestation: { success, errors } } }: DeleteAttestationMutationType) => {
      if (success) {
        changeAttendanceVNode.value.cancelEdit()
        setSuccess(t('process.course.register.changeAttestations.deleteSuccess') as string)
      } else {
        throw new Error(joinErrors(errors))
      }
    })

    const deleteAttendance = async (): Promise<void> => {
      deleteAttendanceLoading.value = true
      try {
        deleteAttendanceMutate({ attestationId: attendance.value!.id })
      } catch (error) {
        setError(error.message)
      } finally {
        deleteAttendanceLoading.value = false
      }
    }

    const changeAttachmentsSuccessUpdate = (
      cache: DataProxy,
      result: ChangeAttachmentsType,
      deletedAttachments: AttachmentType[],
      newAttachments: AttachmentType[]
    ): void => {
      update(cache, result, (dataCache) => {
        const dataKey: string = Object.keys(dataCache)[0]
        dataCache[dataKey].attachments = dataCache[dataKey].attachments!.filter((attachment: AttachmentType) =>
          !deletedAttachments.find((deletedAttachment: AttachmentType) => deletedAttachment.id === attachment.id))
        newAttachments.forEach((attachment: AttachmentType) => dataCache[dataKey].attachments!.push(attachment))
      })
    }

    const saveAttachments = async (
      editAttachments: AttachmentType[],
      newPortfolioFiles: PortfolioFileType[],
      newFiles: AttachmentFiles,
      confirm: boolean
    ): Promise<void> => {
      saveAttachmentsLoading.value = true
      try {
        const attachmentsToDelete = props.attachments.filter((attachment: AttachmentType) =>
          !editAttachments.find((editAttachment: AttachmentType) => editAttachment.id === attachment.id))
        if (attachmentsToDelete.length) {
          await deleteAttachments(attachmentsToDelete)
        }
        const newAttachments = [
          ...newPortfolioFiles.length ? await addPortfolioFileAttachments(newPortfolioFiles, confirm) : [],
          ...newFiles.files.length ? await addFileAttachments(newFiles, confirm) : []
        ]
        changeAttachmentsSuccessUpdate(attachmentsToDelete, newAttachments)
        await nextTick()
        changeAttachmentsVNode.value.cancelEdit()
        changeAttachmentsVNode.value.refetchPortfolioFiles()
        setSuccess(t('process.course.register.changeAttestations.mutationSuccess') as string)
      } catch (error) {
        setError(error.message)
      } finally {
        saveAttachmentsLoading.value = false
      }
    }

    return {
      getUserName,
      changeAttendanceVNode,
      changeMarkVNode,
      changeAttachmentsVNode,
      success,
      error,
      saveAttendanceLoading,
      deleteAttendanceLoading,
      saveMarkLoading,
      deleteMarkLoading,
      saveAttachmentsLoading,
      canEditAttendance,
      canEditMark,
      canEditAttachment,
      attendanceRegistrations,
      markRegistrations,
      showAttendanceBlock,
      showMarkBlock,
      showAttachmentsBlock,
      attendance,
      mark,
      close,
      saveAttendance,
      saveMark,
      deleteMark,
      deleteAttendance,
      saveAttachments
    }
  }
})
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
