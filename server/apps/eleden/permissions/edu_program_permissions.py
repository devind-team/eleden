from apps.eleden.models import Discipline
from devind_helpers.permissions import BasePermission, ModelPermission

ViewEduProgram = ModelPermission('eleden.view_eduprogram')
AddEduProgram = ModelPermission('eleden.add_eduprogram')
ChangeEduProgram = ModelPermission('eleden.change_eduprogram')
DeleteEduProgram = ModelPermission('eleden.delete_eduprogram')
AddDiscipline = ModelPermission('eleden.add_discipline')


class ChangeDiscipline(BasePermission):
    """Пропускает пользвоателей, которые могут изменять дисциплины"""

    @staticmethod
    def has_object_permission(context, obj: Discipline):
        return context.user.has_perm('eleden.change_discipline') or context.user in obj.users.all()


DeleteDiscipline = ModelPermission('eleden.delete_discipline')


class AddMethodologicalSupport(BasePermission):
    """Пропускает пользователей, которые могут добавлять методическое обеспечение"""

    @staticmethod
    def has_object_permission(context, obj: Discipline):
        return context.user.has_perm('eleden.add_methodologicalsupport') or context.user in obj.users.all()


class ChangeMethodologicalSupport(BasePermission):
    """Пропускает пользователей, которые могут изменять методическое обеспечение"""

    @staticmethod
    def has_object_permission(context, obj: Discipline):
        return context.user.has_perm('eleden.change_methodologicalsupport') or context.user in obj.users.all()


class DeleteMethodologicalSupport(BasePermission):
    """Пропускает пользвоателей, которые могут удалять методическое обеспечение"""

    @staticmethod
    def has_object_permission(context, obj: Discipline):
        return context.user.has_perm('eleden.delete_methodologicalsupport') or context.user in obj.users.all()


AddCompetence = ModelPermission('eleden.add_competence')
DeleteCompetence = ModelPermission('eleden.delete_competence')
AddEduHours = ModelPermission('eleden.add_eduhours')
DeleteEduHours = ModelPermission('eleden.delete_eduhours')
