import graphene
from graphene.relay import Node

from apps.core.schema import UserType
from apps.eleden.filters import PortfolioFileFilterSet
from apps.eleden.models import FileKind, PortfolioFile
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType, FileType as CoreFileType


class FileKindType(OptimizedDjangoObjectType):
    """Тип загружаемых файлов в портфолио."""

    class Meta:
        model = FileKind
        fields = ('id', 'name', 'accept', 'created_at', 'updated_at')


class PortfolioFileType(OptimizedDjangoObjectType):
    """Файл в портфолио."""

    file = graphene.Field(CoreFileType, required=True, description='Привязанный к портфолио файл')
    kind = graphene.Field(FileKindType, description='Тип файла из портфолио')
    discipline = graphene.Field('apps.eleden.schema.types.DisciplineType', description='Дисциплина')
    user = graphene.Field(
        UserType,
        description='Пользователь, который подтверждает правильность файла, занесенного в портфолио'
    )

    class Meta:
        model = PortfolioFile
        interfaces = (Node,)
        fields = ('id', 'describe', 'created_at', 'updated_at', 'file', 'kind', 'discipline', 'user',)
        filterset_class = PortfolioFileFilterSet
        connection_class = CountableConnection
