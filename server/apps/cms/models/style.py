from django.db import models


class Size(models.Model):
    """Размеры."""

    width = models.CharField(max_length=16, help_text='Ширина')
    height = models.CharField(max_length=16, help_text='Высота')

    class Meta:
        abstract = True


class Margin(models.Model):
    """Внешние отступы."""

    margin_top = models.CharField(max_length=16, default='0', help_text='Внешний отступ сверху')
    margin_right = models.CharField(max_length=16, default='0', help_text='Внешний отступ справа')
    margin_bottom = models.CharField(max_length=16, default='0', help_text='Внешний отступ снизу')
    margin_left = models.CharField(max_length=16, default='0', help_text='Внешний отступ слева')

    class Meta:
        abstract = True


class Padding(models.Model):
    """Поля"""

    padding_top = models.CharField(max_length=16, default='0', help_text='Поле сверху')
    padding_right = models.CharField(max_length=16, default='0', help_text='Поле справа')
    padding_bottom = models.CharField(max_length=16, default='0', help_text='Поле снизу')
    padding_left = models.CharField(max_length=16, default='0', help_text='Поле слева')

    class Meta:
        abstract = True
