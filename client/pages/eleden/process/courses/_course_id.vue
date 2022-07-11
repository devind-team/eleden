<template lang="pug">
bread-crumbs(v-if="!$apollo.queries.course.loading" :items="bc")
  left-navigator-driver(v-model="active" :items="tabs")
  nuxt-child(:key="$route.fullPath" @update-drawer="active = !active" :course="course" :role="role")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { BreadCrumbsItem, LinksType } from '~/types/devind'
import { CourseType, CourseQueryVariables, UserType } from '~/types/graphql'
import BreadCrumbs from '~/components/common/BreadCrumbs.vue'
import LeftNavigatorDriver from '~/components/common/grid/LeftNavigatorDriver.vue'

export enum Role {
  Student,
  ResponsibleUser,
  Teacher,
  Admin
}

@Component<CourseId>({
  components: { BreadCrumbs, LeftNavigatorDriver },
  middleware: ['auth'],
  computed: {
    ...mapGetters({ user: 'auth/user', hasPerm: 'auth/hasPerm' }),
    role (): Role | null {
      if (this.course) {
        if (this.course.team.responsibleUsers!.find((user: UserType) => user.id === this.user.id)) {
          return Role.ResponsibleUser
        }
        if (this.course.teachers!.find((teacher: UserType) => teacher.id === this.user.id)) {
          return Role.Teacher
        }
        if (this.course.team.users!.find((user: UserType) => user.id === this.user.id)) {
          return Role.Student
        }
        return Role.Admin
      }
      return null
    },
    bc (): BreadCrumbsItem[] {
      return [
        ...this.breadCrumbs,
        {
          text: this.t('process'),
          to: this.localePath({ name: 'eleden-process' }),
          exact: true
        },
        {
          text: this.course.team.name,
          to: this.localePath({
            name: 'eleden-process-team_id',
            params: { team_id: this.course.team.id }
          }),
          exact: true
        },
        {
          text: this.getCourseName(this.course),
          to: this.localePath({
            name: 'eleden-process-courses-course_id'
          })
        }
      ]
    },
    tabs (): LinksType[] {
      return [
        {
          title: this.t('register.name'),
          to: 'eleden-process-courses-course_id-register',
          params: { course_id: this.$route.params.course_id },
          icon: 'book'
        },
        {
          title: this.t('handout.name'),
          to: 'eleden-process-courses-course_id-handout',
          params: { course_id: this.$route.params.course_id },
          icon: 'file-multiple'
        }
      ]
    }
  },
  apollo: {
    course: {
      query: require('~/gql/eleden/queries/process/attestation_course.graphql'),
      variables (): CourseQueryVariables {
        return {
          courseId: this.$route.params.course_id
        }
      }
    }
  },
  head (): MetaInfo {
    return { title: this.t('process') } as MetaInfo
  }
})
export default class CourseId extends Vue {
  @Prop({ type: Array, required: true }) readonly breadCrumbs!: BreadCrumbsItem[]

  readonly user!: UserType
  readonly hasPerm!: (permissions: string | string[], or?: boolean) => boolean
  readonly role!: Role
  readonly bc!: BreadCrumbsItem[]
  readonly course!: CourseType

  active: boolean = true

  /**
   * Получение перевода относильно локального пути
   * @param path
   * @param values
   * @return
   */
  t (path: string, values: any = undefined): string {
    return this.$t(`process.course.${path}`, values) as string
  }

  /**
   * Получение имени курса
   * @param course
   * @return
   */
  getCourseName (course: CourseType): string {
    return this.$tc(
      'process.course.name', course.eduHours.value, {
        name: `${course.eduHours.discipline!.name}, ${course.eduHours.workKind!.name}`,
        count: course.eduHours.value
      }
    )
  }
}
</script>
