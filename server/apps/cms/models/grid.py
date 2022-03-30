"""Контейнер на основе Grid Layout.

Неприоритетная реализация.
"""

from django.db import models

from .common import Container, Info
from .style import Margin, Padding, Size


class Grid(Info, Size, Margin, Padding):
    """Контейнер на основе Grid Layout."""

    template_columns = models.JSONField(null=True, help_text='Шаблоны столбцов для разных размеров экрана')
    template_rows = models.JSONField(null=True, help_text='Шаблоны строк для разных размеров экрана')
    column_gap = models.JSONField(
        null=True,
        help_text='Промежуток между столбцами для разных размеров экрана'
    )
    row_gap = models.JSONField(
        null=True,
        help_text='Промежуток между строками для разных размеров экрана'
    )
    justify_content = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль горизонтальной оси для разных размеров экрана',
    )
    align_content = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль вертикальной оси для разных размеров экрана'
    )
    justify_items = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль горизонтальной оси для разных размеров экрана'
    )
    align_items = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль вертикальной оси внутри ячейки для разных размеров экрана',
    )


class GridElement(Container):
    """Элемент контейнера на основе Grid Layout."""

    grid_column = models.CharField(max_length=16, default='0', help_text='Занимаемые столбцы')
    grid_row = models.CharField(max_length=16, default='0', help_text='Занимаемые строки')
    justify_self = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль горизонтальной оси для разных размеров экрана'
    )
    align_self = models.JSONField(
        null=True,
        help_text='Выравнивание вдоль вертикальной оси внутри ячейки для разных размеров экрана',
    )

    grid = models.ForeignKey(
        Grid,
        on_delete=models.CASCADE,
        help_text='Контейнер на основе Grid Layout'
    )
