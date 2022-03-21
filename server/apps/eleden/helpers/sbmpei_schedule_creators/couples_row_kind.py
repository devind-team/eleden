"""Модуль для определения типа строки пар"""
from enum import Flag, auto
from functools import reduce
from itertools import combinations_with_replacement
from typing import Union, Optional

from openpyxl.cell.cell import Cell
from openpyxl.worksheet.worksheet import Worksheet, MergedCellRange

from .data import ExcelInfo
from .exceptions import ExtractorException

Template = tuple[bool, int, Optional[int]]


class CouplesRowKind(Flag):
    """Тип строки пар"""

    EMPTY = auto()
    ONE = auto()
    FULL = auto()
    DOUBLE_CLASS = auto()
    DOUBLE_CLASSROOM = auto()
    WITHOUT_CLASSROOM = auto()
    NUMERATOR = auto()
    DENOMINATOR = auto()
    EMPTY_NUMERATOR = auto()
    EMPTY_DENOMINATOR = auto()
    WITHOUT_CLASSROOM_NUMERATOR = auto()
    WITHOUT_CLASSROOM_DENOMINATOR = auto()
    LONG_NUMERATOR = auto()
    LONG_DENOMINATOR = auto()
    LEFT = auto()
    RIGHT = auto()

    @classmethod
    def get_numerators(cls) -> list['CouplesRowKind']:
        """Получение числителей.

        :return: список числителей
        """

        return [cls.NUMERATOR, cls.EMPTY_NUMERATOR, cls.WITHOUT_CLASSROOM_NUMERATOR, cls.LONG_NUMERATOR]

    @classmethod
    def get_denominators(cls) -> list['CouplesRowKind']:
        """Получение знаменателей.

        :return: список знаменателей
        """

        return [cls.DENOMINATOR, cls.EMPTY_DENOMINATOR, cls.WITHOUT_CLASSROOM_DENOMINATOR, cls.LONG_DENOMINATOR]

    def get_names(self) -> list[str]:
        """Получение названий констант.

        :return: список названий констант
        """

        return str(self).replace('CouplesRowKind.', '').split('|')


def _get_couples_row_kind_map() -> dict[CouplesRowKind, Union[list[Template], tuple]]:
    """Получения сопоставления типов и шаблонов.

    :return: словарь сопоставления типов и шаблонов
    """

    help_templates = {
        CouplesRowKind.NUMERATOR: ([(True, 0, 1), (True, 2)],),
        CouplesRowKind.DENOMINATOR: ([(True, 3, 4), (True, 5)],),
        CouplesRowKind.EMPTY_NUMERATOR: (
            [(False, 0), (False, 1), (False, 2)],
            [(False, 0, 1), (False, 2)],
            [(False, 0, 2)],
        ),
        CouplesRowKind.EMPTY_DENOMINATOR: (
            [(False, 3), (False, 4), (False, 5)],
            [(False, 3, 4), (False, 5)],
            [(False, 3, 5)]
        ),
        CouplesRowKind.WITHOUT_CLASSROOM_NUMERATOR: ([(True, 0, 1), (False, 2)],),
        CouplesRowKind.WITHOUT_CLASSROOM_DENOMINATOR: ([(True, 3, 4), (False, 5)],),
        CouplesRowKind.LONG_NUMERATOR: ([(True, 0, 2)],),
        CouplesRowKind.LONG_DENOMINATOR: ([(True, 3, 5)],)
    }
    numerator_combinations = list(combinations_with_replacement(CouplesRowKind.get_numerators(), 2))
    denominator_combinations = list(combinations_with_replacement(CouplesRowKind.get_denominators(), 2))

    def template_reduce(
            acc: dict[CouplesRowKind, Union[list[Template], tuple]],
            pair: tuple):
        result = []
        for pair1 in help_templates[pair[0]]:
            for pair2 in help_templates[pair[1]]:
                result.append([*pair1, *pair2])
        return {**acc, **{pair[0] | pair[1]: tuple(result)}}

    ck_map = {
        CouplesRowKind.EMPTY: (
            [(False, 0, 5)],
            [(False, 0, 4), (False, 2, 5)]
        ),
        CouplesRowKind.ONE: [(True, 0, 4), (True, 2, 5)],
        CouplesRowKind.FULL: [(True, 0, 5)],
        CouplesRowKind.DOUBLE_CLASS: [(True, 0, 1), (True, 3, 4), (True, 2, 5)],
        CouplesRowKind.DOUBLE_CLASSROOM: [(True, 0, 4), (True, 2), (True, 5)],
        CouplesRowKind.WITHOUT_CLASSROOM: [(True, 0, 4), (False, 2, 5)],
        CouplesRowKind.LEFT: (
            [(True, 0, 3), (False, 1, 4), (False, 2, 5)],
            [(True, 0, 3), (False, 1, 5)]
        ),
        CouplesRowKind.RIGHT: [(False, 0, 3), (True, 1, 5)],
        CouplesRowKind.LEFT | CouplesRowKind.RIGHT: [(True, 0, 3), (True, 1, 5)],
        **reduce(
            template_reduce,
            filter(
                lambda pair: pair not in numerator_combinations and pair not in denominator_combinations,
                combinations_with_replacement(help_templates.keys(), 2)
            ),
            {}
        )
    }
    return ck_map


couples_row_kind_map = _get_couples_row_kind_map()


def _check_templates(sheet: Worksheet, cells: list[Cell], templates: list[Template]):
    """Проверка строки пар на шаблоны.

    :param sheet: рабочий лист книги
    :param cells: ячейки строки пар
    :param templates: шаблоны
    :return: соответствует ли строка пар шаблонам
    """

    for template in templates:
        has_value = template[0]
        start_index = template[1]
        end_index = template[2] if len(template) == 3 else None
        start_cell = cells[start_index]
        end_cell = cells[end_index] if end_index else None
        if not bool(str(start_cell.value).strip() if start_cell.value else None) == has_value:
            return False
        if end_cell is not None and \
                MergedCellRange(
                    sheet,
                    f'{start_cell.coordinate}:{end_cell.coordinate}'
                ) not in sheet.merged_cells.ranges:
            return False
    return True


def get_couples_row_kind(sheet: Worksheet, cells: list[Cell]) -> CouplesRowKind:
    """Получение типа строки пар.

    :param sheet: рабочий лист
    :param cells: ячейки строки пар
    :return: тип строки пар
    """

    for kind, templates in couples_row_kind_map.items():
        if isinstance(templates, tuple):
            result = False
            for or_templates in templates:
                result = result or _check_templates(sheet, cells, or_templates)
            if result:
                return kind
        elif _check_templates(sheet, cells, templates):
            return kind
    raise ExtractorException(
        message='Невозможно определить тип для ячеек',
        excel_info=ExcelInfo(sheet, cells)
    )


__all__ = ['CouplesRowKind', 'get_couples_row_kind']
