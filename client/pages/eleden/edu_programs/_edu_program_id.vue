<template lang="pug">
bread-crumbs(v-if="!loading" :items="bc")
  .title.mb-2
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.smAndDown" @click="$emit('update-drawer')")
    | {{ eduProgram.name }} ({{ eduProgram.admission }})
  two-columns(:links="links")
    nuxt-child(:edu-program="eduProgram")
v-progress-circular(v-else color="primary" indeterminate)
</template>

<script lang="ts">
import type { PropType } from '#app'
import { defineComponent, computed, useNuxt2Meta, useRoute } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { EduProgramQuery, EduProgramQueryVariables } from '~/types/graphql'
import { useI18n, useCommonQuery } from '~/composables'
import eduProgramQuery from '~/gql/eleden/queries/education/edu_program.graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import TwoColumns from '~/components/common/grid/TwoColumns.vue'

export default defineComponent({
  components: { TwoColumns, BreadCrumbs },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const { t, localePath } = useI18n()
    useNuxt2Meta({ title: t('eduPrograms.name') as string })
    const route = useRoute()

    const { data: eduProgram, loading } = useCommonQuery<EduProgramQuery, EduProgramQueryVariables>({
      document: eduProgramQuery,
      variables: () => ({ eduProgramId: route.params.edu_program_id })
    })

    const links = computed<LinksType[]>(() => ([
      {
        title: t('eduPrograms.menu.description') as string,
        to: 'eleden-edu_programs-edu_program_id-description',
        icon: 'semantic-web'
      },
      {
        title: t('eduPrograms.menu.disciplines') as string,
        to: 'eleden-edu_programs-edu_program_id-disciplines',
        icon: 'file'
      },
      {
        title: t('eduPrograms.menu.settings') as string,
        to: 'eleden-edu_programs-edu_program_id-settings',
        icon: 'cogs',
        permissions: ['eleden.change_eduprogram']
      }
    ]))

    const bc = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('eduPrograms.name') as string,
        to: localePath({ name: 'eleden-edu_programs' }),
        exact: true
      },
      {
        text: eduProgram.value!.name,
        to: localePath({
          name: 'eleden-edu_programs-edu_program_id',
          params: { program_id: route.params.program_id }
        })
      }
    ]))

    return { links, bc, eduProgram, loading }
  }
})
</script>
