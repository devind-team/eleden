"""Модуль для работы с неправильными элементами"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Optional, NamedTuple

from .data import TeamData, CoupleData


class WrongKind(Enum):
    """Тип неправильного элемента"""

    UNDISCOVERED = auto()
    MULTIPLE = auto()
    WRONG_DATA = auto()


class WrongItem(ABC):
    """Неправильный элемент"""

    def __init__(
            self,
            possible_values: Optional[list[str]] = None,
            kind: WrongKind = WrongKind.UNDISCOVERED,
            message: Optional[str] = None):
        self.possible_values: list[str] = possible_values if possible_values else []
        self.kind = kind
        self.message: str = message

    @abstractmethod
    def to_dict(self) -> dict[str, str]:
        """Приведение к словарю.

        :return: словарь
        """

        pass


class WrongTeamItem(WrongItem):
    """Неправильный элемент группы"""

    def __init__(self,
                 team_data: TeamData,
                 possible_values: Optional[list[str]] = None,
                 kind: WrongKind = WrongKind.UNDISCOVERED,
                 message: Optional[str] = None):
        super().__init__(possible_values, kind, message)
        self.team_data = team_data
        self.value = team_data.short_name

    def to_dict(self) -> dict[str, str]:
        message = {} if self.message is None else {'message': self.message}
        return {
            'id': self.team_data.id,
            'kind': self.kind.name.lower(),
            'value': self.value,
            'possible_values': self.possible_values,
            **message,
            **self.team_data.excel_info.to_dict()
        }


class WrongCoupleItem(WrongItem):
    """Неправильный элемент пары"""

    def __init__(self,
                 couple_data: CoupleData,
                 value: str,
                 possible_values: Optional[list[str]] = None,
                 kind: WrongKind = WrongKind.UNDISCOVERED,
                 message: Optional[str] = None):
        super().__init__(possible_values, kind, message)
        self.couple_data = couple_data
        self.value = value

    def to_dict(self) -> dict[str, str]:
        message = {} if self.message is None else {'message': self.message}
        return {
            'id': self.couple_data.id,
            'team_id': self.couple_data.team_data.id,
            'kind': self.kind.name.lower(),
            'value': self.value,
            'possible_values': self.possible_values,
            **message,
            **self.couple_data.excel_info.to_dict()
        }


@dataclass
class WrongItems:
    """Неправильные элементы"""

    # Неправильные группы
    teams: list[WrongTeamItem] = field(init=False, default_factory=list)
    # Неправильные типы работ
    work_kinds: list[WrongCoupleItem] = field(init=False, default_factory=list)
    # Неправильные периоды
    periods: list[WrongCoupleItem] = field(init=False, default_factory=list)
    # Неправильные преподаватели
    teachers: list[WrongCoupleItem] = field(init=False, default_factory=list)
    # Неправильные дисциплины
    disciplines: list[WrongCoupleItem] = field(init=False, default_factory=list)

    @property
    def has_wrong(self) -> bool:
        """Есть ли неправильные элементы"""

        return any((self.teams, self.work_kinds, self.periods, self.teachers, self.disciplines))

    def to_dict(self, path: Optional[str] = None) -> dict:
        """Приведение к словарю.

        :param path: путь к Excel файлу
        :return: словарь
        """

        def ui_to_dict(ui: WrongItem) -> dict[str, str]:
            return ui.to_dict()
        path_dict = {'path': path} if path else {}
        return {
            **path_dict,
            'teams': list(map(ui_to_dict, self.teams)),
            'work_kinds': list(map(ui_to_dict, self.work_kinds)),
            'periods': list(map(ui_to_dict, self.periods)),
            'teachers': list(map(ui_to_dict, self.teachers)),
            'disciplines': list(map(ui_to_dict, self.disciplines))
        }

    WrongDict = dict[str, list[WrongItem]]

    def add_from_wrong_dict(self, wrong: WrongDict) -> None:
        """Добавление из словаря.

        :param wrong: словарь неправильных элементов,
        в котором key - название свойства, а value - неправильные элементы
        """

        for key, wrongs in wrong.items():
            for wrong in wrongs:
                getattr(self, key).append(wrong)


class WrongItemsWrapper(NamedTuple):
    """Неправильные элементы с путем к файлу"""

    # Неправильные элементы
    wrong_items: WrongItems
    # Путь к файлу
    path: str
