import os
from os import path

from django.conf import settings
from django.core.management.base import BaseCommand
from progress.bar import IncrementalBar

from apps.eleden.models import EduForm, \
    EduService, \
    EduProgram, \
    Direction, \
    DisciplineKind, \
    DisciplineView, \
    Team, \
    Discipline, \
    WorkForm, \
    WorkKind, \
    HoursKind, \
    EduHours, \
    BlockKind, \
    EduCycle, \
    Competence
from devind_helpers.utils import convert_str_to_bool


class Command(BaseCommand):
    """Парсинг .plx файлов из папки plx и запись моделей в БД."""

    @staticmethod
    def clear() -> None:
        """Очищение моделей при добавлении аргумента --clear."""

        EduForm.objects.all().delete()
        EduService.objects.all().delete()
        EduProgram.objects.all().delete()
        Direction.objects.all().delete()
        DisciplineKind.objects.all().delete()
        DisciplineView.objects.all().delete()
        Team.objects.all().delete()
        Discipline.objects.all().delete()
        WorkForm.objects.all().delete()
        WorkKind.objects.all().delete()
        HoursKind.objects.all().delete()
        EduHours.objects.all().delete()
        BlockKind.objects.all().delete()
        EduCycle.objects.all().delete()
        Competence.objects.all().delete()

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            '--clear',
            default=False,
            help='Очищать модели или нет'
        )
        parser.add_argument(
            '--ignore_teams',
            type=convert_str_to_bool,
            default=settings.DEBUG,
            help='Игнорировать ненайденные кафедры в дисциплинах или нет'
        )

    def handle(self, *args, **options) -> None:
        if options['clear']:
            self.clear()
        plx_directory = path.join(settings.BASE_DIR, 'apps', 'eleden', 'management', 'plx')
        file_names = os.listdir(plx_directory)
        bar = IncrementalBar('EduProgram', max=len(file_names))
        for file_name in file_names:
            bar.message = file_name
            bar.next()
            file_path = path.join(plx_directory, file_name)
            EduProgram.from_plx(source=file_path, ignore_teams=options['ignore_teams'])
        bar.finish()
