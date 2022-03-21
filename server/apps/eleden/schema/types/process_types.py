import graphene
from django.db.models import QuerySet
from graphene import ResolveInfo
from graphene.relay import Node
from graphene_django import DjangoListField

from apps.core.schema import UserType
from apps.eleden.filters import CourseFilterSet
from apps.eleden.filters import HandoutFilterSet
from apps.eleden.models import Period, Registration, Course, Attestation, Attachment, Handout
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType, FileType
from .education_types import EduHoursType
from .portfolio_types import PortfolioFileType


class RegistrationType(OptimizedDjangoObjectType):
    """Тип учета студентов на занятиях."""

    class Meta:
        model = Registration
        fields = ('id', 'name', 'short_name', 'kind', 'order', 'created_at', 'updated_at',)


class PeriodType(OptimizedDjangoObjectType):
    """Период, учебные недели, 1 - 18, допуск, зачет, экзамен, кр, кр, кн1, кн2."""

    registrations = graphene.List(
        graphene.NonNull(RegistrationType),
        required=True,
        description='Возможные учеты студентов на занятиях'
    )

    class Meta:
        model = Period
        fields = (
            'id',
            'name',
            'short_name',
            'template_doc',
            'template_xml',
            'order',
            'registrations',
            'created_at',
            'updated_at',
        )

    @staticmethod
    def resolve_registrations(period: Period, info: ResolveInfo) -> QuerySet[Registration]:
        return period.registrations.all()


class CourseType(OptimizedDjangoObjectType):
    """Курс."""

    semester = graphene.Int(description='Номер семестра с учетом номера курса')
    edu_hours = graphene.Field('apps.eleden.schema.types.EduHoursType', required=True, description='Часы по плану')
    team = graphene.Field(
        'apps.eleden.schema.types.TeamType',
        required=True,
        description='Группа пользователей, которая обучается'
    )
    teachers = DjangoListField(UserType, description='Преподаватели курса')
    periods = DjangoListField(PeriodType, description='Периоды обучения')
    attestations = graphene.List(graphene.NonNull(lambda: AttestationType), description='Аттестации')
    attachments = graphene.List(graphene.NonNull(lambda: AttachmentType), description='Прикрепленные файлы')
    handouts = graphene.List(graphene.NonNull(lambda: HandoutType), description='Раздаточные материалы')

    class Meta:
        model = Course
        interfaces = (Node,)
        fields = (
            'created_at',
            'updated_at',
            'edu_hours',
            'team',
            'teachers',
            'periods',
        )
        filterset_class = CourseFilterSet
        connection_class = CountableConnection

    @staticmethod
    def resolve_attestations(course: Course, info: ResolveInfo) -> QuerySet[Attestation]:
        return course.attestation_set.order_by('registration__order')

    @staticmethod
    def resolve_attachments(course: Course, info: ResolveInfo) -> QuerySet[Attachment]:
        return course.attachment_set.all()

    @staticmethod
    def resolve_handouts(course: Course, info: ResolveInfo) -> QuerySet[Handout]:
        return course.handout_set.all()


class AttestationType(OptimizedDjangoObjectType):
    """Аттестация."""

    registration = graphene.Field(RegistrationType, required=True, description='Оценка')
    course = graphene.Field(CourseType, required=True, description='Курс')
    period = graphene.Field(PeriodType, required=True, description='Период')
    set_by = graphene.Field(UserType, required=True, description='Пользователь, который выставил аттестацию')
    user = graphene.Field(UserType, required=True, description='Учайщийся')
    confirmed_by = graphene.Field(UserType, description='Пользователь, который подтвердил аттестацию')

    class Meta:
        model = Attestation
        interfaces = (Node,)
        fields = (
            'id',
            'description',
            'created_at',
            'updated_at',
            'registration',
            'course',
            'period',
            'set_by',
            'user',
            'confirmed_by',
        )
        filter_fields = ('description', 'created_at', 'updated_at',)
        connection_class = CountableConnection


class AttachmentType(OptimizedDjangoObjectType):
    """Прикрепленный файл."""

    portfolio_file = graphene.Field(PortfolioFileType, required=True, description='Файл портфоли')
    course = graphene.Field(CourseType, required=True, description='Курс')
    period = graphene.Field(PeriodType, required=True, description='Период')
    id = graphene.ID(required=True, description='Идентификатор')

    class Meta:
        model = Attachment
        fields = ('id', 'created_at', 'updated_at', 'portfolio_file', 'course', 'period',)


class HandoutType(OptimizedDjangoObjectType):
    """Раздаточный материал для курса."""

    user = graphene.Field(UserType, description='Пользователь, который загрузил файл')
    file = graphene.Field(FileType, required=True, description='Файл пользователя')
    course = graphene.Field(CourseType, required=True, description='Курс')
    period = graphene.Field(PeriodType, description='Период обучения')

    class Meta:
        model = Handout
        interfaces = (Node,)
        fields = ('description', 'created_at', 'updated_at', 'user', 'file', 'course', 'period',)
        filterset_class = HandoutFilterSet
        connection_class = CountableConnection


class TeamSummaryReportType(graphene.ObjectType):
    """Итоговый отчет по оценкам группы."""

    team = graphene.Field('apps.eleden.schema.types.TeamType', required=True, description='Группа')
    edu_hours = graphene.List(graphene.NonNull(EduHoursType), required=True, description='Часы по плану')
    attestations = graphene.List(graphene.NonNull(AttestationType), required=True, description='Оценки')


class CourseInputType(graphene.InputObjectType):
    """Частичные входные данные курса."""

    edu_hours_id = graphene.ID(required=True, description='Идентификатор часов по плану')
    teacher_ids = graphene.List(graphene.NonNull(graphene.ID), description='Идентификаторы преподавателей')
    period_ids = graphene.List(graphene.NonNull(graphene.ID), description='Идентификаторы периодов обучения')
