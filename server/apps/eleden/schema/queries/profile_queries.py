import graphene
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField

from apps.eleden.schema.types import FileKindType, PortfolioFileType


class ProfileQueries(graphene.ObjectType):
    file_kinds = DjangoListField(FileKindType, required=True, description='Типы загружаемых файлов')
    portfolio_files = DjangoFilterConnectionField(PortfolioFileType, required=True)
