<template lang="pug">
v-menu(v-model="active" bottom)
  template(#activator="{ on }")
    slot(:on="on")
  v-list
    experimental-dialog(v-slot="{ on }")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-microsoft-excel
        v-list-item-content {{ $t('ac.teams.uploadTeams.buttons.uploadToExcel') }}
    experimental-dialog(v-slot="{ on }")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-file-delimited
        v-list-item-content {{ $t('ac.teams.uploadTeams.buttons.uploadToCsv') }}
    experimental-dialog(v-slot="{ on }")
      v-list-item(v-on="on")
        v-list-item-icon
          v-icon mdi-code-json
        v-list-item-content {{ $t('ac.teams.uploadTeams.buttons.uploadToJson') }}
</template>

<script lang="ts">
import { defineComponent, ref } from '#app'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

export default defineComponent({
  components: { ExperimentalDialog },
  setup () {
    const active = ref<boolean>(false)
    return { active }
  }
})
</script>
