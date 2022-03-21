import graphene
from graphql import ResolveInfo
from graphql_relay import from_global_id
from devind_helpers.schema import BaseMutation
from devind_helpers.decorators import permission_classes
from apps.sveden.models import ItemPropContainer
from apps.sveden.permissions import ChangeItemPropContainer
from apps.sveden.schema.types import ItemPropContainerType
from apps.sveden.services import create_row, change_row, delete_row


class AddRowMutation(BaseMutation):
    """Мутация добавления строки в таблицу."""

    class Input:
        item_prop_container_id = graphene.ID(required=True, description='Идентификатор контейнера')
        index = graphene.Int(description='Позиция при добавлении')
        values = graphene.List(graphene.String, required=True, description='Значение')

    item_prop_container = graphene.Field(ItemPropContainerType, required=True)

    @staticmethod
    @permission_classes((ChangeItemPropContainer,))
    def mutate_and_get_payload(root, info: ResolveInfo, item_prop_container_id: str, *args, **kwargs):
        container = ItemPropContainer.objects.get(pk=from_global_id(item_prop_container_id)[1])
        create_row(container, **kwargs)
        return AddRowMutation(item_prop_container=container)


class ChangeRowMutation(BaseMutation):
    """Мутация изменения данных."""

    class Input:
        item_prop_container_id = graphene.ID(required=True, description='Идентификатор контейнера')
        index = graphene.Int(required=True, description='Позиция данных')
        values = graphene.List(graphene.String, required=True, description='Новые значения')

    item_prop_container = graphene.Field(ItemPropContainerType, required=True)

    @staticmethod
    @permission_classes((ChangeItemPropContainer,))
    def mutate_and_get_payload(root, info: ResolveInfo, item_prop_container_id: str, *args, **kwargs):
        container = ItemPropContainer.objects.get(pk=from_global_id(item_prop_container_id)[1])
        change_row(container, **kwargs)
        return ChangeRowMutation(item_prop_container=container)


class DeleteRowMutation(BaseMutation):
    """Мутация удаления данных."""

    class Input:
        item_prop_container_id = graphene.ID(required=True, description='Идентификатор контейнера')
        index = graphene.Int(description='Позиция данных')

    item_prop_container = graphene.Field(ItemPropContainerType, required=True)

    @staticmethod
    @permission_classes((ChangeItemPropContainer,))
    def mutate_and_get_payload(root, info: ResolveInfo, item_prop_container_id: str, *args, **kwargs):
        container = ItemPropContainer.objects.get(pk=from_global_id(item_prop_container_id)[1])
        delete_row(container, **kwargs)
        return DeleteRowMutation(item_prop_container=container)


class DataMutations:
    add_row = AddRowMutation.Field(required=True, description='Мутация добавления строки в таблицу')
    change_row = ChangeRowMutation.Field(required=True, description='Мутация изменения данных')
    delete_row = DeleteRowMutation.Field(required=True, description='Мутация удаления данных')
