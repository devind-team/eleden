from django.db import models

from apps.core.models import User
from .education import Discipline
from .process import CoursePeriod


class Building(models.Model):
    """Здание"""

    name = models.CharField(max_length=256, help_text='Название')
    address = models.CharField(max_length=512, help_text='Адрес')
    area = models.FloatField(help_text='Площадь')
    year = models.PositiveSmallIntegerField(help_text='Год постройки')


class Classroom(models.Model):
    """Аудитория"""

    name = models.CharField(max_length=128, help_text='Название')
    area = models.FloatField(null=True, help_text='Площадь')
    disabled = models.BooleanField(
        default=False,
        help_text='Аудитория приспособлена для лиц с ограниченными возможностями здоровья'
    )

    building = models.ForeignKey(
        Building,
        null=True,
        on_delete=models.CASCADE,
        help_text='Здание, в котором располагается аудитория'
    )


class EduClass(models.Model):
    """Учебное занятие"""

    week_day = models.PositiveSmallIntegerField(help_text='День недели')
    class_number = models.PositiveSmallIntegerField(help_text='Номер занятия')
    is_distance_learning = models.BooleanField(default=False, help_text='Дистанционное обучение или нет')

    course_period = models.ForeignKey(CoursePeriod, on_delete=models.CASCADE, help_text='Период курса')
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, help_text='Дисциплина')

    teachers = models.ManyToManyField(User, help_text='Преподаватели')
    classrooms = models.ManyToManyField(Classroom, help_text='Аудитории')
