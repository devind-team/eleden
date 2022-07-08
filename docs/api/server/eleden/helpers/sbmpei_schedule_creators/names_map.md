# Модуль names_map

Модуль отображения имен

## Класс NamesMap

Отображение имен

### Методы

| Сигнатура                                                                                                                                                             | Декораторы      | Описание                                                                                                                                |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| __init__(self, **kwargs)                                                                                                                                              | -               | -                                                                                                                                       |
| save_empty_to_json( cls, wrong_items_wrappers: list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItemsWrapper], path: str) -&#62; None                     | ['classmethod'] | Сохранение пустого шаблона в json.:param wrong_items_wrappers: список неправильных элементов с путями к файлам:param path: путь к файлу |
| save_empty_to_xlsx( cls, wrong_items_wrappers: list[apps.eleden.helpers.sbmpei_schedule_creators.wrong.WrongItemsWrapper], path: str) -&#62; None                     | ['classmethod'] | Сохранение пустого шаблона в xlsx.:param wrong_items_wrappers: список неправильных элементов с путями к файлам:param path: путь к файлу |
| load_from_json( cls, path: str) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.names_map.NamesMap                                                                | ['classmethod'] | Загрузка из json.:param path: путь к файлу:return: отображение имен                                                                     |
| load_from_xlsx( cls, path: str) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.names_map.NamesMap                                                                | ['classmethod'] | Загрузка из xlsx.:param path: путь к файлу:return: отображение имен                                                                     |
| get_team_data( self, team_data: apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData         | -               | Получение правильных данных группы.:param team_data: возможно неправильные данные группы:return: правильные данные группы               |
| get_couple_data( self, couple_data: apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData | -               | Получение правильных данных пары.:param couple_data: возможно неправильные данные пары:return: правильные данные пары                   |
| is_couple_data_deleted( self, couple_data: apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData) -&#62; bool                                                  | -               | Проверка являются ли данные пары удаленнными.:param couple_data: данные пары:return: результат проверки                                 |
| is_team_data_deleted( self, team_data: apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData) -&#62; bool                                                        | -               | Проверка являются ли данные группы удаленными.:param team_data: данные группы:return: результаты проверки                               |