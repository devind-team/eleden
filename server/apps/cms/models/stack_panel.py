"""Контейнер на основе Flexbox."""

from django.db import models

from .common import Container, Info
from .style import Margin, Padding, Size


class StackPanel(Info, Size, Margin, Padding):
    """Контейнер на основе Flexbox."""

    HORIZONTAL = 0
    VERTICAL = 1

    PAGE_KIND = (
        (HORIZONTAL, 'horizontal'),
        (VERTICAL, 'vertical'),
    )

    orientation = models.PositiveSmallIntegerField(choices=PAGE_KIND, default=HORIZONTAL, help_text='Ориентация')
    line_length = models.PositiveSmallIntegerField(default=12, help_text='Число элементов в одной линии')
    justify_content = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль главной оси для разных размеров экрана',
    )
    align_items = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль поперечной оси для разных размеров экрана',
    )
    align_content = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль поперечной оси при наличии свободного пространства для разных размеров экрана'
    )


class StackPanelElement(Container, Info, Padding):
    """Элемент контейнера на основе Flexbox.

    Элемент может содержать, как контейнер, такой как StackPanel, так и произвольную секцию."""

    position = models.PositiveIntegerField(default=0, help_text='Позиция вывода')
    align_self = models.JSONField(
        null=True,
        help_text='Переопределение выравнивания вдоль поперечной оси для разных размеров экрана',
    )
    offset = models.JSONField(
        null=True,
        help_text='Смещение вдоль главной оси для разных размеров экрана'
    )

    stack_panel = models.ForeignKey(StackPanel, on_delete=models.CASCADE, help_text='Контейнер на основе Flexbox')

    class Meta:
        ordering = ('position',)
