from typing import Optional, Set

import graphene
from django.db.models import QuerySet
from graphene.relay import Node
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django_optimizer import resolver_hints
from graphql import ResolveInfo

from apps.core.models import User
from devind_core.filters import UserFilterSet
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_helpers.optimized import OptimizedDjangoObjectType


class UserType(OptimizedDjangoObjectType):
    """Описание пользовательского типа."""

    change = graphene.Field(graphene.Boolean, required=True)
    teams = graphene.List('apps.eleden.schema.types.TeamType', required=True)
    responsible_teams = graphene.List('apps.eleden.schema.types.TeamType', required=True)
    jobs = graphene.List('apps.eleden.schema.types.JobType', required=True)
    articles = graphene.List('apps.eleden.schema.types.ArticleType', required=True)
    session = graphene.Field('devind_core.schema.types.SessionType', description='Сессия пользователя')
    groups = graphene.List('devind_core.schema.types.GroupType', required=True, description='Группы пользователя')
    permissions = graphene.List(graphene.String, required=True, description='Привилегии пользователя')
    notices = DjangoFilterConnectionField('devind_notifications.schema.NoticeType', required=True)
    notifications = DjangoFilterConnectionField('devind_notifications.schema.NotificationType', required=True)
    profile_values = graphene.List('devind_core.schema.types.ProfileValueType', required=True)

    class Meta:
        model = User
        interfaces = (Node,)
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'sir_name',
            'is_active',
            'avatar',
            'birthday',
            'agreement',
            'created_at',
            'change',
            'notices',
            'notifications',
            'teams',
            'responsible_teams',
            'jobs',
            'articles',
            'profile_values',
        )
        filterset_class = UserFilterSet
        connection_class = CountableConnection

    @staticmethod
    def resolve_change(user: User, info: ResolveInfo) -> bool:
        return user.change(info.context.user) if hasattr(info.context, 'user') else False

    @staticmethod
    @resolver_hints(model_field='teams')
    def resolve_teams(user: User, info: ResolveInfo) -> QuerySet:
        """Возвращаем пользователей, если имеется привилегия view_team, иначе возвращаем пустой массив

        :param user: Пользователь
        :param info: Информация о запросе
        :return:
        """
        return user.teams.all()

    @staticmethod
    @resolver_hints(model_field='responsible_teams')
    def resolve_responsible_teams(user: User, info: ResolveInfo) -> QuerySet:
        """Возвращаем список групп, за которые пользователь несет ответственность

        :param user:
        :param info:
        :return:
        """
        return user.responsible_teams.all()

    @staticmethod
    @resolver_hints(model_field='job_set')
    def resolve_jobs(user: User, info: ResolveInfo) -> QuerySet:
        """Вовзращаяем работы пользователя

        :param user: пользователь
        :param info: информация о запросе
        :return:
        """
        return user.job_set.all()

    @staticmethod
    def resolve_session(user: User, info: ResolveInfo) -> QuerySet:
        from devind_core.models import Session
        token: Optional[str] = info.context.META.get('HTTP_AUTHORIZATION', None)
        return user.session_set.latest('created_at') \
            if token is None \
            else Session.objects.get(access_token__token=token[7:])

    @staticmethod
    @resolver_hints(model_field='groups')
    def resolve_groups(user: User, info: ResolveInfo) -> QuerySet:
        return user.groups.all()

    @staticmethod
    @resolver_hints(model_field='user_permissions')
    def resolve_permissions(user: User, info: ResolveInfo) -> Set[str]:
        return user.get_all_permissions()

    @staticmethod
    @resolver_hints(model_field='notice_set')
    def resolve_notices(user: User, info: ResolveInfo) -> QuerySet:
        return user.notice_set.all()

    @staticmethod
    @resolver_hints(model_field='notification_set')
    def resolve_notifications(user: User, info: ResolveInfo) -> QuerySet:
        return user.notification_set.all()

    @staticmethod
    @resolver_hints(model_field='article_set')
    def resolve_articles(user: User, info: ResolveInfo) -> QuerySet['apps.eleden.schema.types.ArticleType']:
        return user.article_set.all()

    @staticmethod
    @resolver_hints(model_field='profilevalue_set')
    def resolve_profile_values(user: User, info: ResolveInfo) -> QuerySet['apps.core.schema.types.ProfileValueType']:
        return user.profilevalue_set.all()
