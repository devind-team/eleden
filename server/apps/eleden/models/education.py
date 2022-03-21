import re

from django.db import models, transaction

from apps.core.models import User
from devind_helpers.resolve_model import ResolveModel


class EduForm(models.Model):
    """Форма обучения"""

    name = models.TextField(help_text='Название')
    short_name = models.CharField(max_length=255, help_text='Короткое название')

    parent = models.ForeignKey(
        'self',
        null=True,
        default=None,
        on_delete=models.DO_NOTHING,
        help_text='Родительская форма обучения'
    )

    class Meta:
        ordering = ('name', 'id',)


class EduService(models.Model):
    """Образовательная услуга (Бакалавриат, Специалитет)"""

    name = models.TextField(help_text='Название')


class Direction(models.Model):
    """Направление подготовки"""

    name = models.TextField(help_text='Название')
    code = models.CharField(max_length=20, unique=True, help_text='Код специальности')
    secret = models.BooleanField(default=False, help_text='Секретное направление подготовки')
    delete = models.BooleanField(default=False, help_text='Теперь не проводиться обучения по данному направлению')

    edu_service = models.ForeignKey(EduService, on_delete=models.CASCADE, help_text='Образовательная услуга')
    parent = models.ForeignKey(
        'self',
        null=True,
        default=None,
        on_delete=models.CASCADE,
        help_text='Родительское направление'
    )

    class Meta:
        ordering = ('code', 'id',)


class EduProgram(models.Model, ResolveModel):
    """Образовательная программа"""

    name = models.CharField(max_length=1024, help_text='Профиль подготовки')
    adaptive = models.BooleanField(default=False, help_text='Признак адапативности программ')
    admission = models.PositiveIntegerField(help_text='Год поступления')
    expedited = models.BooleanField(help_text='Ускоренная программа')
    description = models.FileField(
        upload_to='storage/edu_programs/description/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Описание'
    )
    description_sign = models.FileField(
        upload_to='storage/edu_programs/description/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись описания'
    )
    syllabus = models.FileField(
        upload_to='storage/edu_programs/syllabus/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Учебный план'
    )
    syllabus_sign = models.FileField(
        upload_to='storage/edu_programs/syllabus/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись учебного плана'
    )
    calendar = models.FileField(
        upload_to='storage/edu_programs/calendar/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Календарный учебный график'
    )
    calendar_sign = models.FileField(
        upload_to='storage/edu_programs/calendar/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись календарного учебного графика'
    )

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    edu_form = models.ForeignKey(EduForm, on_delete=models.CASCADE, help_text='Форма обучения')
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, help_text='Направление подготовки')

    class Meta:
        ordering = ('-admission', 'id',)

    resolve_fields = ['direction_id']

    @staticmethod
    def from_plx(*args, **kwargs) -> 'EduProgram':
        """Импорт учебного плана из файла *.plx"""

        from apps.eleden.helpers import EduProgramParser
        if 'ignore_teams' not in kwargs:
            kwargs['ignore_teams'] = False
        ep: EduProgramParser = EduProgramParser(**kwargs)
        ep.parse()
        with transaction.atomic():
            return ep()


class DisciplineKind(models.Model):
    """Тип дисциплины"""

    name = models.CharField(max_length=255, help_text='Название')
    order = models.PositiveIntegerField(default=0, help_text='Позиция для сортировки')

    class Meta:
        ordering = ('order',)


class DisciplineView(models.Model):
    """Форма представления дисциплины (Базовая, Выборная, Альтернативная)"""

    name = models.CharField(max_length=255, help_text='Название')
    order = models.PositiveIntegerField(default=0, help_text='Позиция для сортировки')

    class Meta:
        ordering = ('order',)


class Discipline(models.Model, ResolveModel):
    """Дисциплина"""

    code = models.CharField(max_length=128, help_text='Код')
    name = models.CharField(max_length=1024, help_text='Название')
    units = models.PositiveIntegerField(default=0, help_text='Фактических единиц зачета')
    hours = models.PositiveIntegerField(default=0, help_text='Часов по плану')
    annotation = models.FileField(
        upload_to='storage/disciplines/annotations/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Аннотация к рабочей программе дисциплины/практики/ГИА'
    )
    annotation_sign = models.FileField(
        upload_to='storage/disciplines/annotations/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись аннотации к рабочей программе дисциплины/практики/ГИА'
    )
    work_program = models.FileField(
        upload_to='storage/disciplines/work_programs/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Рабочая программа дисциплины'
    )
    work_program_sign = models.FileField(
        upload_to='storage/disciplines/work_programs/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись рабочей программы дисциплины'
    )

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    edu_program = models.ForeignKey(EduProgram, on_delete=models.CASCADE, help_text='Образовательная программа')
    kind = models.ForeignKey(DisciplineKind, on_delete=models.CASCADE, help_text='Тип')
    view = models.ForeignKey(DisciplineView, on_delete=models.CASCADE, help_text='Форма представления')
    team = models.ForeignKey('eleden.Team', null=True, on_delete=models.SET_NULL, help_text='Ответственная кафедра')
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE, help_text='Родительская дисциплина')

    users = models.ManyToManyField(User, help_text='Авторы')

    @property
    def order(self) -> int:
        """Позиция для сортировки"""

        if len(re.findall(r'^Б\d+\.О\.', self.code)):
            return 1
        elif len(re.findall(r'^Б\d+\.В\.\d+$', self.code)):
            return 2
        elif len(re.findall(r'^Б\d+\.В\.ДВ\.', self.code)):
            return 3
        elif len(re.findall(r'\(\w+\)', self.code)):
            return 4
        elif len(re.findall(r'^Б\d+\.\d+$', self.code)):
            return 5
        elif len(re.findall(r'^ФТД', self.code)):
            return 6
        else:
            return 0

    class Meta:
        ordering = ('code', 'id',)
        permissions = [
            ('view_discipline_additional_fields', 'Can view discipline additional fields'),
            ('change_discipline_additional_fields', 'Can change discipline additional fields')
        ]

    resolve_fields = ['edu_program_id', 'parent_id']


class WorkForm(models.Model):
    """Форма работы"""

    name = models.CharField(max_length=255, help_text='Название')
    order = models.PositiveIntegerField(default=0, help_text='Позиция для сортировки')

    class Meta:
        ordering = ('order', 'id',)


class WorkKind(models.Model):
    """Вид работы"""

    name = models.CharField(max_length=255, help_text='Название')
    short_name = models.CharField(max_length=32, help_text='Короткое название')
    is_hidden = models.BooleanField(default=False, help_text='Скрыт ли вид работы')
    is_final = models.BooleanField(default=False, help_text='Выставляется ли итоговая оценка за данный вид работы')
    order = models.PositiveIntegerField(help_text='Позиция для сортировки')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    work_form = models.ForeignKey(WorkForm, null=True, on_delete=models.CASCADE, help_text='Форма работы')

    class Meta:
        ordering = ('order', 'id',)


class HoursKind(models.Model):
    """Тип часов"""

    name = models.CharField(max_length=255, help_text='Название')


class EduHours(models.Model):
    """Часы по плану"""

    course_number = models.PositiveSmallIntegerField(default=1, help_text='Курс')
    semester_number = models.PositiveSmallIntegerField(default=1, help_text='Семестр')
    value = models.FloatField(default=0., help_text='Значение')

    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, help_text='Дисциплина')
    work_kind = models.ForeignKey(WorkKind, on_delete=models.CASCADE, help_text='Вид работы')
    hours_kind = models.ForeignKey(HoursKind, on_delete=models.CASCADE, help_text='Тип часов')

    def all(self):
        pass


class BlockKind(models.Model):
    """Тип блока образовательной программы"""

    name = models.CharField(max_length=128, help_text='Название')
    order = models.PositiveIntegerField(default=0, help_text='Позиция для сортировки')

    class Meta:
        ordering = ('order',)


class EduCycle(models.Model):
    """Цикл образовательных программ"""

    name = models.CharField(max_length=512, help_text='Название')
    code = models.CharField(max_length=128, help_text='Код')
    order = models.PositiveIntegerField(default=0, help_text='Порядок сортировки')

    block_kind = models.ForeignKey(BlockKind, on_delete=models.CASCADE, help_text='Тип блока')
    discipline_kind = models.ForeignKey(
        DisciplineKind,
        on_delete=models.CASCADE,
        help_text='Тип образовательной программы'
    )
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE, help_text='Родительский цикл')

    class Meta:
        ordering = ('order',)


class Competence(models.Model):
    """Компетенция"""

    name = models.CharField(max_length=1024, help_text='Название')
    code = models.CharField(max_length=10, help_text='Код')
    category = models.CharField(max_length=512, help_text='Категория')
    order = models.PositiveIntegerField(default=0, help_text='Порядок сортировки')

    disciplines = models.ManyToManyField(Discipline, help_text='Дисциплины')

    class Meta:
        ordering = ('order',)


class MethodologicalSupport(models.Model, ResolveModel):
    """Методическое обеспечение"""

    name = models.CharField(max_length=1024, help_text='Подпись файла')
    src = models.FileField(
        upload_to='storage/edu_programs/methodological_supports/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Файл'
    )
    src_sign = models.FileField(
        upload_to='storage/edu_programs/methodological_supports/',
        max_length=1024,
        default=None,
        null=True,
        help_text='Электронная подпись файла'
    )

    created_at = models.DateTimeField(auto_now_add=True, help_text='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, help_text='Дата обновления')

    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, help_text='Дисциплина')

    resolve_fields = ['discipline_id']
