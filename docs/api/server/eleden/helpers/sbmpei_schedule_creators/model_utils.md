# Модуль model_utils

Модуль с вспомогательными функциями для работы с моделями

### Функции

| Сигнатура                                                                                                                                                                                                                      | Декораторы             | Описание                                                                                                                                                                                                                              |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| save( teams_model_data: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamModelData], ignore_save_errors: bool, only_result: bool = False) -&#62; apps.eleden.helpers.sbmpei_schedule_creators.model_utils.SaveResult | ['transaction.atomic'] | Сохранение данных моделей.:param teams_model_data: список данных моделей групп:param ignore_save_errors: игнорировать ошибки при сохранении или нет:param only_result: сохранять только курсы-результаты:return: результат сохранения |
| clear() -&#62; None                                                                                                                                                                                                            | -                      | Очистка моделей расписания.                                                                                                                                                                                                           |

## Класс SaveResult

Результат сохранения

### Методы

| Сигнатура                                                                                                                                                                                                                                                                              | Декораторы | Описание            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, courses: list[tuple[apps.eleden.models.process.Course, bool]] = &#60;factory&#62;, classrooms: list[tuple[apps.eleden.models.schedule.Classroom, bool]] = &#60;factory&#62;, edu_classes: list[tuple[apps.eleden.models.schedule.EduClass, bool]] = &#60;factory&#62;) | -          | -                   |
| __or__( self, other: apps.eleden.helpers.sbmpei_schedule_creators.model_utils.SaveResult)                                                                                                                                                                                              | -          | Return self|value.  |
| __repr__(self)                                                                                                                                                                                                                                                                         | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                                                                                                                                                    | -          | Return self==value. |