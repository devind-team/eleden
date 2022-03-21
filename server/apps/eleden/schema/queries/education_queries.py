from typing import List

import graphene
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.eleden.models import EduProgram, \
    Discipline, \
    EduHours, \
    Competence
from apps.eleden.schema.types import EduFormType, \
    EduServiceType, \
    DirectionType, \
    EduProgramType, \
    DisciplineViewType, \
    DisciplineType, \
    MethodologicalSupportType, \
    WorkFormType, \
    DisciplineKindType, \
    HoursKindType, \
    EduHoursType, \
    BlockKindType, \
    EduCycleType, \
    CompetenceType
from devind_helpers.orm_utils import get_object_or_404


class EducationQueries(graphene.ObjectType):
    edu_forms = DjangoListField(EduFormType, required=True, description='Формы обучения')
    edu_services = DjangoListField(EduServiceType, required=True, description='Образовательные услуги')
    directions = DjangoListField(DirectionType, required=True, description='Направления подготовки')
    work_forms = DjangoListField(WorkFormType, required=True, description='Форма работы')
    hours_kinds = DjangoListField(HoursKindType, required=True, description='Тип часов')
    discipline_kinds = DjangoListField(DisciplineKindType, required=True, description='Тип дисциплины')
    block_kinds = DjangoListField(BlockKindType, required=True, description='Тип блока образовательной программы')
    edu_cycles = DjangoListField(EduCycleType, required=True, description='Цикл образовательных программ')
    edu_program = graphene.Field(
        EduProgramType,
        edu_program_id=graphene.ID(),
        required=True,
        description='Образовательная программа'
    )
    edu_programs = DjangoFilterConnectionField(EduProgramType, required=True, description='Образовательные программы')
    discipline_views = DjangoListField(DisciplineViewType, required=True, description='Формы представления дисциплины')
    discipline = graphene.Field(DisciplineType, discipline_id=graphene.ID(), required=True, description='Дисциплина')
    disciplines = DjangoFilterConnectionField(DisciplineType, required=True, description='Дисциплины')
    methodological_supports = DjangoFilterConnectionField(
        MethodologicalSupportType,
        required=True,
        description='Методическое обеспечение'
    )
    discipline_competences = graphene.List(
        CompetenceType,
        discipline_id=graphene.ID(),
        required=True,
        description='Компетенция'
    )
    competences = DjangoFilterConnectionField(
        CompetenceType,
        exclude_discipline_id=graphene.ID(),
        required=True,
        description='Компетенции'
    )
    discipline_edu_hours = graphene.List(
        EduHoursType,
        discipline_id=graphene.ID(),
        required=True,
        description='Часы'
    )

    @staticmethod
    def resolve_edu_program(root, info: ResolveInfo, edu_program_id: str, *args, **kwargs) -> EduProgram:
        return EduProgram.objects.get(pk=from_global_id(edu_program_id)[1])

    @staticmethod
    def resolve_discipline(root, info: ResolveInfo, discipline_id: str, *args, **kwargs) -> Discipline:
        return Discipline.objects.get(pk=from_global_id(discipline_id)[1])

    @staticmethod
    def resolve_discipline_competences(
        root,
        info: ResolveInfo,
        discipline_id: str,
        *args,
        **kwargs
    ) -> List[Competence]:
        discipline: Discipline = get_object_or_404(Discipline, pk=from_global_id(discipline_id)[1])
        return discipline.competence_set.all()

    @staticmethod
    def resolve_competences(root, info: ResolveInfo, exclude_discipline_id: str, *args, **kwargs) -> List[Competence]:
        return Competence.objects.exclude(disciplines__id=from_global_id(exclude_discipline_id)[1]) \
            if exclude_discipline_id \
            else Competence.objects.all()

    @staticmethod
    def resolve_discipline_edu_hours(root, info: ResolveInfo, discipline_id: str, *args, **kwargs) -> List[EduHours]:
        discipline = Discipline.objects.get(pk=from_global_id(discipline_id)[1])
        return EduHours.objects.filter(discipline=discipline).exclude(work_kind__is_hidden=True)
