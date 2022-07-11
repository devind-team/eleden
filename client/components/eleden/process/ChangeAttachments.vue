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
            v-stream:update:search-input="searchStreamPortfolioFiles$"
            :label="t('newPortfolioFiles')"
            :items="portfolioFileItems"
            :loading="$apollo.queries.portfolioFiles.loading"
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
            :label="t('newFiles')"
            multiple
            small-chips
            hide-selected
            hide-details
            success
          )
          template(v-if="newFiles.files.length")
            validation-provider.mt-2(
              v-slot="{ errors, valid }"
              :name="t('describe')"
              rules="required|min:2|max:512"
            )
              v-textarea(
                v-model="newFiles.describe"
                :label="t('describe')"
                :error-messages="errors"
                :success="valid"
                rows="3"
                hide-details="auto"
                clearable
                auto-grow
              )
            validation-provider.mt-2(
              v-slot="{ errors, valid }"
              :name="t('fileKind')"
              rules="required"
            )
              v-autocomplete(
                v-model="newFiles.kind"
                :items="fileKinds"
                :label="t('fileKind')"
                :loading="$apollo.queries.fileKinds.loading"
                :error-messages="errors"
                :success="valid"
                item-text="name"
                item-value="id"
                hide-details="auto"
                return-object
              )
          .w-full.d-flex.justify-center
            v-switch(v-if="canConfirm" v-model="confirm" :label="t('confirm')" hide-details success)
      v-list-item-action.justify-center
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" icon @click="cancelEdit")
              v-icon mdi-minus
          span {{ t('cancel') }}
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
          span {{ t('save') }}
v-list(v-else)
  v-list-item(dense)
    v-list-item-content
      v-list-item-title {{ attachments.length ? t('attachments') : t('zeroAttachments') }}
      v-list-item-action-text.overflow-x-auto
        v-tooltip(v-for="(attachment, index) in attachments" :key="attachment.id" bottom)
          template(#activator="{ on }")
            v-chip.my-1.overflow-visible.max-w-none(
              v-on="on"
              :href="`/${attachment.portfolioFile.file.src}`"
              :class="{ 'mr-1': index !== attachments.length - 1 }"
              target="_blank"
            ) {{ getPortfolioFileText(attachment.portfolioFile) }}
          span {{ t('open') }}
    v-list-item-action(v-if="canEdit")
      v-tooltip(right)
        template(#activator="{ on }")
          v-btn(v-on="on" color="success" icon @click="edit = true")
            v-icon mdi-pencil
        span {{ t('change') }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Subject } from 'rxjs'
import { debounceTime, filter, pluck, startWith } from 'rxjs/operators'
import {
  UserType,
  CourseType,
  AttachmentType,
  PortfolioFileType,
  FileKindType,
  PortfolioFilesQueryVariables,
  PortfolioFileTypeEdge
} from '~/types/graphql'

export type AttachmentFiles = {
  files: File[],
  describe: string,
  kind: FileKindType | null
}

@Component<ChangeAttachments>({
  computed: {
    portfolioFileItems () {
      return this.portfolioFiles
        ? [
            ...this.portfolioFiles.filter((portfolioFile: PortfolioFileType) =>
              !this.course.attachments!.find((attachment: AttachmentType) =>
                attachment.portfolioFile.id === portfolioFile.id) &&
              !this.newPortfolioFiles.find((newPortfolioFile: PortfolioFileType) =>
                newPortfolioFile.id === portfolioFile.id)),
            ...this.newPortfolioFiles
          ]
        : []
    }
  },
  domStreams: ['searchStreamCompetences$'],
  subscriptions () {
    const searchPortfolioFiles$ = this.searchStreamPortfolioFiles$.pipe(
      pluck('event', 'msg'),
      filter((e: string | null) => e !== null),
      debounceTime(700),
      startWith('')
    )
    return { searchPortfolioFiles$ }
  },
  apollo: {
    portfolioFiles: {
      query: require('~/gql/eleden/queries/profile/portfolio_files.graphql'),
      variables (): PortfolioFilesQueryVariables {
        return {
          usersId: [this.student.id],
          disciplineId: this.course.eduHours.discipline!.id,
          first: 5,
          search: this.searchPortfolioFiles$
        }
      },
      update ({ portfolioFiles }) {
        return portfolioFiles.edges.map((e: PortfolioFileTypeEdge) => e.node)
      }
    },
    fileKinds: require('~/gql/eleden/queries/profile/file_kinds.graphql')
  }
})
export default class ChangeAttachments extends Vue {
  @Prop({ type: Object, required: true }) readonly student!: UserType
  @Prop({ type: Object, required: true }) readonly course!: CourseType
  @Prop({ type: Array, required: true }) readonly attachments!: AttachmentType[]
  @Prop({ type: Boolean, required: true }) readonly canEdit!: boolean
  @Prop({ type: Boolean, required: true }) readonly canConfirm!: boolean
  @Prop({ type: Boolean, required: true }) readonly saveLoading!: boolean

  portfolioFileItems!: PortfolioFileType[]
  portfolioFiles!: PortfolioFileType[]
  fileKinds!: FileKindType[]
  editAttachments!: AttachmentType[]

  edit: boolean = false
  confirm: boolean = false
  searchStreamPortfolioFiles$: Subject<any> = new Subject<any>()
  searchPortfolioFiles$: string = ''
  newPortfolioFiles: PortfolioFileType[] = []
  newFiles: AttachmentFiles = {
    files: [],
    describe: '',
    kind: null
  }

  data () {
    return {
      editAttachments: this.attachments
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.changeAttestations.changeAttachments.${path}`, values) as string
  }

  /**
   * Удаление прикрепленного файла
   * @param attachment
   */
  deleteAttachment (attachment: AttachmentType): void {
    this.editAttachments = this.editAttachments
      .filter((existAttachment: AttachmentType) => existAttachment.id !== attachment.id)
  }

  /**
   * Удаление файла портфолио из списка на добавление
   * @param competence
   */
  deletePortfolioFile (portfolioFile: PortfolioFileType) {
    this.newPortfolioFiles = this.newPortfolioFiles
      .filter((newPortfolioFile: PortfolioFileType) => portfolioFile.id !== newPortfolioFile.id)
  }

  /**
   * Получение текста файла портфолио
   * @param portfolioFile
   * @return
   */
  getPortfolioFileText (portfolioFile: PortfolioFileType): string {
    return `${portfolioFile.describe} (${portfolioFile.kind?.name}, ` +
      `${portfolioFile.user ? this.t('confirmed') : this.t('notConfirmed')})`
  }

  /**
   * Отмена редактирования
   */
  cancelEdit (): void {
    this.edit = false
    this.editAttachments = this.attachments
    this.newPortfolioFiles = []
    this.newFiles = {
      files: [],
      describe: '',
      kind: null
    }
    this.confirm = false
  }

  /**
   * Обновление файлов портфолио с сервера
   */
  refetchPortfolioFiles () {
    this.$apollo.queries.portfolioFiles.refetch()
  }
}
</script>
