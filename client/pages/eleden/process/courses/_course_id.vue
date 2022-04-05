<template lang="pug">
  bread-crumbs(v-if="!loading" :items="bc")
    left-navigator-driver(v-model="active" :items="tabs")
    nuxt-child(:key="$route.fullPath" @update-drawer="active = !active" :course="course" :role="role")
</template>

<script lang="ts">
import type { PropType, Ref, ComputedRef } from '#app'
import { defineComponent, ref, computed, toRefs, useRoute, useNuxt2Meta } from '#app'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { CourseType, AttestationCourseQuery, AttestationCourseQueryVariables } from '~/types/graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'
import { useAuthStore } from '~/store'
import { useI18n, useCommonQuery } from '~/composables'
import attestationCourseQuery from '~/gql/eleden/queries/process/attestation_course.graphql'

export enum Role {
  Student,
  ResponsibleUser,
  Teacher,
  Admin
}

export default defineComponent({
  components: { BreadCrumbs, LeftNavigatorDriver },
  middleware: ['auth'],
  props: {
    breadCrumbs: { type: Array as PropType<BreadCrumbsItem[]>, required: true }
  },
  setup (props) {
    const authStore = useAuthStore()
    const { hasPerm, user } = toRefs(authStore)
    const { t, localePath, tc } = useI18n()
    const route = useRoute()
    useNuxt2Meta({ title: t('process.course.process') as string })

    const active: Ref<boolean> = ref<boolean>(true)

    const {
      data: course,
      loading
    } = useCommonQuery<AttestationCourseQuery, AttestationCourseQueryVariables>({
      document: attestationCourseQuery,
      variables: () => ({ courseId: route.params.course_id })
    })

    const getCourseName = (course: CourseType): string => {
      return tc(
        'process.course.name', course.eduHours.value, {
          name: `${course.eduHours.discipline!.name}, ${course.eduHours.workKind!.name}`,
          count: course.eduHours.value
        }
      )
    }

    const role: ComputedRef<Role | null> = computed<Role | null>(() => {
      if (course.value) {
        if (course.value.team.responsibleUsers!.find(u => u.id === user.value.id)) {
          return Role.ResponsibleUser
        }
        if (course.value.teachers!.find(teacher => teacher.id === user.value.id)) {
          return Role.Teacher
        }
        if (course.value.team.users!.find(u => u.id === user.value.id)) {
          return Role.Student
        }
        return Role.Admin
      }
      return null
    })

    const bc: ComputedRef<BreadCrumbsItem[]> = computed<BreadCrumbsItem[]>(() => ([
      ...props.breadCrumbs,
      {
        text: t('process.course.process') as string,
        to: localePath({ name: 'eleden-process' }),
        exact: true
      },
      {
        text: course.value.team.name,
        to: localePath({
          name: 'eleden-process-team_id',
          params: { team_id: course.value.team.id }
        }),
        exact: true
      },
      {
        text: getCourseName(course.value),
        to: localePath({
          name: 'eleden-process-courses-course_id'
        })
      }
    ]))

    const tabs: ComputedRef<LinksType[]> = computed<LinksType[]>(() => ([
      {
        title: t('process.course.register.name') as string,
        to: 'eleden-process-courses-course_id-register',
        params: { course_id: route.params.course_id },
        icon: 'book'
      },
      {
        title: t('process.course.handout.name') as string,
        to: 'eleden-process-courses-course_id-handout',
        params: { course_id: route.params.course_id },
        icon: 'file-multiple'
      }
    ]))

    return { hasPerm, user, active, role, bc, tabs, course, loading }
  }
})
</script>
