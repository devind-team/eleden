import django_filters
from django.contrib.postgres.aggregates import StringAgg
from django.db.models import Q, Value, Count, QuerySet
from django.db.models.functions import Concat, Substr
from graphene_django.filter import GlobalIDFilter, GlobalIDMultipleChoiceFilter
from graphql_relay import from_global_id

from .models import Team, EduProgram, Discipline, WorkKind, PortfolioFile, Course, Period


class TeamFilterSet(django_filters.FilterSet):
    """Фильтр для поиска групп пользователей."""

    name__icontains = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    short_name__icontains = django_filters.CharFilter(field_name='short_name', lookup_expr='icontains')
    admission__icontains = django_filters.CharFilter(field_name='admission', lookup_expr='icontains')
    course_count = django_filters.NumberFilter(field_name='course_count')
    course_count__gt = django_filters.NumberFilter(field_name='course_count', lookup_expr='gt')

    class Meta:
        model = Team
        fields = [
            'name__icontains',
            'short_name__icontains',
            'admission__icontains',
            'course_count',
            'course_count__gt',
        ]

    @property
    def qs(self):
        """Переопределяем стандартное поведение qs.

        :return: QuerySet
        """

        queryset: QuerySet = self.queryset.annotate(course_count=Count('course'))
        query_icontains = Q()
        for field, q in self.data.items():
            if '__icontains' in field:
                query_icontains |= Q(**{field: q})
            elif field == 'course_count':
                queryset = queryset.filter(course_count=q)
            elif field == 'course_count__gt':
                queryset = queryset.filter(course_count__gt=q)
        return queryset.filter(query_icontains).order_by('-updated_at', 'id')


class EduProgramFilterSet(django_filters.FilterSet):
    """Фильтр для сортировки направлений подготовки."""

    name__icontains = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    admission__icontains = django_filters.CharFilter(field_name='admission', lookup_expr='icontains')

    direction__code__icontains = django_filters.CharFilter(field_name='direction__code', lookup_expr='icontains')
    direction__name__icontains = django_filters.CharFilter(field_name='direction__name', lookup_expr='icontains')

    class Meta:
        model = EduProgram
        fields = [
            'name__icontains',
            'admission__icontains',
            'direction__code__icontains',
            'direction__name__icontains',
        ]

    @property
    def qs(self):
        """Переопределяем стандартное поведение qs.

        :return: QuerySet
        """

        query_icontains = Q()
        for field, q in self.data.items():
            if '__icontains' in field:
                query_icontains |= Q(**{field: q})
        return self.queryset.filter(query_icontains)


class DisciplineFilterSet(django_filters.FilterSet):
    """Фильтр для выборки дисциплин."""

    code = django_filters.CharFilter(field_name='code', lookup_expr='exact')
    code__icontains = django_filters.CharFilter(field_name='code', lookup_expr='icontains')
    name = django_filters.CharFilter(field_name='name', lookup_expr='exact')
    name__icontains = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    created_at = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='exact')
    updated_at = django_filters.DateTimeFilter(field_name='updated_at', lookup_expr='exact')
    edu_program__id = GlobalIDFilter(field_name='edu_program')
    view__id = django_filters.NumberFilter(field_name='view_id', lookup_expr='exact')

    class Meta:
        model = Discipline
        fields = [
            'code',
            'code__icontains',
            'name',
            'name__icontains',
            'created_at',
            'updated_at',
            'edu_program_id',
            'view_id',
        ]

    @property
    def qs(self):
        """Переопределяем стандартное поведение qs.

        :return: QuerySet
        """

        queryset: QuerySet = self.queryset
        query_icontains = Q()
        for field, q in self.data.items():
            if self.filters[field].lookup_expr == 'icontains':
                query_icontains |= Q(**{field: q})
            elif self.filters[field].lookup_expr == 'exact':
                if isinstance(self.filters[field], GlobalIDFilter):
                    queryset = queryset.filter(**{field: from_global_id(q)[1]})
        return queryset.filter(query_icontains)


class PortfolioFileFilterSet(django_filters.FilterSet):
    """Фильтр для выборки файлов портфолио."""

    discipline_id = GlobalIDFilter(field_name='discipline')
    file__user_id__in = GlobalIDMultipleChoiceFilter(field_name='file__user_id')
    describe__icontains = django_filters.CharFilter(field_name='describe', lookup_expr='icontains')
    kind_id = django_filters.NumberFilter(field_name='kind_id', lookup_expr='exact')
    is_confirmed = django_filters.BooleanFilter(field_name='user', lookup_expr='isnull', exclude=True)

    class Meta:
        model = PortfolioFile
        fields = [
            'discipline_id',
            'file__user_id__in',
            'describe__icontains',
            'kind_id',
            'is_confirmed'
        ]


class CourseFilterSet(django_filters.FilterSet):
    """Фильтр для выборки курсов."""

    semester__icontains = django_filters.CharFilter(field_name='semester', lookup_expr='icontains')
    semester = django_filters.NumberFilter(field_name='semester')
    discipline_name__icontains = django_filters.CharFilter(
        field_name='edu_hours__discipline__name',
        lookup_expr='icontains'
    )
    discipline_id__in = GlobalIDMultipleChoiceFilter(field_name='edu_hours__discipline__id__in')
    work_kind_name__icontains = django_filters.CharFilter(
        field_name='edu_hours__work_kind__name',
        lookup_expr='icontains'
    )
    work_kind_id__in = django_filters.ModelMultipleChoiceFilter(
        field_name='edu_hours__work_kind__id__in',
        queryset=WorkKind.objects.all(),
    )
    teachers_names__icontains = django_filters.CharFilter(
        field_name='teachers_names',
        lookup_expr='icontains'
    )
    teacher_id__in = GlobalIDMultipleChoiceFilter(field_name='teachers__id__in')

    class Meta:
        model = Course
        fields = [
            'semester__icontains',
            'semester',
            'discipline_name__icontains',
            'discipline_id__in',
            'work_kind_name__icontains',
            'work_kind_id__in',
            'teachers_names__icontains',
            'teacher_id__in'
        ]

    @property
    def qs(self):
        """Переопределяем стандартное поведение qs.

        :return: QuerySet
        """

        queryset: QuerySet = self.queryset.annotate(
            teachers_names=Concat(
                StringAgg(
                    Concat(
                        'teachers__last_name', Value(' '),
                        'teachers__first_name', Value(' '), 'teachers__sir_name'
                    ), ', '
                ),
                Value(' '),
                StringAgg(
                    Concat(
                        'teachers__last_name', Value(' '),
                        Substr('teachers__first_name', 1, 1), Value('. '),
                        Substr('teachers__sir_name', 1, 1), Value('.')
                    ), ', '
                )
            )
        )
        query_icontains = Q()
        for field, q in self.data.items():
            django_filter: django_filters.Filter = self.filters[field]
            if django_filter.lookup_expr == 'icontains':
                query_icontains |= Q(**{f'{django_filter.field_name}__icontains': q})
            else:
                if isinstance(django_filter, GlobalIDFilter):
                    queryset = queryset.filter(**{django_filter.field_name: from_global_id(q)[1]})
                elif isinstance(django_filter, GlobalIDMultipleChoiceFilter):
                    queryset = queryset.filter(**{django_filter.field_name: [from_global_id(v)[1] for v in q]})
                else:
                    queryset = queryset.filter(**{django_filter.field_name: q})
        return queryset.filter(query_icontains)


class HandoutFilterSet(django_filters.FilterSet):
    """Фильтр для выборки раздаточного материала."""

    description__icontains = django_filters.CharFilter(field_name='description', lookup_expr='icontains')
    period_id__in = django_filters.ModelMultipleChoiceFilter(
        field_name='period__id__in',
        queryset=Period.objects.all(),
    )

    @property
    def qs(self):
        """Переопределяем стандартное поведение qs.

        :return: QuerySet
        """

        query_icontains = Q()
        queryset = self.queryset
        for field, q in self.data.items():
            django_filter: django_filters.Filter = self.filters[field]
            if django_filter.lookup_expr == 'icontains':
                query_icontains |= Q(**{f'{django_filter.field_name}__icontains': q})
            else:
                queryset = queryset.filter(**{django_filter.field_name: q})
        return queryset.filter(query_icontains)
