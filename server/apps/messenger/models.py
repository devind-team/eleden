"""
Описание схемы базы данных для построения чата

1. Избранный чат - в чате есть только пользователь как создатель,
создается, когда пользователь только заходит
    - Имя чата - Избранное
    - Аватар - пользователь может установить
    - Пользователь администратор
2. Чат для двоих - в чате 2 человека (members)
    - в качестве аватара устанавливается аватар пользователя, с которым ведется беседа
    - имя чата по умолчанию
    - два пользователя администраторы
3. Групповой чат - в чате более двух человек
    - Создается имя чата
    - Существует возможность выбора аватара
    - Администраторы и участники
"""

from datetime import datetime

from django.contrib.postgres.fields import ArrayField
from django.db import models

from apps.core.models import User


def af_directory_path(_: 'AttachedFile', filename: str):
    """ Формирует автоматический путь загрузки файлов """
    now: datetime = datetime.now()
    return f'storage/messages/{now.year}/{now.month}/{filename}'


class AttachedFile(models.Model):
    """Прикрепляемые файлы."""
    src = models.FileField(upload_to=af_directory_path, max_length=1024, help_text='Путь к файлу')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата добавления файла')

    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, help_text='Добавивший файл')

    class Meta:
        ordering = ('-created_at',)


class Message(models.Model):
    """Сообщение."""

    text = models.TextField(help_text='Текст сообщения')
    pinned = models.BooleanField(default=False, help_text='Закреплено ли сообщение')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата изменения')

    forwarded = ArrayField(models.IntegerField(), null=True, help_text='Пересылаемые сообщения')

    attached_files = models.ManyToManyField(AttachedFile, help_text='Прикрепленные файлы')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, help_text='Автор сообщения')

    class Meta:
        ordering = ('-created_at',)


class Chat(models.Model):
    """Чат."""

    name = models.CharField(max_length=128, null=True, help_text='Название')
    avatar = models.ImageField(
        upload_to='storage/messages/avatars',
        max_length=1024,
        null=True,
        default=None,
        help_text='Аватар')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата изменения')

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='user',
        help_text='Организатор чата'
    )
    users = models.ManyToManyField(User, through='Member', help_text='Пользователи')
    messages = models.ManyToManyField(Message, through='ChatMessage', help_text='Сообщения')

    class Meta:
        ordering = ('-created_at',)


class Member(models.Model):
    """Участники чата."""

    PARTICIPANT = 0
    ADMINISTRATOR = 1
    ROLES = (
        (PARTICIPANT, 'participant'),
        (ADMINISTRATOR, 'administrator')
    )

    role = models.PositiveIntegerField(choices=ROLES, default=PARTICIPANT, help_text='Роль пользователя')
    notification = models.BooleanField(default=True, help_text='Уведомлять о сообщениях')
    favorite = models.BooleanField(default=False, help_text='Избранный чат')

    excluded = models.BooleanField(default=False, help_text='Исключен ли пользователь из чата')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата добавления')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата изменения')

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, help_text='Чат')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='Пользователь')

    class Meta:
        ordering = ('-updated_at',)
        unique_together = (('chat', 'user',),)


class ChatMessage(models.Model):
    """Сообщения."""

    delivered = models.DateTimeField(null=True, default=None, help_text='Сообщение доставлено')
    read = models.DateTimeField(null=True, default=None, help_text='Сообщение прочитано')
    favorite = models.BooleanField(default=False, help_text='Избранное сообщение')
    deleted = models.BooleanField(default=False, help_text='Сообщение удалено')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, help_text='Чат')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, help_text='Сообщения')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='Пользователь')

    class Meta:
        ordering = ('-created_at',)
        unique_together = (('chat', 'message', 'user',),)
