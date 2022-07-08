# Модуль data_mutations



## Класс AddRowMutation

Мутация добавления строки в таблицу.

### Методы

| Сигнатура                                                                                                             | Декораторы                                                         | Описание |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, item_prop_container_id: str, *args, **kwargs) | ['staticmethod', 'permission_classes((ChangeItemPropContainer,))'] | -        |

## Класс ChangeRowMutation

Мутация изменения данных.

### Методы

| Сигнатура                                                                                                             | Декораторы                                                         | Описание |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, item_prop_container_id: str, *args, **kwargs) | ['staticmethod', 'permission_classes((ChangeItemPropContainer,))'] | -        |

## Класс DeleteRowMutation

Мутация удаления данных.

### Методы

| Сигнатура                                                                                                             | Декораторы                                                         | Описание |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, item_prop_container_id: str, *args, **kwargs) | ['staticmethod', 'permission_classes((ChangeItemPropContainer,))'] | -        |

## Класс DataMutations



### Методы

| Сигнатура  | Декораторы | Описание |
| :--------- | :--------- | :------- |
| __init__() | -          | -        |