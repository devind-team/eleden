<template lang="pug">
v-dialog(v-model="active" width="800")
  template(#activator="{ on }")
    slot(name="activator" :on="on" :close="close")
  form
    v-card
      v-card-title {{ $t('ac.teams.posts.statusHistory.header') }}
        v-spacer
        v-btn(@click="close" icon)
          v-icon mdi-close
      v-card-subtitle {{ `${getUserFullName(job.user)}, ${jobPost.post.name}` }}
      v-card-text
        v-simple-table.status-history__table(max-height="400px" fixed-header)
          template
            thead
              tr
                th {{ $t('ac.teams.posts.statusHistory.tableHeaders.status') }}
                th {{ $t('ac.teams.posts.statusHistory.tableHeaders.createdAt') }}
                th {{ $t('ac.teams.posts.statusHistory.tableHeaders.endAt') }}
                th(v-if="viewActions") {{ $t('ac.teams.posts.statusHistory.tableHeaders.actions') }}
            tbody
              tr(v-for="statusHistory in jobPost.statusHistory" :key="statusHistory.id")
                td {{ getStatusText(statusHistory.status) }}
                td {{ dateTimeHM(statusHistory.createdAt) }}
                td
                  template(v-if="statusHistory.endAt") {{ dateTimeHM(statusHistory.endAt) }}
                  strong(v-else) &mdash;
                td(v-if="viewActions" style="width: 140px")
                  v-tooltip(v-if="statusHistory.decreeDocx" bottom)
                    template(#activator="{ on }")
                      v-btn(v-on="on" :href="`/${statusHistory.decreeDocx}`" target="_blank" color="success" icon)
                        v-icon mdi-file-word-box
                    span {{ $t('ac.teams.posts.statusHistory.tooltips.downloadDocx') }}
                  template(
                    v-else-if="canChange && statusHistory.status.templateXml && statusHistory.status.templateDocx"
                  )
                    experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on: onDialog }")
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip }")
                          v-btn(v-on="{ ...onDialog, ...onTooltip }" color="primary" icon)
                            v-icon mdi-file-word-box
                        span {{ $t('ac.teams.posts.statusHistory.tooltips.createDocx') }}
                  v-btn(v-else-if="canChange" icon disabled)
                    v-icon mdi-file-word-box
                  v-tooltip(v-if="statusHistory.decreePdf" bottom)
                    template(#activator="{ on }")
                      v-btn(v-on="on" :href="`/${statusHistory.decreePdf}`" target="_blank" color="success" icon)
                        v-icon mdi-file-pdf-box
                    span {{ $t('ac.teams.posts.statusHistory.tooltips.downloadPdf') }}
                  template(
                    v-else-if="canChange && statusHistory.status.templateXml && statusHistory.status.templateDocx"
                  )
                    experimental-dialog(v-if="hasPerm('core.view_experimental')" v-slot="{ on: onDialog }")
                      v-tooltip(bottom)
                        template(#activator="{ on: onTooltip }")
                          v-btn(v-on="{ ...onDialog, ...onTooltip }" color="primary" icon)
                            v-icon mdi-file-pdf-box
                        span {{ $t('ac.teams.posts.statusHistory.tooltips.createPdf') }}
                  v-btn(v-else-if="canChange" icon disabled)
                    v-icon mdi-file-pdf-box
                  experimental-dialog(v-if="hasPerm('core.view_experimental') && canDelete" v-slot="{ on: onDialog }")
                    v-tooltip(bottom)
                      template(#activator="{ on: onTooltip }")
                        v-btn(v-on="{ ...onDialog, ...onTooltip }" color="error" icon)
                          v-icon mdi-delete
                      span {{ $t('ac.teams.posts.statusHistory.tooltips.delete') }}
</template>

<script lang="ts">
import type { PropType } from '#app'
import { computed, defineComponent, ref, toRef } from '#app'
import type { JobType, JobPostType, JobPostStatusType } from '~/types/graphql'
import { useFilters, useI18n } from '~/composables'
import { useAuthStore } from '~/store'
import { getStatusText as _getStatusText } from '~/services/eleden'
import ExperimentalDialog from '~/components/common/dialogs/ExperimentalDialog.vue'

export default defineComponent({
  components: { ExperimentalDialog },
  props: {
    job: { type: Object as PropType<JobType>, required: true },
    jobPost: { type: Object as PropType<JobPostType>, required: true },
    canChange: { type: Boolean, required: true },
    canDelete: { type: Boolean, required: true }
  },
  setup (props) {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const hasPerm = toRef(authStore, 'hasPerm')
    const { getUserFullName, dateTimeHM } = useFilters()

    const active = ref<boolean>(false)

    const viewActions = computed<boolean>(() => ([
      (props.canChange && hasPerm.value('core.view_experimental')) ||
          props.jobPost.statusHistory.some(statusHistory => statusHistory.decreeDocx),
      (props.canChange && hasPerm.value('core.view_experimental')) ||
          props.jobPost.statusHistory.some(statusHistory => statusHistory.decreePdf),
      props.canDelete && hasPerm.value('core.view_experimental')
    ].some(check => check)
    ))

    const getStatusText = (status: JobPostStatusType) => _getStatusText(t, status)

    const close = (): void => {
      active.value = false
    }

    return { hasPerm, getUserFullName, dateTimeHM, viewActions, active, getStatusText, close }
  }
})
</script>

<style lang="sass">
.status-history__table
  th, td
    text-align: center !important
</style>
