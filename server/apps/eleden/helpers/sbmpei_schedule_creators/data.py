"""Модуль для классов, предназначенных для хранения данных.
Данные - строковые значения найденные в ячейках расписания. Пример: 'доц. Иванов. И.И.'
Данные модели - значения с найденными записями в базе данных. Пример: '<User: Ivanov>'
"""
import re
from dataclasses import dataclass, field
from functools import partial
from typing import Optional, Union, ClassVar, Callable

from openpyxl.cell.cell import Cell
from openpyxl.worksheet.worksheet import Worksheet

from apps.core.models import User
from apps.eleden.models import WorkKind, Discipline, Period, Team


def _next_id(class_name: str) -> int:
    """Получение следующего идентификатора.

    :param class_name: имя класса
    :return: следующий идентификатор
    """

    cls = globals()[class_name]
    cls_id = cls._id
    cls._id += 1
    return cls_id


@dataclass
class ExcelInfo:
    """Информация о положении в книге"""

    # Рабочий лист книги
    worksheet: Worksheet
    # Ячейки
    cells: list[Cell]

    def to_dict(self) -> dict[str, str]:
        """Приведение к словарю.

        :return: словарь
        """

        return {
            'worksheet': self.worksheet.title,
            'cells': '[' + ', '.join(map(lambda cell: cell.coordinate, self.cells)) + ']'
        }


@dataclass
class TeacherData:
    """Данные преподавателя"""

    # Должность
    position: Optional[str]
    # Фамилия
    last_name: str
    # Инициалы
    initials: str

    # Разрешенные должности
    positions: ClassVar[list[str]] = ['асс.', 'ст.пр.', 'доц.', 'д.', 'проф.']

    def __post_init__(self):
        if self.position and self.position not in self.positions:
            raise ValueError(f'Строка "{self.position}" не входит в множестово {{{", ".join(self.positions)}}}')
        if not re.match(r'^[А-ЯЁ][а-яё]+$', self.last_name):
            raise ValueError(f'Строка "{self.last_name}" не является фамилией')
        if not re.match(r'^[А-ЯЁ]\.[А-ЯЁ]\.$', self.initials):
            raise ValueError(f'Строка "{self.initials}" не является инициалами')

    def __str__(self):
        return f'{self.position} {self.last_name} {self.initials}'


@dataclass
class CoupleData:
    """Данные пары"""

    # Информация о положении в книге
    excel_info: Optional[ExcelInfo] = None
    # Данные группы
    team_data: Optional['TeamData'] = None
    # Вид работы
    work_kind: Optional[str] = None
    # День недели
    week_day: Optional[int] = None
    # Номер подгруппы
    subgroup_number: Optional[int] = None
    # Слова названия дисциплины
    discipline_words: list[str] = field(default_factory=list)
    # Периоды обучения
    periods: Union[list[str], Callable[[str], bool]] = field(default_factory=list)
    # Преподаватели
    teachers: list[TeacherData] = field(default_factory=list)
    # Аудитории
    classrooms: list[str] = field(default_factory=list)
    # Номера занятия
    class_numbers: list[int] = field(default_factory=list)
    # Дистанционное обучение
    distance_learning: bool = False
    # Идентификатор
    id: int = field(default_factory=partial(_next_id, 'CoupleData'))

    # Счетчик идентификаторов
    _id: ClassVar[int] = 1

    def __eq__(self, other):
        if not isinstance(other, CoupleData):
            raise TypeError(f'{type(other)} не является экземляром класса {CoupleData.__name__}')
        return self.id == other.id

    def __hash__(self):
        return hash(self.id)


@dataclass
class TeamData:
    """Данные группы"""

    # Информация о положении в книге
    excel_info: Optional[ExcelInfo] = None
    # Сокращенное название
    short_name: Optional[str] = None
    # Номер курса
    course_number: Optional[int] = None
    # Номер семестра
    semester_number: Optional[int] = None
    # Пары
    couples: list[CoupleData] = field(default_factory=list)
    # Идентификатор
    id: int = field(default_factory=partial(_next_id, 'TeamData'))

    # Счетчик идентификаторов
    _id: ClassVar[int] = 1

    def __eq__(self, other):
        if not isinstance(other, TeamData):
            raise TypeError(f'{type(other)} не является экземляром класса {TeamData.__name__}')
        return self.id == other.id

    def __hash__(self):
        return hash(self.id)


@dataclass
class CoupleModelData:
    """Данные модели пары"""

    # Вид работы
    work_kind: Optional[WorkKind]
    # День недели
    week_day: int
    # Дисциплина
    discipline: Discipline
    # Периоды
    periods: list[Period]
    # Преподаватели
    teachers: list[User]
    # Номер подгруппы
    subgroup_number: Optional[int] = None
    # Аудитории
    classrooms: list[str] = field(default_factory=list)
    # Номера занятия
    class_numbers: list[int] = field(default_factory=list)
    # Дистанционное обучение
    distance_learning: bool = False


@dataclass
class TeamModelData:
    """Данные модели группы"""

    # Группа
    team: Team
    # Номер курса
    course_number: int
    # Номер семестра
    semester_number: int
    # Список данных модели пары
    couples: list[CoupleModelData] = field(default_factory=list)
