from django.db import models
from django.contrib.postgres.fields import ArrayField


class Subsection(models.Model):
    """Подраздел"""
    header = models.CharField(max_length=255, help_text='Название подраздела')
    url = models.CharField(max_length=255, unique=True, help_text='Адрес подраздела')

    class Meta:
        ordering = ('id',)


class ItemPropContainer(models.Model):
    """Контейнер с данными и структурой"""
    header = models.CharField(max_length=255, help_text='Подпись к данным')
    values = ArrayField(ArrayField(models.TextField()), default=list, help_text='Данные')
    is_generated = models.BooleanField(default=False, help_text='Флаг, что данные заполняются автоматически')
    subsection = models.ForeignKey(Subsection, null=True, on_delete=models.CASCADE, help_text='Подраздел')

    class Meta:
        ordering = ('id',)


class ItemProp(models.Model):
    """Главный тег"""
    item_prop = models.CharField(max_length=255, help_text='Главный тег')
    container = models.OneToOneField(ItemPropContainer, on_delete=models.CASCADE, help_text='Контейнер с данными')

    class Meta:
        ordering = ('id',)


class ChildItemProp(models.Model):
    """Дочерний тег"""
    header = models.CharField(max_length=255, help_text='Подпись к единице информации')
    item_prop = models.CharField(max_length=255, help_text='Дочерний тег')
    show_position = models.PositiveIntegerField(help_text='Позиция дочернего тега при выводе')
    value_position = models.PositiveIntegerField(help_text='Индекс под которым хранится данные с тегом')
    parent = models.ForeignKey(ItemProp, on_delete=models.CASCADE, help_text='Главный тег')

    class Meta:
        ordering = ('show_position', 'id',)
