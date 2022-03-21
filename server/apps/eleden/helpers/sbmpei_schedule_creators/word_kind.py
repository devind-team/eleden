"""Модуль с функциями для определения типа слова"""
import re
from dataclasses import dataclass
from enum import Enum, auto

from .data import TeacherData


class WordKind(Enum):
    """Тип слова"""

    # Вид работы
    WORK_KIND = auto()
    # Должность преподавателя
    TEACHER_POSITION = auto()
    # Фамилия преподавателя
    TEACHER_LAST_NAME = auto()
    # Инициалы преподавателя
    TEACHER_INITIALS = auto()
    # Подгруппа
    SUBGROUP = auto()
    # Список периодов
    LIST_PERIODS = auto()
    # Периоды вида 'с по'
    FROM_TO_PERIODS = auto()
    # Четные периоды
    EVEN_PERIODS = auto()
    # Нечетные периоды
    ODD_PERIODS = auto()
    # Название дисциплины
    DISCIPLINE_NAME = auto()
    # Аудитория
    CLASSROOM = auto()
    # Дистанционное обучение
    DISTANCE_LEARNING = auto()
    # Номера занятия
    CLASS_NUMBERS = auto()
    # Неизвестный тип
    UNKNOWN = auto()


@dataclass
class IdentifiedWord:
    """Идентифицированное слово"""

    # Слово
    word: str
    # Тип слова
    kind: WordKind


def _is_list_periods(word: str) -> bool:
    """Проверка явлеяется ли слово списком периодов.

    :param word: слово
    :return: явлеяется ли слово списком периодов
    """

    return bool(re.match(r'(\d{1,2},)*\d{1,2}н\.$', word))


def _is_from_to_periods(word: str) -> bool:
    """Проверка является ли слово периодами вида 'с по'.

    :param word: слово
    :return: является ли слово периодами вида 'с по'
    """

    return bool(re.search(r'\(с\s*\d+\s*по\s*\d+\)', word))


def _is_even_periods(word: str) -> bool:
    """Проверка является ли слово четными периодами.

    :param word: слово
    :return: является ли слово четными периодами
    """

    return word == 'четн.нед.'


def _is_odd_periods(word: str) -> bool:
    """Проверка является ли слово нечентыми периодами.

    :param word: слово
    :return: является ли слово нечетными периодами
    """

    return word == 'неч.нед.'


def _is_teacher_position(word: str) -> bool:
    """Проверка является ли слово должностью преподавателя.

    :param word: слово
    :return: является ли слово должностью преподавателя
    """

    return word in TeacherData.positions


def _is_teacher_initials(word: str) -> bool:
    """Проверка является ли слово преподавателем.

    :param word: слово
    :return: является ли слово преподавателем
    """

    return bool(re.match(r'[А-ЯЁ]\.[А-ЯЁ]\.', word))


def _is_subgroup(word: str) -> bool:
    """Проверка является ли слово подгруппой.

    :param word: слово
    :return: является ли слово подгруппой
    """

    return bool(re.match(r'\dпгр\.', word))


def _is_classroom(word: str) -> bool:
    """Проверка является ли слово аудиторией.

    :param word: слово
    :return: ялвляется ли слово аудиторией
    """

    return bool(re.match(r'[А-ЯЁ]\d{1,3}[а-яё]?$', word)) or \
        bool(re.match(r'\d{1,3}[А-ЯЁ]$', word)) or \
        bool(re.match(r'\d{3}[а-яё]?$', word)) or \
        bool(re.match(r'[А-ЯЁ]\d{3}[А-ЯЁ]$', word))


def _is_distance_learning(word: str) -> bool:
    """Проверка является ли слово дистанционной формой обучения.

    :param word: слово
    :return: является ли слово дистанционной формой обучения
    """

    return word == '(ДОТ)'


def _is_class_numbers(word: str) -> bool:
    """Проверка является ли слово номерами занятия.

    :param word: слово
    :return: является ли слово номером занятия
    """

    return bool(re.match(r'№з{(\d+,)*\d+}', word))


_work_kind_func_map = {
    WordKind.LIST_PERIODS: _is_list_periods,
    WordKind.FROM_TO_PERIODS: _is_from_to_periods,
    WordKind.EVEN_PERIODS: _is_even_periods,
    WordKind.ODD_PERIODS: _is_odd_periods,
    WordKind.TEACHER_POSITION: _is_teacher_position,
    WordKind.TEACHER_INITIALS: _is_teacher_initials,
    WordKind.SUBGROUP: _is_subgroup,
    WordKind.CLASSROOM: _is_classroom,
    WordKind.DISTANCE_LEARNING: _is_distance_learning,
    WordKind.CLASS_NUMBERS: _is_class_numbers
}


def _get_work_kind(word: str) -> WordKind:
    """Получение типа слова.

    :param word: слово
    :return: тип слова
    """

    for work_kind, func in _work_kind_func_map.items():
        if func(word):
            return work_kind
    return WordKind.UNKNOWN


def get_identified_words(words: list[str]) -> list[IdentifiedWord]:
    """Получение идентифицированных слов.

    :param words: список слов
    :return: список идентифицированных слов
    """

    identified_words: list[IdentifiedWord] = []
    for word in words:
        identified_words.append(IdentifiedWord(word, _get_work_kind(word)))
    i = 0
    while i < len(identified_words):
        identified_word = identified_words[i]
        if identified_word.kind is WordKind.TEACHER_POSITION:
            i += 1
            while i < len(identified_words) and identified_words[i].kind is WordKind.UNKNOWN:
                identified_words[i].kind = WordKind.TEACHER_LAST_NAME
                i += 1
        elif identified_word.kind is WordKind.UNKNOWN and identified_word.word[0].isupper():
            while i < len(identified_words) and identified_words[i].kind is WordKind.UNKNOWN:
                identified_words[i].kind = WordKind.DISCIPLINE_NAME
                i += 1
        else:
            i += 1
    for i, identified_word in enumerate(identified_words):
        if identified_word.kind is WordKind.UNKNOWN:
            if i + 1 < len(identified_words) and identified_words[i + 1].word[0].isupper():
                identified_word.kind = WordKind.WORK_KIND
            else:
                identified_word.kind = WordKind.DISCIPLINE_NAME
    return identified_words


__all__ = ['WordKind', 'IdentifiedWord', 'get_identified_words']
