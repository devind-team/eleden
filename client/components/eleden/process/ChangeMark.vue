<template lang="pug">
validation-observer(v-if="edit" v-slot="{ invalid }" slim)
  v-list
    v-list-item(dense)
      v-list-item-content
        validation-provider(
          v-slot="{ errors, valid }"
          :name="t('mark')"
          rules="required"
        )
          v-select(
            v-model="registration"
            :items="markRegistrations"
            :label="t('mark')"
            :error-messages="errors"
            :success="valid"
            hide-details="auto"
            item-value="id"
            item-text="name"
            return-object
          )
        v-textarea.mt-2(
          v-model="description"
          :label="t('description')"
          rows="3"
          success
          hide-details
          clearable
          auto-grow
        )
      v-list-item-action.justify-center
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" icon @click="cancelEdit")
              v-icon mdi-minus
          span {{ t('cancel') }}
        v-tooltip(v-if="mark" right)
          template(#activator="{ on }")
            v-btn(v-on="on" :loading="deleteLoading" color="error" icon @click="$emit('delete')")
              v-icon mdi-delete
          span {{ t('delete') }}
        v-tooltip(right :disabled="invalid")
          template(#activator="{ on }")
            v-btn(
              v-on="on"
              :disabled="invalid"
              :loading="saveLoading"
              color="success"
              icon
              @click="$emit('save', registration, description)"
            )
              v-icon mdi-check-circle
          span {{ t('save') }}
v-list(v-else)
  v-list-item(dense)
    v-list-item-content
      v-list-item-title(v-if="mark")
        | {{ `${mark.registration.name} (${$filters.date(mark.updatedAt)})` }}
      v-list-item-title(v-else) {{ t('markNotSet') }}
      v-list-item-action-text.mt-1(v-if="mark")
        .mt-1.mb-2 {{ mark.description }}
        span {{ t('setBy') + ': ' }}
        user-link(:user="mark.setBy" chip)
    v-list-item-action(v-if="canEdit")
      v-tooltip(right)
        template(#activator="{ on }")
          v-btn(v-on="on" color="success" icon @click="edit = true")
            v-icon mdi-pencil
        span {{ t('change') }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AttestationType, RegistrationType } from '~/types/graphql'
import UserLink from '~/components/eleden/user/UserLink.vue'

@Component<ChangeMark>({
  components: { UserLink },
  computed: {
    markRegistrations (): RegistrationType[] {
      return this.registrations.filter((registration: RegistrationType) => registration.kind === 'A_1')
    }
  }
})
export default class ChangeMark extends Vue {
  @Prop({ type: Object }) readonly mark?: AttestationType
  @Prop({ type: Array, required: true }) readonly registrations!: RegistrationType[]
  @Prop({ type: Boolean, required: true }) readonly canEdit!: boolean
  @Prop({ type: Boolean, required: true }) readonly saveLoading!: boolean
  @Prop({ type: Boolean, required: true }) readonly deleteLoading!: boolean

  readonly markRegistrations!: RegistrationType[]

  registration!: RegistrationType | null
  description!: string | null

  edit: boolean = false

  data () {
    return {
      registration: this.mark ? this.mark.registration : null,
      description: this.mark ? this.mark.description : null
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.changeAttestations.changeMark.${path}`, values) as string
  }

  /**
   * Отмена редактирования
   */
  cancelEdit (): void {
    this.edit = false
    this.registration = this.mark ? this.mark.registration : null
    this.description = this.mark ? this.mark.description : null
  }
}
</script>
