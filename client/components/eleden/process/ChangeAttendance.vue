<template lang="pug">
  validation-observer(v-if="edit" v-slot="{ invalid }" slim)
    v-list
      v-list-item(dense)
        v-list-item-content
          validation-provider(
            v-slot="{ errors, valid }"
            :name="$t('process.course.register.changeAttestations.changeAttendance.attendance')"
            rules="required"
          )
            v-select(
              v-model="registration"
              :items="attendanceRegistrations"
              :label="$t('process.course.register.changeAttestations.changeAttendance.attendance')"
              :error-messages="errors"
              :success="valid"
              hide-details="auto"
              item-value="id"
              item-text="name"
              return-object
            )
          .w-full.d-flex.justify-center
            v-switch(
              v-if="canConfirm"
              v-model="confirm"
              :label="$t('process.course.register.changeAttestations.changeAttendance.confirm')"
              hide-details
              success
            )
        v-list-item-action
          v-tooltip(right)
            template(#activator="{ on }")
              v-btn(v-on="on" icon @click="cancelEdit")
                v-icon mdi-minus
            span {{ $t('process.course.register.changeAttestations.changeAttendance.cancel') }}
          v-tooltip(v-if="attendance" right)
            template(#activator="{ on }")
              v-btn(v-on="on" :loading="deleteLoading" color="error" icon @click="$emit('delete')")
                v-icon mdi-delete
            span {{ $t('process.course.register.changeAttestations.changeAttendance.delete') }}
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
            span {{ $t('process.course.register.changeAttestations.changeAttendance.save') }}
  v-list(v-else)
    v-list-item(dense)
      v-list-item-content(v-if="attendance")
        v-list-item-title
          | {{ `${attendance.registration.name} (${date(attendance.updatedAt)})` }}
        v-list-item-action-text.mt-1
          span {{ $t('process.course.register.changeAttestations.changeAttendance.setBy') + ': ' }}
          user-link(:user="attendance.setBy" chip)
          template(v-if="attendance.confirmedBy")
            span.ml-2 {{ $t('process.course.register.changeAttestations.changeAttendance.confirmedBy') + ': ' }}
            user-link(:user="attendance.confirmedBy" chip)
      v-list-item-content(v-else)
        v-list-item-title {{ $t('process.course.register.changeAttestations.changeAttendance.attendanceNotSet') }}
      v-list-item-action(v-if="canEdit")
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" color="success" icon @click="edit = true")
              v-icon mdi-pencil
          span {{ $t('process.course.register.changeAttestations.changeAttendance.change') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { AttestationType, RegistrationType } from '~/types/graphql'
import { useFilters } from '~/composables'
import UserLink from '~/components/eleden/user/UserLink.vue'

export default defineComponent({
  components: { UserLink },
  props: {
    attendance: { type: Object as PropType<AttestationType>, default: undefined },
    registrations: { type: Array as PropType<RegistrationType[]>, required: true },
    canEdit: { type: Boolean, required: true },
    canConfirm: { type: Boolean, required: true },
    saveLoading: { type: Boolean, required: true },
    deleteLoading: { type: Boolean, required: true }
  },
  setup (props) {
    const { date } = useFilters()

    const registration = ref<RegistrationType | null>(props.attendance ? props.attendance.registration : null)
    const edit = ref<boolean>(false)
    const confirm = ref<boolean>(false)

    const attendanceRegistrations = computed<RegistrationType[]>(() => (
      props.registrations.filter((registration: RegistrationType) => registration.kind === 'A_0')
    ))

    const cancelEdit = (): void => {
      edit.value = false
      registration.value = props.attendance ? props.attendance.registration : null
      confirm.value = false
    }

    return { date, registration, edit, confirm, attendanceRegistrations, cancelEdit }
  }
})
</script>
