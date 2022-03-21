import re
from datetime import datetime
from typing import Type

import graphene
from django.core.exceptions import FieldDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Model
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.core.models import User
from apps.eleden.helpers.job_status import add_job_post_with_status, get_decrees_src, get_multiple_decrees_src
from apps.eleden.models import Team, JobPostStatus, JobPostStatusHistory, Post, Job
from apps.eleden.permissions import AddJob, DeleteJob
from apps.eleden.schema.types import JobType
from apps.eleden.validators import AddJobValidator, UploadJobsValidator, UploadJobsUserValidator
from devind_core.models import File, Profile, ProfileValue
from devind_helpers.schema.types import ErrorFieldType, RowFieldErrorType, TableType
from devind_core.validators import UserValidator
from devind_helpers.decorators import permission_classes, resolve_classes, validation_classes
from devind_helpers.import_from_file import ImportFromFile, Ratio, HookItemException, ItemsException
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation


class AddJobMutation(BaseMutation):
    """Добавление пользователя в группу"""

    class Input:
        rate = graphene.Float(required=True, description='Занимаемая ставка')
        kind = graphene.String(required=True, description='Тип работы')
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        user_id = graphene.ID(required=True, desctiption='Идентификатор пользователя')
        post_id = graphene.ID(required=True, description='Идентификатор занимаемой должности')
        status_id = graphene.ID(
            required=True,
            description='Идентификатор статуса должности пользователя на месте работы'
        )
        status_created_at = graphene.Date(
            required=True,
            description='Дата присвоения статуса должности пользователя на месте работы'
        )
        generate_docx = graphene.Boolean(required=True, description='Создавать приказ в формате docx')
        generate_pdf = graphene.Boolean(required=True, description='Создавать приказ в формате pdf')

    job = graphene.Field(JobType, description='Новое место работы пользователя')
    src = graphene.String(description='Ссылка на сгенерированный файл')

    @classmethod
    @permission_classes((IsAuthenticated, AddJob,))
    @resolve_classes((Job,))
    @validation_classes((AddJobValidator,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, generate_docx: bool, generate_pdf: bool, **kwargs):
        info.context.check_object_permissions(info.context, Team.objects.get(pk=kwargs['team_id']))
        job_data = {'team_id': kwargs['team_id'], 'user_id': kwargs['user_id']}
        if Job.objects.filter(**job_data).count() != 0:
            return cls(
                success=False,
                errors=[ErrorFieldType(field='user_id', messages=['Пользователь уже есть в группе'])]
            )
        job = Job.objects.create(**job_data)
        created_at = datetime.combine(kwargs['status_created_at'], datetime.now().time())
        _, job_post_status_history = add_job_post_with_status(job, created_at, generate_docx, generate_pdf, **kwargs)
        src = get_decrees_src(job_post_status_history, created_at) if generate_docx or generate_pdf else None
        return cls(job=job, src=src)


class UploadJobsMutation(BaseMutation):
    """Загрузка существующих пользователей в группу из файла"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        file = Upload(required=True, description='Источник данных, файл xlsx, csv, json')
        generate_docx = graphene.Boolean(required=True, description='Создавать приказ в формате docx')
        generate_pdf = graphene.Boolean(required=True, description='Создавать приказ в формате pdf')

    errors = graphene.List(RowFieldErrorType, required=True, description='Ошибки валидации')
    table = graphene.Field(TableType, description='Валидируемый документ')
    jobs = graphene.List(JobType, description='Новые места работы пользователей')
    src = graphene.String(description='Ссылка на сгенерированный архив с приказами')

    @staticmethod
    @permission_classes((IsAuthenticated, AddJob,))
    def mutate_and_get_payload(
            root,
            info: ResolveInfo,
            team_id: str,
            file: InMemoryUploadedFile,
            generate_docx: bool,
            generate_pdf: bool):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        file = File.objects.create(name=file.name, src=file, user=info.context.user, deleted=True)
        iff = ImportFromFile(
            Job,
            file.src.path,
            introduction={'team_id': team_id},
            ratio=Ratio({'username|user_id': User, 'email|user_id': User}),
            required_keys=['user_id', 'rate', 'post_id', 'status_id', 'kind']
        )
        iff.separate(
            ('rate', 'post_id', 'name|post_id', 'kind', 'status_id', 'name|status_id', 'status_created_at'),
            Ratio({'name|status_id': JobPostStatus, 'name|post_id': Post}),
            UploadJobsValidator
        )
        success, errors = iff.validate()
        if not success:
            return UploadJobsMutation(
                success=False,
                errors=[RowFieldErrorType(
                    row=row,
                    errors=ErrorFieldType.from_validator(error)
                ) for row, error in errors],
                table=TableType.from_iff(iff)
            )

        job_status_history: list[JobPostStatusHistory] = []

        def job_before_create(mdl: Type[Model], data: dict, separated_data: dict, index: int, **kwargs) -> None:
            """Дополнительная проверка перед созданием места работы пользователя.

            :param mdl: модель
            :param data: данные, которые будут использованны для создания пользователя
            :param separated_data: отделенные данные
            :param index: индекс создаваемого объекта
            """

            if re.match(r'(?i)^(mj|ip|ep|cc)$', separated_data['kind']) is None:
                raise HookItemException((index, {
                    'kind': {
                        'regex': 'Поле "Тип работы" должно принадлежать множеству {"mj", "ip", "ep", "cc"}'
                    }
                }))
            if team.users.filter(pk=data['user_id']).count():
                if 'username|user_id' in iff.items[index]:
                    key = 'username|user_id'
                elif 'email|user_id' in iff.items[index]:
                    key = 'email|user_id'
                else:
                    key = 'user_id'
                raise HookItemException((index, {
                    key: {
                        'not_multiple': 'Пользователь уже есть в группе'
                    }
                }))

        def job_created(obj: Job, separated_data: dict, **kwargs) -> None:
            """Дополнительная обработка созданного места работы пользователя.

            :param obj: созданный пользователь
            :param separated_data: отделенные данные
            """

            if obj.team.group is not None:
                obj.user.groups.add(obj.team.group)
            created_at = datetime.combine(
                datetime.strptime(
                    separated_data['status_created_at'],
                    '%d.%m.%Y' if '.' in separated_data['status_created_at'] else '%Y-%m-%d'
                ), datetime.now().time()
            ) if 'status_created_at' in separated_data else datetime.now()
            job_status_history.append(
                add_job_post_with_status(
                    obj,
                    created_at,
                    generate_docx,
                    generate_pdf,
                    **{**separated_data, 'kind': separated_data['kind'].upper()}
                )[1]
            )

        try:
            jobs = iff.run(before_create=job_before_create, created=job_created)
        except ItemsException as ex:
            return UploadJobsMutation(
                success=False,
                errors=[RowFieldErrorType(
                    row=row,
                    errors=ErrorFieldType.from_validator(error)
                ) for row, error in ex.errors],
                table=TableType.from_iff(iff)
            )
        return UploadJobsMutation(
            errors=[],
            jobs=jobs,
            src=get_multiple_decrees_src(job_status_history, datetime.now())
        )


class UploadJobsUserMutation(BaseMutation):
    """Загрузка новых пользователей в группу из файла"""

    class Input:
        rate = graphene.Float(required=True, description='Занимаемая ставка')
        kind = graphene.String(required=True, description='Тип работы')
        file = Upload(required=True, description='Источник данных, файл xlsx, csv, json')
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        post_id = graphene.ID(required=True, description='Идентификатор занимаемой должности')
        status_id = graphene.ID(required=True, description='Идентификатор статуса места работы пользователя')
        status_created_at = graphene.Date(
            required=True,
            description='Дата присвоения статуса места работы пользователя'
        )
        generate_docx = graphene.Boolean(required=True, description='Создавать приказ в формате docx')
        generate_pdf = graphene.Boolean(required=True, description='Создавать приказ в формате pdf')

    errors = graphene.List(RowFieldErrorType, required=True, description='Ошибки валидации')
    table = graphene.Field(TableType, description='Валидируемый документ')
    errors_job = graphene.List(graphene.NonNull(ErrorFieldType), required=True, description='Ошибки мутации')
    jobs = graphene.List(JobType, description='Новые места работы пользователей')
    src = graphene.String(description='Ссылка на сгенерированный архив с приказами')

    @classmethod
    @permission_classes((IsAuthenticated, AddJob,))
    @resolve_classes((Job,))
    @validation_classes((UploadJobsUserValidator,), deferred=True)
    def mutate_and_get_payload(
            cls,
            root,
            info: ResolveInfo,
            file: InMemoryUploadedFile,
            generate_docx: bool,
            generate_pdf: bool,
            **kwargs):
        team: Team = get_object_or_404(Team, pk=kwargs['team_id'])
        info.context.check_object_permissions(info.context, team)
        info.context.validate()
        file = File.objects.create(name=file.name, src=file, user=info.context.user, deleted=True)
        iff = ImportFromFile(User, file.src.path, UserValidator)
        iff.separate(('profile',))
        success, errors = iff.validate()
        if not success:
            return cls(
                success=False,
                errors=[RowFieldErrorType(
                    row=row,
                    errors=ErrorFieldType.from_validator(error)
                ) for row, error in errors],
                errors_job=[],
                table=TableType.from_iff(iff)
            )
        profiles = Profile.objects.filter(parent__isnull=False).values('id', 'code')
        created_at = datetime.combine(kwargs['status_created_at'], datetime.now().time())
        job_post_status_history: list[JobPostStatusHistory] = []

        def user_created(obj: User, separated_data: dict, **_kwargs):
            """Дополнительная обработка созданного пользователя.

            :param obj: созданный пользователь
            :param separated_data: отделенные данные
            """

            if team.group is not None:
                obj.groups.add(team.group)
            for profile_key, profile_value in separated_data['profile'].items() if 'profile' in separated_data else {}:
                if profile_value is None:
                    continue
                profile_id = next((profile['id'] for profile in profiles if profile['code'] == profile_key), None)
                if profile_id is None:
                    raise FieldDoesNotExist(f'Неизвестный столбец {profile_key}')
                ProfileValue.objects.create(user_id=obj.id, profile_id=profile_id, value=profile_value)
            job = team.job_set.create(user=obj)
            job_post_status_history.append(
                add_job_post_with_status(job, created_at, generate_docx, generate_pdf, **kwargs)[1]
            )
            return job

        return cls(
            errors=[],
            errors_job=[],
            jobs=iff.run(created=user_created),
            src=get_multiple_decrees_src(job_post_status_history, created_at)
        )


class JobMutations(graphene.ObjectType):
    add_job = AddJobMutation.Field(required=True)
    upload_jobs = UploadJobsMutation.Field(required=True)
    upload_jobs_user = UploadJobsUserMutation.Field(required=True)
    delete_job = DeleteMutation(
        model=Job,
        permissions=(IsAuthenticated, DeleteJob),
        check_permissions=lambda context, job: context.check_object_permissions(context, job.team)
    ).Field(required=True)
