from typing import Protocol, Union, Optional

from django.db.models.fields.related_descriptors import ManyToManyDescriptor

from apps.core.models import User
from apps.eleden.models import Team, EduProgram, Course
from apps.eleden.services import get_related_edu_hours
from devind_helpers.relations import get_children, get_parents

__all__ = (
    'TeamUser',
    'get_children_teams',
    'get_relative_teams',
    'is_member',
    'is_related',
    'is_responsible_user',
    'change_edu_program',
)


class _WithTeams(Protocol):
    """Модель с группами."""

    teams: ManyToManyDescriptor
    responsible_teams: ManyToManyDescriptor


TeamUser = Union[User, _WithTeams]


def get_children_teams(user: TeamUser) -> list[int]:
    """Получение идентификаторов иерархии групп пользователя.
    :param user: пользователь
    :return: идентификаторы иерархии групп пользователя
    """

    team_ids = [
        *user.teams.values_list('pk', flat=True),
        *user.responsible_teams.values_list('pk', flat=True),
        *user.course_set.values_list('team__pk', flat=True)
    ]
    return get_children(Team, team_ids)


def get_relative_teams(user: TeamUser) -> list[int]:
    """Получение идентификаторов групп, с которыми связан пользователь.
    :param user: пользователь
    :return: идентификаторы групп, с которыми связан пользователь
    """

    team_ids = [
        *user.teams.values_list('pk', flat=True),
        *user.responsible_teams.values_list('pk', flat=True),
        *user.course_set.values_list('team__pk', flat=True)
    ]
    branch_teams_id = get_children(Team, team_ids)
    for team_id in team_ids:
        branch_teams_id += get_parents(Team.objects.get(pk=team_id))
    return list(set(branch_teams_id))


def is_member(team: Team, user: User) -> bool:
    """Проверяет, является ли пользователь членом группы.
    :param team: группа
    :param user: пользователь
    :return: результат проверки
    """

    return user in team.users.all()


def is_related(team: Team, user: User) -> bool:
    """Проверяет, связан ли пользователь с группой.
    :param team: группа
    :param user: пользователь
    :return: результат проверки
    """

    return team.id in get_relative_teams(user)


def is_responsible_user(team: Team, user: User) -> bool:
    """Проверяет, является ли пользователь ответственным за группу.
    :param team: группа
    :param user: пользователь
    :return: результат проверки
    """

    return Team.objects.filter(
        responsible_users=user,
        pk__in=get_parents(team)
    ).exists()


def change_edu_program(team: Team, edu_program: Optional[EduProgram], transfer_courses: bool = False) -> None:
    """Изменение образовательной программы.
    :param team: группа
    :param edu_program: образовательная программа,
    :param transfer_courses: переносить курсы с удалением ненайденных
    """

    if team.edu_program is not None and transfer_courses:
        for course in Course.objects.filter(team=team, edu_hours__discipline__edu_program=team.edu_program).all():
            try:
                course.edu_hours = get_related_edu_hours(edu_program, course.edu_hours)
                course.save(update_fields=('edu_hours', 'updated_at',))
            except Course.DoesNotExist:
                course.delete()
    team.edu_program = edu_program
    team.save(update_fields=('edu_program', 'updated_at',))
