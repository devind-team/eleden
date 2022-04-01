from datetime import datetime
from os.path import basename, splitext, join, normpath, relpath
from pathlib import PurePath
from shutil import copyfile
from typing import Any, List, Dict, NamedTuple, Optional

import graphene
from django.conf import settings
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.eleden.helpers import EduProgramUnload
from apps.eleden.models.education import EduProgram, \
    DisciplineKind, \
    DisciplineView, \
    Discipline, \
    MethodologicalSupport, \
    Competence, \
    EduHours, \
    Direction
from apps.eleden.permissions import AddEduProgram, \
    ChangeEduProgram, \
    DeleteEduProgram, \
    AddDiscipline, \
    ChangeDiscipline, \
    DeleteDiscipline, \
    AddMethodologicalSupport, \
    ChangeMethodologicalSupport, \
    DeleteMethodologicalSupport, \
    AddCompetence, \
    DeleteCompetence, \
    AddEduHours, \
    DeleteEduHours
from apps.eleden.schema.types import EduProgramType, \
    DisciplineType, \
    MethodologicalSupportType, \
    MethodologicalSupportInputType, \
    CompetenceType, \
    EduHoursType
from apps.eleden.validators import EduProgramChangeValidator, \
    DisciplineValidator, \
    DisciplineChangeValidator, \
    MethodologicalSupportValidator
from apps.eleden.validators import EduProgramValidator
from devind_core.models import File
from devind_helpers.schema.types import ErrorFieldType, RowFieldErrorType, TableType
from devind_helpers.decorators import permission_classes
from devind_helpers.import_from_file import ImportFromFile
from devind_helpers.orm_utils import get_object_or_none
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation
from devind_helpers.unpack_zip import UnpackZip
from devind_helpers.utils import random_string


class AddEduProgramMutation(BaseMutation):
    """Добавление образовательной программы."""

    class Input:
        name = graphene.String(required=True, description='Профиль подготовки')
        adaptive = graphene.Boolean(required=True, description='Признак адапативности программ')
        admission = graphene.Int(required=True, description='Год поступления')
        expedited = graphene.Boolean(required=True, description='Ускоренная программа')
        edu_form_id = graphene.Int(required=True, description='Идентификатор формы обучения')
        direction_id = graphene.ID(required=True, description='Идентификатор направления подготовки')
        description = Upload(description='Описание')
        syllabus = Upload(description='Учебный план')
        calendar = Upload(description='Календарный учебный график')
        edu_program_id = graphene.ID(
            description='Индентификатор образовательной программы, откуда необходимо копировать дисциплины'
        )

    edu_program = graphene.Field(EduProgramType, description='Новая образовательная программа')

    @staticmethod
    @permission_classes([IsAuthenticated, AddEduProgram])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        kwargs = EduProgram.resolve_global(kwargs)
        donor_id = kwargs.pop('edu_program_id', None)
        validator: EduProgramValidator = EduProgramValidator(
            {k: v for k, v in kwargs.items() if k not in ['description', 'syllabus', 'calendar']}
        )
        if validator.validate():
            edu_program = EduProgram.objects.create(**kwargs)
            if donor_id is not None:
                donor: EduProgram = EduProgram.objects.get(pk=from_global_id(donor_id)[1])
                disciplines_with_pks = []
                for discipline in donor.discipline_set.all():
                    methodological_support_set = discipline.methodologicalsupport_set.all()
                    pk = discipline.pk
                    parent_pk = None if discipline.parent is None else discipline.parent.pk
                    discipline.pk = None
                    discipline.edu_program = edu_program
                    discipline.save()
                    for methodological_support in methodological_support_set:
                        methodological_support.pk = None
                        methodological_support.discipline = discipline
                        methodological_support.save()
                    disciplines_with_pks.append((discipline, pk, parent_pk))
                for discipline, pk, parent_pk in disciplines_with_pks:
                    if parent_pk:
                        discipline.parent = next(
                            (d_with_pks[0] for d_with_pks in disciplines_with_pks if d_with_pks[1] == parent_pk)
                        )
                        discipline.save(update_fields=['parent'])
            return AddEduProgramMutation(edu_program=edu_program)
        else:
            return AddEduProgramMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))


class AddEduProgramFromPlxMutation(BaseMutation):
    """Добавление образовательной программы из файла plx."""

    class Input:
        file = Upload(required=True, description='Файл plx')

    edu_program = graphene.Field(EduProgramType, description='Новая образовательная программа')

    @staticmethod
    @permission_classes([IsAuthenticated, AddEduProgram])
    def mutate_and_get_payload(root, info: ResolveInfo, file: InMemoryUploadedFile, **kwargs):
        return AddEduProgramFromPlxMutation(edu_program=EduProgram.from_plx(file=file))


class AddEduProgramsMutation(BaseMutation):
    """Добавление образовательных программ."""

    class Input:
        file = Upload(required=True, description='Источник данных: файл xlsx, csv, json')

    errors = graphene.List(RowFieldErrorType, required=True, description='Ошибки валидации')
    table = graphene.Field(TableType, description='Валидируемый документ')
    edu_programs = graphene.List(EduProgramType, description='Новые образовательные программы')

    @staticmethod
    @permission_classes([IsAuthenticated, AddEduProgram])
    def mutate_and_get_payload(root, info: ResolveInfo, file: InMemoryUploadedFile):
        f: File = File.objects.create(name=file.name, src=file, user=info.context.user, deleted=True)  # Файл скрыт
        iff: ImportFromFile = ImportFromFile(EduProgram, f.src.path, EduProgramValidator)
        for item in iff.items:
            item['direction'] = Direction.objects.filter(code=item['direction']).first()
        success, errors = iff.validate()
        return AddEduProgramsMutation(errors=[], edu_programs=iff.run()) if success else AddEduProgramsMutation(
            success=False,
            errors=[RowFieldErrorType(row=row, errors=ErrorFieldType.from_validator(error)) for row, error in errors],
            table=TableType.from_iff(iff)
        )


class ChangeEduProgramMutation(BaseMutation):
    """Изменение образовательной программы."""

    class Input:
        edu_program_id = graphene.ID(required=True, description='Идентификатор образовательной программы')
        delete_description = graphene.Boolean(required=True, description='Удалять ли описание')
        delete_syllabus = graphene.Boolean(required=True, description='Удалять ли учебный план')
        delete_calendar = graphene.Boolean(required=True, description='Удалять ли календарный учебный график')
        name = graphene.String(description='Профиль подготовки')
        adaptive = graphene.Boolean(description='Признак адапативности программ')
        admission = graphene.Int(description='Год поступления')
        expedited = graphene.Boolean(description='Ускоренная программа')
        description = Upload(description='Описание')
        syllabus = Upload(description='Учебный план')
        calendar = Upload(description='Календарный учебный график')
        edu_form_id = graphene.Int(description='Идентификатор формы обучения')
        direction_id = graphene.ID(description='Идентификатор направления подготовки')

    edu_program = graphene.Field(EduProgramType, description='Измененая образовательная программа')

    @staticmethod
    @permission_classes([IsAuthenticated, ChangeEduProgram])
    def mutate_and_get_payload(root, info: ResolveInfo, edu_program_id, **kwargs):
        pk: int = from_global_id(edu_program_id)[1]
        kwargs = EduProgram.resolve_global(kwargs)
        edu_program: EduProgram = EduProgram.objects.get(pk=pk)
        validator: EduProgramChangeValidator = EduProgramChangeValidator(
            {k: v for k, v in kwargs.items() if k not in ['description', 'syllabus', 'calendar']}
        )
        if validator.validate():
            delete_description = kwargs.pop('delete_description')
            delete_syllabus = kwargs.pop('delete_syllabus')
            delete_calendar = kwargs.pop('delete_calendar')
            for k, v in kwargs.items():
                setattr(edu_program, k, v)
            update_fields = list(kwargs.keys())
            if delete_description:
                edu_program.description = None
                update_fields.append('description')
            if delete_syllabus:
                edu_program.syllabus = None
                update_fields.append('syllabus')
            if delete_calendar:
                edu_program.calendar = None
                update_fields.append('calendar')
            edu_program.save(update_fields=[*update_fields, 'updated_at'])
            return ChangeEduProgramMutation(edu_program=edu_program)
        else:
            return ChangeEduProgramMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class UnloadEduProgramsMutation(BaseMutation):
    """Выгрузка данных в различных форматах."""
    class Input:
        extension = graphene.String(required=True, description='Формат выгрузки: html, xlsx')

    src = graphene.String(description='Ссылка на сгенерированный файл')

    @staticmethod
    @permission_classes([IsAuthenticated])
    def mutate_and_get_payload(root, info: ResolveInfo, extension: str, *args, **kwargs):
        edu_programs = EduProgram.objects\
            .values(
                'id',
                'name',
                'adaptive',
                'admission',
                'description',
                'syllabus',
                'calendar',
                'direction__code',
                'direction__edu_service__name',
                'edu_form__name')\
            .order_by('direction__code', 'direction__edu_service__name', 'admission')
        epu: EduProgramUnload = EduProgramUnload(edu_programs, 'https://eleden.sbmpei.ru/', '15.10.2021')
        src: str = epu.html() if extension == 'html' else epu.excel()
        return UnloadEduProgramsMutation(src=src)


class DeleteEduProgramMutation(BaseMutation):
    """Удаление образовательной программы."""

    class Input:
        edu_program_id = graphene.ID(required=True, description='Идентификатор образовательной программы')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteEduProgram])
    def mutate_and_get_payload(root, info: ResolveInfo, edu_program_id):
        edu_program_id = from_global_id(edu_program_id)[1]
        count_delete, _ = EduProgram.objects.filter(pk=edu_program_id).delete()
        return DeleteEduProgramMutation(success=count_delete > 0)


class AddDisciplineMutation(BaseMutation):
    """Добавление дисциплины."""

    class Input:
        code = graphene.String(required=True, description='Код дисциплины')
        name = graphene.String(required=True, description='Название дисциплины')
        edu_program_id = graphene.ID(required=True, description='Идентификатор учебной программы')
        user_ids = graphene.List(graphene.NonNull(graphene.ID), required=True, description='Идентификаторы авторов')
        view_id = graphene.ID(description='Форма представления дисциплины')
        parent_id = graphene.ID(description='Родительская дисциплина')
        annotation = Upload(description='Аннотация к рабочей программе дисциплины/практики/ГИА')
        work_program = Upload(description='Рабочая программа дисциплины')
        methodological_support = graphene.List(
            MethodologicalSupportInputType,
            description='Методическое обеспечение дисциплины'
        )

    discipline = graphene.Field(DisciplineType, description='Новая дисциплина')

    @staticmethod
    @permission_classes([IsAuthenticated, AddDiscipline])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        kwargs = Discipline.resolve_global(kwargs)
        discipline_annotation: InMemoryUploadedFile = kwargs.pop('annotation', None)
        discipline_work_program: InMemoryUploadedFile = kwargs.pop('work_program', None)
        methodological_support: List[MethodologicalSupportInputType] = kwargs.pop('methodological_support', [])
        user_ids: list[str] = kwargs.pop('user_ids')
        validator = DisciplineValidator(kwargs)
        if validator.validate():
            try:
                with transaction.atomic():
                    kind = DisciplineKind.objects.get(name='Дисциплины')
                    if kwargs['view_id'] is None:
                        kwargs['view_id'] = DisciplineView.objects.first().pk
                    discipline = Discipline.objects.create(
                        **kwargs,
                        annotation=discipline_annotation,
                        work_program=discipline_work_program,
                        kind=kind
                    )
                    discipline.users.set(map(lambda user_id: from_global_id(user_id)[1], user_ids))
                    for file in methodological_support:
                        file_validator = MethodologicalSupportValidator({'name': file.name})
                        if file_validator.validate():
                            MethodologicalSupport.objects.create(discipline=discipline, name=file.name, src=file.src)
                        else:
                            raise ValidationError(file_validator.get_message())
            except ValidationError:
                return AddDisciplineMutation(
                    success=False,
                    errors=ErrorFieldType.from_validator(file_validator.get_message())
                )
            return AddDisciplineMutation(discipline=discipline)
        else:
            return AddDisciplineMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))


class AddDisciplinesFilesMutation(BaseMutation):
    """Добавление файлов дисциплин (аннотаций и рабочих программ)

    Примеры названий файлов в архиве:
    анн_13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf;
    13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf.
    Если дисциплина существует, то к ней прикрепится файл, иначе ошибка.
    """

    class Input:
        edu_program_id = graphene.ID(required=True, description='Идентификатор учебной программы')
        file = Upload(reqired=True, description='Архивный файл')

    disciplines = graphene.List(graphene.NonNull(DisciplineType), description='Измененные дисциплины')

    class FileNameParams(NamedTuple):
        """Параметры имени файла из архива."""

        direction_code: str        # Код направления: 13.03.02
        direction_short_name: str  # Короткое название направления подготовки: ЭЭ
        profile_short_name: str    # Короткое название профиля подготовки: РЭМС
        discipline_code: str       # Код дисциплины: Б1.В.07
        discipline_name: str       # Название дисциплины: Теория автоматического управления
        edu_form_short_name: str   # Короткое название формы обучения: о
        admission: int             # Год поступления: 2019

    @staticmethod
    def get_file_name_params(params_list: List[str]) -> FileNameParams:
        """Получение параметров имени файла из списка.

        :param params_list: список параметров
        :return: параметры имени файла
        """

        return AddDisciplinesFilesMutation.FileNameParams(
            direction_code=params_list[0],
            direction_short_name=params_list[1],
            profile_short_name=params_list[2],
            discipline_code=params_list[3],
            discipline_name=params_list[4],
            edu_form_short_name=params_list[5],
            admission=int(params_list[6])
        )

    @staticmethod
    def check_params_list(file_name: str, params_list: List[str], is_annotation: bool) -> None:
        """Проверка списка параметров

        :param file_name: имя файла
        :param params_list: список параметров
        :param is_annotation: является ли файл аннотацией
        """

        valid_params_len = len(AddDisciplinesFilesMutation.FileNameParams._fields) + 1 \
            if is_annotation \
            else len(AddDisciplinesFilesMutation.FileNameParams._fields)
        name = 'аннотации' if is_annotation else 'рабочей программы'
        if len(params_list) != valid_params_len:
            raise ValidationError({
                'param_list_len': [f'Неверное число параметров в имени файла {name} "{file_name}". '
                                   f'Ожидалось {valid_params_len}, получено {len(params_list)}']
            })
        if not params_list[-1].isdigit():
            raise ValidationError({
                'param_list': [f'Неверный год поступления в имени файла {name} "{file_name}". '
                               f'Ожидался год, получено {params_list[-1]}']
            })

    @staticmethod
    def check_file_name_params(edu_program: EduProgram, file_name: str, file_name_params: FileNameParams) -> None:
        """Проверка параметров имени файла.

        :param edu_program: учебная программа
        :param file_name: имя файла
        :param file_name_params: параметры имени файла
        """

        if edu_program.direction.code != file_name_params.direction_code:
            raise ValidationError({
                'direction_code': [f'Неверный код направления в имени файла "{file_name}"']
            })
        if edu_program.admission != file_name_params.admission:
            raise ValidationError({
                'admission': [f'Неверный год поступления в имени файла "{file_name}"']
            })

    @staticmethod
    @permission_classes([IsAuthenticated, AddDiscipline])
    def mutate_and_get_payload(
            root,
            info: ResolveInfo,
            edu_program_id: str,
            file: InMemoryUploadedFile,
            *args,
            **kwargs):
        edu_program: EduProgram = EduProgram.objects.get(pk=from_global_id(edu_program_id)[1])
        try:
            uz: UnpackZip = UnpackZip(file)
        except ValidationError as validation_error:
            return AddDisciplinesFilesMutation(
                success=False,
                errors=ErrorFieldType.from_messages_dict(validation_error.message_dict)
            )
        df: Dict[Discipline, Dict[str, str]] = {}
        for file_path in uz():
            file_name: str = basename(file_path)
            fn, _ = splitext(file_name)
            params_list: List[str] = fn.split('_')
            is_annotation = params_list[0].lower() == 'анн'
            try:
                AddDisciplinesFilesMutation.check_params_list(file_name, params_list, is_annotation)
                file_name_params = AddDisciplinesFilesMutation.get_file_name_params(
                    params_list[1:] if is_annotation else params_list
                )
                AddDisciplinesFilesMutation.check_file_name_params(edu_program, file_name, file_name_params)
                discipline: Discipline = Discipline.objects.get(
                    edu_program=edu_program,
                    name=file_name_params.discipline_name,
                    code=file_name_params.discipline_code
                )
                field: str = 'annotation' if is_annotation else 'work_program'
                if discipline in df:
                    df[discipline][field] = file_path
                else:
                    df[discipline] = {
                        field: file_path
                    }
            except ValidationError as validation_error:
                return AddDisciplinesFilesMutation(
                    success=False,
                    errors=ErrorFieldType.from_messages_dict(validation_error.message_dict)
                )
            except Discipline.DoesNotExist:
                return AddDisciplinesFilesMutation(
                    success=False,
                    errors=[
                        ErrorFieldType('discipline_existence', [f'Не найдена дисциплина по имени файла "{file_name}"'])
                    ]
                )
        disciplines: List[Discipline] = []
        prefix: str = ''.join([random_string(5), '_', datetime.now().strftime('%d%m%Y%H%M')])
        for discipline, fields in df.items():
            for field, file_path in fields.items():
                new_file_path: str = join(
                    normpath(Discipline._meta.get_field(field).upload_to),
                    prefix + basename(file_path)
                )
                copyfile(file_path, new_file_path)
                getattr(discipline, field).name = PurePath(relpath(new_file_path, settings.BASE_DIR)).as_posix()
            discipline.save(update_fields=fields.keys())
            disciplines.append(discipline)
        return AddDisciplinesFilesMutation(disciplines=disciplines)


class ChangeDisciplineMutation(BaseMutation):
    """Изменение дисциплины"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        view_id = graphene.ID(required=True, description='Форма представления дисциплины')
        user_ids = graphene.List(graphene.NonNull(graphene.ID), required=True, description='Идентификаторы авторов')
        delete_annotation = graphene.Boolean(required=True, description='Удалять ли аннотацию')
        delete_work_program = graphene.Boolean(required=True, description='Удалять ли файл')
        code = graphene.String(description='Код дисциплины')
        name = graphene.String(description='Название дисциплины')
        annotation = Upload(description='Аннотация к рабочей программе дисциплины/практики/ГИА')
        work_program = Upload(description='Рабочая программа дисциплины')
        parent_id = graphene.ID(description='Родительская дисциплина')

    discipline = graphene.Field(DisciplineType, description='Измененная дисциплина')

    @staticmethod
    @permission_classes([IsAuthenticated, ChangeDiscipline])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, **kwargs):
        kwargs = Discipline.resolve_global(kwargs)
        discipline = Discipline.objects.get(pk=from_global_id(discipline_id)[1])
        info.context.check_object_permissions(info.context, discipline)
        validator: DisciplineChangeValidator = DisciplineChangeValidator(
            {k: kwargs[k] for k in kwargs if k not in ('annotation', 'work_program')}
        )
        if validator.validate():
            delete_annotation = kwargs.pop('delete_annotation')
            delete_work_program = kwargs.pop('delete_work_program')
            user_ids = kwargs.pop('user_ids')
            for k, v in kwargs.items():
                setattr(discipline, k, v)
            update_fields = list(kwargs.keys())
            if delete_annotation:
                discipline.annotation = None
                if 'annotation' not in update_fields:
                    update_fields.append('annotation')
            if delete_work_program:
                discipline.work_program = None
                if 'work_program' not in update_fields:
                    update_fields.append('work_program')
            discipline.users.set(map(lambda user_id: from_global_id(user_id)[1], user_ids))
            discipline.save(update_fields=[*update_fields, 'updated_at'])
            return ChangeDisciplineMutation(discipline=discipline)
        else:
            return ChangeDisciplineMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteDisciplineMutation(BaseMutation):
    """Удаление дисциплины"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')

    id = graphene.ID(required=True, description='Идентификатор дисциплины')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteDiscipline])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str):
        discipline_id = from_global_id(discipline_id)[1]
        count_delete, _ = Discipline.objects.filter(pk=discipline_id).delete()
        return DeleteDisciplineMutation(success=count_delete > 0, id=discipline_id)


class AddMethodologicalSupportMutation(BaseMutation):
    """Добавление методического обеспечения"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        name = graphene.String(required=True, description='Подпись файла')
        src = Upload(required=True, description='Файл')

    methodological_support = graphene.Field(MethodologicalSupportType, description='Новое методическое обеспечение')

    @staticmethod
    @permission_classes([IsAuthenticated, AddMethodologicalSupport])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        kwargs = MethodologicalSupport.resolve_global(kwargs)
        discipline: Discipline = Discipline.objects.get(pk=kwargs['discipline_id'])
        info.context.check_object_permissions(info.context, discipline)
        src: InMemoryUploadedFile = kwargs.pop('src')
        validator = MethodologicalSupportValidator(kwargs)
        if validator.validate():
            return AddMethodologicalSupportMutation(
                methodological_support=MethodologicalSupport.objects.create(**kwargs, src=src)
            )
        else:
            return AddMethodologicalSupportMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class AddEduProgramMethodologicalSupportsMutation(BaseMutation):
    """Добавление методического обеспечения дисциплин одной образовательной программы

    Пример названия файла в архиве: Б1.О.03_Философия.docx.
    """

    class Input:
        edu_program_id = graphene.ID(required=True, description='Идентификатор учебной программы')
        file = Upload(reqired=True, description='Архивный файл')

    methodological_supports = graphene.List(
        graphene.NonNull(MethodologicalSupportType),
        description='Новое методическое обеспечение'
    )

    class FileNameParams(NamedTuple):
        """Параметры имени файла из архива"""

        discipline_code: str  # Код дисциплины: Б1.О.03
        discipline_name: str  # Название дисциплины: Философия

    @staticmethod
    def try_fix_params_list_len(file_name: str, params_list: List[str]) -> List[str]:
        """Попытка исправления неверного числа параметров

        :param file_name: имя файла
        :param params_list: список параметров
        :return: правильный список параметров
        """

        valid_params_list = None
        for i, param in enumerate(params_list):
            if Discipline.objects.filter(code=param).exists() and i + 1 < len(params_list):
                valid_params_list = params_list[i:i + 2]
                break
        if valid_params_list is None:
            raise ValidationError({
                'discipline_existence': [f'Не найдена дисциплина по имени файла "{file_name}"']
            })
        else:
            return valid_params_list

    @staticmethod
    def get_file_name_params(params_list: List[str]) -> FileNameParams:
        """Получение параметров имени файла из списка.

        :param params_list: список параметров
        :return: параметры имени файла
        """

        return AddEduProgramMethodologicalSupportsMutation.FileNameParams(
            discipline_code=params_list[0],
            discipline_name=params_list[1],
        )

    @staticmethod
    def check_file_name_params(edu_program: EduProgram, file_name: str, file_name_params: FileNameParams) -> Discipline:
        """Проверка параметров имени файла.

        :param edu_program: учебная программа
        :param file_name: имя файла
        :param file_name_params: параметры имени файла
        :return: дисциплина, которой принадлежит файл
        """

        try:
            discipline: Discipline = Discipline.objects.get(
                edu_program=edu_program,
                name=file_name_params.discipline_name,
                code=file_name_params.discipline_code
            )
        except ObjectDoesNotExist:
            raise ValidationError({
                'discipline_existence': [f'Не найдена дисциплина по имени файла "{file_name}"']
            })
        return discipline

    @staticmethod
    @permission_classes([IsAuthenticated, AddMethodologicalSupport])
    def mutate_and_get_payload(root, info: ResolveInfo, edu_program_id: str, file: InMemoryUploadedFile):
        edu_program: EduProgram = EduProgram.objects.get(pk=from_global_id(edu_program_id)[1])
        try:
            uz: UnpackZip = UnpackZip(file)
        except ValidationError as validation_error:
            return AddDisciplinesFilesMutation(
                success=False,
                errors=ErrorFieldType.from_messages_dict(validation_error.message_dict)
            )
        df: Dict[Discipline, Dict[str, Any]] = {}
        for file_path in uz():
            try:
                file_name: str = basename(file_path)
                fn, _ = splitext(file_name)
                params_list: List[str] = fn.split('_')
                if len(params_list) != len(AddEduProgramMethodologicalSupportsMutation.FileNameParams._fields):
                    params_list = AddEduProgramMethodologicalSupportsMutation.try_fix_params_list_len(
                        file_name,
                        params_list
                    )
                file_name_params = AddEduProgramMethodologicalSupportsMutation.get_file_name_params(params_list)
                discipline: Discipline = AddEduProgramMethodologicalSupportsMutation.check_file_name_params(
                    edu_program,
                    file_name,
                    file_name_params
                )
                df[discipline] = {
                    'file_path': file_path,
                    'name': fn
                }
            except ValidationError as validation_error:
                return AddEduProgramMethodologicalSupportsMutation(
                    success=False,
                    errors=ErrorFieldType.from_messages_dict(validation_error.message_dict)
                )
        methodological_supports: List[MethodologicalSupport] = []
        for discipline, params in df.items():
            prefix: str = ''.join([random_string(5), '_', datetime.now().strftime('%d%m%Y%H%M')])
            new_file_path: str = join(
                settings.BASE_DIR,
                normpath(MethodologicalSupport._meta.get_field('src').upload_to),
                prefix + basename(params['file_path'])
            )
            copyfile(params['file_path'], new_file_path)
            methodological_support: MethodologicalSupport = MethodologicalSupport.objects.create(
                discipline=discipline,
                name=params['name']
            )
            methodological_support.src.name = PurePath(relpath(new_file_path, settings.BASE_DIR)).as_posix()
            methodological_support.save(update_fields=['src'])
            methodological_supports.append(methodological_support)
        return AddEduProgramMethodologicalSupportsMutation(methodological_supports=methodological_supports)


class AddDisciplineMethodologicalSupportsMutation(BaseMutation):
    """Добавление методического обеспечения дисциплины."""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        file = Upload(reqired=True, description='Архивный файл')

    methodological_supports = graphene.List(
        graphene.NonNull(MethodologicalSupportType),
        description='Новое методическое обеспечение'
    )

    @staticmethod
    @permission_classes([IsAuthenticated, AddMethodologicalSupport])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, file: InMemoryUploadedFile):
        discipline: Discipline = Discipline.objects.get(pk=from_global_id(discipline_id)[1])
        uz: UnpackZip = UnpackZip(file)
        methodological_supports: List[MethodologicalSupport] = []
        with transaction.atomic():
            for file_path in uz():
                file_name: str = basename(file_path)
                prefix: str = ''.join([random_string(5), '_', datetime.now().strftime('%d%m%Y%H%M')])
                new_file_path: str = join(
                    settings.BASE_DIR,
                    normpath(MethodologicalSupport._meta.get_field('src').upload_to),
                    prefix + file_name
                )
                copyfile(file_path, new_file_path)
                methodological_support: MethodologicalSupport = MethodologicalSupport.objects.create(
                    discipline=discipline,
                    name=file_name
                )
                methodological_support.src.name = PurePath(relpath(new_file_path, settings.BASE_DIR)).as_posix()
                methodological_support.save(update_fields=['src'])
                methodological_supports.append(methodological_support)
        return AddDisciplineMethodologicalSupportsMutation(methodological_supports=methodological_supports)


class ChangeMethodologicalSupportMutation(BaseMutation):
    """Изменение методического обеспечения."""

    class Input:
        methodological_support_id = graphene.ID(required=True, description='Идентификатор методического обеспечения')
        name = graphene.String(required=True, description='Подпись файла')

    methodological_support = graphene.Field(
        MethodologicalSupportType,
        description='Измененное методическое обеспечение'
    )

    @staticmethod
    @permission_classes([IsAuthenticated, ChangeMethodologicalSupport])
    def mutate_and_get_payload(root, info: ResolveInfo, methodological_support_id, **kwargs):
        pk: int = from_global_id(methodological_support_id)[1]
        methodological_support: MethodologicalSupport = MethodologicalSupport.objects.get(pk=pk)
        info.context.check_object_permissions(info.context, methodological_support.discipline)
        validator = MethodologicalSupportValidator(kwargs)
        if validator.validate():
            methodological_support.name = kwargs['name']
            methodological_support.save(update_fields=[*kwargs.keys(), 'updated_at'])
            return ChangeMethodologicalSupportMutation(methodological_support=methodological_support)
        else:
            return ChangeMethodologicalSupportMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteMethodologicalSupportMutation(BaseMutation):
    """Удаление методического обеспечения"""

    class Input:
        methodological_support_id = graphene.ID(required=True, description='Идентификатор методического обеспечения')

    id = graphene.ID(required=True, description='Идентификатор методического обеспечения')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteMethodologicalSupport])
    def mutate_and_get_payload(root, info: ResolveInfo, methodological_support_id, **kwargs):
        pk: int = from_global_id(methodological_support_id)[1]
        methodological_support: Optional[MethodologicalSupport] = get_object_or_none(MethodologicalSupport, pk=pk)
        if methodological_support is not None:
            info.context.check_object_permissions(info.context, methodological_support.discipline)
            methodological_support.delete()
            return DeleteMethodologicalSupportMutation(id=methodological_support_id)
        else:
            return DeleteMethodologicalSupportMutation(success=False)


class AddCompetencesMutation(BaseMutation):
    """Добавление компетенций дисциплины"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        competence_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификатор дисциплины'
        )

    competences = graphene.List(graphene.NonNull(CompetenceType), description='Добавленные компетенции')

    @staticmethod
    @permission_classes([IsAuthenticated, AddCompetence])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, competence_ids: str, **kwargs):
        discipline: Discipline = Discipline.objects.get(pk=from_global_id(discipline_id)[1])
        competences = []
        for competence_id in competence_ids:
            discipline.competence_set.add(Competence.objects.get(pk=from_global_id(competence_id)[1]))
            competences.append(Competence.objects.get(pk=from_global_id(competence_id)[1]))
        return AddCompetencesMutation(competences=competences)


class DeleteCompetenceMutation(BaseMutation):
    """Удаление компетенций"""

    class Input:
        competence_id = graphene.ID(required=True, description='Идентификатор компетенции')
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')

    id = graphene.ID(required=True, description='Идентификатор компетенции')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteCompetence])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, competence_id: str,  **kwargs):
        discipline: Discipline = Discipline.objects.get(pk=from_global_id(discipline_id)[1])
        discipline.competence_set.remove(Competence.objects.get(pk=from_global_id(competence_id)[1]))
        return DeleteCompetenceMutation(id=competence_id)


class AddEduHoursMutation(BaseMutation):
    """Добавление часов по плану дисциплины"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        work_kind_id = graphene.ID(required=True, description='Идентификатор вида работ')
        course_number = graphene.Int(required=True, description='Курс')
        semester_number = graphene.Int(required=True, description='Семестр')
        value = graphene.Int(required=True, description='Значение')
        hours_kind_id = graphene.ID(required=True, description='Тип часов')

    edu_hour = graphene.Field(EduHoursType, description='Добавленный вид работы')

    @staticmethod
    @permission_classes([IsAuthenticated, AddEduHours])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, **kwargs):
        return AddEduHoursMutation(edu_hour=EduHours.objects.create(
            discipline_id=from_global_id(discipline_id)[1], **kwargs)
        )


class DeleteEduHourMutation(BaseMutation):
    """Удаление часов по плану"""

    class Input:
        edu_hour_id = graphene.ID(required=True, description='Идентификатор вида работ')

    id = graphene.ID(required=True, description='Идентификатор вида работ')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteEduHours])
    def mutate_and_get_payload(root, info: ResolveInfo, edu_hour_id: str,  **kwargs):
        count_delete, _ = EduHours.objects.filter(pk=edu_hour_id).delete()
        return DeleteEduHourMutation(success=count_delete > 0, id=edu_hour_id)


class EduProgramsMutations(graphene.ObjectType):
    # Мутации образовательных программ
    add_edu_program = AddEduProgramMutation.Field(required=True)
    add_edu_program_from_plx = AddEduProgramFromPlxMutation.Field(required=True)
    add_edu_programs = AddEduProgramsMutation.Field(required=True)
    change_edu_program = ChangeEduProgramMutation.Field(required=True)
    unload_edu_programs = UnloadEduProgramsMutation.Field(required=True)
    delete_edu_program = DeleteEduProgramMutation.Field(required=True)

    # Мутации дисциплин
    add_discipline = AddDisciplineMutation.Field(required=True)
    add_disciplines_files = AddDisciplinesFilesMutation.Field(required=True)
    change_discipline = ChangeDisciplineMutation.Field(required=True)
    delete_discipline = DeleteDisciplineMutation.Field(required=True)

    # Мутации методического обеспечения дисциплин
    add_methodological_support = AddMethodologicalSupportMutation.Field(required=True)
    add_edu_program_methodological_supports = AddEduProgramMethodologicalSupportsMutation.Field(required=True)
    add_discipline_methodological_supports = AddDisciplineMethodologicalSupportsMutation.Field(required=True)
    change_methodological_support = ChangeMethodologicalSupportMutation.Field(required=True)
    delete_methodological_support = DeleteMethodologicalSupportMutation.Field(required=True)

    # Мутации компетенций дисциплин
    add_competences = AddCompetencesMutation.Field(required=True)
    delete_competence = DeleteCompetenceMutation.Field(required=True)

    # Мутации часов дисциплин
    add_edu_hours = AddEduHoursMutation.Field(required=True)
    delete_edu_hour = DeleteEduHourMutation.Field(required=True)
