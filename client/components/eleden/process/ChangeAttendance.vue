<template lang="pug">
validation-observer(v-if="edit" v-slot="{ invalid }" slim)
  v-list
    v-list-item(dense)
      v-list-item-content
        validation-provider(
          v-slot="{ errors, valid }"
          :name="t('attendance')"
          rules="required"
        )
          v-select(
            v-model="registration"
            :items="attendanceRegistrations"
            :label="t('attendance')"
            :error-messages="errors"
            :success="valid"
            hide-details="auto"
            item-value="id"
            item-text="name"
            return-object
          )
        .w-full.d-flex.justify-center
          v-switch(v-if="canConfirm" v-model="confirm" :label="t('confirm')" hide-details success)
      v-list-item-action
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" icon @click="cancelEdit")
              v-icon mdi-minus
          span {{ t('cancel') }}
        v-tooltip(v-if="attendance" right)
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
              @click="$emit('save', registration, confirm)"
            )
              v-icon mdi-check-circle
          span {{ t('save') }}
v-list(v-else)
  v-list-item(dense)
    v-list-item-content(v-if="attendance")
      v-list-item-title
        | {{ `${attendance.registration.name} (${$filters.date(attendance.updatedAt)})` }}
      v-list-item-action-text.mt-1
        span {{ t('setBy') + ': ' }}
        user-link(:user="attendance.setBy" chip)
        template(v-if="attendance.confirmedBy")
          span.ml-2 {{ t('confirmedBy') + ': ' }}
          user-link(:user="attendance.confirmedBy" chip)
    v-list-item-content(v-else)
      v-list-item-title {{ t('attendanceNotSet') }}
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

@Component<ChangeAttendance>({
  components: { UserLink },
  computed: {
    attendanceRegistrations (): RegistrationType[] {
      return this.registrations.filter((registration: RegistrationType) => registration.kind === 'A_0')
    }
  }
})
export default class ChangeAttendance extends Vue {
  @Prop({ type: Object }) readonly attendance?: AttestationType
  @Prop({ type: Array, required: true }) readonly registrations!: RegistrationType[]
  @Prop({ type: Boolean, required: true }) readonly canEdit!: boolean
  @Prop({ type: Boolean, required: true }) readonly canConfirm!: boolean
  @Prop({ type: Boolean, required: true }) readonly saveLoading!: boolean
  @Prop({ type: Boolean, required: true }) readonly deleteLoading!: boolean

  readonly attendanceRegistrations!: RegistrationType[]

  registration!: RegistrationType | null

  edit: boolean = false
  confirm: boolean = false

  data () {
    return {
      registration: this.attendance ? this.attendance.registration : null
    }
  }

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.register.changeAttestations.changeAttendance.${path}`, values) as string
  }

  /**
   * Отмена редактирования
   */
  cancelEdit (): void {
    this.edit = false
    this.registration = this.attendance ? this.attendance.registration : null
    this.confirm = false
  }
}
</script>
