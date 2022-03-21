"""Модуль с функциями, исправляющими строки в ячейках расписания"""
import re
from functools import reduce

from .data import TeacherData


def _fix_positions(value: str) -> str:
    """Исправление должностей: 'доцИванов' -> 'доц. Иванов'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    tmp_value = value.replace('ст. ', 'ст.')
    for position in TeacherData.positions:
        tmp_value = re.sub(position[0:-1] + r'\.?,?\s?([А-ЯЁ])', fr'{position} \1', tmp_value)
    return tmp_value


def _fix_initials(value: str) -> str:
    """Исправление инициалов: 'Петров П. П,Иванов И.И1,2,3 н.' -> 'Петров П.П. Иванов И.И. 1,2,3 н.'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    def initials_repl(match: re.Match) -> str:
        initials = f'{match.group(1)}.{match.group(2)}.'
        space = ' ' if any((match.group(3), match.group(4), match.group(5))) else ''
        digit = match.group(5) if match.group(5) else ''
        return initials + space + digit

    return re.sub(r'([А-ЯЁ])\.\s?([А-ЯЁ])\.?(,)?(\s)?(\d)?', initials_repl, value)


def _fix_subgroups(value: str) -> str:
    """Исправление подгрупп: '1 пгр' -> '1пгр.'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    return re.sub(r'(\d)\s?пгр\.?', r'\1пгр.', value)


def _fix_list_periods(value: str) -> str:
    """Исправление списка периодов: '1. 3, 5.7,9 н.' -> '1,3,5,7,9н.'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    tmp_value = re.sub(r'\sн(\s|$)', r' н.\1', value)
    periods = tmp_value.split('н.')
    for i in range(0, len(periods) - 1):
        periods[i] += 'н.'
        periods[i] = re.sub(r'(\d{1,2})[.,]\s?', r'\1,', periods[i])
        periods[i] = re.sub(r'((\d{1,2},)*)(\d{1,2})[.,]?\s?н\.', r'\1\3н.', periods[i])
        periods[i] = re.sub(r'н\.\s?([^$])', r'н. \1', periods[i])
    return ''.join(periods)


def _fix_from_to_periods(value: str) -> str:
    """Исправление списка периодов вида 'с по'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    return re.sub(r'\(?со?\s*(\d+)\s*по\s*(\d+)\s*(недел[ию]|недел.|нед.|н.)\)?', r'(с\1по\2)', value)


def _fix_class_numbers(value: str) -> str:
    """Исправление номеров занятия: '1.2 и 3 пары' -> '№з{1,2,3}'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    tmp_value = re.sub(
        r'(\s|^)((\d[.,]\s?)*)(\d)\s?и\s?(\d)\s?(п\.|пар[аы])',
        lambda match: f"{match.group(1)}№з{{{match.group(2).replace(' ', '')}{match.group(4)},{match.group(5)}}}",
        value
    )
    tmp_value = re.sub(
        r'(\s|^)((\d[.,]\s?)*)(\d)\s?(п\.|пар[аы])',
        lambda match: f"{match.group(1)}№з{{{match.group(2).replace(' ', '')}{match.group(4)}}}",
        tmp_value
    )
    return re.sub(r'(\s|^)(\d)\s?(п\.|пар[аы])', r'\1№з{\2}', tmp_value)


def _fix_classrooms(value: str) -> str:
    """Исправление аудиторий 'А 301' -> 'A301'; '301 А' -> '301А'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    def letter_digit_repl(match: re.Match) -> str:
        group4 = ', ' if match.group(4) == ',' else str(match.group(4) or '')
        return str(match.group(1) or '') + str(match.group(2) or '') + \
            str(match.group(3) or '') + group4

    def digit_letter_repl(match: re.Match) -> str:
        group3 = ', ' if match.group(3) == ',' else str(match.group(3) or '')
        return str(match.group(1) or '') + str(match.group(2) or '') + group3

    tmp_value = re.sub(r'([А-ЯЁ])\s?(\d{1,3})\s?([а-яё])?(\s|,\s?|$)', letter_digit_repl, value)
    tmp_value = re.sub(r'(\d{1,3})\s?([А-ЯЁ])(\s|,\s?|$)', digit_letter_repl, tmp_value)
    tmp_value = re.sub(r'(\d{3}[а-яё]?),\s?', r'\1, ', tmp_value)
    return re.sub(r',\s', ' ', tmp_value)


def _fix_distance_learning(value: str) -> str:
    """Исправление дистанционного обучения: 'ДОТ' -> '(ДОТ)'; '( ДОТ )' -> '(ДОТ)'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    return re.sub(r'\(?\s*ДОТ\s*\)?', '(ДОТ)', value)


def _fix_even_periods(value: str) -> str:
    """Исправление четных периодов: 'по четн. нед.' -> 'четн.нед.'.

    :param value: строка для исправления
    :return: исправленная строка
    """

    return re.sub(r',?\s?по\s?чет?н?ы?м?\.\s?н(ед)?\.', ' четн.нед.', value)


def _fix_odd_periods(value: str) -> str:
    """Исправление нечетных периодов: 'по неч. нед.' ->  'неч.нед.'

    :param value: строка для исправления
    :return: исравленная строка
    """

    return re.sub(r',?\s?по\s?нече?т?н?ы?м?\.\s?н(ед)?\.', ' неч.нед.', value)


_fix_functions = [
    _fix_positions,
    _fix_initials,
    _fix_subgroups,
    _fix_list_periods,
    _fix_from_to_periods,
    _fix_class_numbers,
    _fix_classrooms,
    _fix_distance_learning,
    _fix_even_periods,
    _fix_odd_periods
]


def fix_main_string(value: str) -> str:
    """Исправление строки основной ячейки для последующего парсинга.

    :param value: стандартная строка ячейки
    :return: исправленная строка основной ячейки
    """

    return reduce(lambda acc, func: func(acc), _fix_functions, re.sub(r'\s+', ' ', value.strip()))


def fix_classrooms_string(value: str) -> str:
    """Исправление строки ячейки с аудиториями для последующего парсинга.

    :param value: ячейка с аудиториями
    :return: исправленая строка ячейки с аудиториями
    """

    return _fix_classrooms(value)


__all__ = ['fix_main_string', 'fix_classrooms_string']
