<template lang="pug">
v-card
  template(v-if="team.permissions.canChange")
    v-card-title {{ $t('ac.teams.settings.name') }}
    v-card-subtitle {{ $t('ac.teams.settings.updatedAt', { updatedAt: $filters.dateTimeHM(team.updatedAt) }) }}
    v-card-text
      change-team(:team="team")
    v-divider
    v-card-title {{ $t('ac.teams.settings.changeTeamResponsibleUsers.name') }}
    v-card-text
      change-team-responsible-users(:team="team")
    v-divider
    v-card-title {{ $t('ac.teams.settings.changeTeamEduProgram.name') }}
    v-card-subtitle {{ eduProgramWarning }}
    v-card-text
      .mb-3(v-if="team.eduProgram") {{ $t('ac.teams.settings.changeTeamEduProgram.currentEduProgram') }}
        nuxt-link(:to="eduProgramPath") {{ eduProgramName }}
      change-team-edu-program(:team="team")
  v-divider(v-if="team.permissions.canChange && team.permissions.canDelete")
  template(v-if="team.permissions.canDelete")
    v-card-title {{ $t('ac.teams.settings.changeTeamDelete.name') }}
    v-card-subtitle(v-html="$t('ac.teams.settings.changeTeamDelete.warning')")
    v-card-text
      .mb-3 {{ team.delete ? $t('ac.teams.settings.changeTeamDelete.archived') : $t('ac.teams.settings.changeTeamDelete.notArchived') }}
      delete-team(:team="team")
</template>

<script lang="ts">
import type { PropType, ComputedRef } from '#app'
import { defineComponent, computed } from '#app'
import { TeamType } from '~/types/graphql'
import { useI18n } from '~/composables'
import ChangeTeam from '~/components/eleden/ac/team/ChangeTeam.vue'
import ChangeTeamResponsibleUsers from '~/components/eleden/ac/team/ChangeTeamResponsibleUsers.vue'
import ChangeTeamEduProgram from '~/components/eleden/ac/team/ChangeTeamEduProgram.vue'
import DeleteTeam from '~/components/eleden/ac/team/DeleteTeam.vue'

export default defineComponent({
  components: { ChangeTeam, ChangeTeamResponsibleUsers, ChangeTeamEduProgram, DeleteTeam },
  beforeRouteEnter (_to, _from, next) {
    next((vm: Vue & { team: TeamType }) => {
      if (!(vm.team.permissions.canChange || vm.team.permissions.canDelete)) {
        vm.$nuxt.error({
          statusCode: 403,
          message: vm.$t('permissionDenied') as string
        })
      }
    })
  },
  middleware: 'auth',
  props: {
    team: { type: Object as PropType<TeamType>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()

    const eduProgramWarning: ComputedRef<string> = computed<string>(() => {
      return (props.team.eduProgram
        ? t('ac.teams.settings.changeTeamEduProgram.changeWarning')
        : t('ac.teams.settings.changeTeamEduProgram.setWarning')) as string
    })

    const eduProgramPath: ComputedRef<string | null> = computed<string | null>(() => {
      if (props.team.eduProgram) {
        return localePath({
          name: 'eleden-edu_programs-edu_program_id',
          params: { edu_program_id: props.team.eduProgram.id }
        })
      }
      return null
    })

    const eduProgramName: ComputedRef<string | null> = computed<string | null>(() => {
      if (props.team.eduProgram) {
        return `${props.team.eduProgram.direction.code} ${props.team.eduProgram.name} ` +
          `(${props.team.eduProgram.admission}, ${props.team.eduProgram.eduForm.name})`
      }
      return null
    })

    return { eduProgramWarning, eduProgramPath, eduProgramName }
  }
})
</script>
