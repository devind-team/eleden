from typing import Iterable

import graphene
from graphene.relay import Node
from graphene_django import DjangoListField
from graphene_django_optimizer import resolver_hints
from graphql import ResolveInfo

from apps.core.schema import UserType
from apps.eleden.filters import TeamFilterSet
from apps.eleden.models import Team, JobPostStatus, JobPostStatusHistory, Post, Job, JobPost
from apps.eleden.permissions import ChangeTeam, DeleteTeam, ViewTeamMembers
from apps.eleden.schema.types.education_types import EduProgramType
from apps.eleden.schema.types.process_types import CourseType
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType, GroupType
from devind_helpers.permissions import PermissionsInterface, PermissionsWrapperType


class JobPostStatusType(OptimizedDjangoObjectType):
    """Статус должности пользователя на месте работы"""

    class Meta:
        model = JobPostStatus
        fields = ('id', 'name', 'active', 'template_docx', 'template_xml', 'order',)


class JobPostStatusHistoryType(OptimizedDjangoObjectType):
    """История стасусов должности пользователя на месте работы"""

    job = graphene.Field(lambda: JobType, required=True, description='Место работы пользователя')
    status = graphene.Field(JobPostStatusType, required=True, description='Статус места работы пользователя')

    class Meta:
        model = JobPostStatusHistory
        fields = ('id', 'decree_docx', 'decree_pdf', 'created_at', 'end_at', 'job', 'status')


class PostType(OptimizedDjangoObjectType):
    """Занимаемая должность"""

    statuses = DjangoListField(JobPostStatusType, required=True, description='Возможные статусы')

    class Meta:
        model = Post
        fields = ('id', 'name', 'order', 'statuses',)

    @staticmethod
    @resolver_hints(
        model_field='job_statuses',
    )
    def resolve_job_statuses(post: Post, info: ResolveInfo) -> Iterable[JobPostStatus]:
        return post.statuses.all()


class JobPostType(OptimizedDjangoObjectType):
    """Должность пользователя на месте работы"""

    job = graphene.Field(lambda: JobType, required=True, description='Место работы пользователя')
    post = graphene.Field(PostType, required=True, description='Должность пользователя на месте работы')

    status_history = DjangoListField(JobPostStatusHistoryType, required=True, description='История статусов')

    class Meta:
        model = JobPost
        fields = ('id', 'rate', 'kind', 'job', 'post')

    @staticmethod
    @resolver_hints(
        model_field='status_history_set'
    )
    def resolve_status_history(job_post: JobPost, info: ResolveInfo) -> Iterable[JobPostStatusHistory]:
        return job_post.status_history_set.all()


class JobType(OptimizedDjangoObjectType):
    """Место работы пользователя"""

    team = graphene.Field(lambda: TeamType, required=True, description='Группа')
    user = graphene.Field(UserType, required=True, description='Пользователь')

    job_posts = DjangoListField(JobPostType, required=True, description='Должности пользователя на месте работы')

    class Meta:
        model = Job
        fields = ('id', 'team', 'user',)

    @staticmethod
    @resolver_hints(
        model_field='job_post_set'
    )
    def resolve_job_posts(job: Job, info: ResolveInfo) -> JobPost:
        return job.job_post_set.all()


class TeamPermissionsType(graphene.ObjectType):
    """Разрешения группы пользователей"""

    can_view_team_members = graphene.Boolean(required=True, description='Есть ли права на просмотр участников группы')

    class Meta:
        interfaces = (PermissionsInterface,)

    @staticmethod
    def resolve_can_change(team: Team, info: ResolveInfo) -> bool:
        return ChangeTeam.has_permission(info.context) and ChangeTeam.has_object_permission(info.context, team)

    @staticmethod
    def resolve_can_delete(team: Team, info: ResolveInfo) -> bool:
        return DeleteTeam.has_permission(info.context) and DeleteTeam.has_object_permission(info.context, team)

    @staticmethod
    def resolve_can_view_team_members(team: Team, info: ResolveInfo) -> bool:
        return ViewTeamMembers.has_permission(info.context) and \
               ViewTeamMembers.has_object_permission(info.context, team)


class TeamType(OptimizedDjangoObjectType, PermissionsWrapperType(TeamPermissionsType)):
    """Группа пользователей"""

    users = DjangoListField(UserType, required=True, description='Участники')
    group = graphene.Field(GroupType, description='Группа прав')
    responsible_users = DjangoListField(UserType, required=True, description='Пользователи, ответственные за группу')
    edu_program = graphene.Field(EduProgramType, description='Реализуемая образовательная программа')

    jobs = DjangoListField(lambda: JobType, required=True, description='Пользователи с учетом работы')
    courses = DjangoListField(CourseType, required=True, description='Курсы')

    class Meta:
        model = Team
        interfaces = (Node,)
        fields = (
            'id',
            'name',
            'short_name',
            'admission',
            'delete',
            'created_at',
            'updated_at',
            'users',
            'group',
            'responsible_users',
            'edu_program',
            'parent',
        )
        filterset_class = TeamFilterSet
        connection_class = CountableConnection

    @staticmethod
    @resolver_hints(
        model_field='responsible_users',
    )
    def resolve_responsible_users(team: Team, info: ResolveInfo) -> Iterable[UserType]:
        return team.responsible_users.all()

    @staticmethod
    @resolver_hints(
        model_field='job_set',
    )
    def resolve_jobs(team: Team, info: ResolveInfo) -> Iterable[Job]:
        return team.job_set.order_by('user__last_name', 'user__first_name', 'user__sir_name').all()
