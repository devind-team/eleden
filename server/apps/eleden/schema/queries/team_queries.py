from typing import Iterable

import graphene
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.eleden.models import Team
from apps.eleden.permissions import ViewTeams, ViewTeam
from apps.eleden.schema.types import PostType, TeamType
from apps.eleden.services import get_relative_teams
from devind_helpers.decorators import permission_classes
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated


class TeamQueries(graphene.ObjectType):
    posts = DjangoListField(PostType, required=True, description='Должности')
    teams = DjangoFilterConnectionField(TeamType, required=True, description='Группы пользователей')
    relative_teams = DjangoFilterConnectionField(
        TeamType,
        required=True,
        description='Группы пользователей, связанные с пользователем'
    )
    team = graphene.Field(TeamType, team_id=graphene.ID(), required=True, description='Группа пользователей')

    @staticmethod
    @permission_classes((IsAuthenticated, ViewTeams,))
    def resolve_teams(root, info: ResolveInfo, *args, **kwargs) -> Iterable[Team]:
        return Team.objects.all()

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_relative_teams(root, info: ResolveInfo, *args, **kwargs) -> Iterable[Team]:
        return Team.objects.filter(pk__in=get_relative_teams(info.context.user))

    @staticmethod
    @permission_classes((IsAuthenticated, ViewTeam,))
    def resolve_team(root, info: ResolveInfo, team_id: str, *args, **kwargs) -> Team:
        team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        return team
