# Модуль wrong

Модуль для работы с неправильными элементами

## Класс WrongKind

Тип неправильного элемента

### Методы

| Сигнатура           | Декораторы | Описание                                                               |
| :------------------ | :--------- | :--------------------------------------------------------------------- |
| __new__(cls, value) | -          | Create and return a new object. See help(type) for accurate signature. |

## Класс WrongItem

Неправильный элемент

### Методы

| Сигнатура                           | Декораторы         | Описание                              |
| :---------------------------------- | :----------------- | :------------------------------------ |
| to_dict(self) -&#62; dict[str, str] | ['abstractmethod'] | Приведение к словарю.:return: словарь |

## Класс WrongTeamItem

Неправильный элемент группы

### Методы

| Сигнатура                                                                                                                                                                                                                                                                    | Декораторы | Описание                              |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------------------------ |
| __init__( self, team_data: apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData, possible_values: Optional[list[str]] = None, kind: apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongKind = &#60;WrongKind.UNDISCOVERED: 1&#62;, message: Optional[str] = None) | -          | -                                     |
| to_dict(self) -&#62; dict[str, str]                                                                                                                                                                                                                                          | -          | Приведение к словарю.:return: словарь |

## Класс WrongCoupleItem

Неправильный элемент пары

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                    | Декораторы | Описание                              |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------------------------ |
| __init__( self, couple_data: apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData, value: str, possible_values: Optional[list[str]] = None, kind: apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongKind = &#60;WrongKind.UNDISCOVERED: 1&#62;, message: Optional[str] = None) | -          | -                                     |
| to_dict(self) -&#62; dict[str, str]                                                                                                                                                                                                                                                          | -          | Приведение к словарю.:return: словарь |

## Класс WrongItems

Неправильные элементы

### Методы

| Сигнатура                                                                                                                    | Декораторы | Описание                                                                                                                              |
| :--------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| __init__(self)                                                                                                               | -          | -                                                                                                                                     |
| to_dict(self, path: Optional[str] = None) -&#62; dict                                                                        | -          | Приведение к словарю.:param path: путь к Excel файлу:return: словарь                                                                  |
| add_from_wrong_dict( self, wrong: dict[str, list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItem]]) -&#62; None | -          | Добавление из словаря.:param wrong: словарь неправильных элементов,в котором key - название свойства, а value - неправильные элементы |
| __repr__(self)                                                                                                               | -          | Return repr(self).                                                                                                                    |
| __eq__(self, other)                                                                                                          | -          | Return self==value.                                                                                                                   |

## Класс WrongItemsWrapper

Неправильные элементы с путем к файлу

### Методы

| Сигнатура                                                                                              | Декораторы | Описание                                                    |
| :----------------------------------------------------------------------------------------------------- | :--------- | :---------------------------------------------------------- |
| __init__( _cls, wrong_items: apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItems, path: str) | -          | Create new instance of WrongItemsWrapper(wrong_items, path) |
| __new__( _cls, wrong_items: apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItems, path: str)  | -          | Create new instance of WrongItemsWrapper(wrong_items, path) |
| __repr__(self)                                                                                         | -          | Return a nicely formatted representation string             |
| __getnewargs__(self)                                                                                   | -          | Return self as a plain tuple. Used by copy and pickle.      |