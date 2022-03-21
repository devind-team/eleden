import graphene
from devind_helpers.decorators import permission_classes
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.schema import BaseMutation
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.sveden.models import ItemPropContainer, ItemProp, ChildItemProp
from apps.sveden.permissions import AddItemPropContainer, ChangeChildItemProp, AddChildItemProp, \
    ChangeItemPropContainer, ChangeItemProp
from apps.sveden.schema.types import ItemPropContainerType, ChildItemPropType, ItemPropContainerInputType, ItemPropType
from apps.sveden.services import create_schema, create_child_item_prop, change_child_item_prop, \
    change_item_prop_container
from apps.sveden.services.schema_services import change_item_prop


class AddItemPropContainerMutation(BaseMutation):
    class Input:
        url_id = graphene.ID(required=True, description='Идентификатор подраздела')
        item_prop_container = ItemPropContainerInputType(required=True, description='Добавляемая структура')

    item_prop_container = graphene.Field(ItemPropContainerType)

    @staticmethod
    @permission_classes((AddItemPropContainer,))
    def mutate_and_get_payload(root, info: ResolveInfo, url_id: str, item_prop_container: ItemPropContainerInputType, *args, **kwargs):
        return AddItemPropContainerMutation(item_prop_container=create_schema(url_id, item_prop_container))


class ChangeItemPropContainerMutation(BaseMutation):
    class Input:
        item_prop_container_id = graphene.ID(required=True, description='Идентификатор контейнера')
        header = graphene.String(required=True, description='Новый заголовок')
        item_prop = graphene.String(required=True, description='Главный тег')
        is_generated = graphene.Boolean(required=True, description='Флаг генерации данных')

    item_prop_container = graphene.Field(ItemPropContainerType, required=True)

    @staticmethod
    @permission_classes((ChangeItemPropContainer,))
    def mutate_and_get_payload(root, info: ResolveInfo, item_prop_container_id: str, item_prop: str, *args, **kwargs):
        ipc = get_object_or_404(ItemPropContainer, pk=from_global_id(item_prop_container_id)[1])
        ip = ipc.itemprop
        change_item_prop_container(ipc, **kwargs)
        change_item_prop(ip, item_prop)
        return ChangeItemPropContainerMutation(item_prop_container=ipc)


class AddChildItemPropMutation(BaseMutation):
    class Input:
        item_prop_id = graphene.ID(required=True, description='Идентификатор родительского тега')
        item_prop = graphene.String(required=True, description='Дочерний тег')
        header = graphene.String(required=True, description='Заголовок столбца')
        show_position = graphene.Int(required=True, description='Положение при выводе')

    child_item_prop = graphene.Field(ChildItemPropType, required=True)

    @staticmethod
    @permission_classes((AddChildItemProp,))
    def mutate_and_get_payload(root, info: ResolveInfo, item_prop_id: str, *args, **kwargs):
        ip = get_object_or_404(ItemProp, pk=from_global_id(item_prop_id)[1])
        return AddChildItemPropMutation(child_item_prop=create_child_item_prop(ip, **kwargs))


class ChangeChildItemPropMutation(BaseMutation):
    class Input:
        child_item_prop_id = graphene.ID(required=True, description='Идентификатор дочернего тега')
        item_prop = graphene.String(required=True, description='Новый дочерний тег')
        header = graphene.String(required=True, description='Новый заголовок')
        show_position = graphene.Int(required=True, description='Новое положение для вывода')

    child_item_prop = graphene.Field(ChildItemPropType, required=True)

    @staticmethod
    @permission_classes((ChangeChildItemProp,))
    def mutate_and_get_payload(root, info: ResolveInfo, child_item_prop_id: str, *args, **kwargs):
        cip = get_object_or_404(ChildItemProp, pk=from_global_id(child_item_prop_id)[1])
        change_child_item_prop(cip, **kwargs)
        return ChangeChildItemPropMutation(child_item_prop=cip)


class SchemaMutations(graphene.ObjectType):
    # Мутации управления структуры в целом
    add_item_prop_container = AddItemPropContainerMutation.Field(required=True, description='Мутация добавления структуры')
    change_item_prop_container = ChangeItemPropContainerMutation.Field(required=True, description='Мутация изменения контейнера')
    delete_item_prop_container = DeleteMutation(ItemPropContainer, is_global_id=True).Field(required=True)
    # Мутации управления дочерними тегами
    add_child_item_prop = AddChildItemPropMutation.Field(required=True, description='Мутация добавления дочернего тега')
    change_child_item_prop = ChangeChildItemPropMutation.Field(required=True, description='Мутация изменения дочернего тега')
    delete_child_item_prop = DeleteMutation(ChildItemProp, is_global_id=True).Field(required=True)  # todo: add additional_actions
