"""Секция."""
from django.db import models

from .common import Info


class Section(Info):
    """Секция."""

    TEXT = 0
    GALLERY = 1
    FILES = 2
    USERS = 3
    SLIDER = 4
    FORM = 5
    JUPYTER = 6
    DATASET = 7

    SECTION_KIND = (
        (TEXT, 'text'),
        (GALLERY, 'gallery'),
        (FILES, 'files'),
        (USERS, 'profiles'),
        (SLIDER, 'slider'),
        (FORM, 'form'),
        (JUPYTER, 'jupyter'),
        (DATASET, 'dataset')
    )

    text = models.TextField(help_text='Текст')
    kind = models.PositiveIntegerField(choices=SECTION_KIND, default=TEXT, help_text='Тип')
    payload = models.JSONField(null=True, help_text='Дополнительные данные')
    position = models.PositiveIntegerField(default=0, help_text='Позиция')

    class Meta:
        ordering = ('position',)
