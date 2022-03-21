from os.path import splitext
from typing import Callable, NamedTuple

import graphene
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction
from django.db.models import QuerySet
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.core.models import User
from apps.eleden.models import Team, \
    Course, \
    Attestation, \
    Attachment, \
    Handout, \
    Registration, \
    Period, \
    PortfolioFile
from apps.eleden.permissions import AddCourse, \
    ChangeCourse, \
    DeleteCourse, \
    AddAttestation, \
    ChangeAttestation, \
    DeleteAttestation, \
    AddAttachment, \
    DeleteAttachment, \
    AddHandout, \
    ChangeHandout, \
    DeleteHandout
from apps.eleden.schema.types import CourseType, \
    AttestationType, \
    AttachmentType, \
    HandoutType, \
    CourseInputType
from apps.eleden.validators import CourseValidator, \
    AttestationValidator, \
    AttachmentValidator, \
    RegistrationValidator, \
    PeriodValidator, \
    HandoutValidator
from devind_core.models import File
from devind_helpers.schema.types import ErrorFieldType
from devind_helpers.decorators import permission_classes
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation


class CoursesMutation(BaseMutation):
    """Мутация курсов"""

    class Meta:
        abstract = True

    class SaveResult(NamedTuple):
        """Результат метода save_courses"""

        courses: list[Course] or None       # Список курсов
        validator: CourseValidator or None  # Валидатор курсов
        team_id: str                        # Идентификатор группы пользователей

    @staticmethod
    def save_courses(course_method: Callable, **kwargs) -> SaveResult:
        """Сохранение курсов.

        :param course_method: метод для получения курса
        :param kwargs: входные данные курсов
        :return: список курсов
        """

        kwargs = Course.resolve_global(kwargs)
        input_courses = kwargs.pop('courses', [])
        courses: list[Course] = []
        with transaction.atomic():
            for input_course in input_courses:
                full_input_course = {**kwargs, 'edu_hours_id': input_course.edu_hours_id}
                validator: CourseValidator = CourseValidator(full_input_course)
                if validator.validate():
                    course: Course = course_method(**full_input_course)
                    course.teachers.set(
                        map(
                            lambda teacher_id: User.objects.get(pk=from_global_id(teacher_id)[1]),
                            input_course.teacher_ids if input_course.teacher_ids else []
                        )
                    )
                    course.periods.set(
                        map(
                            lambda period_id: Period.objects.get(pk=period_id),
                            input_course.period_ids if input_course.period_ids else []
                        )
                    )
                else:
                    return CoursesMutation.SaveResult(None, validator, kwargs['team_id'])
                courses.append(course)
        return CoursesMutation.SaveResult(courses, None, kwargs['team_id'])


class AddCoursesMutation(CoursesMutation):
    """Добавление курсов"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        courses = graphene.List(graphene.NonNull(CourseInputType), description='Частичные данные курсов')

    courses = graphene.List(graphene.NonNull(CourseType), description='Новые курсы')

    @staticmethod
    @permission_classes([IsAuthenticated, AddCourse])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        def create(**create_kwargs) -> Course:
            return Course.objects.create(**create_kwargs)
        courses, validator, _ = AddCoursesMutation.save_courses(create, **kwargs)
        if courses is None:
            return AddCoursesMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )
        else:
            return AddCoursesMutation(courses=courses)


class ChangeCoursesMutation(CoursesMutation):
    """Изменение курсов"""

    class Input:
        discipline_id = graphene.ID(required=True, description='Идентификатор дисциплины')
        team_id = graphene.ID(required=True, description='Идентификатор группы')
        courses = graphene.List(graphene.NonNull(CourseInputType), description='Частичные данные курсов')

    courses = graphene.List(graphene.NonNull(CourseType), description='Измененные курсы')
    has_courses = graphene.Boolean(description='Остались ли курсы у группы')

    @staticmethod
    @permission_classes([IsAuthenticated, ChangeCourse])
    def mutate_and_get_payload(root, info: ResolveInfo, discipline_id: str, **kwargs):
        def get_or_create(**get_or_create_kwargs) -> Course:
            return Course.objects.get_or_create(**get_or_create_kwargs)[0]
        courses, validator, team_id = ChangeCoursesMutation.save_courses(get_or_create, **kwargs)
        if courses is None:
            return ChangeCoursesMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )
        else:
            Course.objects.filter(team_id=team_id, edu_hours__discipline_id=from_global_id(discipline_id)[1]) \
                .exclude(pk__in=[course.id for course in courses]).delete()
            has_courses = Team.objects.get(pk=team_id).course_set.count() > 0
            return ChangeCoursesMutation(courses=courses, has_courses=has_courses)


class DeleteCoursesMutation(BaseMutation):
    """Удаление всех курсов группы"""

    class Input:
        team_id = graphene.ID(required=True, description='Идентификатор группы')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteCourse])
    def mutate_and_get_payload(root, info: ResolveInfo, team_id: str):
        return DeleteCoursesMutation(success=Course.objects.filter(team=from_global_id(team_id)[1]).delete()[0] > 0)


class DeleteCourseMutation(BaseMutation):
    """Удаление курса"""

    class Input:
        course_id = graphene.ID(required=True, description='Идентификатор курса')

    @staticmethod
    @permission_classes([IsAuthenticated, DeleteCourse])
    def mutate_and_get_payload(root, info: ResolveInfo, course_id: str):
        return DeleteCourseMutation(success=Course.objects.get(pk=from_global_id(course_id)[1]).delete()[0] > 0)


class AddAttestationMutation(BaseMutation):
    """Добавление аттестации"""

    class Input:
        description = graphene.String(required=True, description='Описание')
        registration_id = graphene.ID(required=True, description='Идентификатор учета студентов')
        course_id = graphene.ID(required=True, description='Идентификатор курса')
        period_id = graphene.ID(required=True, description='Идентификатор периода')
        set_by_id = graphene.ID(required=True, description='Идентификатор пользователя, который выставил аттестацию')
        user_id = graphene.ID(required=True, description='Идентификатор учащегося')
        confirmed_by_id = graphene.ID(description='Идентификатор пользователя, который подтвердил аттестацию')

    attestation = graphene.Field(AttestationType, description='Новая аттестация')

    @staticmethod
    @permission_classes([AddAttestation])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        kwargs = Attestation.resolve_global(kwargs)
        validator: AttestationValidator = AttestationValidator(kwargs)
        if validator.validate():
            info.context.check_object_permissions(
                info.context,
                AddAttestation.Input(
                    course=Course.objects.get(pk=kwargs['course_id']),
                    registration=Registration.objects.get(pk=kwargs['registration_id'])
                )
            )
            return AddAttestationMutation(attestation=Attestation.objects.create(**kwargs))
        else:
            return AddAttestationMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class ChangeAttestationMutation(BaseMutation):
    """Изменение аттестации"""

    class Input:
        attestation_id = graphene.ID(required=True, description='Идентификатор аттестации')
        description = graphene.String(description='Описание')
        registration_id = graphene.ID(description='Идентификатор курса')
        set_by_id = graphene.ID(description='Идентификатор пользователя, который выставил аттестацию')
        confirmed_by_id = graphene.ID(description='Идентификатор пользователя, который подтвердил аттестацию')

    attestation = graphene.Field(AttestationType, description='Измененная аттестация')

    @staticmethod
    @permission_classes([ChangeAttestation])
    def mutate_and_get_payload(root, info: ResolveInfo, attestation_id: str, **kwargs):
        attestation: Attestation = Attestation.objects.get(pk=from_global_id(attestation_id)[1])
        kwargs = Attestation.resolve_global(kwargs)
        kwargs = {k: v for k, v in kwargs.items() if v is not None}
        validator: AttestationValidator = AttestationValidator(kwargs)
        if validator.validate():
            info.context.check_object_permissions(info.context, attestation)
            for k, v in kwargs.items():
                setattr(attestation, k, v)
            attestation.save(update_fields=[*kwargs.keys(), 'updated_at'])
            return AddAttestationMutation(attestation=attestation)
        else:
            return AddAttestationMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteAttestationMutation(BaseMutation):
    """Удаление аттестации"""

    class Input:
        attestation_id = graphene.ID(required=True, description='Идентификатор аттестации')

    @staticmethod
    @permission_classes([DeleteAttestation])
    def mutate_and_get_payload(root, info: ResolveInfo, attestation_id: str):
        attestation: Attestation = Attestation.objects.get(pk=from_global_id(attestation_id)[1])
        info.context.check_object_permissions(info.context, attestation)
        return DeleteAttestationMutation(
            success=attestation.delete()[0] > 0
        )


class AttachmentsMutation(BaseMutation):
    """Мутация прикрепленных файлов"""

    class Meta:
        abstract = True

    @staticmethod
    def check_permissions(info: ResolveInfo, course: Course, period: Period, user: User) -> None:
        """Проверка разрешений."""

        attestations: QuerySet[Attestation] = Attestation.objects.filter(
            registration__kind=Registration.MARK,
            course=course,
            period=period,
            user=user
        )
        info.context.check_object_permissions(info.context, AddAttachment.Input(
            course=course,
            attestation=attestations.first() if attestations.exists() else None,
            user=user
        ))


class AddAttachmentsMutation(AttachmentsMutation):
    """Добавление прикрепленных файлов"""

    class Meta:
        abstract = True

    class CommonParams(NamedTuple):
        """Общие параметры дочерних мутаций"""

        course: Course
        period: Period
        user: User
        confirmed_by: User

    @staticmethod
    def resolve(kwargs: dict) -> dict:
        """Очистка данных и преобразование id."""

        result = Attachment.resolve_global(kwargs)
        result['user_id'] = from_global_id(kwargs['user_id'])[1]
        result['confirmed_by_id'] = from_global_id(kwargs['confirmed_by_id'])[1] \
            if kwargs['confirmed_by_id'] is not None \
            else None
        return result

    @staticmethod
    def get_common_params(kwargs: dict) -> CommonParams:
        """Получение общих параметров дочерних мутаций."""

        confirmed_by: User = User.objects.get(pk=kwargs['confirmed_by_id']) \
            if kwargs['confirmed_by_id'] is not None \
            else None
        return AddAttachmentsMutation.CommonParams(
            course=Course.objects.get(pk=kwargs['course_id']),
            period=Period.objects.get(pk=kwargs['period_id']),
            user=User.objects.get(pk=kwargs['user_id']),
            confirmed_by=confirmed_by
        )


class AddPortfolioFileAttachmentsMutation(AddAttachmentsMutation):
    """Добавление прикрепленных файлов из файлов портофолио"""

    class Input:
        course_id = graphene.ID(required=True, description='Идентификатор курса')
        period_id = graphene.ID(required=True, description='Идентификатор периода')
        user_id = graphene.ID(required=True, description='Идентификатор учащегося')
        portfolio_file_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы файлов портфолио'
        )
        confirmed_by_id = graphene.ID(description='Идентификатор пользователя, который подтвердил файлы')

    attachments = graphene.List(AttachmentType, description='Новые прикрепленные файлы')

    @staticmethod
    @permission_classes([AddAttachment])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        portfolio_file_ids: list[str] = kwargs.pop('portfolio_file_ids')
        kwargs = AddPortfolioFileAttachmentsMutation.resolve(kwargs)
        validator: AttachmentValidator = AttachmentValidator(kwargs)
        attachments: list[Attachment] = []
        if validator.validate():
            course, period, user, confirmed_by = AddPortfolioFileAttachmentsMutation.get_common_params(kwargs)
            AddPortfolioFileAttachmentsMutation.check_permissions(info, course, period, user)
            with transaction.atomic():
                for portfolio_file_id in portfolio_file_ids:
                    portfolio_file = PortfolioFile.objects.get(pk=from_global_id(portfolio_file_id)[1])
                    if confirmed_by:
                        portfolio_file.user = confirmed_by
                        portfolio_file.save(update_fields=('user', 'updated_at'))
                    attachments.append(Attachment.objects.create(
                        course=course,
                        period=period,
                        portfolio_file_id=from_global_id(portfolio_file_id)[1]
                    ))
                return AddPortfolioFileAttachmentsMutation(attachments=attachments)
        else:
            return AddPortfolioFileAttachmentsMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class AddFileAttachmentsMutation(AddAttachmentsMutation):
    """Добавление прикрепленных файлов из файлов"""

    class Input:
        course_id = graphene.ID(required=True, description='Идентификатор курса')
        period_id = graphene.ID(required=True, description='Идентификатор периода')
        user_id = graphene.ID(required=True, description='Идентификатор учащегося')
        files = graphene.List(
            graphene.NonNull(Upload),
            required=True,
            description='Файлы'
        )
        describe = graphene.String(required=True, description='Описание файла')
        file_kind_id = graphene.ID(required=True, description='Идентификатор типа файла')
        confirmed_by_id = graphene.ID(description='Идентификатор пользователя, который подтвердил файлы')

    attachments = graphene.List(AttachmentType, description='Новые прикрепленные файлы')

    @staticmethod
    @permission_classes([AddAttachment])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        files: list[InMemoryUploadedFile] = kwargs.pop('files')
        kwargs = AddFileAttachmentsMutation.resolve(kwargs)
        validator: AttachmentValidator = AttachmentValidator(kwargs)
        attachments: list[Attachment] = []
        if validator.validate():
            course, period, user, confirmed_by = AddFileAttachmentsMutation.get_common_params(kwargs)
            describe = kwargs.pop('describe')
            file_kind_id = kwargs.pop('file_kind_id')
            AddFileAttachmentsMutation.check_permissions(info, course, period, user)
            with transaction.atomic():
                for file in files:
                    portfolio_file: PortfolioFile = PortfolioFile.objects.create(
                        describe=describe,
                        file=File.objects.create(
                            name=describe,
                            src=file,
                            deleted=True,
                            user=user
                        ),
                        kind_id=file_kind_id,
                        discipline=course.edu_hours.discipline,
                        user=confirmed_by
                    )
                    attachments.append(Attachment.objects.create(
                        course=course,
                        period=period,
                        portfolio_file=portfolio_file
                    ))
                return AddFileAttachmentsMutation(attachments=attachments)
        else:
            return AddFileAttachmentsMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteAttachmentsMutation(AttachmentsMutation):
    """Удаление прикрепленных файлов"""

    class Input:
        attachment_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы прикрепленных файлов'
        )

    @staticmethod
    @permission_classes([DeleteAttachment])
    def mutate_and_get_payload(root, info: ResolveInfo, attachment_ids: list[str]):
        attachments: QuerySet[Attachment] = Attachment.objects.filter(pk__in=attachment_ids)
        for attachment in attachments.all():
            DeleteAttachmentsMutation.check_permissions(
                info,
                attachment.course,
                attachment.period,
                attachment.portfolio_file.file.user
            )
        attachments.delete()
        return DeleteAttachmentsMutation()


class AddHandoutMutation(BaseMutation):
    """Добавление раздаточного материала"""

    class Input:
        description = graphene.String(required=True, description='Описание раздаточного материала')
        file = Upload(required=True, description='Файл пользователя')
        course_id = graphene.ID(required=True, description='Идентификатор курса')
        period_id = graphene.ID(required=True, description='Идентификатор периода')

    handout = graphene.Field(HandoutType, description='Новый раздаточный материал')

    @staticmethod
    @permission_classes([AddHandout])
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        file: InMemoryUploadedFile = kwargs.pop('file')
        kwargs = Handout.resolve_global(kwargs)
        validator: HandoutValidator = HandoutValidator(kwargs)
        if validator.validate():
            course = Course.objects.get(pk=kwargs['course_id'])
            info.context.check_object_permissions(info.context, course)
            return AddHandoutMutation(
                handout=Handout.objects.create(
                    description=kwargs['description'],
                    user=info.context.user,
                    file=File.objects.create(
                        name=splitext(file.name)[0],
                        src=file,
                        user=info.context.user
                    ),
                    course=course,
                    period_id=kwargs['period_id']
                )
            )
        else:
            return AddHandoutMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class ChangeHandoutMutation(BaseMutation):
    """Изменение раздаточного материала"""

    class Input:
        handout_id = graphene.ID(required=True, description='Идентификатор раздаточного материала')
        description = graphene.String(description='Описание раздаточного материала')
        period_id = graphene.ID(description='Идентификатор периода')

    handout = graphene.Field(HandoutType, description='Измененнный раздаточный материал')

    @staticmethod
    @permission_classes([ChangeHandout])
    def mutate_and_get_payload(root, info: ResolveInfo, handout_id: str, **kwargs):
        kwargs = Handout.resolve_global(kwargs)
        validator: HandoutValidator = HandoutValidator(kwargs)
        if validator.validate():
            handout: Handout = Handout.objects.get(pk=from_global_id(handout_id)[1])
            info.context.check_object_permissions(info.context, handout.course)
            for k, v in kwargs.items():
                setattr(handout, k, v)
            handout.save(update_fields=[*kwargs.keys(), 'updated_at'])
            return ChangeHandoutMutation(handout=handout)
        else:
            return ChangeHandoutMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteHandoutsMutation(BaseMutation):
    """Удаление раздаточных материалов"""

    class Input:
        handout_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы раздаточных материалов'
        )

    @staticmethod
    @permission_classes([DeleteHandout])
    def mutate_and_get_payload(root, info: ResolveInfo, handout_ids: list[str]):
        handouts: QuerySet[Handout] = Handout.objects.filter(
            pk__in=[from_global_id(handout_id)[1] for handout_id in handout_ids]
        )
        for handout in handouts.all():
            info.context.check_object_permissions(info.context, handout.course)
        handouts.delete()
        return DeleteHandoutsMutation()


class AddRegistrationMutation(BaseMutation):
    """Добавление регистрации"""

    class Input:
        name = graphene.String(required=True)
        short_name = graphene.String(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        validator = RegistrationValidator(kwargs)
        if validator.validate():
            registration = Registration(name=kwargs['name'], short_name=kwargs['short_name'])
            registration.save()
        else:
            return AddRegistrationMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))
        return AddRegistrationMutation()


class ChangeRegistrationMutation(BaseMutation):
    """Изменение регистрации"""

    class Input:
        registration_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        short_name = graphene.String(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        validator = RegistrationValidator(kwargs)
        if validator.validate():
            registration = get_object_or_404(Registration, pk=kwargs['registration_id'])
            registration.name = kwargs['name']
            registration.short_name = kwargs['short_name']
            registration.save(update_fields=('name', 'short_name'))
        else:
            return ChangeRegistrationMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))
        return ChangeRegistrationMutation()


class DeleteRegistrationMutation(BaseMutation):
    """Удаление регистрации"""

    class Input:
        registration_id = graphene.Int(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, registration_id, **kwargs):
        registration = get_object_or_404(Registration, pk=registration_id)
        registration.delete()
        return DeleteRegistrationMutation()


class AddPeriodMutation(BaseMutation):
    """Добавление периода"""

    class Input:
        name = graphene.String(required=True)
        short_name = graphene.String(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        validator = PeriodValidator(kwargs)
        if validator.validate():
            period = Period(name=kwargs['name'], short_name=kwargs['short_name'])
            period.save()
        else:
            return AddPeriodMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))
        return AddPeriodMutation()


class ChangePeriodMutation(BaseMutation):
    """Изменение периода"""

    class Input:
        period_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        short_name = graphene.String(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, **kwargs):
        validator = PeriodValidator(kwargs)
        if validator.validate():
            period = get_object_or_404(Period, pk=kwargs['period_id'])
            period.name = kwargs['name']
            period.short_name = kwargs['short_name']
            period.save(update_fields=('name', 'short_name'))
        else:
            return ChangePeriodMutation(success=False, errors=ErrorFieldType.from_validator(validator.get_message()))
        return ChangePeriodMutation()


class DeletePeriodMutation(BaseMutation):
    """Удаление периода"""

    class Input:
        period_id = graphene.Int(required=True)

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, period_id, **kwargs):
        period = get_object_or_404(Period, pk=period_id)
        period.delete()
        return DeletePeriodMutation()


class ProcessMutations(graphene.ObjectType):
    # Мутации курсов
    add_courses = AddCoursesMutation.Field(required=True)
    change_courses = ChangeCoursesMutation.Field(required=True)
    delete_courses = DeleteCoursesMutation.Field(required=True)
    delete_course = DeleteCourseMutation.Field(required=True)

    # Мутации аттестаций
    add_attestation = AddAttestationMutation.Field(required=True)
    change_attestation = ChangeAttestationMutation.Field(required=True)
    delete_attestation = DeleteAttestationMutation.Field(required=True)

    # Мутации прикрепленных файлов
    add_portfolio_file_attachments = AddPortfolioFileAttachmentsMutation.Field(required=True)
    add_file_attachments = AddFileAttachmentsMutation.Field(required=True)
    delete_attachments = DeleteAttachmentsMutation.Field(required=True)

    # Мутации раздаточного материала
    add_handout = AddHandoutMutation.Field(required=True)
    change_handout = ChangeHandoutMutation.Field(required=True)
    delete_handouts = DeleteHandoutsMutation.Field(required=True)

    # Мутации для регистрации действий
    add_registration = AddRegistrationMutation.Field(required=True)
    change_registration = ChangeRegistrationMutation.Field(required=True)
    delete_registration = DeleteRegistrationMutation.Field(required=True)

    # Мутации для периодов
    add_period = AddPeriodMutation.Field(required=True)
    change_period = ChangePeriodMutation.Field(required=True)
    delete_period = DeletePeriodMutation.Field(required=True)
