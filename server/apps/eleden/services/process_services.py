from dataclasses import dataclass
from typing import Iterable, Optional

from django.db.models import F

from apps.core.models import User
from apps.eleden.models import Team, EduHours, Attestation

__all__ = (
    'TeamSummaryReport',
    'get_teams_summary_report',
    'get_users_summary_report',
)


@dataclass
class TeamSummaryReport:
    """Итоговый отчет по оценкам группы."""

    # Группа
    team: Team
    # Часы по плану
    edu_hours: Iterable[EduHours]
    # Оценки
    attestations: Iterable[Attestation]


def get_teams_summary_report(
        teams: Iterable[Team],
        users: Optional[Iterable[User]] = None) -> Iterable[TeamSummaryReport]:
    """Получение итогового отчета по оценкам групп.
    :param teams: группы
    :param users: пользователи
    :return: итоговый отчет по оценкам групп
    """

    result: list[TeamSummaryReport] = []
    for team in teams:
        edu_hours = _only_childless(
            EduHours.objects
            .filter(discipline__edu_program=team.edu_program, work_kind__is_final=True)
            .order_by((F('course_number') - 1) * 2 + F('semester_number'), 'work_kind__order')
            .all()
        )
        attestations = Attestation.objects.filter(
            course__team=team,
            course__edu_hours__in=edu_hours,
            period__is_final=True,
            **{'user__in': users} if users is not None else {}
        ).all()
        result.append(TeamSummaryReport(team=team, edu_hours=edu_hours, attestations=attestations))
    return result


def get_users_summary_report(users: Iterable[User]) -> Iterable[TeamSummaryReport]:
    """Получение итогового отчета по оценкам пользователей.
    :param users: пользователи
    :return: итоговый отчет по оценкам пользователей
    """

    return get_teams_summary_report(Team.objects.filter(users__in=users).all(), users)


def _only_childless(edu_hours: list[EduHours]) -> list[EduHours]:
    """Отбор часов по плану, дисциплина которых не имеет дочерних элементов.
    :param edu_hours: часы по плану
    :return: часы по плану, дисциплина которых не имеет дочерних элементов
    """

    result: list[EduHours] = []
    for possible_parent in edu_hours:
        if next((
            possible_child for possible_child in edu_hours if
            possible_child.discipline.parent == possible_parent.discipline), None
        ) is None:
            result.append(possible_parent)
    return result
