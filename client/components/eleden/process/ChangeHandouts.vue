<template lang="pug">
form
  v-card
    v-card-title {{ t('title') }}
      v-spacer
      v-btn(@click="close" icon)
        v-icon mdi-close
    v-card-text(v-if="error || success")
      v-alert(v-if="error" type="error") {{ t('mutationBusinessLogicError', { error: error.value }) }}
      v-alert(v-else-if="success" type="success") {{ success.value }}
    v-divider
    v-card-text.ma-0.pa-0(style="max-height: 600px")
      validation-observer(v-if="edit" v-slot="{ invalid }" slim)
        v-list-item(dense)
          v-list-item-content
            v-list-item-action-text.overflow-x-auto
              v-chip.my-1.overflow-visible.max-w-none(
                v-for="(handout, index) in editHandouts"
                :key="handout.id"
                :href="`/${handout.file.src}`"
                :class="{ 'mr-1': index !== handouts.length - 1 }"
                target="_blank"
                close
                @click:close="deleteHandout(handout)"
              ) {{ handout.description }}
            v-file-input.mt-2.mb-2(
              v-model="newFile"
              :label="t('newFile')"
              small-chips
              hide-selected
              hide-details
              success
            )
            validation-provider(
              v-if="newFile"
              v-slot="{ errors, valid }"
              :name="t('description')"
              rules="required|min:2|max:512"
            )
              v-textarea(
                v-model="description"
                :label="t('description')"
                :error-messages="errors"
                :success="valid"
                rows="3"
                clearable
                auto-grow
              )
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
                  @click="save"
                )
                  v-icon mdi-check-circle
              span {{ t('save') }}
      v-list(v-else)
        v-list-item(dense)
          v-list-item-content
            v-list-item-title(v-if="!handouts.length") {{ t('zeroHandouts') }}
            v-list-item-action-text.overflow-x-auto
              v-tooltip(v-for="(handout, index) in handouts" :key="handout.id" bottom)
                template(#activator="{ on }")
                  v-chip.my-1.overflow-visible.max-w-none(
                    v-on="on"
                    :href="`/${handout.file.src}`"
                    :class="{ 'mr-1': index !== handouts.length - 1 }"
                    target="_blank"
                  ) {{ handout.description }}
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
import { DataProxy } from 'apollo-cache'
import {
  CourseType,
  ErrorFieldType,
  HandoutType,
  PeriodType,
  AddHandoutMutation,
  AddHandoutMutationVariables,
  DeleteHandoutsMutation,
  DeleteHandoutsMutationVariables, CourseQueryVariables
} from '~/types/graphql'
import { Role } from '~/pages/eleden/process/courses/_course_id.vue'
import { WithTimer } from '~/types/devind'
import AddHandout from '~/gql/eleden/mutations/process/add_handout.graphql'
import DeleteHandouts from '~/gql/eleden/mutations/process/delete_handouts.graphql'
import AttestationCourse from '~/gql/eleden/queries/process/attestation_course.graphql'

@Component<ChangeHandouts>({
  computed: {
    canEdit () {
      return this.role === Role.Teacher || this.role === Role.Admin
    }
  }
})
export default class ChangeHandouts extends Vue {
  @Prop({ type: Number, required: true }) readonly role!: Role
  @Prop({ type: Object, required: true }) readonly course!: CourseType
  @Prop({ type: Object, required: true }) readonly period!: PeriodType
  @Prop({ type: Array, required: true }) readonly handouts!: HandoutType[]

  readonly canEdit!: boolean
  editHandouts!: HandoutType[]

  edit: boolean = false
  hideAlertTimeout: number = 5000
  success: WithTimer<string> | null = null
  error: WithTimer<string> | null = null
  newFile: File | null = null
  description: string | null = null
  saveLoading: boolean = false

  data () {
    return {
      editHandouts: this.handouts
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.changeHandouts.${path}`, values) as string
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
   * Удаление раздаточного материала
   * @param handout
   */
  deleteHandout (handout: HandoutType): void {
    this.editHandouts = this.editHandouts
      .filter((existHandout: HandoutType) => existHandout.id !== handout.id)
  }

  /**
   * Удаление раздаточных материалов
   * @param handouts
   */
  async deleteHandouts (handouts: HandoutType[]): Promise<void> {
    const { data } = await this.$apollo.mutate<DeleteHandoutsMutation, DeleteHandoutsMutationVariables>({
      mutation: DeleteHandouts,
      variables: {
        handoutIds: handouts.map((handout: HandoutType) => handout.id)
      }
    })
    if (!data!.deleteHandouts.success) {
      throw new Error(this.joinErrors(data!.deleteHandouts.errors))
    }
  }

  /**
   * Добавление раздаточных материалов
   */
  async addHandout (newFile: File, description: string): Promise<HandoutType> {
    const { data } = await this.$apollo.mutate<AddHandoutMutation, AddHandoutMutationVariables>({
      mutation: AddHandout,
      variables: {
        description,
        file: newFile,
        courseId: this.course.id,
        periodId: this.period.id
      }
    })
    if (data!.addHandout.success) {
      return data!.addHandout.handout as HandoutType
    }
    throw new Error(this.joinErrors(data!.addHandout.errors))
  }

  /**
   * Обновление раздаточных материалов после успешного изменения
   * @param deletedHandouts
   * @param newHandout
   */
  changeHandoutsSuccessUpdate (deletedHandouts: HandoutType[], newHandout: HandoutType | null): void {
    const variables: CourseQueryVariables = {
      courseId: this.course.id
    }
    const store: DataProxy = this.$apolloProvider.defaultClient.cache
    const data: { course: CourseType } = store.readQuery({
      query: AttestationCourse,
      variables
    }) as { course: CourseType }
    data.course.handouts = data.course.handouts!.filter((handout: HandoutType) =>
      !deletedHandouts.find((deletedHandout: HandoutType) => deletedHandout.id === handout.id))
    if (newHandout) {
      data.course.handouts!.push(newHandout)
    }
    store.writeQuery({ query: AttestationCourse, variables, data })
  }

  /**
   * Сохранение раздаточного материала
   */
  async save (): Promise<void> {
    this.saveLoading = true
    try {
      const handoutsToDelete = this.handouts.filter((handout: HandoutType) =>
        !this.editHandouts.find((editHandout: HandoutType) => editHandout.id === handout.id))
      if (handoutsToDelete.length) {
        await this.deleteHandouts(handoutsToDelete)
      }
      const newHandout = this.newFile && this.description ? await this.addHandout(this.newFile, this.description) : null
      this.changeHandoutsSuccessUpdate(handoutsToDelete, newHandout)
      await this.$nextTick()
      this.cancelEdit()
      this.setSuccess(this.t('mutationSuccess'))
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.saveLoading = false
    }
  }

  /**
   * Отмена редактирования
   */
  cancelEdit () {
    this.edit = false
    this.editHandouts = this.handouts
    this.newFile = null
    this.description = null
    this.error = null
    this.success = null
  }

  /**
   * Закрытие диалога
   */
  close (): void {
    this.cancelEdit()
    this.$emit('close')
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
