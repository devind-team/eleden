import graphene
from graphene.types import ResolveInfo
from graphene_file_upload.scalars import Upload
from graphql_relay import from_global_id

from apps.core.models import User
from apps.eleden.models import FileKind, PortfolioFile, Team
from apps.eleden.permissions import AddFileKind, \
    ChangeFileKind, \
    AddPortfolioFile, \
    ConfirmPortfolioFile, \
    DeletePortfolioFile
from apps.eleden.schema.types import PortfolioFileType, FileKindType
from apps.eleden.services import create_file_kind, \
    change_file_kind, \
    create_portfolio_file, \
    AddPortfolioFiles, \
    confirm_portfolio_file
from apps.eleden.validators import PortfolioFileValidator, FileKindValidator
from devind_helpers.schema.types import ErrorFieldType
from devind_helpers.decorators import permission_classes, resolve_classes, validation_classes
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation


class AddFileKindMutation(BaseMutation):
    """Добавление типа загружаемых файлов в портфолио"""

    class Input:
        name = graphene.String(required=True, description='Наименование цели загрузки файла')
        accept = graphene.String(required=True, description='Допустимый формат загрузки файлов')

    file_kind = graphene.Field(FileKindType, description='Добавленный тип загружаемых файлов в портфолио')

    @classmethod
    @permission_classes((AddFileKind,))
    @validation_classes((FileKindValidator,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        return cls(file_kind=create_file_kind(**kwargs))


class ChangeFileKindMutation(BaseMutation):
    """Изменение типа загружаемых файлов в портфолио"""

    class Input:
        file_kind_id = graphene.ID(required=True, description='Идентификатор типа загружаемых файлов в портфолио')
        name = graphene.String(required=True, description='Наименование цели загрузки файла')
        accept = graphene.String(required=True, description='Допустимый формат загрузки файлов')

    file_kind = graphene.Field(FileKindType, description='Измененный тип загружаемых файлов в портфолио')

    @classmethod
    @permission_classes((ChangeFileKind,))
    @validation_classes((FileKindValidator,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, file_kind_id: str, **kwargs):
        file_kind = get_object_or_404(FileKind, pk=file_kind_id)
        change_file_kind(file_kind, **kwargs)
        return cls(file_kind=file_kind)


class AddPortfolioFileMutation(BaseMutation):
    """Добавление файла в портфолио"""

    class Input:
        user_id = graphene.ID(required=True, description='Пользователь')
        describe = graphene.String(required=True, description='Описание')
        kind_id = graphene.ID(required=True, description='Тип файла из портфолио')
        file = Upload(required=True, description='Привязанный к портфолио файл')
        discipline_id = graphene.ID(description='Дисциплина')
        confirm = graphene.Boolean(default_value=False, description='Подтверждение файла при загрузке')

    portfolio_file = graphene.Field(PortfolioFileType, description='Добавленный в портфолио файл')

    @classmethod
    @permission_classes((IsAuthenticated, AddPortfolioFile,))
    @resolve_classes((PortfolioFile,))
    @validation_classes((PortfolioFileValidator,), deferred=True)
    def mutate_and_get_payload(
            cls,
            root,
            info: ResolveInfo,
            user_id: str,
            confirm: bool,
            **kwargs):
        user: User = get_object_or_404(User, pk=from_global_id(user_id)[1])
        info.context.check_object_permissions(info.context, user)
        info.context.validate()
        return cls(portfolio_file=create_portfolio_file(
            user=user,
            confirm_user=info.context.user if confirm else None,
            **kwargs
        ))


class AddPortfolioFilesMutation(BaseMutation):
    """Добавление файлов в портфолио"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        describe = graphene.String(required=True, description='Описание')
        kind_id = graphene.ID(required=True, description='Тип файла из портфолио')
        file = Upload(reqired=True, description='Архивный файл')
        discipline_id = graphene.ID(description='Идентификатор дисциплины')
        confirm = graphene.Boolean(default_value=False, description='Подтверждение файлов при загрузке')

    portfolio_files = graphene.List(PortfolioFileType, description='Добавленные в портфолио файлы')

    @classmethod
    @permission_classes((IsAuthenticated, AddPortfolioFile,))
    @resolve_classes((PortfolioFile,))
    @validation_classes((PortfolioFileValidator,))
    def mutate_and_get_payload(
            cls,
            root,
            info: ResolveInfo,
            team_id: str,
            confirm: bool,
            **kwargs):
        add_portfolio_files = AddPortfolioFiles(
            team=Team.objects.get(pk=from_global_id(team_id)[1]),
            confirm_user=info.context.user if confirm else None,
            **kwargs
        )
        try:
            add_portfolio_files.match_user_and_files(
                lambda user: info.context.check_object_permissions(info.context, user)
            )
            add_portfolio_files.create_portfolio_files()
        except AddPortfolioFiles.AddPortfolioFilesException as ex:
            return AddPortfolioFileMutation(success=False, errors=[ErrorFieldType('file', [ex.message])])
        return AddPortfolioFilesMutation(portfolio_files=add_portfolio_files.portfolio_files)


class ConfirmPortfolioFileMutation(BaseMutation):
    """Подтверждение файла портфолио"""

    class Input:
        portfolio_file_id = graphene.ID(required=True, description='Идентификатор файла портфолио')

    portfolio_file = graphene.Field(PortfolioFileType, description='Пользователь, подтвердивший файл портфолио')

    @classmethod
    @permission_classes((IsAuthenticated, ConfirmPortfolioFile,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, portfolio_file_id: str, **kwargs):
        portfolio_file: PortfolioFile = get_object_or_404(PortfolioFile, pk=from_global_id(portfolio_file_id)[1])
        info.context.check_object_permissions(info.context, portfolio_file)
        confirm_portfolio_file(portfolio_file, info.context.user)
        return cls(portfolio_file=portfolio_file)


class PortfolioMutations(graphene.ObjectType):
    # Мутации для изменения типа загружаемых файлов в портфолио
    add_file_kind = AddFileKindMutation.Field(required=True)
    change_file_kind = ChangeFileKindMutation.Field(required=True)
    delete_file_kind = DeleteMutation(model=FileKind).Field(required=True)

    # Мутации для изменения файлов в портфолио
    add_portfolio_file = AddPortfolioFileMutation.Field(required=True)
    add_portfolio_files = AddPortfolioFilesMutation.Field(required=True)
    confirm_portfolio_file = ConfirmPortfolioFileMutation.Field(required=True)
    delete_portfolio_file = DeleteMutation(
        model=PortfolioFile,
        permissions=(IsAuthenticated, DeletePortfolioFile),
        is_global_id=True
    ).Field(required=True)
