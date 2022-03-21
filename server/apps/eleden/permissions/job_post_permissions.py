from apps.eleden.models import Team
from .team_permissions import ChangeTeam


class AddJobPost(ChangeTeam):
    """Пропускает пользователей, которые могут добавлять должности пользователя в группе"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.add_jobpost') or \
               ChangeTeam.has_object_permission(context, obj)


class DeleteJobPost(ChangeTeam):
    """Пропускает пользователей, которые могут удалять должности пользователя в группе"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.delete_jobpost') or \
               ChangeTeam.has_object_permission(context, obj)


class AddJobPostStatusHistory(ChangeTeam):
    """Пропускает пользователей, которые могут добавлять историю статусов должности пользователя на месте работы"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.add_jobpoststatushistory') or \
               ChangeTeam.has_object_permission(context, obj)
