from typing import List
from apps.sveden.models import ItemPropContainer


def create_row(container: ItemPropContainer, index: int, values: List[str]) -> None:
    """Добавление данных
    :param container: контейнер с данными
    :param index: положение данных
    :param values: добавляемые значения
    """
    container.values.insert(index, values)
    container.save(update_fields=('values',))


def change_row(container: ItemPropContainer, index: int, values: List[str]) -> None:
    """Изменение данных
    :param container: контейнер с данными
    :param index: положение данных
    :param values: добавляемые значения
    """
    container.values[index] = values
    container.save(update_fields=('values',))


def delete_row(container: ItemPropContainer, index: int) -> None:
    """Удаление данных
    :param container: контейнер с данными
    :param index: положение данных
    """
    container.values.pop(index)
    container.save(update_fields=('values',))
