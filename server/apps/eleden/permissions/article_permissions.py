"""Права на добавление, изменение и удаление публикаций."""

from devind_helpers.permissions import BasePermission
from devind_helpers.permissions import ModelPermission
from apps.eleden.models.article import Article


AddArticle = ModelPermission('eleden.add_article')
DeleteArticle = ModelPermission('eleden.delete_article')


class ChangeArticle(BasePermission):
    """Пропускает пользователей, которые могут изменять публикации."""

    @staticmethod
    def has_object_permission(context, obj: Article):
        return context.user.has_perm('eleden.change_article') or context.user in obj.users.all()
