<template lang="pug">
bread-crumbs(v-if="!loading" :items="bc")
  .title.mb-2
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    | {{ team.name }} ({{ team.shortName }})
  two-columns(:links="links")
    nuxt-child(
      :team="team"
      :is-member="isMember"
      :can-view-portfolio="canViewPortfolio"
      :can-view-summary-report="canViewSummaryReport"
      :raw-job-kinds="rawJobKinds"
      :job-kinds="jobKinds",
      :jobs-count="users.length"
    )
</template>

<script lang="ts">
import type { ComputedRef, PropType, Ref } from '#app'
import { computed, defineComponent, useNuxt2Meta, useRoute, ref, provide } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { TeamQuery, TeamQueryVariables } from '~/types/graphql'
import { useAuthStore } from '~/store'
import { useI18n, useCommonQuery } from '~/composables'
import teamQuery from '~/gql/eleden/queries/team/team.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'

export type JobKind = { [key: string]: string }
type JobUser = TeamQuery['team']['jobs'][number]['user']

export default defineComponent({
  components: { TwoColumns, BreadCrumbs },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('ac.teams.index') as string })

    const route = useRoute()

    const { hasPerm, user } = useAuthStore()

    const rawJobKinds: Ref<string[]> = ref<string[]>(['MJ', 'IP', 'EP', 'CC'])

    const { data: team, loading, update } = useCommonQuery<TeamQuery, TeamQueryVariables>({
      document: teamQuery,
      variables: () => ({
        teamId: route.params.team_id
      })
    })
    provide('teamUpdate', update)

    const users: ComputedRef<JobUser[]> = computed<JobUser[]>(() => {
      if (!team.value) {
        return []
      }
      return team.value.jobs.map(job => job.user)
    })

    const isMember: ComputedRef<boolean> = computed<boolean>(() => (
      !!users.value.find(u => u.id === user.id)
    ))

    const canViewPortfolio: ComputedRef<boolean> = computed<boolean>(() => (
      hasPerm('eleden.view_portfoliofile') || (!!team.value && team.value.permissions.canViewTeamMembers)
    ))

    const canViewSummaryReport: ComputedRef<boolean> = computed<boolean>(() => (
      !!team.value && team.value.permissions.canViewTeamMembers
    ))

    const links: ComputedRef<LinksType[]> = computed<LinksType[]>(() => {
      if (!team.value) {
        return []
      }
      const links: LinksType[] = [{
        title: t('ac.teams.menu.users') as string,
        to: 'eleden-ac-teams-team_id-users',
        icon: 'face-man'
      }]
      if (team.value.jobs && team.value.jobs.length) {
        links.push({
          title: t('ac.teams.menu.posts') as string,
          to: 'eleden-ac-teams-team_id-posts',
          icon: 'book-account'
        })
        if (canViewPortfolio.value || isMember.value) {
          links.push({
            title: t('ac.teams.menu.portfolio') as string,
            to: 'eleden-ac-teams-team_id-portfolio',
            icon: 'folder-open'
          })
        }
      }
      if (team.value.eduProgram) {
        links.push({
          title: t('ac.teams.menu.eduProgram') as string,
          to: 'eleden-ac-teams-team_id-edu_program',
          icon: 'school'
        })
      }
      if (
        team.value.jobs &&
        team.value.jobs.length &&
        team.value.eduProgram &&
        (canViewSummaryReport.value || isMember.value)
      ) {
        links.push({
          title: t('ac.teams.menu.summaryReport') as string,
          to: 'eleden-ac-teams-team_id-summary',
          icon: 'table'
        })
      }
      if (team.value.permissions.canChange || team.value.permissions.canDelete) {
        links.push({
          title: t('ac.teams.menu.settings') as string,
          to: 'eleden-ac-teams-team_id-settings',
          icon: 'cogs'
        })
      }
      return links
    })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => {
      if (!team.value) {
        return props.breadCrumbs
      }
      return [
        ...props.breadCrumbs,
        { text: t('ac.teams.name') as string, to: localePath({ name: 'eleden-ac-teams' }), exact: true },
        {
          text: team.value.name,
          to: localePath({
            name: 'eleden-ac-teams-team_id',
            params: { team_id: team.value.id }
          }),
          exact: true
        }
      ]
    })

    const jobKinds: ComputedRef<{ [key: string]: string }[]> = computed<{ [key: string]: string }[]>(() => (
      rawJobKinds.value.map((e: string) => ({ text: t(`ac.teams.jobKinds.${e.toLowerCase()}`) as string, value: e }))
    ))

    return {
      hasPerm,
      user,
      rawJobKinds,
      team,
      loading,
      users,
      isMember,
      canViewPortfolio,
      canViewSummaryReport,
      links,
      bc,
      jobKinds
    }
  }
})
</script>
