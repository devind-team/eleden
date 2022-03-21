"""Модуль с исключениями"""
from typing import Optional

from apps.eleden.models import Team, Discipline, WorkKind
from .data import ExcelInfo


class ExtractorException(Exception):
    """Исключение извлекателя данных"""

    def __init__(self, **kwargs):
        self.message: Optional[str] = kwargs.get('message', None)
        self.path: Optional[str] = kwargs.get('path', None)
        self.excel_info: ExcelInfo = kwargs.get('excel_info', None)

    def __repr__(self):
        values_dict = {
            'message': self.message,
            'path': self.path,
            **self.excel_info.to_dict()
        }
        return ', '.join(
            map(
                lambda item: f'{item[0]} = {item[1]}',
                {k: v for k, v in values_dict .items() if v is not None}.items()
            )
        )

    def __str__(self):
        return repr(self)


class EduHoursNotFoundException(Exception):
    """Исключение, возникающее, если невозможно найти часы по плану"""

    def __init__(self,
                 team: Team,
                 discipline: Discipline,
                 work_kind: WorkKind,
                 course_number: int,
                 semester_number: int):
        self.message = 'Невозможно найти часы по плану'
        self.team = team
        self.discipline = discipline
        self.work_kind = work_kind
        self.course_number = course_number
        self.semester_number = semester_number

    def __repr__(self):
        values_dict = {
            'message': self.message,
            'team_id': self.team.id,
            'discipline_id': self.discipline.id,
            'work_kind_id': self.work_kind.id,
            'course_number': self.course_number,
            'semester_number': self.semester_number
        }
        return ', '.join(
            map(
                lambda item: f'{item[0]} = {item[1]}',
                {k: v for k, v in values_dict.items()}.items()
            )
        )

    def __str__(self):
        return repr(self)
