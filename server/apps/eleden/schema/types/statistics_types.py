import graphene

from apps.dashboard.schema.types import PointTotalStatisticsType


class EduProgramStatisticsType(graphene.ObjectType):
    """Статистика образовательных программ."""

    id = graphene.ID(required=True, description='Идентификатор записи')
    direction_name = graphene.String(required=True, description='Название образовательной программы')
    direction_code = graphene.String(required=True, description='Код образовательной программы')
    edu_form = graphene.String(required=True, description='Форма обучения')
    name = graphene.String(required=True, description='Имя образовательной программы')
    admission = graphene.Int(required=True, description='Год набора')

    points = graphene.List(PointTotalStatisticsType, required=True, description='Значения показателей')
