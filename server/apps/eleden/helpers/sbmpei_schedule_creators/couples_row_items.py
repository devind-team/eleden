"""Модуль для работы с элементами пар"""
import re
from copy import copy
from enum import Enum, auto
from functools import partial
from typing import Any, Optional, NamedTuple

from .couples_row_corrector import fix_main_string
from .data import TeacherData
from .word_kind import WordKind, IdentifiedWord, get_identified_words


class CoupleItemKind(Enum):
    """Тип элемента пар"""

    # Вид работы
    WORK_KIND = auto()
    # Преподователи
    TEACHERS = auto()
    # Подгруппа
    SUBGROUP_NUMBER = auto()
    # Периоды
    PERIODS = auto()
    # Слова названий дисциплин
    DISCIPLINE_WORDS = auto()
    # Аудитории
    CLASSROOMS = auto()
    # Дистанционное обучение
    DISTANCE_LEARNING = auto()
    # Номера занятия
    CLASS_NUMBERS = auto()


class CouplesItem(NamedTuple):
    """Элемент пар"""

    # Значение
    value: Any
    # Тип
    kind: CoupleItemKind


class GroupedCouplesItems(NamedTuple):
    """Сгруппированные элементы пар"""

    # Вид работы
    work_kind: Optional[CouplesItem]
    # Преподаватели
    teachers: list[CouplesItem]
    # Номера подгрупп
    subgroups_numbers: list[CouplesItem]
    # Периоды
    periods: list[CouplesItem]
    # Слова названий дисциплин
    disciplines_words: list[CouplesItem]
    # Аудитории
    classrooms: list[CouplesItem]
    # Дистанционное обучение
    distance_learning: bool
    # Номера занятий
    class_numbers: Optional[CouplesItem]


def is_even_period(short_name: str) -> bool:
    """Функция определяющая, что период четный.

    :param short_name: короткое название периода
    :result: является ли период четным
    """

    return short_name.isdigit() and int(short_name) % 2 == 0


def is_odd_period(short_name: str) -> bool:
    """Функция определяющая, что период нечентный.

    :param short_name: короткое название периода
    :result: является ли период нечентным
    """

    return short_name.isdigit() and int(short_name) % 2 != 0


def _parse_teacher(identified_words: list[IdentifiedWord], i: int) -> tuple[TeacherData, int]:
    """Парсинг преподавателя.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :return: (преподаватель, конечный индекс)
    """

    position = identified_words[i].word
    i += 1
    last_name = ''
    while i < len(identified_words) and identified_words[i].kind is WordKind.TEACHER_LAST_NAME:
        last_name += identified_words[i].word
        i += 1
    return TeacherData(position, last_name, identified_words[i].word), i


def _parse_work_kind(identified_words: list[IdentifiedWord], i: int) -> tuple[str, int]:
    """Парсинг вида работы.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :return: (вид работы, конечный индекс)
    """

    return identified_words[i].word, i


def _parse_subgroup(identified_words: list[IdentifiedWord], i: int) -> tuple[int, int]:
    """Парсинг подгруппы.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :return: (подгруппа, конечный индекс)
    """

    return int(identified_words[i].word.replace('пгр.', '')), i


def _parse_list_periods(identified_words: list[IdentifiedWord], i: int) -> tuple[list[str], int]:
    """Парсинг списка периодов.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :return: (список периодов, конечный индекс)
    """

    return identified_words[i].word.replace('н.', '').split(','), i


def _parse_from_to_periods(identified_words: list[IdentifiedWord], i: int) -> tuple[list[str], int]:
    """Парсинг периодов вида 'с по'.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :return: (список периодов, конечный индекс)
    """

    from_to_search = re.search(r'с(?P<from>\d+)по(?P<to>\d+)', identified_words[i].word)
    from_period = int(from_to_search.group('from'))
    to_period = int(from_to_search.group('to'))
    return list(map(str, range(from_period, to_period + 1))), i


def _parse_class_numbers(identified_words: list[IdentifiedWord], i: int) -> tuple[list[int], int]:
    """Парсинг номеров занятия.

    :param i: начальный индекс
    :return: (функция периодов, конечный индекс)
    """

    return list(map(int, identified_words[i].word[3:-1].split(','))), i


def _parse_multiple_words(identified_words: list[IdentifiedWord], i: int, kind: WordKind) -> tuple[list[str], int]:
    """Парсинг нескольких слов одного типа.

    :param identified_words: идентифицированные слова
    :param i: начальный индекс
    :param kind: тип слова
    :return: (список слов, конечный индекс)
    """

    result: list[str] = []
    while i < len(identified_words) and identified_words[i].kind is kind:
        result.append(identified_words[i].word)
        i += 1
    i -= 1
    return result, i


_couple_item_map = {
    WordKind.WORK_KIND: (_parse_work_kind, CoupleItemKind.WORK_KIND),
    WordKind.SUBGROUP: (_parse_subgroup, CoupleItemKind.SUBGROUP_NUMBER),
    WordKind.LIST_PERIODS: (_parse_list_periods, CoupleItemKind.PERIODS),
    WordKind.FROM_TO_PERIODS: (_parse_from_to_periods, CoupleItemKind.PERIODS),
    WordKind.EVEN_PERIODS: (lambda _, i: (is_even_period, i), CoupleItemKind.PERIODS),
    WordKind.ODD_PERIODS: (lambda _, i: (is_odd_period, i), CoupleItemKind.PERIODS),
    WordKind.DISCIPLINE_NAME: (
        partial(_parse_multiple_words, kind=WordKind.DISCIPLINE_NAME), CoupleItemKind.DISCIPLINE_WORDS
    ),
    WordKind.CLASSROOM: (
        partial(_parse_multiple_words, kind=WordKind.CLASSROOM), CoupleItemKind.CLASSROOMS
    ),
    WordKind.CLASS_NUMBERS: (_parse_class_numbers, CoupleItemKind.CLASS_NUMBERS)
}


def create_couples_items(value: str) -> list[CouplesItem]:
    """Создание элементов пары из стандартной строки ячейки.

    :param value: стандартная строка ячейки
    :return: элементы пар
    """

    words = fix_main_string(value).split(' ')
    identified_words = get_identified_words(words)
    couples_items: list[CouplesItem] = []
    i = 0
    while i < len(identified_words):
        if identified_words[i].kind in _couple_item_map:
            func, couple_item_kind = _couple_item_map[identified_words[i].kind]
            value, i = func(identified_words, i)
            couples_items.append(CouplesItem(value, couple_item_kind))
        elif identified_words[i].kind is WordKind.TEACHER_POSITION:
            teacher_data, i = _parse_teacher(identified_words, i)
            if len(couples_items) and couples_items[-1].kind is CoupleItemKind.TEACHERS:
                couples_items[-1].value.append(teacher_data)
            else:
                couples_items.append(CouplesItem([teacher_data], CoupleItemKind.TEACHERS))
        elif identified_words[i].kind is WordKind.DISTANCE_LEARNING:
            if not next(filter(lambda couple_item: couple_item.kind is WordKind.DISTANCE_LEARNING, couples_items),
                        None):
                couples_items.append(CouplesItem(identified_words[i], CoupleItemKind.DISTANCE_LEARNING))
        i += 1
    return couples_items


def get_couples_items(couples_items: list[CouplesItem], kind: CoupleItemKind) -> list[CouplesItem]:
    """Получение элементов пар по типу.

    :param couples_items: элементы пар
    :param kind: тип элемента пары
    :return: элементы пар принадлежащие типу
    """

    return [couple for couple in couples_items if couple.kind is kind]


def split_couples_items(couples_items: list[CouplesItem], kind: CoupleItemKind) -> list[list[CouplesItem]]:
    """Разделение элементов пар по типу.

    :param couples_items: элементы пар
    :param kind: тип элемента пары
    :return: список элементов пар
    """

    prefix: list[CouplesItem] = []
    result: list[list[CouplesItem]] = []
    for item in couples_items:
        if item.kind is kind:
            result.append(copy(prefix))
            result[-1].append(item)
        elif len(result):
            result[-1].append(item)
        else:
            prefix.append(item)
    return result if len(result) else [prefix]


def join_couples_items(head: list[CouplesItem], tail: list[CouplesItem]) -> list[CouplesItem]:
    """Объединение элементов пар.

    :param head: элементы пар
    :param tail: присоединяемы элементы пар
    :return: объединенные элементы пар
    """

    if head[-1].kind is CoupleItemKind.DISCIPLINE_WORDS and tail[0].kind is CoupleItemKind.DISCIPLINE_WORDS:
        return [*head[0:-1],
                CouplesItem([*head[-1].value, *tail[0].value], CoupleItemKind.DISCIPLINE_WORDS),
                *head[1:]]
    return [*head, *tail]


def create_grouped_couples_items(couples_items: list[CouplesItem]) -> GroupedCouplesItems:
    """Создание сгруппированных элементов пар.

    :param couples_items: элементы пар
    :return: сгруппированные элементы пар
    """

    return GroupedCouplesItems(
        work_kind=next(iter(get_couples_items(couples_items, CoupleItemKind.WORK_KIND)), None),
        teachers=get_couples_items(couples_items, CoupleItemKind.TEACHERS),
        subgroups_numbers=get_couples_items(couples_items, CoupleItemKind.SUBGROUP_NUMBER),
        periods=get_couples_items(couples_items, CoupleItemKind.PERIODS),
        disciplines_words=get_couples_items(couples_items, CoupleItemKind.DISCIPLINE_WORDS),
        classrooms=get_couples_items(couples_items, CoupleItemKind.CLASSROOMS),
        distance_learning=bool(get_couples_items(couples_items, CoupleItemKind.DISTANCE_LEARNING)),
        class_numbers=next(iter(get_couples_items(couples_items, CoupleItemKind.CLASS_NUMBERS)), None)
    )


__all__ = [
    'CoupleItemKind', 'CouplesItem', 'GroupedCouplesItems',
    'is_even_period', 'is_odd_period', 'create_couples_items',
    'get_couples_items', 'split_couples_items', 'join_couples_items',
    'create_grouped_couples_items'
]
