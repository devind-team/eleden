<template lang="pug">
  v-dialog(v-model="active" width="800")
    template(#activator="{ on }")
      slot(name="activator" :on="on" :close="close")
    form
      v-card
        v-card-title {{ t('header') }}
          v-spacer
          v-btn(@click="close" icon)
            v-icon mdi-close
        v-card-subtitle {{ `${$getUserFullName(job.user)}, ${jobPost.post.name}` }}
        v-card-text
          v-simple-table.status-history__table(max-height="400px" fixed-header)
            template
              thead
                tr
                  th {{ t('tableHeaders.status') }}
                  th {{ t('tableHeaders.active') }}
                  th {{ t('tableHeaders.createdAt') }}
                  th {{ t('tableHeaders.endAt') }}
                  th(v-if="viewActions") {{ t('tableHeaders.actions') }}
              tbody
                tr(v-for="statusHistory in jobPost.statusHistory" :key="statusHistory.id")
                  td {{ statusHistory.status.name }}
                  td {{ statusHistory.status.active ? $t('yes') : $t('no') }}
                  td {{ $filters.dateTimeHM(statusHistory.createdAt) }}
                  td
                    template(v-if="statusHistory.endAt") {{ $filters.dateTimeHM(statusHistory.endAt) }}
                    strong(v-else) &mdash;
                  td(v-if="viewActions" style="width: 140px")
                    v-tooltip(v-if="statusHistory.decreeDocx" bottom)
                      template(#activator="{ on }")
                        v-btn(v-on="on" :href="`/${statusHistory.decreeDocx}`" target="_blank" color="success" icon)
                          v-icon mdi-file-word-box
                      span {{ t('tooltips.downloadDocx') }}
                    template(
                      v-else-if="canChange && statusHistory.status.templateXml && statusHistory.status.templateDocx"
                    )
                      experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on: onDialog }")
                        v-tooltip(bottom)
                          template(#activator="{ on: onTooltip }")
                            v-btn(v-on="{ ...onDialog, ...onTooltip }" color="primary" icon)
                              v-icon mdi-file-word-box
                          span {{ t('tooltips.createDocx') }}
                    v-btn(v-else-if="canChange" icon disabled)
                      v-icon mdi-file-word-box
                    v-tooltip(v-if="statusHistory.decreePdf" bottom)
                      template(#activator="{ on }")
                        v-btn(v-on="on" :href="`/${statusHistory.decreePdf}`" target="_blank" color="success" icon)
                          v-icon mdi-file-pdf-box
                      span {{ t('tooltips.downloadPdf') }}
                    template(
                      v-else-if="canChange && statusHistory.status.templateXml && statusHistory.status.templateDocx"
                    )
                      experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on: onDialog }")
                        v-tooltip(bottom)
                          template(#activator="{ on: onTooltip }")
                            v-btn(v-on="{ ...onDialog, ...onTooltip }" color="primary" icon)
                              v-icon mdi-file-pdf-box
                          span {{ t('tooltips.createPdf') }}
                    v-btn(v-else-if="canChange" icon disabled)
                      v-icon mdi-file-pdf-box
                    experimental-dialog(v-if="hasPerm('core.view_experimental') && canDelete" v-slot="{ on: onDialog }")
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip }")
                          v-btn(v-on="{ ...onDialog, ...onTooltip }" color="error" icon)
                            v-icon mdi-delete
                        span {{ t('tooltips.delete') }}
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { JobType, JobPostType } from '~/types/graphql'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

@Component<StatusHistory>({
  components: { ExperimentalDialog },
  computed: {
    ...mapGetters({ hasPerm: 'auth/hasPerm' }),
    viewActions (): boolean {
      return [
        (this.canChange && this.hasPerm('core.view_experimental')) ||
          this.jobPost.statusHistory.some(statusHistory => statusHistory.decreeDocx),
        (this.canChange && this.hasPerm('core.view_experimental')) ||
          this.jobPost.statusHistory.some(statusHistory => statusHistory.decreePdf),
        this.canDelete && this.hasPerm('core.view_experimental')
      ].some(check => check)
    }
  }
})
export default class StatusHistory extends Vue {
  @Prop({ type: Object as PropType<JobType>, required: true }) readonly job!: JobType
  @Prop({ type: Object as PropType<JobPostType>, required: true }) readonly jobPost!: JobPostType
  @Prop({ type: Boolean, required: true }) readonly canChange!: boolean
  @Prop({ type: Boolean, required: true }) readonly canDelete!: boolean

  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly viewActions!: boolean

  active: boolean = false

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`ac.teams.posts.statusHistory.${path}`, values) as string
  }

  /**
   * Закрыте формы
   */
  close (): void {
    this.active = false
  }
}
</script>

<style lang="sass">
.status-history__table
  th, td
    text-align: center !important
</style>
