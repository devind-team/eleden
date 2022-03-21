from datetime import datetime
from os import mkdir
from os.path import basename, splitext, exists, relpath, join
from pathlib import PurePath
from shutil import copyfile
from typing import Union, Optional, Callable

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q

from apps.core.models import User
from apps.eleden.models import Team, FileKind, PortfolioFile
from devind_core.models import File
from devind_helpers.unpack_zip import UnpackZip
from devind_helpers.utils import random_string


def create_file_kind(name: str, accept: str) -> FileKind:
    """Создание типа загружаемых файлов в портфолио.

    :param name: наименование цели загрузки файла
    :param accept: допустимый формат загрузки файлов
    :return: тип загружаемых файлов в портфолио
    """

    return FileKind.objects.create(name, accept=accept)


def change_file_kind(file_kind: FileKind, name: str, accept: str) -> None:
    """Изменение типа загружаемых файлов в портфолио.

    :param file_kind: тип загружаемых файлов в портфолио
    :param name: наименование цели загрузки файла
    :param accept: допустимый формат загрузки файлов
    """

    file_kind.name = name
    file_kind.accept = accept
    file_kind.save(update_fields=('name', 'accept',))


def create_portfolio_file(
        user: User,
        describe: str,
        kind_id: str,
        file: InMemoryUploadedFile,
        discipline_id: str,
        confirm_user: Optional[User]) -> PortfolioFile:
    """Создание файла портфолио.

    :param user: пользователь
    :param describe: описание файла в портфолио
    :param kind_id: идентификатор типа файла из портфолио
    :param file: архивный файл
    :param discipline_id: идентификатор дисциплины
    :param confirm_user: пользователь, который подтверждает правильность файла, занесенного в портфолио
    """

    return PortfolioFile.objects.create(
        describe=describe,
        file=File.objects.create(name=describe, src=file, user=user),
        kind_id=kind_id,
        discipline_id=discipline_id,
        user=confirm_user
    )


class AddPortfolioFiles:
    """Добавление файлов в портфолио"""

    class AddPortfolioFilesException(Exception):
        """Ошибка добавления файла в портфолио"""

        def __init__(self, message: str):
            self.message = message

    class WrongFileFormatException(AddPortfolioFilesException):
        """Неверный формат файла"""

        pass

    class UserNotFoundException(AddPortfolioFilesException):
        """Пользователь не найден"""

        pass

    def __init__(
            self,
            team: Team,
            describe: str,
            kind_id: Union[int, str],
            file: InMemoryUploadedFile,
            discipline_id: Union[int, str],
            confirm_user: Optional[User]):
        """Конструктор добавления файлов в портфолио.

        :param team: группа пользователей
        :param describe: описание файла в портфолио
        :param kind_id: идентификатор типа файла из портфолио
        :param file: архивный файл
        :param discipline_id: идентификатор дисциплины
        :param confirm_user: пользователь, который подтверждает правильность файла, занесенного в портфолио
        """

        self._team = team
        self._describe = describe
        self._kind_id = kind_id
        self._file = file
        self._discipline_id = discipline_id
        self._confirm_user = confirm_user
        self._uz: Optional[UnpackZip] = None
        self._user_files: dict[str, User] = {}
        self.portfolio_files: list[PortfolioFile] = []

    def match_user_and_files(self, callback: Callable[[User], None]) -> None:
        """Соотнесение файлов и пользователей

        :callback: обратный вызов для проверки разрешений
        """

        self._uz = UnpackZip(self._file)
        for file_path in self._uz():
            file_name = basename(file_path)
            fn, _ = splitext(file_name)
            params = fn.split('_')
            try:
                if len(params) == 1:
                    user = self._team.users.get(Q(email=params[0]) | Q(username=params[0]))
                elif len(params) == 3:
                    user = self._team.users.get(last_name=params[0], first_name=params[1], sir_name=params[2])
                else:
                    raise self.WrongFileFormatException(f'Неверный формат файла "{file_name}"')
            except User.DoesNotExist:
                raise self.UserNotFoundException(f'Пользователь не найден "{fn}"')
            callback(user)
            self._user_files[file_path] = user

    def create_portfolio_files(self) -> None:
        """Создание файлов портфолио."""

        for file_path, user in self._user_files.items():
            fn, fe = splitext(basename(file_path))
            file_name = ''.join((random_string(5), '_', datetime.now().strftime('%d%m%Y%H%M'), fe))
            user_dir: str = join(settings.USERS_DIR, str(user.pk))
            if not exists(user_dir):
                mkdir(user_dir)
            user_fp = join(user_dir, file_name)
            copyfile(file_path, user_fp)
            self.portfolio_files.append(PortfolioFile.objects.create(
                describe=self._describe,
                file=File.objects.create(
                    name=fn,
                    src=PurePath(relpath(user_fp, settings.BASE_DIR)).as_posix(),
                    user=user
                ),
                kind_id=self._kind_id,
                discipline_id=self._discipline_id,
                user=self._confirm_user
            ))


def confirm_portfolio_file(portfolio_file: PortfolioFile, user: User) -> None:
    """Подтверждение файла портфолио.

    :param portfolio_file: файл в портфолио
    :param user: пользователь, который подтверждает правильность файла, занесенного в портфолио
    """

    portfolio_file.user = user
    portfolio_file.save(update_fields=('user',))
