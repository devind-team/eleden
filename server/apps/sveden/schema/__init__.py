import graphene
from graphene_django import DjangoListField
from graphql import ResolveInfo
from devind_helpers.orm_utils import get_object_or_none
from .mutations import SchemaMutations, DataMutations, SubsectionMutations
from .types import SubsectionType
from ..models import Subsection


class Query(graphene.ObjectType):
    subsection = graphene.Field(SubsectionType, url=graphene.String(required=True))
    subsections = DjangoListField(SubsectionType, required=True)

    @staticmethod
    def resolve_subsection(root, info: ResolveInfo, url: str, *args, **kwargs):
        return get_object_or_none(Subsection, url=url)


class Mutation(SchemaMutations, DataMutations, SubsectionMutations, graphene.ObjectType):
    pass
