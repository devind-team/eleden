# Модуль data_services



### Функции

| Сигнатура                                                                                                      | Декораторы | Описание                                                                                                                |
| :------------------------------------------------------------------------------------------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------- |
| create_row( container: apps.sveden.models.models.ItemPropContainer, index: int, values: List[str]) -&#62; None | -          | Добавление данных:param container: контейнер с данными:param index: положение данных:param values: добавляемые значения |
| change_row( container: apps.sveden.models.models.ItemPropContainer, index: int, values: List[str]) -&#62; None | -          | Изменение данных:param container: контейнер с данными:param index: положение данных:param values: добавляемые значения  |
| delete_row( container: apps.sveden.models.models.ItemPropContainer, index: int) -&#62; None                    | -          | Удаление данных:param container: контейнер с данными:param index: положение данных                                      |