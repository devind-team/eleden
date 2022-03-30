from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Info(models.Model):
    """Общая информация о записи."""

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        help_text='Создавший пользователь'
    )

    class Meta:
        abstract = True


class Container(models.Model):
    """Контейнер с содержимым."""

    content_id = models.PositiveIntegerField(help_text='Идентификатор содержимого')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, help_text='Модель содержимого')
    content = GenericForeignKey('content_type', 'content_id')

    class Meta:
        abstract = True
