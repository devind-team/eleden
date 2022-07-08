# Модуль couples_row_parser

Модуль парсера строки пар

## Класс CouplesRowParser

Парсер строки пар

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                                                  | Декораторы | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------- |
| __init__( self, excel_info: apps.eleden.helpers.sbmpei_schedule_creators.data.ExcelInfo, kind: Union[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind, int], week_day: int, class_number: int, previous_results: list[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_parser.Result]) | -          | -        |

## Класс Result

Результат парсинга строки пары

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                                                                                                                                 | Декораторы | Описание                                                                                   |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :----------------------------------------------------------------------------------------- |
| __init__( _cls, kind: apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind, couple_items: list[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_items.CouplesItem], excel_info: apps.eleden.helpers.sbmpei_schedule_creators.data.ExcelInfo, class_numbers: list[int], couples_data: Optional[list[apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData]] = None) | -          | Create new instance of Result(kind, couple_items, excel_info, class_numbers, couples_data) |
| __new__( _cls, kind: apps.eleden.helpers.sbmpei_schedule_creators.couples_row_kind.CouplesRowKind, couple_items: list[apps.eleden.helpers.sbmpei_schedule_creators.couples_row_items.CouplesItem], excel_info: apps.eleden.helpers.sbmpei_schedule_creators.data.ExcelInfo, class_numbers: list[int], couples_data: Optional[list[apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData]] = None)  | -          | Create new instance of Result(kind, couple_items, excel_info, class_numbers, couples_data) |
| __repr__(self)                                                                                                                                                                                                                                                                                                                                                                                            | -          | Return a nicely formatted representation string                                            |
| __getnewargs__(self)                                                                                                                                                                                                                                                                                                                                                                                      | -          | Return self as a plain tuple. Used by copy and pickle.                                     |