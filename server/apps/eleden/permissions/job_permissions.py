from apps.eleden.models import Team
from .team_permissions import ChangeTeam


class AddJob(ChangeTeam):
    """Пропускает пользователей, которые могут добавлять пользователей в группу"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.add_job') or ChangeTeam.has_object_permission(context, obj)


class DeleteJob(ChangeTeam):
    """Пропускает пользователей, которые могут добавлять пользователей в группу"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.delete_job') or ChangeTeam.has_object_permission(context, obj)
