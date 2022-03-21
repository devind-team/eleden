from os.path import join
from datetime import datetime
from random import choice
from string import ascii_letters
from typing import Optional

import graphene
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.template import Context
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from devind_core.models import File
from devind_helpers.schema.types import ErrorFieldType, RowFieldErrorType, TableType
from devind_helpers.decorators import permission_classes, resolve_classes, validation_classes
from devind_helpers.generators import DocumentGenerator
from devind_helpers.import_from_file import ImportFromFile
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation

from apps.eleden.models import Team, Job, EduProgram
from apps.eleden.permissions import AddTeam, ChangeTeam, DeleteTeam
from apps.eleden.schema.types import TeamType
from apps.eleden.services import change_edu_program
from apps.eleden.validators import TeamValidator, TeamChangeValidator
from apps.eleden.helpers import UsersUnload


class AddTeamMutation(BaseMutation):
    """Добавление группы пользователей"""

    class Input:
        name = graphene.String(required=True, description='Название группы')
        short_name = graphene.String(required=True, description='Сокращенное название группы')
        admission = graphene.Int(required=True, description='Год образования группы/поступления')
        group_id = graphene.ID(description='Группа, от которой назначаем права пользователю при добавлении')
        parent_id = graphene.ID(description='Родительская группа (Администрация -> Кафедра -> Студенты)')

    team = graphene.Field(TeamType, description='Новая группа пользователей')

    @classmethod
    @permission_classes((IsAuthenticated, AddTeam,))
    @resolve_classes((Team,))
    @validation_classes((TeamValidator,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        return cls(team=Team.objects.create(**kwargs))


class UploadTeamsMutation(BaseMutation):
    """Загрузка групп пользователей"""

    class Input:
        file = Upload(required=True, description='Источник данных, файл xlsx, csv, json')

    errors = graphene.List(RowFieldErrorType, required=True, description='Ошибки валидации')
    table = graphene.Field(TableType, description='Валидируемый документ')
    teams = graphene.List(TeamType, description='Загруженные группы пользователей')

    @staticmethod
    @permission_classes((IsAuthenticated, AddTeam,))
    def mutate_and_get_payload(root, info: ResolveInfo, file: InMemoryUploadedFile):
        f = File.objects.create(name=file.name, src=file, user=info.context.user, deleted=True)  # Файл скрыт
        iff = ImportFromFile(Team, f.src.path, TeamValidator)
        success, errors = iff.validate()
        return UploadTeamsMutation(errors=[], teams=iff.run()) if success else UploadTeamsMutation(
            success=False,
            errors=[RowFieldErrorType(row=row, errors=ErrorFieldType.from_validator(error)) for row, error in errors],
            table=TableType.from_iff(iff)
        )


class ChangeTeamMutation(BaseMutation):
    """Изменения группы пользователей"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы пользователей')
        name = graphene.String(description='Название группы')
        short_name = graphene.String(description='Сокращенное название группы')
        admission = graphene.Int(description='Год образования группы/поступления')
        group_id = graphene.ID(describe='Группа, от которой назначаем права пользователю при добавлении')
        parent_id = graphene.ID(description='Родительская группа (Администрация -> Кафедра -> Студенты)')

    team = graphene.Field(TeamType, description='Измененная группа')

    @classmethod
    @permission_classes((IsAuthenticated, ChangeTeam,))
    @resolve_classes((Team,))
    @validation_classes((TeamChangeValidator,), deferred=True)
    def mutate_and_get_payload(cls, root, info: ResolveInfo, team_id: str, **kwargs):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        info.context.validate()
        for k, v in kwargs.items():
            setattr(team, k, v)
        team.save(update_fields=(*kwargs.keys(), 'updated_at'))
        return cls(team=team)


class ChangeTeamResponsibleUsersMutation(BaseMutation):
    """Изменение ответственных пользователей в группе"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы пользователей')
        users_id = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы пользователей'
        )

    team = graphene.Field(TeamType, description='Измененная группа')

    @staticmethod
    @permission_classes((IsAuthenticated, ChangeTeam,))
    def mutate_and_get_payload(root, info: ResolveInfo, team_id: str, users_id: list[str]):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        team.responsible_users.set([get_object_or_404(User, pk=from_global_id(user_id)[1]) for user_id in users_id])
        return ChangeTeamResponsibleUsersMutation(team=team)


class ChangeTeamEduProgramMutation(BaseMutation):
    """Изменение образовательной программы для группы пользователей"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы пользователей')
        transfer_courses = graphene.Boolean(required=True, description='Переносить курсы с удалением ненайденных')
        edu_program_id = graphene.ID(description='Идентификатор образовательной программы')

    team = graphene.Field(TeamType, description='Измененная группа')

    @staticmethod
    @permission_classes((IsAuthenticated, ChangeTeam,))
    def mutate_and_get_payload(
            root,
            info: ResolveInfo,
            team_id: str,
            transfer_courses: bool,
            edu_program_id: Optional[str]):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        change_edu_program(
            team,
            get_object_or_404(EduProgram, pk=from_global_id(edu_program_id)[1]) if edu_program_id else None,
            transfer_courses
        )
        return ChangeTeamEduProgramMutation(team=team)


class ChangeTeamDeleteMutation(BaseMutation):
    """Мягкое удаление или восстановление группы пользователей"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы пользователей')
        delete = graphene.Boolean(required=True, description='Удалена ли группа (закончено обучение)')

    team = graphene.Field(TeamType, description='Измененная группа')

    @staticmethod
    @permission_classes((IsAuthenticated, DeleteTeam,))
    def mutate_and_get_payload(root, info: ResolveInfo, team_id: str, delete: bool):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        team.delete = delete
        team.save(update_fields=('delete', 'updated_at'))
        return ChangeTeamDeleteMutation(team=team)


class GenerateTeamNewPasswordsMutation(BaseMutation):
    """Генерация паролей заданным пользователям"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы пользователей')
        users_id = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы пользователей'
        )
        date = graphene.String(required=True, description='Дата генерации паролей')

    src = graphene.String(description='Ссылка на сгенерированный файл')

    @staticmethod
    @permission_classes((IsAuthenticated, ChangeTeam,))
    def mutate_and_get_payload(root, info: ResolveInfo, team_id: str, users_id: list[str], date: str):
        team: Team = get_object_or_404(Team, pk=from_global_id(team_id)[1])
        info.context.check_object_permissions(info.context, team)
        try:
            date = datetime.strftime(datetime.strptime(date, '%Y-%m-%d'), "%d.%m.%Y")
        except ValueError:
            return GenerateTeamNewPasswordsMutation(
                success=False,
                errors=[ErrorFieldType('team', ['Неверный формат даты'])]
            )
        users_id = [from_global_id(user_id)[1] for user_id in users_id]
        jobs = Job.objects.filter(team=team, user_id__in=users_id)
        # Генерируем новые пароли
        users = []
        for job in jobs:
            password = ''.join(choice(ascii_letters) for _ in range(10))
            job.user.set_password(password)
            job.user.save(update_fields=('password',))
            users.append({
                'username': job.user.username,
                'name': f'{job.user.last_name} {job.user.first_name} {job.user.sir_name}',
                'password': password
            })
        # Отправляем сообщения об изменении паролей
        # change_password.delay(users_id)
        # Рендерим docx файл
        context: Context = Context({
            'team': team,
            'users': users,
            'user': info.context.user,
            'date': date
        })
        template = join(settings.BASE_DIR, 'apps', 'eleden', 'templates', 'reset_passwords.xml')
        source = join(settings.BASE_DIR, 'apps', 'eleden', 'templates', 'reset_passwords.docx')
        dg = DocumentGenerator(context, template, source)
        return GenerateTeamNewPasswordsMutation(src=dg.generate_pdf().path)


class UnloadUsersMutation(BaseMutation):
    """ Выгрузка пользователей группы """

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        users_id = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы пользователей'
        )
        extension = graphene.String(required=True, description='Формат выгрузки: html, xlsx')

    src = graphene.String(description='Ссылка на сгенерированный файл')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(root, info: ResolveInfo, extension: str, users_id: list[str], team_id: str):
        users_id = [from_global_id(user_id)[1] for user_id in users_id]
        usu: UsersUnload = UsersUnload(users_id, team_id, request=info.context)
        src: str = usu.html()
        return UnloadUsersMutation(src=src)


class TeamMutations(graphene.ObjectType):
    unload_users = UnloadUsersMutation.Field(required=True)
    add_team = AddTeamMutation.Field(required=True)
    upload_teams = UploadTeamsMutation.Field(required=True)
    change_team = ChangeTeamMutation.Field(required=True)
    change_team_responsible_users = ChangeTeamResponsibleUsersMutation.Field(required=True)
    change_team_edu_program = ChangeTeamEduProgramMutation.Field(required=True)
    delete_team = DeleteMutation(model=Team, is_global_id=True).Field(required=True)
    change_team_delete = ChangeTeamDeleteMutation.Field(required=True)
    generate_team_new_passwords = GenerateTeamNewPasswordsMutation.Field(required=True)
