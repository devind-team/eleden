from apps.core.models import User
from apps.eleden.models import PortfolioFile
from devind_helpers.permissions import BasePermission, ModelPermission

AddFileKind = ModelPermission('eleden.add_filekind')
ChangeFileKind = ModelPermission('eleden.change_filekind')


class AddPortfolioFile(BasePermission):
    """Пропускает пользователей, которые могут добавлять файлы в портфолио другого пользователя"""

    @staticmethod
    def has_object_permission(context, obj: User):
        return obj.change(context.user) or context.user == obj


class ConfirmPortfolioFile(BasePermission):
    """Пропускает пользователей, которые могут подтверждать файлы портфолио другого пользователя"""

    @staticmethod
    def has_object_permission(context, obj: PortfolioFile):
        return obj.file.user.change(context.user) or context.user.has_perm('eleden.change_portfoliofile')


class ChangePortfolioFile(BasePermission):
    """Пропускает пользователей, которые могут изменять файлы портфолио другого пользователя"""

    @staticmethod
    def has_object_permission(context, obj: User):
        return obj.change(context.user) or context.user == obj


class DeletePortfolioFile(BasePermission):
    """Пропускает пользователей, которые могут удалять файлы в портфолио другого пользователя"""

    @staticmethod
    def has_object_permission(context, obj: PortfolioFile):
        return obj.file.user.change(context.user) or context.user.has_perm('eleden.delete_portfoliofile')
