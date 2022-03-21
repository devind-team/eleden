from typing import Iterable

import graphene
from django.db.models import QuerySet, Count, Subquery, OuterRef, Func
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.core.models import User
from apps.eleden.models import Discipline, \
    Team, \
    EduHours, \
    Course, \
    Handout
from apps.eleden.permissions import ViewCourse, ViewTeamMembers
from apps.eleden.schema.types import DisciplineType, \
    TeamType, \
    EduHoursType, \
    HandoutType, \
    WorkKindType, \
    PeriodType, \
    RegistrationType, \
    CourseType, \
    TeamSummaryReportType
from apps.eleden.services import get_children_teams, get_teams_summary_report, get_users_summary_report
from devind_core.permissions import ViewUser
from devind_helpers.decorators import permission_classes
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.relations import get_children


class ProcessQueries(graphene.ObjectType):
    process_teams = DjangoFilterConnectionField(
        TeamType,
        required=True,
        description='Группы, в которые включен пользователь и по иерархии вниз с наличием курсов'
    )
    edu_program_courses_numbers = graphene.List(
        graphene.Int,
        edu_program_id=graphene.ID(required=True),
        description='Курсы образовательной программы'
    )
    semester_disciplines = DjangoListField(
        DisciplineType,
        team_id=graphene.ID(required=True),
        course_number=graphene.Int(required=True),
        semester_number=graphene.Int(required=True),
        has_courses=graphene.Boolean(required=True),
        description='Дисциплины семестра'
    )
    discipline_semester_edu_hours = DjangoListField(
        EduHoursType,
        discipline_id=graphene.ID(required=True),
        course_number=graphene.Int(required=True),
        semester_number=graphene.Int(required=True),
        description='Часы дисциплины семестра по плану'
    )
    work_kinds = DjangoListField(WorkKindType, required=True, description='Виды работ')
    periods = DjangoListField(PeriodType, required=True, description='Периоды')
    courses = DjangoFilterConnectionField(
        CourseType,
        team_id=graphene.ID(),
        required=True,
        description='Курсы группы пользователей'
    )
    course = graphene.Field(CourseType, course_id=graphene.ID(), required=True, description='Курс')
    course_handouts = DjangoFilterConnectionField(
        HandoutType,
        course_id=graphene.ID(required=True),
        required=True,
        description='Раздаточный материал курса'
    )
    registrations = DjangoListField(RegistrationType, required=True, description='Учет студентов на занятиях')
    teams_summary_report = graphene.List(
        TeamSummaryReportType,
        required=True,
        team_ids=graphene.List(graphene.NonNull(graphene.ID), required=True),
        description='Итоговый отчет по оценкам группы'
    )
    users_summary_report = graphene.List(
        TeamSummaryReportType,
        required=True,
        user_ids=graphene.List(graphene.NonNull(graphene.ID), required=True),
        description='Итоговый отчет по оценкам пользователей'
    )

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_process_teams(root, info: ResolveInfo, *args, **kwargs) -> Iterable[Team]:
        order_by = ('-admission', 'short_name')
        return Team.objects.all().order_by(*order_by) \
            if Team.can_view(info.context.user) \
            else Team.objects.filter(pk__in=get_children_teams(info.context.user)).order_by(*order_by)

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_edu_program_courses_numbers(root, info: ResolveInfo, edu_program_id: str) -> Iterable[int]:
        return EduHours.objects.filter(
            discipline__edu_program__pk=from_global_id(edu_program_id)[1]
        ).order_by('course_number').values_list('course_number', flat=True).distinct()

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_semester_disciplines(
            root,
            info: ResolveInfo,
            team_id: str,
            course_number: int,
            semester_number: int,
            has_courses: bool) -> Iterable[Discipline]:
        team_id = from_global_id(team_id)[1]
        disciplines: QuerySet[Discipline] = Discipline.objects \
            .filter(
                edu_program__team__pk=team_id,
                eduhours__course_number=course_number,
                eduhours__semester_number=semester_number
            ) \
            .annotate(edu_hours_count=Count('eduhours')) \
            .filter(edu_hours_count__gt=0) \
            .annotate(
                course_count=Subquery(
                    Course.objects
                    .filter(
                        team_id=team_id,
                        edu_hours__course_number=course_number,
                        edu_hours__semester_number=semester_number,
                        edu_hours__discipline__pk=OuterRef('pk')
                    )
                    .annotate(course_count=Func('id', function='COUNT'))
                    .values('course_count')
                )
            ) \
            .filter(**{'course_count__gt': 0} if has_courses else {'course_count': 0})
        return [discipline for discipline in disciplines.all() if len(get_children(Discipline, [discipline.pk])) == 1]

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_discipline_semester_edu_hours(
            root,
            info: ResolveInfo,
            discipline_id: str,
            course_number: int,
            semester_number: int) -> Iterable[EduHours]:
        return EduHours.objects.filter(
            discipline__pk=from_global_id(discipline_id)[1],
            course_number=course_number,
            semester_number=semester_number,
            work_kind__is_hidden=False,
        )

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def resolve_courses(root, info: ResolveInfo, team_id: str, *args, **kwargs) -> QuerySet[Course]:
        order_by = ('-semester',)
        courses = Course.objects.filter(team_id=from_global_id(team_id)[1]).order_by(*order_by)
        return courses if Team.can_view(info.context.user) else Course.objects.filter(
            pk__in=[course.pk for course in courses if info.context.user in course.users]
        ).order_by(*order_by)

    @staticmethod
    @permission_classes((IsAuthenticated, ViewCourse))
    def resolve_course(root, info: ResolveInfo, course_id: str) -> Course:
        course: Course = get_object_or_404(Course, pk=from_global_id(course_id)[1])
        info.context.check_object_permissions(info.context, course)
        return course

    @staticmethod
    @permission_classes((IsAuthenticated, ViewCourse))
    def resolve_course_handouts(root, info: ResolveInfo, course_id: str, *args, **kwargs) -> QuerySet[Handout]:
        course: Course = get_object_or_404(Course, pk=from_global_id(course_id)[1])
        info.context.check_object_permissions(info.context, course)
        return course.handout_set.all()

    @staticmethod
    @permission_classes((IsAuthenticated, ViewTeamMembers))
    def resolve_teams_summary_report(root, info: ResolveInfo, team_ids: list[str]) -> Iterable[TeamSummaryReportType]:
        teams = Team.objects.filter(pk__in=[from_global_id(team_id)[1] for team_id in team_ids]).all()
        for team in teams:
            info.context.check_object_permissions(info.context, team)
        return [
            TeamSummaryReportType(
                team=team_mark.team,
                edu_hours=team_mark.edu_hours,
                attestations=team_mark.attestations
            )
            for team_mark in get_teams_summary_report(teams)
        ]

    @staticmethod
    @permission_classes((IsAuthenticated, ViewUser))
    def resolve_users_summary_report(root, info: ResolveInfo, user_ids: list[str]) -> Iterable[TeamSummaryReportType]:
        users = User.objects.filter(pk__in=[from_global_id(user_id)[1] for user_id in user_ids]).all()
        for user in users:
            info.context.check_object_permissions(info.context, user)
        return [
            TeamSummaryReportType(
                team=team_mark.team,
                edu_hours=team_mark.edu_hours,
                attestations=team_mark.attestations
            )
            for team_mark in get_users_summary_report(users)
        ]
