import graphene
from typing import Optional, List
from graphene_django import DjangoListField
from graphql import ResolveInfo
from graphene.relay import Node
from graphene_django_optimizer.resolver import resolver_hints
from apps.core.schema.types import OptimizedDjangoObjectType
from ..models import Subsection, ItemProp, ItemPropContainer, ChildItemProp


class ChildItemPropType(OptimizedDjangoObjectType):
    class Meta:
        model = ChildItemProp
        interfaces = (Node,)
        fields = (
            'id',
            'item_prop',
            'header',
            'show_position',
            'value_position'
        )


class ItemPropType(OptimizedDjangoObjectType):
    children = DjangoListField(ChildItemPropType)

    class Meta:
        model = ItemProp
        interfaces = (Node,)
        fields = (
            'id',
            'item_prop'
        )

    @staticmethod
    @resolver_hints(model_field='childitemprop_set')
    def resolve_children(prop: ItemProp, info: ResolveInfo, *args, **kwargs):
        return prop.childitemprop_set.all()


class ItemPropContainerType(OptimizedDjangoObjectType):
    values = graphene.List(graphene.List(graphene.String, required=True), required=True)
    schema = graphene.Field(ItemPropType)

    class Meta:
        model = ItemPropContainer
        interfaces = (Node,)
        fields = (
            'id',
            'header',
            'is_generated',
            'values'
        )

    @staticmethod
    @resolver_hints(model_field='itemprop')
    def resolve_schema(prop: ItemPropContainer, info: ResolveInfo, *args, **kwargs):
        return prop.itemprop


class SubsectionType(OptimizedDjangoObjectType):
    item_prop_containers = DjangoListField(ItemPropContainerType, required=True)

    class Meta:
        model = Subsection
        interfaces = (Node,)
        fields = (
            'id',
            'url',
            'header',
        )

    @staticmethod
    @resolver_hints(model_field='itempropcontainer_set')
    def resolve_item_prop_containers(prop: Subsection, info: ResolveInfo, *args, **kwargs):
        return prop.itempropcontainer_set.all()


class ChildItemPropInputType(graphene.InputObjectType):
    header = graphene.String(required=True, description='Заголовок столбца')
    item_prop = graphene.String(required=True, description='Дочерний тег')


class ItemPropInputType(graphene.InputObjectType):
    item_prop = graphene.String(required=True, description='Главный тег')
    child_item_props = graphene.List(ChildItemPropInputType, required=True, description='Дочерние теги')


class ItemPropContainerInputType(graphene.InputObjectType):
    header = graphene.String(required=True, description='Заголовок структуры данных')
    schema = ItemPropInputType(required=True, description='Структура данных')
