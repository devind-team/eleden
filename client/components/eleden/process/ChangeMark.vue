<template lang="pug">
  validation-observer(v-if="edit" v-slot="{ invalid }" slim)
    v-list
      v-list-item(dense)
        v-list-item-content
          validation-provider(
            v-slot="{ errors, valid }"
            :name="$t('process.course.register.changeAttestations.changeMark.mark')"
            rules="required"
          )
            v-select(
              v-model="registration"
              :items="markRegistrations"
              :label="$t('process.course.register.changeAttestations.changeMark.mark')"
              :error-messages="errors"
              :success="valid"
              hide-details="auto"
              item-value="id"
              item-text="name"
              return-object
            )
          v-textarea.mt-2(
            v-model="description"
            :label="$t('process.course.register.changeAttestations.changeMark.description')"
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
            span {{ $t('process.course.register.changeAttestations.changeMark.cancel') }}
          v-tooltip(v-if="mark" right)
            template(#activator="{ on }")
              v-btn(v-on="on" :loading="deleteLoading" color="error" icon @click="$emit('delete')")
                v-icon mdi-delete
            span {{ $t('process.course.register.changeAttestations.changeMark.delete') }}
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
            span {{ $t('process.course.register.changeAttestations.changeMark.save') }}
  v-list(v-else)
    v-list-item(dense)
      v-list-item-content
        v-list-item-title(v-if="mark")
          | {{ `${mark.registration.name} (${date(mark.updatedAt)})` }}
        v-list-item-title(v-else) {{ $t('process.course.register.changeAttestations.changeMark.markNotSet') }}
        v-list-item-action-text.mt-1(v-if="mark")
          .mt-1.mb-2 {{ mark.description }}
          span {{ $t('process.course.register.changeAttestations.changeMark.setBy') + ': ' }}
          user-link(:user="mark.setBy" chip)
      v-list-item-action(v-if="canEdit")
        v-tooltip(right)
          template(#activator="{ on }")
            v-btn(v-on="on" color="success" icon @click="edit = true")
              v-icon mdi-pencil
          span {{ $t('process.course.register.changeAttestations.changeMark.change') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { AttestationType, RegistrationType } from '~/types/graphql'
import { useFilters } from '~/composables'
import UserLink from '~/components/eleden/user/UserLink.vue'

export default defineComponent({
  components: { UserLink },
  props: {
    mark: { type: Object as PropType<AttestationType>, default: undefined },
    registrations: { type: Array as PropType<RegistrationType[]>, required: true },
    canEdit: { type: Boolean, required: true },
    saveLoading: { type: Boolean, required: true },
    deleteLoading: { type: Boolean, required: true }
  },
  setup (props) {
    const { date } = useFilters()

    const registration = ref<RegistrationType | null>(props.mark ? props.mark.registration : null)
    const description = ref<string | null>(props.mark ? props.mark.description : null)
    const edit = ref<boolean>(false)

    const markRegistrations = computed<RegistrationType[]>(() => (
      props.registrations.filter((registration: RegistrationType) => registration.kind === 'A_1')
    ))

    const cancelEdit = (): void => {
      edit.value = false
      registration.value = props.mark ? props.mark.registration : null
      description.value = props.mark ? props.mark.description : null
    }

    return { date, registration, description, edit, markRegistrations, cancelEdit }
  }
})
</script>
