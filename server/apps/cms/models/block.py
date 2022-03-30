"""Блок на странице."""
from django.db import models

from .common import Container, Info
from .page import Page
from .style import Margin, Padding, Size


class Block(Container, Info, Size, Margin, Padding):
    """Блок на странице.

    Блоки располагаются вертикально друг за другом.
    Блок может содержать, как контейнер, такой как StackPanel, так и произвольную секцию.
    """

    is_adaptive = models.BooleanField(default=False, help_text='Является ли ширина адаптивной под экран пользователя')
    has_parallax = models.BooleanField(default=False, help_text='Показывать параллакс или нет')
    position = models.PositiveIntegerField(default=0, help_text='Позиция вывода')

    page = models.ForeignKey(Page, on_delete=models.CASCADE, help_text='Страница')
