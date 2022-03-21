import json
import os
from os import path
from typing import Optional, Any, NamedTuple

from django.conf import settings
from django.core.management.base import BaseCommand
from progress.bar import IncrementalBar

from apps.eleden.helpers.sbmpei_schedule_creators import Cache, \
    ExcelExtractor, \
    CacheExtractor, \
    ExtractorException, \
    NamesMap, \
    WrongItemsWrapper, \
    clear, \
    save


class Command(BaseCommand):
    """Создание расписания формата CФ МЭИ (Excel)."""

    class _Settings(NamedTuple):
        """Настройки комманды"""

        # Очищать модели или нет
        clear: bool
        # Сохранять модели или нет
        save: bool
        # Игнорировать ошибки при сохранении
        ignore_save_errors: bool
        # Сохранять только курсы-результаты
        result_only: bool
        # Загружать расписания по пути
        load_path: str
        # Фильтр групп
        teams_filter: Optional[dict[str, any]]
        # Сохранять неправильные группы или нет
        save_wrong_teams: bool
        # Сохранить неправильные элементы по пути
        save_wrong_path: Optional[str]
        # Сохранить отображение имен по путям
        save_names_map_paths: list[str]
        # Загрузить отображение имен по пути
        load_names_map_path: Optional[str]
        # Сохранить кеш по пути
        save_cache_path: Optional[str]
        # Загрузить кеш по пути
        load_cache_path: Optional[str]

    def __init__(self):
        super().__init__()
        self.settings: Optional[Command._Settings] = None

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            '-c',
            '--clear',
            action='store_true',
            help='Очищать модели или нет'
        )
        parser.add_argument(
            '-s',
            '--save',
            action='store_true',
            help='Сохранять модели или нет'
        )
        parser.add_argument(
            '-ise',
            '--ignore_save_errors',
            action='store_true',
            help='Игнорировать ошибки при сохранении или нет'
        )
        parser.add_argument(
            '-ro',
            '--result_only',
            action='store_true',
            help='Сохранять только курсы-результаты'
        )
        parser.add_argument(
            '-lp',
            '--load_path',
            help='Загружать расписания по пути'
        )
        parser.add_argument(
            '-tf',
            '--teams_filter',
            help='Фильтр групп'
        )
        parser.add_argument(
            '-swt',
            '--save_wrong_teams',
            action='store_true',
            help='Сохранять неправильные группы или нет'
        )
        parser.add_argument(
            '-swp',
            '--save_wrong_path',
            help='Сохранить неправильные элементы по пути'
        )
        parser.add_argument(
            '-snmp',
            '--save_names_map_paths',
            action='extend',
            nargs='*',
            help='Сохранить отображение имен по путям'
        ),
        parser.add_argument(
            '-lnmp',
            '--load_names_map_path',
            help='Загрузить отображение имен по пути'
        )
        parser.add_argument(
            '-scp',
            '--save_cache_path',
            help='Сохранить кеш по пути'
        )
        parser.add_argument(
            '-lcp',
            '--load_cache_path',
            help='Загрузить кеш по пути'
        )

    def handle(self, *args, **options) -> None:
        self.settings = self._Settings(
            clear=options['clear'],
            save=options['save'],
            ignore_save_errors=options['ignore_save_errors'],
            result_only=options['result_only'],
            load_path=self.get_load_path(options),
            teams_filter=json.loads(options['teams_filter']) if options['teams_filter'] else None,
            save_wrong_teams=options['save_wrong_teams'],
            save_wrong_path=self.get_save_wrong_path(options),
            save_names_map_paths=self.get_save_names_map_paths(options),
            load_names_map_path=options['load_names_map_path'],
            save_cache_path=self.get_save_cache_path(options),
            load_cache_path=options['load_cache_path']
        )
        names_map = self.get_names_map(self.settings.load_names_map_path)
        if self.settings.clear:
            self.clear()
        if self.settings.load_cache_path:
            self.create_from_cache(names_map)
        else:
            self.create_from_excel(names_map)

    save_directory = path.join(settings.BASE_DIR, 'storage', 'create_sbmpei_schedule', 'results')

    def create_from_excel(self, names_map: NamesMap) -> None:
        """Создание расписания из Excel.

        :param names_map: отображение имен
        """

        file_paths = self.get_file_paths(self.settings.load_path)
        bar = IncrementalBar('Schedules', max=len(file_paths))
        wrong_items_wrappers: list[WrongItemsWrapper] = []
        cache: Cache = Cache()
        for file_path in file_paths:
            short_file_path = path.relpath(file_path, self.settings.load_path)
            bar.message = short_file_path
            bar.next()
            try:
                creator = ExcelExtractor(
                    file_path,
                    self.get_semester_number(file_path),
                    names_map,
                    self.settings.teams_filter,
                    self.settings.save_wrong_teams
                )
                cache = cache | creator.cache
                wrong_items_wrappers.append(WrongItemsWrapper(creator.wrong_items, short_file_path))
                if self.settings.save:
                    save(creator.teams_model_data, self.settings.ignore_save_errors, self.settings.result_only)
            except ExtractorException as parser_exception:
                parser_exception.path = file_path
                raise parser_exception
        if self.settings.save_wrong_path:
            self.save_wrong_items(wrong_items_wrappers)
        if self.settings.save_cache_path:
            cache.store(self.settings.save_cache_path)
        self.save_names_map(wrong_items_wrappers)

    def create_from_cache(self, names_map: NamesMap) -> None:
        """Создание расписания из кеша.

        :param names_map: отображение имен
        """

        creator = CacheExtractor(Cache.restore(self.settings.load_cache_path), names_map, self.settings.teams_filter)
        if self.settings.save:
            save(creator.teams_model_data, self.settings.ignore_save_errors, self.settings.result_only)
        wrong_items_wrappers = [WrongItemsWrapper(creator.wrong_items, 'cache')]
        if self.settings.save_wrong_path:
            self.save_wrong_items(wrong_items_wrappers)
        if self.settings.save_cache_path:
            creator.cache.store(self.settings.save_cache_path)
        self.save_names_map(wrong_items_wrappers)

    def save_wrong_items(self, wrong_items_wrappers: list[WrongItemsWrapper]) -> None:
        """Сохранение неправильных элементов.

        :param wrong_items_wrappers: список неправильных элементов
        """

        wrong: list[dict] = []
        for wrong_items, file_path in wrong_items_wrappers:
            if wrong_items.has_wrong:
                wrong.append(wrong_items.to_dict(file_path))
        with open(self.settings.save_wrong_path, 'w', encoding='utf8') as ud_file:
            json.dump(wrong, ud_file, ensure_ascii=False, indent=2)

    def save_names_map(self, wrong_items_wrappers: list[WrongItemsWrapper]) -> None:
        """Сохранение отображения имен.

        :param wrong_items_wrappers: список неправильных элементов с путями к файлам
        """

        for save_path in self.settings.save_names_map_paths:
            _, ext = path.splitext(save_path)
            if ext == '.json':
                NamesMap.save_empty_to_json(wrong_items_wrappers, save_path)
            if ext == '.xlsx':
                NamesMap.save_empty_to_xlsx(wrong_items_wrappers, save_path)

    @staticmethod
    def get_semester_number(file_path: str) -> int:
        """Получение номера семестра из пути к файлу.

        :param file_path: путь к файлу
        :return: номер семестра
        """

        if 'осень' in file_path:
            return 1
        if 'весна' in file_path:
            return 2
        raise ValueError(f'Невозможно определить номер семестра по пути к файлу "{file_path}"')

    @classmethod
    def make_save_directory(cls) -> None:
        """Создание директории, если она не существует."""

        if not path.exists(cls.save_directory):
            os.mkdir(cls.save_directory)

    @staticmethod
    def get_load_path(options: dict[str, Any]) -> str:
        """Получение пути, по которому необходимо загружать расписания.

        :param options: словарь аргументов
        :return: путь, по которому необходимо загружать расписания
        """

        if options['load_path']:
            return options['load_path']
        return path.join(settings.BASE_DIR, 'storage', 'create_sbmpei_schedule', 'schedules')

    @classmethod
    def get_save_wrong_path(cls, options: dict[str, Any]) -> Optional[str]:
        """Получение пути, по которому нужно сохранять неправильные элементы.

        :param options: словарь аргументов
        :return: путь, по которому нужно сохранять неправильные элементы
        """

        if options['save_wrong_path']:
            return options['save_wrong_path']
        if settings.DEBUG:
            cls.make_save_directory()
            return path.join(cls.save_directory, 'wrong.json')

    @classmethod
    def get_save_names_map_paths(cls, options: dict[str, Any]) -> list[str]:
        """Получение путей, по которым нужно сохранять пустой шаблон отображения имен.

        :param options: словарь аргументов
        :return: список путей, по которым нужно сохранять пустой шаблон отображения имен
        """

        if options['save_names_map_paths']:
            return options['save_names_map_paths']
        if settings.DEBUG:
            cls.make_save_directory()
            return [path.join(cls.save_directory, 'template.json'), path.join(cls.save_directory, 'template.xlsx')]
        return []

    @classmethod
    def get_save_cache_path(cls, options: dict[str, Any]) -> Optional[str]:
        """Получение пути, по которому нужно сохранять кеш.

        :param options: словарь аргументов
        :return: путь, по которому нужно сохранять кеш
        """

        if options['save_cache_path']:
            return options['save_cache_path']
        if settings.DEBUG:
            cls.make_save_directory()
            return path.join(cls.save_directory, 'cache')

    @staticmethod
    def clear() -> None:
        """Очищение моделей при добавлении аргумента --clear."""

        clear()

    @staticmethod
    def get_names_map(names_map_path: Optional[str]) -> NamesMap:
        """Получение отображения имен.

        :param names_map_path: путь к файлу отображения имен
        :return: отображение имен
        """

        if not names_map_path:
            return NamesMap()
        _, ext = path.splitext(names_map_path)
        if ext == '.json':
            return NamesMap.load_from_json(names_map_path)
        if ext == '.xlsx':
            return NamesMap.load_from_xlsx(names_map_path)

    @staticmethod
    def get_file_paths(directory: str) -> list[str]:
        """Получение путей ко всем файлам директории.

        :param directory: директория
        :return: пути ко всем файлам директории
        """

        file_paths: list[str] = []
        for root, _, files in os.walk(directory):
            for name in files:
                file_paths.append(path.join(root, name))
        return file_paths
