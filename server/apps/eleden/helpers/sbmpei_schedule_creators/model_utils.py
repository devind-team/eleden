"""Модуль с вспомогательными функциями для работы с моделями"""
import sys
from dataclasses import dataclass, field
from functools import reduce
from itertools import groupby, product
from typing import Type, TypeVar, Iterable, NamedTuple

from django.db import transaction, connection
from django.db.models import Model, Count, Case, When, Value, IntegerField, QuerySet, Q

from apps.core.models import User
from apps.eleden.models import Course, \
    Classroom, \
    EduClass, \
    Discipline, \
    WorkKind, \
    EduHours, \
    Period, \
    CoursePeriod
from .data import CoupleModelData, TeamModelData
from .exceptions import EduHoursNotFoundException


@dataclass
class SaveResult:
    """Результат сохранения"""

    courses: list[tuple[Course, bool]] = field(default_factory=list)
    classrooms: list[tuple[Classroom, bool]] = field(default_factory=list)
    edu_classes: list[tuple[EduClass, bool]] = field(default_factory=list)

    def __or__(self, other: 'SaveResult'):
        return SaveResult(
            courses=self.courses + other.courses,
            classrooms=self.classrooms + other.classrooms,
            edu_classes=self.edu_classes + other.edu_classes
        )


class CouplesGroupResult(NamedTuple):
    """Сгруппированные данные моделей пар"""

    # Данные модели группы
    team_model_data: TeamModelData
    # Дисциплина
    discipline: Discipline
    # Данные моделей пар, соответсвующие дисциплине
    couples: Iterable[CoupleModelData]


def clear() -> None:
    """Очистка моделей расписания."""

    Course.objects.all().delete()
    Classroom.objects.all().delete()
    EduClass.objects.all().delete()
    with connection.cursor() as cursor:
        for model in (Course, Classroom, EduClass):
            cursor.execute(f'ALTER SEQUENCE {model._meta.db_table}_id_seq RESTART WITH 1;')


@transaction.atomic
def save(teams_model_data: list[TeamModelData], ignore_save_errors: bool, only_result: bool = False) -> SaveResult:
    """Сохранение данных моделей.

    :param teams_model_data: список данных моделей групп
    :param ignore_save_errors: игнорировать ошибки при сохранении или нет
    :param only_result: сохранять только курсы-результаты
    :return: результат сохранения
    """

    save_result = SaveResult()
    for team_model_data, discipline, discipline_couples in _get_grouped_couples(teams_model_data):
        try:
            if not only_result:
                save_result = save_result | _save_main_courses(team_model_data, discipline, discipline_couples)
            save_result = save_result | _save_result_course(team_model_data, discipline, discipline_couples)
        except EduHoursNotFoundException as ex:
            if ignore_save_errors:
                print(ex)
            else:
                raise ex
    return save_result


def _get_grouped_couples(teams_model_data: Iterable[TeamModelData]) -> Iterable[CouplesGroupResult]:
    """Получение сгруппированных данных моделей пар.

    :param teams_model_data: данные моделей групп
    :return: результаты группировки данных моделей пар
    """

    for team_model_data in teams_model_data:
        for discipline, discipline_couples in _get_couples_group_by_attr(
                team_model_data.couples,
                'discipline',
                Discipline):
            yield CouplesGroupResult(
                team_model_data=team_model_data,
                discipline=discipline,
                couples=list(discipline_couples)
            )


MType = TypeVar('MType', bound=Model)


def _get_couples_group_by_attr(
        couples_model_data: Iterable[CoupleModelData],
        attr: str,
        model: Type[MType]) -> Iterable[tuple[MType, Iterable[CoupleModelData]]]:
    """Получение данных моделей пар, сгруппированных по атрибуту, представляющему модель.

    :param couples_model_data: данные моделей пар
    :param attr: атрибут
    :param model: модель
    :return: (ключевой атрибут, данные моделей пар)
    """

    def key_func(couple: CoupleModelData) -> int:
        value = getattr(couple, attr)
        return value.pk if value else 0

    for pk, couples in groupby(sorted(couples_model_data, key=key_func), key_func):
        yield model.objects.get(pk=pk) if pk != 0 else None, list(couples)


def _save_main_courses(
        team_model_data: TeamModelData,
        discipline: Discipline,
        discipline_couples: Iterable[CoupleModelData]) -> SaveResult:
    """Сохранение основных курсов.

    :param team_model_data: данные модели группы
    :param discipline: дисциплина
    :param discipline_couples: данные моделей пар дисциплины
    """

    result = SaveResult()
    exclude_work_kinds = ('КРП',)
    for work_kind, couples in _get_couples_group_by_attr(discipline_couples, 'work_kind', WorkKind):
        if not work_kind or work_kind.short_name not in exclude_work_kinds:
            course, course_created = _get_or_create_main_course(team_model_data, discipline, work_kind, couples)
            result.courses.append((course, course_created))
            for couple in couples:
                for period, class_number in product(_get_couple_periods(couple), couple.class_numbers):
                    created_classrooms = [Classroom.objects.get_or_create(name=name) for name in couple.classrooms]
                    result.classrooms.extend(created_classrooms)
                    classrooms = [created_classroom[0] for created_classroom in created_classrooms]
                    course_period = CoursePeriod.objects.get(course=course, period=period)
                    result.edu_classes.append(_get_or_create_edu_class(
                        couple=couple,
                        discipline=discipline,
                        classrooms=classrooms,
                        course_period=course_period,
                        class_number=class_number
                    ))
    return result


def _get_or_create_main_course(
        team_model_data: TeamModelData,
        discipline: Discipline,
        work_kind: WorkKind,
        couples_model_data: Iterable[CoupleModelData]) -> tuple[Course, bool]:
    """Получение или создание основного курса.

    :param team_model_data: данные модели группы
    :param discipline: дисциплина
    :param work_kind: вид работы
    :param couples_model_data: данные моделей пар
    :return: (курс, создан ли курс)
    """

    edu_hours = _get_course_edu_hours(
        team_model_data,
        discipline,
        work_kind if work_kind is not None else WorkKind.objects.get(name='Практические занятия')
    )
    teachers = _get_course_teachers(couples_model_data)
    periods = _get_main_course_periods(couples_model_data)
    course, created = Course.objects.get_or_create(edu_hours=edu_hours, team=team_model_data.team)
    course.teachers.set(teachers)
    course.periods.set(periods)
    return course, created


def _save_result_course(
        team_model_data: TeamModelData,
        discipline: Discipline,
        discipline_couples: Iterable[CoupleModelData]) -> SaveResult:
    """Сохранение курсов-результатов.

    :param team_model_data: данные модели группы
    :param discipline: дисциплина
    :param discipline_couples: данные моделей пар дисциплины
    """

    result = SaveResult()
    teachers = _get_result_courses_teachers(discipline_couples)
    for work_kind in WorkKind.objects.filter(short_name__in=('Эк', 'За', 'ЗаО', 'КР')):
        try:
            edu_hours = _get_course_edu_hours(team_model_data, discipline, work_kind)
            periods = _get_result_course_periods(work_kind)
            course, created = Course.objects.get_or_create(edu_hours=edu_hours, team=team_model_data.team)
            course.teachers.set(teachers)
            course.periods.set(periods)
            result.courses.append((course, created))
        except EduHoursNotFoundException:
            pass
    return result


def _get_course_edu_hours(team_model_data: TeamModelData, discipline: Discipline, work_kind: WorkKind) -> EduHours:
    """Получение часов по плану курса.

    :param team_model_data: данные модели группы
    :param discipline: дисциплина
    :param work_kind: вид работы
    :return: часы по плану курса
    """

    edu_hours = EduHours.objects.filter(
        discipline=discipline,
        work_kind=work_kind,
        course_number=team_model_data.course_number,
        semester_number=team_model_data.semester_number,
        hours_kind__name__in=['Часы в объемных показателях', 'Часы в неделю']
    ).annotate(hours_kind_order=Case(
        When(hours_kind__name='Часы в объемных показателях', then=Value(1)),
        When(hours_kind__name='Часы в неделю', then=Value(2)),
        output_field=IntegerField()
    )).order_by('hours_kind_order').first()
    if edu_hours is None:
        raise EduHoursNotFoundException(
            team_model_data.team,
            discipline,
            work_kind,
            team_model_data.course_number,
            team_model_data.semester_number
        )
    return edu_hours


def _get_result_courses_teachers(discipline_couples: Iterable[CoupleModelData]) -> list[User]:
    """Получение всех преподавателей курсов-результатов.

    :param discipline_couples: данные моделей пар дисциплины
    :return: все преподаватели
    """

    def key_func(couple: CoupleModelData) -> int:
        return couple.work_kind.order if couple.work_kind else sys.maxsize

    _, couples_model_data = next(groupby(sorted(discipline_couples, key=key_func), key_func))
    return _get_course_teachers(couples_model_data)


def _get_course_teachers(couples_model_data: Iterable[CoupleModelData]) -> list[User]:
    """Получение всех преподавателей основного курса.

    :param couples_model_data: данные моделей пар
    :return: все преподаватели
    """

    return reduce(lambda acc, c: [*acc, *c.teachers], couples_model_data, [])


def _get_main_course_periods(couples_model_data: Iterable[CoupleModelData]) -> list[Period]:
    """Получение всех периодов основного курса.

    :param couples_model_data: данные моделей пар
    :return: все периоды
    """

    periods = reduce(lambda acc, c: acc | set(c.periods or _get_main_periods().all()), couples_model_data, set())
    if len(periods) == 0:
        return list(_get_main_periods().all())
    additional_period = Period.objects.filter(short_name__in=('кн1', 'кн2')).all()
    return list({*periods, *additional_period})


def _get_result_course_periods(work_kind: WorkKind) -> list[Period]:
    """Получение всех периодов курса-результата.

    :param work_kind: вид работы
    :return: все периоды
    """

    if work_kind.short_name == 'Эк':
        return [Period.objects.get(short_name='д'), Period.objects.get(name='Экзамен')]
    elif work_kind.short_name == 'За':
        return [Period.objects.get(name='Зачет')]
    elif work_kind.short_name == 'ЗаО':
        return [Period.objects.get(name='Зачет с оценкой')]
    elif work_kind.short_name == 'КР':
        return [Period.objects.get(name='Курсовая работа')]
    elif work_kind.short_name == 'КП':
        return [Period.objects.get(name='Курсовой проект')]


def _get_couple_periods(couple_model_data: CoupleModelData) -> list[Period]:
    """Получение правильных периодов данных модели пары.

    :param couple_model_data: данные модели пары
    :return: правильные периоды
    """

    if len(couple_model_data.periods) == 0:
        return list(_get_main_periods().exclude(short_name__in=('кн1', 'кн2')).all())
    return couple_model_data.periods


def _get_main_periods() -> QuerySet[Period]:
    """Получение основных периодов."""

    return Period.objects.filter(Q(short_name__regex=r'\d+') | Q(short_name__in=('кн1', 'кн2')))


def _get_or_create_edu_class(couple: CoupleModelData,
                             discipline: Discipline,
                             classrooms: list[Classroom],
                             course_period: CoursePeriod,
                             class_number: int) -> tuple[EduClass, bool]:
    """Получение или создание учебного занятия.

    :param couple: данные модели пары
    :param discipline: дисциплина
    :param classrooms: аудитории
    :param course_period: период курса
    :class_number: номер занятия
    :return (учебное занятие, создано ли учебное занятие)
    """

    return EduClass.objects \
        .filter(teachers__in=couple.teachers, classrooms__in=classrooms) \
        .annotate(Count('teachers', distinct=True), Count('classrooms', distinct=True)) \
        .filter(teachers__count=len(couple.teachers), classrooms__count=len(classrooms)) \
        .get_or_create(
            week_day=couple.week_day,
            class_number=class_number,
            is_distance_learning=couple.distance_learning,
            course_period=course_period,
            discipline=discipline
        )


__all__ = ['SaveResult', 'save', 'clear']
