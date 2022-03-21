"""Модуль парсера строки пар"""
import re
from functools import reduce
from itertools import repeat
from typing import Union, Optional, Any, NamedTuple

from openpyxl.cell.cell import Cell

from .couples_row_corrector import fix_classrooms_string
from .couples_row_items import CouplesItem, \
    GroupedCouplesItems, \
    CoupleItemKind, \
    is_even_period, \
    is_odd_period, \
    create_couples_items, \
    get_couples_items, \
    split_couples_items, \
    join_couples_items, \
    create_grouped_couples_items
from .couples_row_kind import CouplesRowKind
from .data import ExcelInfo, CoupleData
from .exceptions import ExtractorException


class Result(NamedTuple):
    """Результат парсинга строки пары"""

    # Тип строки пар
    kind: CouplesRowKind
    # Элементы пар
    couple_items: list[CouplesItem]
    # Информация о положении в книге
    excel_info: ExcelInfo
    # Номера занятий
    class_numbers: list[int]
    # Данные пар
    couples_data: Optional[list[CoupleData]] = None


class CouplesRowParser:
    """Парсер строки пар"""

    def __init__(self,
                 excel_info: ExcelInfo,
                 kind: Union[CouplesRowKind, int],
                 week_day: int,
                 class_number: int,
                 previous_results: list[Result]):
        self._excel_info = excel_info
        self._kind = kind
        self._week_day = week_day
        self._class_number = class_number
        self._previous_results = previous_results
        self._results = self._parse()

    @property
    def results(self) -> list[Result]:
        """Результаты парсинга"""

        return self._results

    @property
    def _previous_incomplete_left(self) -> Optional[Result]:
        """Предыдущий неполный результат типа LEFT"""

        return next(
            (result for result in self._previous_results
             if result.kind is CouplesRowKind.LEFT and not result.couples_data),
            None
        )

    @property
    def _previous_incomplete_right(self) -> Optional[Result]:
        """Предыдущий неполный результат типа RIGHT"""

        return next(
            (result for result in self._previous_results
             if result.kind is CouplesRowKind.RIGHT and not result.couples_data),
            None
        )

    def _parse(self) -> list[Result]:
        """Парсинг строки пары.

        :return: список результатов парсинга
        """

        results: list[Result] = []
        kind_names: list[str] = list(map(lambda name: name.lower(), sorted(self._kind.get_names())))
        if 'left' not in kind_names and self._previous_incomplete_left:
            results.append(self._create_complete_result(self._previous_incomplete_left))
        if 'right' not in kind_names and self._previous_incomplete_right:
            results.append(self._create_complete_result(self._previous_incomplete_right))
        for kind_name in kind_names:
            try:
                results += getattr(self, f'_parse_{kind_name.lower()}', lambda: [])()
            except Exception as exception:
                raise ExtractorException(internal_exception=exception, excel_info=self._excel_info) from exception
        return results

    def _parse_one(self) -> list[Result]:
        """Парсинг типа ONE.

        :return: результаты парсинга
        """

        return [self._parse_class_with_classroom(
            self._excel_info.cells[0], self._excel_info.cells[2], CouplesRowKind.ONE
        )]

    def _parse_full(self) -> list[Result]:
        """Парсинг типа FULL.

        :return: результаты парсинга
        """

        return [self._parse_long(self._excel_info.cells[0], CouplesRowKind.FULL)]

    def _parse_double_class(self) -> list[Result]:
        """Парсинг типа DOUBLE_CLASS.

        :return: результаты парсинга
        """

        return [
            self._parse_class_with_classroom(
                self._excel_info.cells[0], self._excel_info.cells[2], CouplesRowKind.DOUBLE_CLASS
            ),
            self._parse_class_with_classroom(
                self._excel_info.cells[3], self._excel_info.cells[2], CouplesRowKind.DOUBLE_CLASS
            )
        ]

    def _parse_double_classroom(self) -> list[Result]:
        """Парсинг типа DOUBLE_CLASSROOM.

        :return: результаты парсинга
        """

        return [
            self._parse_class_with_classroom(
                self._excel_info.cells[0], self._excel_info.cells[2], CouplesRowKind.DOUBLE_CLASSROOM
            ),
            self._parse_class_with_classroom(
                self._excel_info.cells[0], self._excel_info.cells[5], CouplesRowKind.DOUBLE_CLASSROOM
            )
        ]

    def _parse_without_classroom(self) -> list[Result]:
        """Парсинг типа WITHOUT_CLASSROOM.

        :return: результаты парсинга
        """

        return [self._parse_class_with_classroom(self._excel_info.cells[0], None, CouplesRowKind.WITHOUT_CLASSROOM)]

    def _parse_numerator(self) -> list[Result]:
        """Парсинг типа NUMERATOR.

        :return: результаты парсинга
        """

        result = self._parse_class_with_classroom(
            self._excel_info.cells[0], self._excel_info.cells[2], CouplesRowKind.NUMERATOR
        )
        self._set_odd_periods(result)
        return [result]

    def _parse_denominator(self) -> list[Result]:
        """Парсинг типа DENOMINATOR.

        :return: результаты парсинга
        """

        result = self._parse_class_with_classroom(
            self._excel_info.cells[3], self._excel_info.cells[5], CouplesRowKind.DENOMINATOR
        )
        self._set_even_periods(result)
        return [result]

    def _parse_without_classroom_numerator(self) -> list[Result]:
        """Парсинг типа WITHOUT_CLASSROOM_NUMERATOR.

        :return: результаты парсинга
        """

        result = self._parse_class_with_classroom(
            self._excel_info.cells[0], None, CouplesRowKind.WITHOUT_CLASSROOM_NUMERATOR
        )
        self._set_odd_periods(result)
        return [result]

    def _parse_without_classroom_denominator(self) -> list[Result]:
        """Парсинг типа WITHOUT_CLASSROOM_DENOMINATOR.

        :return: результаты парсинга
        """

        result = self._parse_class_with_classroom(
            self._excel_info.cells[3], None, CouplesRowKind.WITHOUT_CLASSROOM_DENOMINATOR
        )
        self._set_even_periods(result)
        return [result]

    def _parse_long_numerator(self) -> list[Result]:
        """Парсинг типа LONG_NUMERATOR.

        :return: результаты парсинга
        """

        result = self._parse_long(self._excel_info.cells[0], CouplesRowKind.LONG_NUMERATOR)
        self._set_odd_periods(result)
        return [result]

    def _parse_long_denominator(self) -> list[Result]:
        """Парсинг типа LONG_DENOMINATOR.

        :return: результаты парсинга
        """

        result = self._parse_long(self._excel_info.cells[3], CouplesRowKind.LONG_DENOMINATOR)
        self._set_even_periods(result)
        return [result]

    def _parse_left(self) -> list[Result]:
        """Парсинг типа LEFT.

        :return: результаты парсинга
        """

        result = self._parse_left_right(self._excel_info.cells[0], CouplesRowKind.LEFT)
        self._set_odd_periods(result)
        return [result]

    def _parse_right(self) -> list[Result]:
        """Парсинг типа RIGHT.

        :return: результаты парсинга
        """

        result = self._parse_left_right(self._excel_info.cells[1], CouplesRowKind.RIGHT)
        self._set_even_periods(result)
        return [result]

    def _parse_class_with_classroom(
            self,
            class_cell: Cell,
            classroom_cell: Optional[Cell],
            kind: CouplesRowKind) -> Result:
        """Парсинг ячейки занятия и ячейки аудитории.

        :param class_cell: ячейка занятия
        :param classroom_cell: ячейка аудитории
        :param kind: тип строки пар
        :return: результат парсинга
        """

        classrooms: list[str] = fix_classrooms_string(
            re.sub(r'\s+', ' ', str(classroom_cell.value).strip())
        ).split(' ') if classroom_cell else []
        couple_items = create_couples_items(class_cell.value)
        couples = self._create_couples(couple_items, self._excel_info, [self._class_number])
        for couple in couples:
            couple.classrooms.extend(classrooms)
        return Result(kind, couple_items, self._excel_info, [self._class_number], couples)

    def _parse_long(self, cell: Cell, kind: CouplesRowKind) -> Result:
        """Парсинг длинной ячейки.

        :param cell: длинная ячейка
        :param kind: тип строки пар
        :return: результат парсинга
        """

        couple_items = create_couples_items(cell.value)
        couples = self._create_couples(couple_items, self._excel_info, [self._class_number])
        return Result(kind, couple_items, self._excel_info, [self._class_number], couples)

    def _parse_left_right(self, cell: Cell, kind: CouplesRowKind) -> Result:
        """Парсинг ячейки типа LEFT или RIGHT.

        :param cell: ячейка типа LEFT или RIGHT
        :param kind: тип строки пар
        :return: результат парсинга
        """

        previous_incomplete = None
        if kind is CouplesRowKind.LEFT and self._previous_incomplete_left:
            previous_incomplete = self._previous_incomplete_left
        elif kind is CouplesRowKind.RIGHT and self._previous_incomplete_right:
            previous_incomplete = self._previous_incomplete_right
        excel_info = ExcelInfo(
            self._excel_info.worksheet,
            [*self._excel_info.cells, *previous_incomplete.excel_info.cells]
        ) if previous_incomplete else self._excel_info
        couple_items = create_couples_items(cell.value)
        if previous_incomplete:
            couple_items = join_couples_items(previous_incomplete.couple_items, couple_items)
        class_numbers = [*(previous_incomplete.class_numbers if previous_incomplete else []), self._class_number]
        couples = self._create_couples(couple_items, excel_info, None)
        cn_iter = zip(couples, map(lambda number: [number], class_numbers)) \
            if len(couples) == len(class_numbers) \
            else zip(couples, repeat(class_numbers))
        for couple, numbers in cn_iter:
            if not couple.class_numbers:
                couple.class_numbers = numbers
        if len(get_couples_items(couple_items, CoupleItemKind.CLASS_NUMBERS)) or \
                len(get_couples_items(couple_items, CoupleItemKind.CLASSROOMS)):
            return Result(kind, couple_items, self._excel_info, class_numbers, couples)
        else:
            return Result(kind, couple_items, self._excel_info, class_numbers)

    def _create_complete_result(self, incomplete_result: Result) -> Result:
        """Создание полного результата из неполного результата.

        :param incomplete_result: неполный результат
        :return: полный результат
        """

        return Result(
            incomplete_result.kind,
            incomplete_result.couple_items,
            incomplete_result.excel_info,
            incomplete_result.class_numbers,
            self._create_couples(
                incomplete_result.couple_items,
                incomplete_result.excel_info,
                incomplete_result.class_numbers
            )
        )

    def _create_couples(self,
                        couples_items: list[CouplesItem],
                        excel_info: ExcelInfo,
                        class_numbers: Optional[list[int]]) -> list[CoupleData]:
        """Создание пар из элементов пар.

        :param couples_items: элементы пар
        :param excel_info: информация о положении в книге
        :param class_numbers: номера занятий
        :return: список пар
        """

        for kind in (CoupleItemKind.WORK_KIND, CoupleItemKind.DISCIPLINE_WORDS, CoupleItemKind.TEACHERS,
                     CoupleItemKind.SUBGROUP_NUMBER, CoupleItemKind.PERIODS):
            couples_items_list = split_couples_items(couples_items, kind)
            if len(couples_items_list) > 1:
                return reduce(lambda acc, items: [
                    *acc,
                    *self._create_couples(items, excel_info, class_numbers)
                ], couples_items_list, [])
        grouped_couples_items = create_grouped_couples_items(couples_items)
        couple_creation_dict = self._create_couple_creation_dict(grouped_couples_items, excel_info, class_numbers)
        return [CoupleData(**couple_creation_dict)]

    def _create_couple_creation_dict(
            self,
            grouped_couples_items: GroupedCouplesItems,
            excel_info: ExcelInfo,
            class_numbers: Optional[list[int]]) -> dict[str, Any]:
        """Создание словаря для создания пары.

        :param grouped_couples_items: сгруппированные элементы пар
        :param excel_info: информация о положении в книге
        :param class_numbers: номера занятий
        :return словарь для создания пары
        """

        return {
            'excel_info': excel_info,
            'work_kind': grouped_couples_items.work_kind.value if grouped_couples_items.work_kind else None,
            'week_day': self._week_day,
            'discipline_words': grouped_couples_items.disciplines_words[0].value
            if len(grouped_couples_items.disciplines_words) == 1
            else [],
            'teachers': grouped_couples_items.teachers[0].value if len(grouped_couples_items.teachers) == 1 else [],
            'subgroup_number': grouped_couples_items.subgroups_numbers[0].value
            if len(grouped_couples_items.subgroups_numbers) == 1
            else None,
            'periods': grouped_couples_items.periods[0].value if len(grouped_couples_items.periods) == 1 else [],
            'classrooms': grouped_couples_items.classrooms[0].value
            if len(grouped_couples_items.classrooms) == 1
            else [],
            'class_numbers': grouped_couples_items.class_numbers.value
            if grouped_couples_items.class_numbers
            else class_numbers
        }

    @classmethod
    def _set_even_periods(cls, result: Result) -> None:
        """Установить четные периоды.

        :param result: результат парсинга строки пары
        """

        if not result.couples_data:
            return
        for couple_data in result.couples_data:
            if not couple_data.periods:
                couple_data.periods = is_even_period

    @classmethod
    def _set_odd_periods(cls, result: Result) -> None:
        """Установить нечентные периоды.

        :param result: результат парсинга строки пары
        """

        if not result.couples_data:
            return
        for couples_data in result.couples_data:
            if not couples_data.periods:
                couples_data.periods = is_odd_period


__all__ = ['CouplesRowParser', 'Result']
