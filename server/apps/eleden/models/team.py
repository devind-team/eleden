from functools import reduce

from django.conf import settings
from django.db import models

from apps.core.models import User
from devind_helpers.resolve_model import ResolveModel
from .education import EduProgram


class Team(models.Model, ResolveModel):
    """Группа пользователей"""

    name = models.CharField(max_length=255, help_text='Название')
    short_name = models.CharField(max_length=50, unique=True, help_text='Сокращенное название')
    admission = models.PositiveIntegerField(help_text='Год образования/поступления')
    delete = models.BooleanField(default=False, help_text='Удалена ли группа (закончено обучение)')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    group = models.ForeignKey('auth.Group', null=True, on_delete=models.SET_NULL, help_text='Группа прав')
    edu_program = models.ForeignKey(
        EduProgram,
        null=True,
        on_delete=models.SET_NULL,
        help_text='Реализуемая образовательная программа'
    )
    parent = models.ForeignKey(
        'self',
        null=True,
        on_delete=models.CASCADE,
        help_text='Родительская группа (Администрация -> Кафедра -> Студенты)'
    )

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='Job',
        related_name='teams',
        help_text='Участники'
    )
    responsible_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='responsible_teams',
        help_text='Пользователи, ответственные за группу'
    )

    class Meta:
        ordering = ('-updated_at', 'id',)

    resolve_fields = ['user_id', 'parent_id', 'edu_program_id']

    @staticmethod
    def can_view(user: User) -> bool:
        """Возвращает разрешение на просмотр всех групп.

        :param user: пользователь
        :return: разрешение на просмотр
        """

        return reduce(
            lambda acc, curr: acc or user.has_perm(curr),
            [
                'eleden.view_team', 'eleden.view_course',
                'eleden.add_course', 'eleden.change_course',
                'eleden.delete_course'
            ],
            False
        )


class JobPostStatus(models.Model):
    """Статус должности пользователя на месте работы"""

    name = models.CharField(max_length=256, help_text='Название')
    active = models.BooleanField(default=False, help_text='Является ли статус активным')
    template_docx = models.FileField(
        upload_to='storage/job_status/templates/docx',
        default=None,
        null=True,
        help_text='Шаблон docx для формрования приказа по присвоению статуса'
    )
    template_xml = models.FileField(
        upload_to='storage/job_status/templates/xml',
        default=None,
        null=True,
        help_text='Шаблон xml для формирования приказа по присвоению статуса'
    )
    order = models.PositiveIntegerField(help_text='Позиция для сортировки')

    class Meta:
        ordering = ('order', 'id',)


class JobPostStatusHistory(models.Model):
    """История стасусов должности пользователя на месте работы"""

    decree_docx = models.FileField(
        upload_to='storage/job_status/decrees/docx',
        max_length=256,
        default=None,
        null=True,
        help_text='Приказ по присвоению статуса в формате docx'
    )
    decree_pdf = models.FileField(
        upload_to='storage/job_status/decrees/pdf',
        max_length=256,
        default=None,
        null=True,
        help_text='Приказ по присвоению статуса в формате pdf'
    )

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата получения статуса')
    end_at = models.DateTimeField(null=True, default=None, help_text='Дата потери статуса')

    job_post = models.ForeignKey(
        'JobPost',
        on_delete=models.CASCADE,
        related_name='status_history_set',
        help_text='Должность пользователя на месте работы',
    )
    status = models.ForeignKey(
        JobPostStatus,
        on_delete=models.CASCADE,
        related_name='status_history_set',
        help_text='Статус места работы пользователя'
    )

    class Meta:
        ordering = ('created_at',)


class Post(models.Model):
    """Занимаемая должность"""

    name = models.CharField(max_length=512, help_text='Название')
    order = models.PositiveIntegerField(help_text='Позиция для сортировки')

    statuses = models.ManyToManyField(JobPostStatus, help_text='Возможные статусы')

    class Meta:
        ordering = ('order', 'id',)


class Job(models.Model, ResolveModel):
    """Место работы пользователя"""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, help_text='Группа')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, help_text='Пользователь')

    resolve_fields = ['team_id', 'user_id']


class JobPost(models.Model):
    """Должность пользователя на месте работы"""

    MAIN_JOB = 'MJ'
    INTERNAL_PART_TIME = 'IP'
    EXTERNAL_PART_TIME = 'EP'
    CIVIL_CONTRACT = 'CC'
    JOB_KINDS = [
        (MAIN_JOB, 'Основное место работы'),
        (INTERNAL_PART_TIME, 'Внутренний совместитель'),
        (EXTERNAL_PART_TIME, 'Внешний совместитель'),
        (CIVIL_CONTRACT, 'Договор гражданско правового характера')
    ]

    rate = models.FloatField(default=1., help_text='Занимаемая ставка')
    kind = models.CharField(max_length=2, choices=JOB_KINDS, default=MAIN_JOB, help_text='Тип работы')

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='job_post_set',
        help_text='Место работы пользователя'
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='job_post_set',
        help_text='Занимаемая дожность'
    )
