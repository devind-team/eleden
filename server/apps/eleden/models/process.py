from typing import Protocol, Union

from django.db import models

from apps.core.models import User
from apps.messenger.models import Chat
from devind_core.models import File
from devind_helpers.resolve_model import ResolveModel
from .education import EduHours
from .portfolio import PortfolioFile
from .team import Team


class Registration(models.Model):
    """Учет студентов на занятиях"""

    ATTENDANCE = 0
    MARK = 1

    KIND = (
        (ATTENDANCE, 'attendance'),
        (MARK, 'mark'),
    )

    name = models.CharField(max_length=255, help_text='Название')
    short_name = models.CharField(max_length=10, help_text='Короткое название')
    kind = models.PositiveIntegerField(choices=KIND, default=ATTENDANCE, help_text='Тип записи')
    order = models.PositiveIntegerField(help_text='Позиция для сортировки')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    class Meta:
        ordering = ('order', 'id',)


class Period(models.Model):
    """Период: учебные недели (1 - 18), допуск, зачет, экзамен и т.д."""

    name = models.CharField(max_length=255, help_text='Название')
    short_name = models.CharField(max_length=10, help_text='Короткое название')
    is_final = models.BooleanField(
        default=False,
        help_text='Выставляется ли итоговая оценка за этот период'
    )
    template_doc = models.FileField(
        upload_to='storage/statements/doc/',
        default=None,
        null=True,
        help_text='Шаблон doc'
    )
    template_xml = models.FileField(
        upload_to='storage/statements/xml/',
        default=None,
        null=True,
        help_text='Шаблон xml'
    )
    order = models.IntegerField(help_text='Позиция для сортировки')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    registrations = models.ManyToManyField(Registration, help_text='Возможные учеты студентов на занятиях')

    class Meta:
        ordering = ('order', 'id',)


class Course(models.Model, ResolveModel):
    """Курс"""

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    edu_hours = models.ForeignKey(EduHours, on_delete=models.CASCADE, help_text='Часы по плану')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, help_text='Группа пользователей, которая обучается')
    chat = models.ForeignKey(Chat, null=True, default=None, on_delete=models.SET_NULL, help_text='Чат курса')

    teachers = models.ManyToManyField(User, help_text='Преподаватели курса')
    periods = models.ManyToManyField(Period, through='CoursePeriod', help_text='Периоды обучения')

    class Meta:
        ordering = ('-created_at', 'id',)

    resolve_fields = ['discipline_id', 'team_id']

    class _ObjectsManager(models.Manager):
        class CourseProtocol(Protocol):
            # Номер семестра с учетом номера курса: (2 курс, 2 семестр) -> 4
            semester: int

        def get_queryset(self) -> models.QuerySet[Union['Course', CourseProtocol]]:
            return super().get_queryset().annotate(
                semester=(models.F('edu_hours__course_number') - 1) * 2 + models.F('edu_hours__semester_number')
            )

    objects = _ObjectsManager()

    @property
    def users(self) -> list[User]:
        """Пользователи, связанные с курсом"""

        return [*self.team.users.all(), *self.team.responsible_users.all(), *self.teachers.all()]


class CoursePeriod(models.Model):
    """Период курса"""

    period = models.ForeignKey(Period, on_delete=models.CASCADE, help_text='Период')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, help_text='Курс')


class Attestation(models.Model, ResolveModel):
    """Аттестация"""

    description = models.TextField(help_text='Описание')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, help_text='Учет студента')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, help_text='Курс')
    period = models.ForeignKey(Period, on_delete=models.CASCADE, help_text='Период')
    set_by = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name='attestation_set_by_set',
        help_text='Пользователь, который выставил аттестацию'
    )
    confirmed_by = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name='attestation_confirmed_by_set',
        help_text='Пользователь, который подтвердил аттестацию'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='annotation_user_set',
        help_text='Учащийся'
    )

    class Meta:
        ordering = ('-created_at', 'id', )

    resolve_fields = ['course_id', 'set_by_id', 'confirmed_by_id', 'user_id']


class Attachment(models.Model, ResolveModel):
    """Прикрепленный файл"""

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    portfolio_file = models.OneToOneField(
        PortfolioFile,
        on_delete=models.CASCADE,
        primary_key=True,
        help_text='Файл портфолио'
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, help_text='Курс')
    period = models.ForeignKey(Period, on_delete=models.CASCADE, help_text='Период')

    class Meta:
        ordering = ('-created_at', 'portfolio_file',)

    resolve_fields = ['portfolio_file_id', 'course_id']


class Handout(models.Model, ResolveModel):
    """Раздаточный материал для курса"""

    description = models.TextField(help_text='Описание раздаточного материала')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        help_text='Пользователь, который загрузил файл'
    )
    file = models.ForeignKey(File, on_delete=models.CASCADE, help_text='Файл пользователя')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, help_text='Курс')
    period = models.ForeignKey(
        Period,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        help_text='Период обучения'
    )

    class Meta:
        ordering = ('-created_at',)

    resolve_fields = ['user_id', 'course_id']
