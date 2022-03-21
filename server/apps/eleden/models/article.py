"""Модели для публикаций."""

import json

from django.db import models

from apps.core.models import User
from devind_helpers.resolve_model import ResolveModel


class ArticleIndex(models.Model):
    """Описание типа индексирования публикации."""

    name = models.CharField(max_length=256, help_text='Название рецензирования')
    coefficient = models.FloatField(default=1., help_text='Коэффициент учета')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    class Meta:
        ordering = ('coefficient',)


def articles_path(instance, filename: str):
    """Формируем автоматический путь директории пользователя."""
    return f'storage/articles/{instance.user.id}/{filename}'


class ArticleKind(models.Model):
    """Тип публикации."""

    name = models.CharField(max_length=256, help_text='Название типа публикации')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')


class Article(models.Model, ResolveModel):
    """Статья."""

    src = models.FileField(upload_to=articles_path, help_text='Путь к файлу')
    name = models.TextField(help_text='Выходные параметры статьи')
    year = models.PositiveIntegerField(help_text='Год выхода статьи')
    workload = models.FloatField(null=True, help_text='Объем работы')

    additional = models.JSONField(null=True, help_text='Дополнительные параметры')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    kind = models.ForeignKey(
        ArticleKind,
        null=True,
        default=None,
        on_delete=models.SET_NULL,
        help_text='Тип публикации'
    )

    index = models.ForeignKey(
        ArticleIndex,
        null=True,
        default=None,
        on_delete=models.SET_NULL,
        help_text='Описание типа рецензирования статьи'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='Пользователь, добавивший публикацию')
    users = models.ManyToManyField(
        User,
        related_name='articles',
        through='Author',
        help_text='Зарегистрированные авторы публикации'
    )

    class Meta:
        ordering = ('-year', '-created_at',)

    @property
    def additional_text(self) -> str:
        """Дополнительные параметры в текст."""
        return json.dumps(self.additional, ensure_ascii=False)


class Author(models.Model):
    """Автор публикации."""

    name = models.CharField(max_length=256, help_text='Фамилия и инициалы автора')
    weight = models.FloatField(help_text='Вклад автора в работу')
    order = models.PositiveIntegerField(help_text='Позиция в авторах публикации')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, help_text='Идентификатор пользователя')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, help_text='Публикация')
