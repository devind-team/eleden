# Модуль data

Модуль для классов, предназначенных для хранения данных. Данные - строковые значения найденные в ячейках расписания. Пример: 'доц. Иванов. И.И.' Данные модели - значения с найденными записями в базе данных. Пример: '<User: Ivanov>'

### Функции

| Сигнатура                            | Декораторы | Описание                                                                                          |
| :----------------------------------- | :--------- | :------------------------------------------------------------------------------------------------ |
| _next_id(class_name: str) -&#62; int | -          | Получение следующего идентификатора.:param class_name: имя класса:return: следующий идентификатор |

## Класс ExcelInfo

Информация о положении в книге

### Методы

| Сигнатура                                                                                                | Декораторы | Описание                              |
| :------------------------------------------------------------------------------------------------------- | :--------- | :------------------------------------ |
| __init__( self, worksheet: openpyxl.worksheet.worksheet.Worksheet, cells: list[openpyxl.cell.cell.Cell]) | -          | -                                     |
| to_dict(self) -&#62; dict[str, str]                                                                      | -          | Приведение к словарю.:return: словарь |
| __repr__(self)                                                                                           | -          | Return repr(self).                    |
| __eq__(self, other)                                                                                      | -          | Return self==value.                   |

## Класс TeacherData

Данные преподавателя

### Методы

| Сигнатура                                                              | Декораторы | Описание            |
| :--------------------------------------------------------------------- | :--------- | :------------------ |
| __init__(self, position: Optional[str], last_name: str, initials: str) | -          | -                   |
| __post_init__(self)                                                    | -          | -                   |
| __str__(self)                                                          | -          | Return str(self).   |
| __repr__(self)                                                         | -          | Return repr(self).  |
| __eq__(self, other)                                                    | -          | Return self==value. |

## Класс CoupleData

Данные пары

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Декораторы | Описание            |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, excel_info: Optional[apps.eleden.helpers.sbmpei_schedule_creators.data.ExcelInfo] = None, team_data: Optional[apps.eleden.helpers.sbmpei_schedule_creators.data.TeamData] = None, work_kind: Optional[str] = None, week_day: Optional[int] = None, subgroup_number: Optional[int] = None, discipline_words: list[str] = &#60;factory&#62;, periods: Union[list[str], Callable[[str], bool]] = &#60;factory&#62;, teachers: list[apps.eleden.helpers.sbmpei_schedule_creators.data.TeacherData] = &#60;factory&#62;, classrooms: list[str] = &#60;factory&#62;, class_numbers: list[int] = &#60;factory&#62;, distance_learning: bool = False, id: int = &#60;factory&#62;) | -          | -                   |
| __eq__(self, other)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | -          | Return self==value. |
| __hash__(self)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -          | Return hash(self).  |
| __repr__(self)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -          | Return repr(self).  |

## Класс TeamData

Данные группы

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                                                                             | Декораторы | Описание            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, excel_info: Optional[apps.eleden.helpers.sbmpei_schedule_creators.data.ExcelInfo] = None, short_name: Optional[str] = None, course_number: Optional[int] = None, semester_number: Optional[int] = None, couples: list[apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleData] = &#60;factory&#62;, id: int = &#60;factory&#62;) | -          | -                   |
| __eq__(self, other)                                                                                                                                                                                                                                                                                                                                   | -          | Return self==value. |
| __hash__(self)                                                                                                                                                                                                                                                                                                                                        | -          | Return hash(self).  |
| __repr__(self)                                                                                                                                                                                                                                                                                                                                        | -          | Return repr(self).  |

## Класс CoupleModelData

Данные модели пары

### Методы

| Сигнатура                                                                                                                                                                                                                                                                                                                                                                                                 | Декораторы | Описание            |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, work_kind: Optional[apps.eleden.models.education.WorkKind], week_day: int, discipline: apps.eleden.models.education.Discipline, periods: list[apps.eleden.models.process.Period], teachers: list[apps.core.models.User], subgroup_number: Optional[int] = None, classrooms: list[str] = &#60;factory&#62;, class_numbers: list[int] = &#60;factory&#62;, distance_learning: bool = False) | -          | -                   |
| __repr__(self)                                                                                                                                                                                                                                                                                                                                                                                            | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                                                                                                                                                                                                                                                                       | -          | Return self==value. |

## Класс TeamModelData

Данные модели группы

### Методы

| Сигнатура                                                                                                                                                                                           | Декораторы | Описание            |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------------ |
| __init__( self, team: apps.eleden.models.team.Team, course_number: int, semester_number: int, couples: list[apps.eleden.helpers.sbmpei_schedule_creators.data.CoupleModelData] = &#60;factory&#62;) | -          | -                   |
| __repr__(self)                                                                                                                                                                                      | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                                                                 | -          | Return self==value. |