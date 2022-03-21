<template lang="pug">
  v-menu(v-model="active" bottom)
    template(#activator="{ on }")
      slot(:on="on")
    v-list
      experimental-dialog(v-slot="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-microsoft-excel
          v-list-item-content {{ t('uploadToExcel') }}
      experimental-dialog(v-slot="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-file-delimited
          v-list-item-content {{ t('uploadToCsv') }}
      experimental-dialog(v-slot="{ on }")
        v-list-item(v-on="on")
          v-list-item-icon
            v-icon mdi-code-json
          v-list-item-content {{ t('uploadToJson') }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

@Component<UnloadTeams>({
  components: { ExperimentalDialog }
})
export default class UnloadTeams extends Vue {
  active: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.uploadTeams.buttons.${path}`, values) as string
  }
}
</script>
