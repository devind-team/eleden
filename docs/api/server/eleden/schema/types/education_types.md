# Модуль education_types



## Класс EduFormType

Форма обучения.

## Класс EduServiceType

Образовательная услуга (Бакалавриат, Специалитет).

## Класс DirectionType

Направление подготовки.

### Методы

| Сигнатура                                                                                                      | Декораторы                                                      | Описание |
| :------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- | :------- |
| resolve_children( direction: apps.eleden.models.education.Direction, info: graphql.execution.base.ResolveInfo) | ['staticmethod', "resolver_hints(model_field='direction_set')"] | -        |

## Класс EduProgramType

Образовательная программа.

## Класс DisciplineViewType

Форма представления дисциплины (Базовая, Выборная, Альтернативная).

## Класс MethodologicalSupportType

Методическое обеспечение.

## Класс DisciplineType

Дисциплина.

### Методы

| Сигнатура                                                                                                                      | Декораторы                                                                  | Описание |
| :----------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------- |
| resolve_methodological_support( discipline: apps.eleden.models.education.Discipline, info: graphql.execution.base.ResolveInfo) | ['staticmethod', "resolver_hints(model_field='methodologicalsupport_set')"] | -        |

## Класс CompetenceType

Компетенция.

## Класс WorkFormType

Форма работы.

## Класс WorkKindType

Вид работы.

## Класс HoursKindType

Тип часов.

## Класс EduHoursType

Часы по плану.

## Класс BlockKindType

Тип блока образовательной программы.

## Класс DisciplineKindType

Тип дисциплины.

## Класс EduCycleType

Цикл образовательных программ.

## Класс MethodologicalSupportInputType

Методическое обеспечение дисциплины.