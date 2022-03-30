"""Категория страницы."""
from django.db import models

from .common import Info


class Category(Info):
    """Категория страницы."""

    avatar = models.FileField(upload_to='storage/cms/category/avatars/', default=None, null=True, help_text='Аватар')
    text = models.CharField(max_length=1024, help_text='Текст')
    position = models.PositiveIntegerField(default=0, help_text='Позиция вывода')

    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, help_text='Родительская категория')

    class Meta:
        ordering = ('position',)
