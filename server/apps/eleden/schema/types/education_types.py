import graphene
from graphene.relay import Node
from graphene_django import DjangoListField
from graphene_django_optimizer import resolver_hints
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo

from apps.core.schema import UserType
from apps.eleden.filters import EduProgramFilterSet, DisciplineFilterSet
from apps.eleden.models import EduForm, \
    EduService, \
    Direction, \
    EduProgram, \
    DisciplineView, \
    Discipline, \
    MethodologicalSupport, \
    WorkKind, \
    WorkForm, \
    HoursKind, \
    EduHours, \
    DisciplineKind, \
    BlockKind, \
    EduCycle, \
    Competence
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType


class EduFormType(OptimizedDjangoObjectType):
    """Форма обучения."""

    class Meta:
        model = EduForm
        fields = ('id', 'name', 'short_name', 'parent',)


class EduServiceType(OptimizedDjangoObjectType):
    """Образовательная услуга (Бакалавриат, Специалитет)."""

    class Meta:
        model = EduService
        fields = ('id', 'name',)


class DirectionType(OptimizedDjangoObjectType):
    """Направление подготовки."""

    edu_service = graphene.Field(EduServiceType, required=True, description='Образовательная услуга')
    children = graphene.List(lambda: DirectionType, description='Дочерние направления')

    class Meta:
        model = Direction
        interfaces = (Node,)
        fields = ('id', 'code', 'name', 'secret', 'delete', 'edu_service',)
        filter_fields = {
            'name': ['icontains']
        }
        connection_class = CountableConnection

    @staticmethod
    @resolver_hints(
        model_field='direction_set',
    )
    def resolve_children(direction: Direction, info: ResolveInfo):
        return direction.direction_set.all()


class EduProgramType(OptimizedDjangoObjectType):
    """Образовательная программа."""

    edu_form = graphene.Field(EduFormType, required=True, description='Форма обучения')
    direction = graphene.Field(DirectionType, required=True, description='Направление подготовки')
    disciplines = graphene.List(lambda: DisciplineType, required=True, description='Дисциплины')

    class Meta:
        model = EduProgram
        interfaces = (Node,)
        fields = (
            'id',
            'name',
            'adaptive',
            'admission',
            'expedited',
            'description',
            'description_sign',
            'syllabus',
            'syllabus_sign',
            'calendar',
            'calendar_sign',
            'created_at',
            'updated_at',
            'edu_form',
            'direction',
            'disciplines',
        )
        filterset_class = EduProgramFilterSet
        connection_class = CountableConnection


class DisciplineViewType(OptimizedDjangoObjectType):
    """Форма представления дисциплины (Базовая, Выборная, Альтернативная)."""

    class Meta:
        model = DisciplineView
        fields = ('id', 'name', 'order',)


class MethodologicalSupportType(OptimizedDjangoObjectType):
    """Методическое обеспечение."""

    discipline = graphene.Field(lambda: DisciplineType, required=True, description='Дисциплина')

    class Meta:
        model = MethodologicalSupport
        interfaces = (Node,)
        fields = ('id', 'name', 'src', 'src_sign', 'created_at', 'updated_at', 'discipline',)
        filter_fields = ('name', 'created_at', 'updated_at', 'discipline__id',)
        connection_class = CountableConnection


class DisciplineType(OptimizedDjangoObjectType):
    """Дисциплина."""

    edu_program = graphene.Field(EduProgramType, required=True, description='Образовательная программа')
    view = graphene.Field(DisciplineViewType, required=True, description='Форма представления')
    users = DjangoListField(UserType, required=True, description='Авторы')
    methodological_support = DjangoListField(
        MethodologicalSupportType,
        required=True,
        description='Методическое обеспечение'
    )
    order = graphene.Int(required=True, description='Позиция для сортировки')

    class Meta:
        model = Discipline
        interfaces = (Node,)
        fields = (
            'id',
            'code',
            'name',
            'annotation',
            'annotation_sign',
            'work_program',
            'work_program_sign',
            'created_at',
            'updated_at',
            'edu_program',
            'view',
            'users',
            'parent',
            'order',
        )
        filterset_class = DisciplineFilterSet
        connection_class = CountableConnection

    @staticmethod
    @resolver_hints(model_field='methodologicalsupport_set')
    def resolve_methodological_support(discipline: Discipline, info: ResolveInfo):
        return discipline.methodologicalsupport_set.all()


class CompetenceType(OptimizedDjangoObjectType):
    """Компетенция."""

    class Meta:
        model = Competence
        interfaces = (Node,)
        fields = ('id', 'name', 'code', 'category')
        filter_fields = {'name': ['icontains']}
        connection_class = CountableConnection


class WorkFormType(OptimizedDjangoObjectType):
    """Форма работы."""

    class Meta:
        model = WorkForm
        fields = ('id', 'name', 'order',)


class WorkKindType(OptimizedDjangoObjectType):
    """Вид работы."""

    work_form = graphene.Field(WorkFormType, description='Форма работы')

    class Meta:
        model = WorkKind
        fields = (
            'id',
            'name',
            'short_name',
            'is_hidden',
            'order',
            'created_at',
            'updated_at',
            'work_form',
        )


class HoursKindType(OptimizedDjangoObjectType):
    """Тип часов."""

    class Meta:
        model = HoursKind
        fields = ('id', 'name',)


class EduHoursType(OptimizedDjangoObjectType):
    """Часы по плану."""

    discipline = graphene.Field(DisciplineType, required=True, description='Дисциплина')
    work_kind = graphene.Field(WorkKindType, required=True, description='Вид работ')
    hours_kind = graphene.Field(HoursKindType, required=True, description='Тип часов')

    class Meta:
        model = EduHours
        fields = ('id', 'course_number', 'semester_number', 'value', 'discipline', 'work_kind', 'hours_kind',)


class BlockKindType(OptimizedDjangoObjectType):
    """Тип блока образовательной программы."""

    class Meta:
        model = BlockKind
        fields = ('id', 'name', 'order',)


class DisciplineKindType(OptimizedDjangoObjectType):
    """Тип дисциплины."""

    class Meta:
        model = DisciplineKind
        fields = ('id', 'name', 'order',)


class EduCycleType(OptimizedDjangoObjectType):
    """Цикл образовательных программ."""

    block_kind = graphene.Field(BlockKindType, required=True, description='Тип блока образовательной программы')
    discipline_kind = graphene.Field(DisciplineKindType, required=True, description='Тип дисциплины')

    class Meta:
        model = EduCycle
        fields = ('id', 'name', 'code', 'order', 'block_kind', 'discipline_kind',)


class MethodologicalSupportInputType(graphene.InputObjectType):
    """Методическое обеспечение дисциплины."""

    name = graphene.String(required=True, description='Подпись файла')
    src = Upload(required=True, description='Файл')
