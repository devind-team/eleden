<template lang="pug">
  mutation-modal-form(
    :header="t('fromFileForNew.header')"
    :subheader="team.name + ' (' + team.shortName + ')'"
    :buttonText="t('fromFileForNew.buttonText')"
    :mutation="require('~/gql/eleden/mutations/job/upload_jobs_user.graphql')"
    :variables="variables"
    :update="update"
    mutation-name="uploadJobsUser"
    errors-in-alert
    width="700"
    @close="close"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    template(#form)
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('form.rate')"
        rules="required|rate"
      )
        v-text-field(
          v-model="rate"
          :label="t('form.rate')"
          :error-messages="errors"
          :success="valid"
        )
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('form.postId')"
        rules="required"
      )
        v-autocomplete(
          v-model="postId"
          :items="posts"
          :loading="$apollo.queries.posts.loading"
          :label="t('form.postId')"
          :error-messages="errors"
          :success="valid"
          item-text="name"
          item-value="id"
          @change="resetStatus"
        )
      validation-provider(
        ref="statusIdValidationProvider"
        v-slot="{ errors, valid }"
        :name="t('form.statusId')"
        rules="required"
      )
        v-select(
          v-model="statusId"
          :disabled="!postId"
          :items="statuses"
          :loading="$apollo.queries.posts.loading"
          :label="t('form.statusId')"
          :error-messages="errors"
          :success="valid"
          item-text="name"
          item-value="id"
        )
          template(#item="{ item }") {{ getStatusText(item) }}
          template(#selection="{ item }") {{ getStatusText(item) }}
      v-row(v-if="canGenerateDecree")
        v-col(cols="6")
          v-checkbox(v-model="generateDocx" :label="t('form.generateDocx')" success)
        v-col(cols="6")
          v-checkbox(v-model="generatePdf" :label="t('form.generatePdf')" success)
      v-menu(
        v-model="statusCreatedAtMenuActive"
        :close-on-content-click="false"
        :nudge-right="35"
        transition="scale-transition"
        min-width="auto"
        offset-y
      )
        template(#activator="{ on, attrs }")
          v-text-field(
            v-bind="attrs"
            v-on="on"
            v-model="formattingStatusCreatedAt"
            :disabled="!postId"
            :label="t('form.statusCreatedAt')"
            prepend-icon="mdi-calendar"
            readonly
            success
          )
        v-date-picker(
          v-model="statusCreatedAt"
          first-day-of-week="1"
          no-title
          @input="statusCreatedAtMenuActive = false"
        )
      v-select(
        v-model="kind"
        :items="jobKinds"
        :label="t('form.kind')"
        :hint="t('form.kindHint')"
        success
        persistent-hint
      )
      validation-provider(
        :name="t('form.file')"
        rules="required"
        v-slot="{ errors, valid }"
      )
        v-file-input(
          v-model="file"
          :label="t('form.file')"
          :success="valid"
          :error-messages="errors"
          accept=".xlsx,.csv,.json"
          clearable
        )
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { ValidationProvider } from 'vee-validate'
import { DataProxy } from 'apollo-cache'
import { pluck, tap } from 'rxjs/operators'
import {
  TeamType,
  PostType,
  JobPostStatusType,
  UploadJobsUserMutationVariables,
  UploadJobsUserMutationPayload
} from '~/types/graphql'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'

export type UploadJobsUserData = { data: { uploadJobsUser: UploadJobsUserMutationPayload } }
type Update = (store: DataProxy, data: UploadJobsUserData) => void

@Component<UploadJobsUser>({
  components: { MutationModalForm },
  computed: {
    variables (): UploadJobsUserMutationVariables {
      return {
        rate: this.rate,
        kind: this.kind,
        file: this.file,
        teamId: this.team.id,
        postId: this.postId ?? '',
        statusId: this.statusId ?? '',
        statusCreatedAt: this.statusCreatedAt,
        generateDocx: this.generateDocx,
        generatePdf: this.generatePdf
      }
    },
    statuses (): JobPostStatusType[] {
      return this.postId && this.posts ? this.posts.find((post: PostType) => post.id === this.postId)!.statuses : []
    },
    canGenerateDecree (): boolean {
      if (!this.statusId) {
        return false
      }
      const status = this.statuses.find((status: JobPostStatusType) => status.id === this.statusId)
      if (!status) {
        return false
      }
      return Boolean(status.templateXml) && Boolean(status.templateDocx)
    },
    formattingStatusCreatedAt (): string {
      return new Date(this.statusCreatedAt).toLocaleDateString()
    }
  },
  subscriptions () {
    const canGenerateDecreeWatch$ = this.$watchAsObservable('canGenerateDecree').pipe(
      pluck('newValue'),
      tap(() => {
        this.generateDocx = false
        this.generatePdf = false
      })
    )
    return { canGenerateDecreeWatch$ }
  },
  apollo: {
    posts: require('~/gql/eleden/queries/team/posts.graphql')
  }
})
export default class UploadJobsUser extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update
  @Prop({ type: Array as PropType<JobKind[]>, required: true }) readonly jobKinds!: JobKind[]

  @Ref() readonly statusIdValidationProvider!: InstanceType<typeof ValidationProvider>

  readonly variables!: UploadJobsUserMutationVariables
  readonly statuses!: JobPostStatusType[]
  readonly canGenerateDecree!: boolean
  readonly formattingStatusCreatedAt!: string
  readonly posts!: PostType[] | undefined

  canGenerateDecreeWatch$: boolean | null = null

  rate: number = 1
  kind: string = 'MJ'
  file: File | null = null
  postId: string | null = null
  statusId: string | null = null
  generateDocx: boolean = false
  generatePdf: boolean = false
  statusCreatedAt: string = this.$getNowDate()
  statusCreatedAtMenuActive: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.users.addMenu.${path}`, values) as string
  }

  /**
   * Сброс статуса, если он не соответствует выбранной должности
   */
  resetStatus (): void {
    if (!this.statuses.find((status: JobPostStatusType) => status.id === this.statusId)) {
      this.statusId = null
      this.statusIdValidationProvider.reset()
    }
  }

  /**
   * Получение текста статуса
   * @param status
   * @return
   */
  getStatusText (status: JobPostStatusType): string {
    return `${status.name} (${status.active ? this.t('form.active') : this.t('form.notActive')})`
  }

  /**
   * Закрыте формы
   */
  close (): void {
    this.rate = 1
    this.kind = 'MJ'
    this.file = null
    this.postId = null
    this.statusId = null
    this.generateDocx = false
    this.generatePdf = false
    this.statusCreatedAt = this.$getNowDate()
    this.statusCreatedAtMenuActive = false
  }
}
</script>
