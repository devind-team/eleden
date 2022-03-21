from typing import NamedTuple

from apps.core.models import User
from apps.eleden.models import Course, Registration, Attestation
from devind_helpers.permissions import BasePermission, ModelPermission

AddCourse = ModelPermission('eleden.add_course')
ChangeCourse = ModelPermission('eleden.change_course')
DeleteCourse = ModelPermission('eleden.delete_course')


class ViewCourse(BasePermission):
    """Пропускает пользователей, которые могут видеть курс"""

    @staticmethod
    def has_object_permission(context, obj: Course):
        return context.user.has_perm('eleden.view_course') or any(
            permission_class.has_permission(context)
            for permission_class
            in (AddCourse, ChangeCourse, DeleteCourse)
        ) or context.user in obj.users


class AddAttestation(BasePermission):
    """Пропускает пользователей, которые могут добавлять аттестацию"""

    class Input(NamedTuple):
        """Входные данные"""

        course: Course
        registration: Registration

    @staticmethod
    def has_object_permission(context, obj: Input):
        if context.user.has_perm('eleden.add_attestation'):
            return True
        if obj.registration.kind == Registration.ATTENDANCE:
            return context.user in [*obj.course.team.responsible_users.all(), *obj.course.teachers.all()]
        else:
            return context.user in obj.course.teachers.all()


class BaseAttestationPermission(BasePermission):
    """Базовое разрешение на изменение аттестации"""

    @staticmethod
    def has_object_permission(context, obj: Attestation):
        if obj.registration.kind == Registration.ATTENDANCE:
            if obj.confirmed_by:
                return context.user in obj.course.teachers.all()
            else:
                return context.user in [*obj.course.team.responsible_users.all(), *obj.course.teachers.all()]
        else:
            return context.user in obj.course.teachers.all()


class ChangeAttestation(BaseAttestationPermission):
    """Пропускает пользователей, которые могут изменять аттестацию"""

    @staticmethod
    def has_object_permission(context, obj: Attestation):
        return True \
            if context.user.has_perm('eleden.change_attestation') \
            else BaseAttestationPermission.has_object_permission(context, obj)


class DeleteAttestation(BasePermission):
    """Пропускает пользователей, которые могут удалять аттестацию"""

    @staticmethod
    def has_object_permission(context, obj: Attestation):
        return True \
            if context.user.has_perm('eleden.delete_attestation') \
            else BaseAttestationPermission.has_object_permission(context, obj)


class BaseAttachmentPermission(BasePermission):
    """Базовое разрешение на изменение прикрепленного файла"""

    class Input(NamedTuple):
        """Входные данные"""

        course: Course
        attestation: Attestation
        user: User

    @staticmethod
    def has_object_permission(context, obj: Input):
        if (context.user in obj.course.teachers.all()) or (not obj.attestation and context.user == obj.user):
            return True
        return False


class AddAttachment(BaseAttachmentPermission):
    """Пропускает пользователей, которые могут добавлять прикрепленные файлы"""

    @staticmethod
    def has_object_permission(context, obj: BaseAttachmentPermission.Input):
        return True \
            if context.user.has_perm('eleden.add_attachment') \
            else BaseAttachmentPermission.has_object_permission(context, obj)


class DeleteAttachment(BaseAttachmentPermission):
    """Пропускает пользователей, которые могут удалять прикрепленные файлы"""

    @staticmethod
    def has_object_permission(context, obj: BaseAttachmentPermission.Input):
        return True \
            if context.user.has_perm('eleden.delete_attachment') \
            else BaseAttachmentPermission.has_object_permission(context, obj)


class AddHandout(BasePermission):
    """Пропускает пользователей, которые могут добавлять раздаточные материалы"""

    @staticmethod
    def has_object_permission(context, obj: Course):
        return True \
            if context.user.has_perm('eleden.add_handout') \
            else context.user in obj.teachers.all()


class ChangeHandout(BasePermission):
    """Пропускает пользователей, которые могут изменять раздаточные материалы"""

    @staticmethod
    def has_object_permission(context, obj: Course):
        return True \
            if context.user.has_perm('eleden.change_handout') \
            else context.user in obj.teachers.all()


class DeleteHandout(BasePermission):
    """Пропускает пользователей, которые могут удалять раздаточные материалы"""

    @staticmethod
    def has_object_permission(context, obj):
        return True \
            if context.user.has_perm('eleden.delete_handout') \
            else context.user in obj.teachers.all()
