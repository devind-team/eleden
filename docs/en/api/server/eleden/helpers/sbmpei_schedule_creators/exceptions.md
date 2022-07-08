# Модуль exceptions

Модуль с исключениями

## Класс ExtractorException

Исключение извлекателя данных

### Методы

| Сигнатура                | Декораторы | Описание           |
| :----------------------- | :--------- | :----------------- |
| __init__(self, **kwargs) | -          | -                  |
| __repr__(self)           | -          | Return repr(self). |
| __str__(self)            | -          | Return str(self).  |

## Класс EduHoursNotFoundException

Исключение, возникающее, если невозможно найти часы по плану

### Методы

| Сигнатура                                                                                                                                                                                            | Декораторы | Описание           |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :----------------- |
| __init__( self, team: apps.eleden.models.team.Team, discipline: apps.eleden.models.education.Discipline, work_kind: apps.eleden.models.education.WorkKind, course_number: int, semester_number: int) | -          | -                  |
| __repr__(self)                                                                                                                                                                                       | -          | Return repr(self). |
| __str__(self)                                                                                                                                                                                        | -          | Return str(self).  |