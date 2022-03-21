<template lang="pug">
  mutation-modal-form(
    :header="t('addForm.header')"
    :subheader="team.name + ' (' + team.shortName + ')'"
    :buttonText="t('addForm.buttonText')"
    :mutation="require('~/gql/eleden/mutations/job_post/add_job_post.graphql')"
    :variables="variables"
    :update="(store, data) => update(store, data, userJob)"
    mutation-name="addJobPost"
    i18n-path="ac.teams.posts.addMenu.form"
    width="700"
    @close="close"
  )
    template(#activator="{ on }")
      slot(name="activator" :on="on")
    template(#form)
      validation-provider(
        v-slot="{ errors, valid }"
        :name="t('form.userId')"
        rules="required"
      )
        v-autocomplete(
          v-model="userId"
          :items="team.jobs.map(job => job.user)"
          :filter="filterUsers"
          :label="t('form.userId')"
          :error-messages="errors"
          :success="valid"
          item-value="id"
          clearable
          hide-no-data
          hide-selected
        )
          template(#selection="{ item }") {{ $getUserFullName(item) }}
          template(#item="{ item }")
            v-list-item-avatar
              avatar-dialog(:item="item")
            v-list-item-content
              v-list-item-title {{ $getUserFullName(item) }}
              v-list-item-subtitle {{ item.username }}
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
          :disabled="!userId"
          :items="availablePosts"
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
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { ValidationProvider } from 'vee-validate'
import { DataProxy } from 'apollo-cache'
import { pluck, tap } from 'rxjs/operators'
import {
  TeamType,
  UserType,
  JobType,
  PostType,
  JobPostType,
  JobPostStatusType,
  AddJobPostMutationPayload,
  AddJobPostMutationVariables
} from '~/types/graphql'
import { JobKind } from '~/pages/eleden/ac/teams/_team_id.vue'
import MutationModalForm from '~/components/common/forms/MutationModalForm.vue'
import AvatarDialog from '~/components/users/AvatarDialog.vue'

export type AddJobPostData = { data: { addJobPost: AddJobPostMutationPayload } }
type Update = (store: DataProxy, data: AddJobPostData, job: JobType) => void

@Component<AddJobPost>({
  components: { MutationModalForm, AvatarDialog },
  computed: {
    variables (): AddJobPostMutationVariables {
      return {
        jobId: this.userJob ? this.userJob.id : '',
        rate: this.rate,
        kind: this.kind,
        postId: this.postId ?? '',
        statusId: this.statusId ?? '',
        statusCreatedAt: this.statusCreatedAt,
        generateDocx: this.generateDocx,
        generatePdf: this.generatePdf
      }
    },
    userJob (): JobType | null {
      if (!this.userId) {
        return null
      }
      return this.team.jobs.find(job => job.user.id === this.userId)!
    },
    existingPosts (): PostType[] | null {
      if (!this.userJob) {
        return null
      }
      return this.userJob.jobPosts.reduce(
        (acc: PostType[], jobPost: JobPostType) => [...acc, jobPost.post], [] as PostType[]
      )
    },
    availablePosts (): PostType[] {
      if (!this.existingPosts || !this.posts) {
        return []
      }
      return this.posts.filter(
        (post: PostType) => !this.existingPosts!.find((existingPost: PostType) => post.id === existingPost.id)
      )
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
export default class AddJobPost extends Vue {
  @Prop({ type: Object as PropType<TeamType>, required: true }) readonly team!: TeamType
  @Prop({ type: Function as PropType<Update>, required: true }) readonly update!: Update
  @Prop({ type: Array as PropType<JobKind[]>, required: true }) readonly jobKinds!: JobKind[]

  @Ref() readonly statusIdValidationProvider!: InstanceType<typeof ValidationProvider>

  readonly variables!: AddJobPostMutationVariables
  readonly userJob!: JobType | null
  readonly existingPosts!: PostType[] | null
  readonly availablePosts!: PostType[]
  readonly statuses!: JobPostStatusType[]
  readonly canGenerateDecree!: boolean
  readonly formattingStatusCreatedAt!: string
  readonly posts!: PostType[] | undefined

  canGenerateDecreeWatch$: boolean | null = null

  userId: string | null = null
  rate: number = 1
  postId: string | null = null
  kind: string = 'MJ'
  statusId: string | null = null
  statusCreatedAt: string = this.$getNowDate()
  statusCreatedAtMenuActive: boolean = false
  generateDocx: boolean = false
  generatePdf: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.posts.addMenu.${path}`, values) as string
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
   * Фильтрация пользователей
   * @param item
   * @param queryText
   * @return
   */
  filterUsers (item: UserType, queryText: string): boolean {
    const qt: string = queryText.toLowerCase()
    const ln: string = item.lastName.toLowerCase()
    const fn: string = item.firstName.toLowerCase()
    return ln.includes(qt) || fn.includes(qt) || item.username.includes(qt)
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
   * Закрыте формы
   */
  close (): void {
    this.rate = 1
    this.kind = 'MJ'
    this.userId = null
    this.postId = null
    this.statusId = null
    this.statusCreatedAt = this.$getNowDate()
    this.statusCreatedAtMenuActive = false
    this.generateDocx = false
    this.generatePdf = false
  }
}
</script>
