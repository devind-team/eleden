"""Страница."""
from django.db import models

from .category import Category
from .common import Info


class Tag(Info):
    """Тег."""

    name = models.CharField(max_length=256, help_text='Название')

    class Meta:
        ordering = ('-created_at',)


class Page(Info):
    """Страница."""

    REGULAR = 0
    MAIN = 1

    PAGE_KIND = (
        (REGULAR, 'regular'),
        (MAIN, 'main')
    )

    title = models.CharField(max_length=1024, help_text='Заголовок')
    avatar = models.FileField(upload_to='storage/cms/page/avatars/', null=True, help_text='Аватар')
    views = models.PositiveIntegerField(default=0, help_text='Количество просмотров')
    hide = models.BooleanField(default=False, help_text='Скрываем ли страницу')
    priority = models.BooleanField(default=False, help_text='Приоритет')
    kind = models.PositiveIntegerField(choices=PAGE_KIND, default=REGULAR, help_text='Тип страницы')

    category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE, help_text='Категория')

    tags = models.ManyToManyField(Tag, help_text='Теги на странице')

    class Meta:
        ordering = ('-priority', '-created_at')
