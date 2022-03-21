from typing import List

import graphene
from django.db.models import Q, Count
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.dashboard.schema.types import PointTotalStatisticsType
from apps.eleden.models import EduProgram, Discipline
from apps.eleden.schema.types import EduProgramStatisticsType


class StatisticsQueries(graphene.ObjectType):
    edu_programs_statistics = graphene.List(
        EduProgramStatisticsType,
        directions=graphene.List(graphene.ID, required=True, description='Направления подготовки'),
        admissions=graphene.List(graphene.String, required=True, description='Выбор годов поступления'),
        edu_forms=graphene.List(graphene.String, required=True, description='Формы обучения'),
        required=True,
        description='Статистика ОП'
    )

    @staticmethod
    def resolve_edu_programs_statistics(
            root,
            info: ResolveInfo,
            directions: List[str],
            admissions: List[str],
            edu_forms: List[str],
            *args, **kwargs) -> List[EduProgramStatisticsType]:
        """Выгрузка показателей заполненности образовательных программ"""

        edu_program_statistics = []
        q = Q()
        if len(directions):
            q &= Q(direction__in=[from_global_id(d)[1] for d in directions])
        if len(admissions):
            q &= Q(admission__in=admissions)
        if len(edu_forms):
            q &= Q(edu_form__in=edu_forms)
        edu_programs = EduProgram.objects.filter(q) \
            .values(
            'id', 'name', 'admission', 'description', 'syllabus', 'calendar',
            'edu_form__name',
            'direction__code', 'direction__name'
        )
        for edu_program in edu_programs:
            points = []
            for indicator in ['description', 'syllabus', 'calendar']:
                points.append(PointTotalStatisticsType(
                    name=indicator,
                    value=1 if edu_program[indicator] else 0,
                    total=1))
            disciplines = Discipline.objects.filter(edu_program_id=edu_program['id']) \
                .exclude(pk__in=Discipline.objects.filter(edu_program_id=edu_program['id'], parent_id__isnull=False)
                         .values_list('parent_id', flat=True)) \
                .values('annotation', 'work_program') \
                .annotate(users=Count('users'), methodological_support=Count('methodologicalsupport'))
            for indicator in ['users', 'annotation', 'work_program', 'methodological_support']:
                points.append(PointTotalStatisticsType(
                    name=indicator,
                    value=sum([bool(di[indicator]) for di in disciplines]),
                    total=len(disciplines)))
            edu_program_statistics.append(
                EduProgramStatisticsType(
                    id=edu_program['id'],
                    name=edu_program['name'],
                    admission=edu_program['admission'],
                    direction_code=edu_program['direction__code'],
                    direction_name=edu_program['direction__name'],
                    edu_form=edu_program['edu_form__name'],
                    points=points
                )
            )
        return edu_program_statistics
