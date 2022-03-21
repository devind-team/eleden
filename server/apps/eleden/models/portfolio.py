from django.db import models

from apps.core.models import User
from devind_core.models import File
from devind_helpers.resolve_model import ResolveModel
from .education import Discipline


class FileKind(models.Model):
    """Тип загружаемых файлов в портфолио"""

    name = models.CharField(max_length=255, help_text='Наименование цели загрузки файла')
    accept = models.CharField(max_length=255, help_text='Допустимый формат загрузки файлов')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    class Meta:
        ordering = ('created_at', 'id',)


class PortfolioFile(models.Model, ResolveModel):
    """Файл в портфолио"""

    describe = models.TextField(help_text='Описание файла в портфолио')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    file = models.OneToOneField(
        File,
        on_delete=models.CASCADE,
        primary_key=True,
        help_text='Привязанный к портфолио файл'
    )

    kind = models.ForeignKey(
        FileKind,
        null=True,
        on_delete=models.SET_NULL,
        help_text='Тип файла из портфолио'
    )
    discipline = models.ForeignKey(Discipline, null=True, on_delete=models.SET_NULL, help_text='Дисциплина')
    user = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        help_text='Пользователь, который подтверждает правильность файла, занесенного в портфолио'
    )

    class Meta:
        ordering = ('-updated_at', 'file',)

    resolve_fields = ['discipline_id']
