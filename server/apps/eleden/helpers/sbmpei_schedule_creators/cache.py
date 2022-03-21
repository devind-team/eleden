"""Модуль с кешем для сохранения распарсенных данных в файл"""
import pickle
from typing import Optional

from .data import TeamData


class Cache:
    """Кеш"""

    def __init__(self, teams: Optional[list[TeamData]] = None):
        self.teams: list[TeamData] = teams if teams else []

    def store(self, path: str) -> None:
        """Сохранение данных в файл.

        :param path: путь к файлу
        """

        with open(path, 'wb') as f:
            pickle.dump(self, f)

    @staticmethod
    def restore(path: str) -> 'Cache':
        """Восстановление данных.

        :param path: путь к файлу
        :return: восстановленный кеш
        """

        with open(path, 'rb') as f:
            return pickle.load(f)

    def __or__(self, other):
        if not isinstance(other, Cache):
            raise TypeError(f'{type(other)} не является экземляром класса {Cache.__name__}')
        return Cache([*self.teams, *other.teams])
