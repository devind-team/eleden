"""Переопределенная пользовательская модель"""

from devind_core.models import AbstractUser
from devind_helpers.relations import get_children


class User(AbstractUser):
    """Переопределенная модель хранения пользователей."""

    @staticmethod
    def get_teams_users(team_ids: list[int]) -> list[int]:
        """Возвращает идентификаторы пользователей, принадлежащих группам.

        :param team_ids: идентификаторы групп
        :return: идентификаторы групп
        """

        from apps.eleden.models import Team
        user_ids: list[int] = []
        for team_id in team_ids:
            team: Team = Team.objects.get(pk=team_id)
            user_ids += team.users.values_list('pk', flat=True)
            user_ids += team.responsible_users.values_list('pk', flat=True)
        return user_ids

    def change(self, user) -> bool:
        """Может ли пользователь быть изменен пользователем user.

        :param self:
        :param user: пользователь, который изменяет текущего пользователя
        :return:
        """

        from apps.eleden.models import Team
        if user.has_perm('core.change_user') or self.pk == user.pk:
            return True
        # Если пользователь есть в группе, за которую user ответственный
        return self.teams.filter(
            pk__in=get_children(Team, user.responsible_teams.values_list('pk', flat=True))
        ).exists() or self.teams.filter(
            pk__in=Team.objects.filter(
                pk__in=user.course_set.values_list('team_id', flat=True)).values_list('pk', flat=True)).exists()
