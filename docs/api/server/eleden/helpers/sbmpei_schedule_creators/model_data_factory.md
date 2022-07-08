# Модуль model_data_factory

Модуль с фабрикой для создания данных моделей из данных

## Класс CreationResult

Результат создание данных модели

### Методы

| Сигнатура                                                                                                                                                               | Декораторы | Описание            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, model_data: Optional[~T1], success: bool = True, wrong: Optional[dict[str, list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItem]]] = None) | -          | -                   |
| __iter__(self)                                                                                                                                                          | -          | -                   |
| __repr__(self)                                                                                                                                                          | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                                     | -          | Return self==value. |

## Класс SearchResult

Результат поиска модели

### Методы

| Сигнатура                                                                                                                                               | Декораторы | Описание            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :------------------ |
| __init__( self, value: Optional[~T2], success: bool = True, wrong: Optional[list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItem]] = None) | -          | -                   |
| __iter__(self)                                                                                                                                          | -          | -                   |
| __repr__(self)                                                                                                                                          | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                     | -          | Return self==value. |

## Класс CreationResults

Результаты создания данных моделей

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                 | Декораторы | Описание                                                                           |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------------------------------------------------------------------------- |
| __init__( _cls, wrong_teams_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData], teams_model_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamModelData], wrongs: list[dict[str, list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItem]]]) | -          | Create new instance of CreationResults(wrong_teams_data, teams_model_data, wrongs) |
| __new__( _cls, wrong_teams_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData], teams_model_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamModelData], wrongs: list[dict[str, list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItem]]])  | -          | Create new instance of CreationResults(wrong_teams_data, teams_model_data, wrongs) |
| __repr__(self)                                                                                                                                                                                                                                                                            | -          | Return a nicely formatted representation string                                    |
| __getnewargs__(self)                                                                                                                                                                                                                                                                      | -          | Return self as a plain tuple. Used by copy and pickle.                             |

## Класс ModelDataFactory

Фабрика данных моделей

### Методы

| Сигнатура                                                                                                                                                                                                      | Декораторы | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------- |
| __init__( self, teams_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData], teams_filter: dict[str, typing.Any], names_map: apps.eleden.helpers.sbmpei_schedule_creators.names_map.NamesMap) | -          | -        |