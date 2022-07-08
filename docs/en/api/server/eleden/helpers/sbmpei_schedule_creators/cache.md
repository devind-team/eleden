# Модуль cache

Модуль с кешем для сохранения распарсенных данных в файл

## Класс Cache

Кеш

### Методы

| Сигнатура                                                                                                 | Декораторы       | Описание                                                                    |
| :-------------------------------------------------------------------------------------------------------- | :--------------- | :-------------------------------------------------------------------------- |
| __init__( self, teams: Optional[list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData]] = None) | -                | -                                                                           |
| store(self, path: str) -&#62; None                                                                        | -                | Сохранение данных в файл.:param path: путь к файлу                          |
| restore(path: str) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.cache.Cache                        | ['staticmethod'] | Восстановление данных.:param path: путь к файлу:return: восстановленный кеш |
| __or__(self, other)                                                                                       | -                | Return self|value.                                                          |