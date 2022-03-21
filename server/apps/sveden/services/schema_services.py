from graphql_relay import from_global_id

from apps.sveden.models import ChildItemProp, ItemProp, ItemPropContainer
from apps.sveden.schema.types import ItemPropContainerInputType


def create_schema(subsection_id: str, item_prop_container: ItemPropContainerInputType) -> ItemPropContainer:
    """Создание структуры данных
    :param subsection_id: подраздел
    :param item_prop_container: структура
    """
    container = ItemPropContainer.objects.create(header=item_prop_container.header,
                                                 subsection_id=from_global_id(subsection_id)[1],
                                                 values=[] if item_prop_container.schema.item_prop else [
                                                     ['' for _ in item_prop_container.schema.child_item_props]])
    item_prop = ItemProp.objects.create(item_prop=item_prop_container.schema.item_prop, container=container)
    ChildItemProp.objects.bulk_create(
        [ChildItemProp(value_position=i, show_position=i, item_prop=x.item_prop, parent=item_prop, header=x.header) for
         (i, x) in enumerate(item_prop_container.schema.child_item_props)])
    return container


def create_child_item_prop(item_prop_obj: ItemProp, item_prop: str, header: str, show_position: int) -> ChildItemProp:
    """Добавление дочернего тега
    :param item_prop_obj: главный тег
    :param item_prop: дочерний тег
    :param header: название столбца(описание тега)
    :param show_position: позиция при выводе
    """
    last_value_position = item_prop_obj.childitemprop_set.only('value_position').order_by(
        '-value_position').first().value_position + 1
    return ChildItemProp.objects.create(item_prop=item_prop,
                                        header=header,
                                        parent_id=item_prop_obj.id,
                                        show_position=show_position,
                                        value_position=last_value_position)


def change_child_item_prop(child_item_prop: ChildItemProp, item_prop: str, header: str, show_position: int) -> None:
    """Изменение дочернего тега
    :param child_item_prop: дочерний тег
    :param item_prop: новое значение itemProp
    :param header: название столбца(описание тега)
    :param show_position: позиция при выводе
    """
    child_item_prop.item_prop = item_prop
    child_item_prop.header = header
    child_item_prop.show_position = show_position
    child_item_prop.save(update_fields=('item_prop', 'header', 'show_position',))


def change_item_prop_container(item_prop_container: ItemPropContainer, header: str, is_generated: int) -> None:
    """Изменение контейнера тега
    :param item_prop_container: контейнер
    :param header: новое значение заголовка
    :param is_generated: флаг генерируемых данных
    """
    item_prop_container.header = header
    item_prop_container.is_generated = is_generated
    item_prop_container.save(update_fields=('header', 'is_generated',))


def change_item_prop(item_prop_obj: ItemProp, item_prop: str) -> None:
    """Изменение контейнера тега
    :param item_prop_obj: Главный тег
    :param item_prop: новое itemProp
    """
    item_prop_obj.item_prop = item_prop
    item_prop_obj.save(update_fields=('item_prop',))
