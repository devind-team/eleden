# Модуль model_data_extractors

Модуль с извлекателями данных

## Класс Extractor

Базовый извлекатель данных моделей

### Методы

| Сигнатура                 | Декораторы         | Описание                |
| :------------------------ | :----------------- | :---------------------- |
| extract(self) -&#62; None | ['abstractmethod'] | Извлечь данные моделей. |

## Класс ExcelExtractor

Извлекатель данных моделей из Excel

### Методы

| Сигнатура                                                                                                                                                                                                                                                                          | Декораторы | Описание                |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------------------- |
| __init__( self, source: Union[str, django.core.files.uploadedfile.UploadedFile], semester_number: int, names_map: Optional[apps.eleden.helpers.sbmpei_schedule_creators.names_map.NamesMap] = None, teams_filter: Optional[dict[str, Any]] = None, save_wrong_teams: bool = False) | -          | -                       |
| extract(self) -&#62; None                                                                                                                                                                                                                                                          | -          | Извлечь данные моделей. |

## Класс CacheExtractor

Извлекатель данных моделей из кеша

### Методы

| Сигнатура                                                                                                                                                                                                                           | Декораторы | Описание                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------------------- |
| __init__( self, source_cache: apps.eleden.helpers.sbmpei_schedule_creators.cache.Cache, names_map: Optional[apps.eleden.helpers.sbmpei_schedule_creators.names_map.NamesMap] = None, teams_filter: Optional[dict[str, Any]] = None) | -          | -                       |
| extract(self) -&#62; None                                                                                                                                                                                                           | -          | Извлечь данные моделей. |