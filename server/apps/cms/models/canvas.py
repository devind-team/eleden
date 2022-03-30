"""Контейнер на основе абсолютного позиционирования.

Неприоритетная реализация.
"""

from django.db import models

from .common import Container, Info
from .style import Margin, Padding, Size


class Canvas(Info, Size, Margin, Padding):
    """Контейнер на основе абсолютного позиционирования."""

    pass


class CanvasElement(Container):
    """Элемент контейнера на основе абсолютного позиционирования."""

    left = models.CharField(max_length=16, default='0', help_text='Отступ от левого края')
    top = models.CharField(max_length=16, default='0', help_text='Отступ от верхнего края')
    right = models.CharField(max_length=16, help_text='Отступ от правого края')
    bottom = models.CharField(max_length=16, help_text='Отступ от нижнего края')
    z_index = models.IntegerField(null=True, help_text='Порядок наложения в третьем измерении')

    canvas = models.ForeignKey(
        Canvas,
        on_delete=models.CASCADE,
        help_text='Контейнер на основе абсолютного позиционирования'
    )
