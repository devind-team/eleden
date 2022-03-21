from apps.eleden.models import Team
from apps.eleden.services import is_related, is_responsible_user
from devind_helpers.permissions import BasePermission, ModelPermission
from .process_permissions import AddCourse, ChangeCourse, DeleteCourse

AddTeam = ModelPermission('eleden.add_team')


class ChangeTeam(BasePermission):
    """Пропускает пользователей, которые могут изменять группу"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.change_team') or is_responsible_user(obj, context.user)


class DeleteTeam(BasePermission):
    """Пропускает пользователей, которые могут удалять группу"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return context.user.has_perm('eleden.delete_team') or is_responsible_user(obj, context.user)


class ViewTeams(BasePermission):
    """Пропускает пользователей, которые могут просматривать группы"""

    @staticmethod
    def has_permission(context):
        return any((
            context.user.has_perm('eleden.view_team'),
            context.user.has_perm('eleden.view_course'),
            AddCourse.has_permission(context),
            ChangeCourse.has_permission(context),
            DeleteCourse.has_permission(context)
        ))


class ViewTeamMembers(BasePermission):
    """Пропускает пользователей, которые могут просматривать участников группы"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return ViewTeams.has_permission(context) or is_responsible_user(obj, context.user)


class ViewTeam(BasePermission):
    """Пропускает пользователей, которые могут просматривать группу"""

    @staticmethod
    def has_object_permission(context, obj: Team):
        return ViewTeamMembers.has_object_permission(context, obj) or is_related(obj, context.user)
