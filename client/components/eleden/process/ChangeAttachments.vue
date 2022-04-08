<template lang="pug">
  validation-observer(v-if="edit" v-slot="{ invalid }" slim)
    v-list
      v-list-item(dense)
        v-list-item-content
          v-list-item-action-text.overflow-x-auto
            v-chip.my-1.overflow-visible.max-w-none(
              v-for="(attachment, index) in editAttachments"
              :key="attachment.id"
              :href="`/${attachment.portfolioFile.file.src}`"
              :class="{ 'mr-1': index !== attachments.length - 1 }"
              target="_blank"
              close
              @click:close="deleteAttachment(attachment)"
            ) {{ getPortfolioFileText(attachment.portfolioFile) }}
          .flex.flex-column
            v-autocomplete(
              v-model="newPortfolioFiles"
              :search-input.sync="search"
              :label="$t('process.course.register.changeAttestations.changeAttachments.newPortfolioFiles')"
              :items="portfolioFileItems"
              :loading="portfolioFilesLoading"
              item-value="id"
              multiple
              hide-selected
              hide-details
              return-object
              success
            )
              template(#selection="{ item }")
                v-chip.my-1.mr-1(
                  :href="`/${item.file.src}`"
                  target="_blank"
                  small
                  close
                  @click:close="deletePortfolioFile(item)"
                ) {{ getPortfolioFileText(item) }}
              template(#item="{ item }") {{ getPortfolioFileText(item) }}
            v-file-input.mt-2(
              v-model="newFiles.files"
              :label="$t('process.course.register.changeAttestations.changeAttachments.newFiles')"
              multiple
              small-chips
              hide-selected
              hide-details
              success
            )
            template(v-if="newFiles.files.length")
              validation-provider.mt-2(
                v-slot="{ errors, valid }"
                :name="$t('process.course.register.changeAttestations.changeAttachments.describe')"
                rules="required|min:2|max:512"
              )
                v-textarea(
                  v-model="newFiles.describe"
                  :label="$t('process.course.register.changeAttestations.changeAttachments.describe')"
                  :error-messages="errors"
                  :success="valid"
                  rows="3"
                  hide-details="auto"
                  clearable
                  auto-grow
                )
              validation-provider.mt-2(
                v-slot="{ errors, valid }"
                :name="$t('process.course.register.changeAttestations.changeAttachments.fileKind')"
                rules="required"
              )
                v-autocomplete(
                  v-model="newFiles.kind"
                  :items="fileKinds"
                  :label="$t('process.course.register.changeAttestations.changeAttachments.fileKind')"
                  :loading="fileKindsLoading"
                  :error-messages="errors"
                  :success="valid"
                  item-text="name"
                  item-value="id"
                  hide-details="auto"
                  return-object
                )
            .w-full.d-flex.justify-center
              v-switch(
                v-if="canConfirm"
                v-model="confirm"
                :label="$t('process.course.register.changeAttestations.changeAttachments.confirm')"
                hide-details
                success
              )
        v-list-item-action.justify-center
          v-tooltip(right)
            template(#activator="{ on }")
              v-btn(v-on="on" icon @click="cancelEdit")
                v-icon mdi-minus
            span {{ $t('process.course.register.changeAttestations.changeAttachments.cancel') }}
          v-tooltip(right :disabled="invalid")
            template(#activator="{ on }")
              v-btn(
                v-on="on"
                :disabled="invalid"
                :loading="saveLoading"
                color="success"
                icon
                @click="$emit('save', editAttachments, newPortfolioFiles, newFiles, confirm)"
              )
                v-icon mdi-check-circle
            span {{ $t('process.course.register.changeAttestations.changeAttachments.save') }}
  v-list(v-else)
    v-list-item(dense)
      v-list-item-content
        v-list-item-title
          | {{ attachments.length
          | ? $t('process.course.register.changeAttestations.changeAttachments.attachments')
          | : $t('process.course.register.changeAttestations.changeAttachments.zeroAttachments') }}
        v-list-item-action-text.overflow-x-auto
          v-tooltip(v-for="(attachment, index) in attachments" :key="attachment.id" bottom)
            template(#activator="{ on }")
              v-chip.my-1.overflow-visible.max-w-none(
                v-on="on"
                :href="`/${attachment.portfolioFile.file.src}`"
                :class="{ 'mr-1': index !== attachments.length - 1 }"
                target="_blank"
              ) {{ getPortfolioFileText(attachment.portfolioFile) }}
            span {{ $t('process.course.register.changeAttestations.changeAttachments.open') }}
      v-list-item-action(v-if="canEdit")
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" color="success" icon @click="edit = true")
              v-icon mdi-pencil
          span {{ $t('process.course.register.changeAttestations.changeAttachments.change') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import {
  UserType,
  CourseType,
  AttachmentType,
  PortfolioFileType,
  FileKindType,
  PortfolioFilesQuery,
  PortfolioFilesQueryVariables,
  FileKindsQuery,
  FileKindsQueryVariables
} from '~/types/graphql'
import { useI18n, useQueryRelay, useCommonQuery, useDebounceSearch } from '~/composables'
import portfolioFilesQuery from '~/gql/eleden/queries/profile/portfolio_files.graphql'
import fileKindsQuery from '~/gql/eleden/queries/profile/file_kinds.graphql'

export type AttachmentFiles = {
  files: File[],
  describe: string,
  kind: FileKindType | null
}

export default defineComponent({
  props: {
    student: { type: Object as PropType<UserType>, required: true },
    course: { type: Object as PropType<CourseType>, required: true },
    attachments: { type: Array as PropType<AttachmentType[]>, required: true },
    canEdit: { type: Boolean, required: true },
    canConfirm: { type: Boolean, required: true },
    saveLoading: { type: Boolean, required: true }
  },
  setup (props) {
    const { t } = useI18n()

    const editAttachments = ref<AttachmentType[]>(props.attachments)
    const edit = ref<boolean>(false)
    const confirm = ref<boolean>(false)
    const newPortfolioFiles = ref<PortfolioFileType[]>([])
    const newFiles = ref<AttachmentFiles>({
      files: [],
      describe: '',
      kind: null
    })

    const portfolioFileItems = computed<PortfolioFileType[]>(() => {
      return portfolioFiles.value
        ? [
            ...portfolioFiles.value.filter((portfolioFile: PortfolioFileType) =>
              !props.course.attachments!.find((attachment: AttachmentType) =>
                attachment.portfolioFile.id === portfolioFile.id) &&
              !newPortfolioFiles.value.find((newPortfolioFile: PortfolioFileType) =>
                newPortfolioFile.id === portfolioFile.id)),
            ...newPortfolioFiles.value
          ]
        : []
    })

    const { search, debounceSearch } = useDebounceSearch()
    const {
      data: portfolioFiles,
      loading: portfolioFilesLoading,
      refetch
    } = useQueryRelay<PortfolioFilesQuery, PortfolioFilesQueryVariables>({
      document: portfolioFilesQuery,
      variables: () => ({
        usersId: [props.student.id],
        disciplineId: props.course.eduHours.discipline!.id,
        first: 5,
        search: debounceSearch.value
      })
    })

    const {
      data: fileKinds,
      loading: fileKindsLoading
    } = useCommonQuery<FileKindsQuery, FileKindsQueryVariables>({ document: fileKindsQuery })

    const deleteAttachment = (attachment: AttachmentType): void => {
      editAttachments.value = editAttachments.value
        .filter((existAttachment: AttachmentType) => existAttachment.id !== attachment.id)
    }

    const deletePortfolioFile = (portfolioFile: PortfolioFileType) => {
      newPortfolioFiles.value = newPortfolioFiles.value
        .filter((newPortfolioFile: PortfolioFileType) => portfolioFile.id !== newPortfolioFile.id)
    }

    const getPortfolioFileText = (portfolioFile: PortfolioFileType): string => {
      return `${portfolioFile.describe} (${portfolioFile.kind?.name}, ` +
      `${portfolioFile.user
        ? t('process.course.register.changeAttestations.changeAttachments.confirmed')
        : t('process.course.register.changeAttestations.changeAttachments.notConfirmed')})`
    }

    const cancelEdit = (): void => {
      edit.value = false
      editAttachments.value = props.attachments
      newPortfolioFiles.value = []
      newFiles.value = {
        files: [],
        describe: '',
        kind: null
      }
      confirm.value = false
    }

    const refetchPortfolioFiles = () => {
      refetch()
    }

    return {
      editAttachments,
      edit,
      confirm,
      newPortfolioFiles,
      newFiles,
      portfolioFileItems,
      portfolioFiles,
      portfolioFilesLoading,
      search,
      fileKinds,
      fileKindsLoading,
      deleteAttachment,
      deletePortfolioFile,
      getPortfolioFileText,
      cancelEdit,
      refetchPortfolioFiles
    }
  }
})
</script>
