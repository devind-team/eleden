# Модуль process_types



## Класс RegistrationType

Тип учета студентов на занятиях.

## Класс PeriodType

Период, учебные недели, 1 - 18, допуск, зачет, экзамен, кр, кр, кн1, кн2.

### Методы

| Сигнатура                                                                                                                                          | Декораторы       | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------- |
| resolve_registrations( period: apps.eleden.models.process.Period, info: graphql.execution.base.ResolveInfo) -&#62; django.db.models.query.QuerySet | ['staticmethod'] | -        |

## Класс CourseType

Курс.

### Методы

| Сигнатура                                                                                                                                         | Декораторы       | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------- | :------- |
| resolve_attestations( course: apps.eleden.models.process.Course, info: graphql.execution.base.ResolveInfo) -&#62; django.db.models.query.QuerySet | ['staticmethod'] | -        |
| resolve_attachments( course: apps.eleden.models.process.Course, info: graphql.execution.base.ResolveInfo) -&#62; django.db.models.query.QuerySet  | ['staticmethod'] | -        |
| resolve_handouts( course: apps.eleden.models.process.Course, info: graphql.execution.base.ResolveInfo) -&#62; django.db.models.query.QuerySet     | ['staticmethod'] | -        |

## Класс AttestationType

Аттестация.

## Класс AttachmentType

Прикрепленный файл.

## Класс HandoutType

Раздаточный материал для курса.

## Класс TeamSummaryReportType

Итоговый отчет по оценкам группы.

## Класс CourseInputType

Частичные входные данные курса.