# Модуль couples_row_kind

Модуль для определения типа строки пар

### Функции

| Сигнатура                                                                                                                                                                                      | Декораторы | Описание                                                                                                   |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------------------------------------------------------------------------------------------------- |
| get_couples_row_kind( sheet: openpyxl.worksheet.worksheet.Worksheet, cells: list[openpyxl.cell.cell.Cell]) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind | -          | Получение типа строки пар.:param sheet: рабочий лист:param cells: ячейки строки пар:return: тип строки пар |

## Класс CouplesRowKind

Тип строки пар

### Методы

| Сигнатура                                                                                                        | Декораторы      | Описание                                                               |
| :--------------------------------------------------------------------------------------------------------------- | :-------------- | :--------------------------------------------------------------------- |
| get_numerators( cls) -&#62; list[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind]   | ['classmethod'] | Получение числителей.:return: список числителей                        |
| get_denominators( cls) -&#62; list[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind] | ['classmethod'] | Получение знаменателей.:return: список знаменателей                    |
| get_names(self) -&#62; list[str]                                                                                 | -               | Получение названий констант.:return: список названий констант          |
| __new__(cls, value)                                                                                              | -               | Create and return a new object. See help(type) for accurate signature. |