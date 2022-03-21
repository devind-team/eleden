"""Модуль с фабрикой для создания данных моделей из данных"""
import re
from dataclasses import dataclass
from itertools import chain, combinations
from typing import Any, Generic, TypeVar, Optional, Union, Iterable, NamedTuple

from django.contrib.postgres.search import SearchQuery, SearchVector, TrigramSimilarity
from django.db.models import Q, QuerySet

from apps.core.models import User
from apps.eleden.models import WorkKind, EduProgram, Discipline, Period, Team
from .data import TeacherData, CoupleData, TeamData, CoupleModelData, TeamModelData
from .names_map import NamesMap
from .wrong import WrongKind, WrongItem, WrongTeamItem, WrongCoupleItem, WrongItems

T1 = TypeVar('T1')
T2 = TypeVar('T2')


@dataclass
class CreationResult(Generic[T1]):
    """Результат создание данных модели"""

    # Данные модели
    model_data: Optional[T1]
    # Успешно ли сохранение
    success: bool = True
    # Словарь неправильных элементов, в котором key - название свойства, а value - неправильные элементы
    wrong: Optional[WrongItems.WrongDict] = None

    def __iter__(self):
        return iter((self.model_data, self.success, self.wrong))


@dataclass
class SearchResult(Generic[T2]):
    """Результат поиска модели"""

    # Найденное значение
    value: Optional[T2]
    # Успешен ли поиск
    success: bool = True
    # Ненайденные элементы
    wrong: Optional[list[WrongItem]] = None

    def __iter__(self):
        return iter((self.value, self.success, self.wrong))


class CreationResults(NamedTuple):
    """Результаты создания данных моделей"""

    # Неправильные данные групп
    wrong_teams_data: list[TeamData]
    # Созданные данные моделей групп
    teams_model_data: list[TeamModelData]
    # Список словарей неправильных элементов, в котором key - название свойства, а value - неправильные элементы
    wrongs: list[WrongItems.WrongDict]


class ModelDataFactory:
    """Фабрика данных моделей"""

    def __init__(self, teams_data: list[TeamData], teams_filter: dict[str, Any], names_map: NamesMap):
        self._teams_data = teams_data
        self._teams_filter = teams_filter
        self._names_map = names_map
        self._creation_results: CreationResults = self._create_models_data()

    @property
    def creation_results(self) -> CreationResults:
        """Результаты создания данных моделей"""

        return self._creation_results

    def _create_models_data(self) -> CreationResults:
        """Создание данных моделей.

        :return: результат создания данных моделей
        """

        results = CreationResults([], [], [])
        for team_data in self._get_right_teams_data(self._teams_data):
            team_model_data, team_success, team_wrong = self._try_create_team(team_data)
            wrong_team_data = TeamData(
                team_data.excel_info,
                team_data.short_name,
                team_data.course_number,
                team_data.semester_number
            )
            results.wrong_teams_data.append(wrong_team_data)
            if team_success:
                results.teams_model_data.append(team_model_data)
            else:
                results.wrongs.append(team_wrong)
            for couple_data in self._get_right_couples_data(team_data.couples):
                couple_model_data, couple_success, couple_wrong = self._try_create_couple(
                    couple_data,
                    team_model_data.team.edu_program if team_success and team_model_data.team.edu_program else None
                )
                if couple_success and team_success:
                    team_model_data.couples.append(couple_model_data)
                else:
                    wrong_team_data.couples.append(couple_data)
                    results.wrongs.append(couple_wrong)
            if len(wrong_team_data.couples) == 0:
                results.wrong_teams_data.remove(wrong_team_data)
        return results

    def _get_right_teams_data(self, teams_data: list[TeamData]) -> Iterable[TeamData]:
        """Получение правильных данных групп.

        :param teams_data: возможно неправильные данные групп
        :return: правильные данные групп
        """

        for team_data in teams_data:
            if not self._names_map.is_team_data_deleted(team_data):
                yield self._names_map.get_team_data(team_data)

    def _get_right_couples_data(self, couples_data: list[CoupleData]) -> Iterable[CoupleData]:
        """Получение правильных данных пар.

        :param couples_data: возможно неправильные данные пар
        :return: правильные данные пар
        """

        for couple_data in couples_data:
            if not self._names_map.is_couple_data_deleted(couple_data):
                yield self._names_map.get_couple_data(couple_data)

    def _try_create_team(self, team_data: TeamData) -> Union[CreationResult[TeamModelData], CreationResult[None]]:
        """Попытка создания данных модели группы.

        :param team_data: данные группы
        :return: результат создание данных модели группы
        """

        teams = Team.objects.filter(
            **self._teams_filter,
            short_name__regex='^' + ''.join(map(lambda c: fr'{c}\s*', re.sub(r'\s', '', team_data.short_name)))
            .replace('(', r'\(').replace(')', r'\)') + '$'
        )
        if teams.count() == 0:
            possible_values = list(map(
                lambda t: t.short_name,
                Team.objects.annotate(similarity=TrigramSimilarity('short_name', team_data.short_name))
                    .filter(similarity__gt=0.3).order_by('-similarity').all()
            ))
            return CreationResult(None, False, {'teams': [WrongTeamItem(
                team_data=team_data,
                possible_values=possible_values
            )]})
        elif teams.count() > 1:
            return CreationResult(None, False, {'teams': [
                WrongTeamItem(team_data=team_data, kind=WrongKind.MULTIPLE)
            ]})
        team = teams.first()
        if team.edu_program is None:
            return CreationResult(None, False, {'teams': [
                WrongTeamItem(
                    team_data=team_data,
                    kind=WrongKind.WRONG_DATA,
                    message='Отсутствует образовательная программа'
                )
            ]})
        return CreationResult(TeamModelData(teams.first(), team_data.course_number, team_data.semester_number))

    def _try_create_couple(self,
                           couple_data: CoupleData,
                           edu_program: Optional[EduProgram]) -> Union[CreationResult[CoupleModelData],
                                                                       CreationResult[None]]:
        """Попытка создания данных модели пары.

        :param couple_data: данные пары
        :param edu_program: образовательная программа
        :return: результат создания данных модели пары
        """

        undiscovered: dict[str, list[WrongItem]] = {}
        work_kind_search_result = self._try_find_work_kind(couple_data)
        if not work_kind_search_result.success:
            undiscovered['work_kinds'] = work_kind_search_result.wrong
        periods_search_result = self._try_find_periods(couple_data)
        if not periods_search_result.success:
            undiscovered['periods'] = periods_search_result.wrong
        teachers_search_result = self._try_find_teachers(couple_data)
        if not teachers_search_result.success:
            undiscovered['teachers'] = teachers_search_result.wrong
        discipline_search_result = self._try_find_discipline(couple_data, edu_program)
        if not discipline_search_result.success:
            undiscovered['disciplines'] = discipline_search_result.wrong
        if len(undiscovered):
            return CreationResult(None, False, undiscovered)
        return CreationResult(CoupleModelData(
            work_kind_search_result.value,
            couple_data.week_day,
            discipline_search_result.value,
            periods_search_result.value,
            teachers_search_result.value,
            couple_data.subgroup_number,
            couple_data.classrooms,
            couple_data.class_numbers,
            couple_data.distance_learning
        ))

    @staticmethod
    def _try_find_work_kind(couple_data: CoupleData) -> SearchResult[WorkKind]:
        """Попытка найти вид работы.

        :param couple_data: данные пары
        :return: результат поиска
        """

        if not couple_data.work_kind:
            return SearchResult(None, True)
        work_kinds_qs = WorkKind.objects.filter(short_name=couple_data.work_kind)
        if work_kinds_qs.count() == 1:
            return SearchResult(work_kinds_qs.first())
        kind = WrongKind.MULTIPLE if work_kinds_qs.count() != 0 else WrongKind.UNDISCOVERED
        possible_values = list(map(
            lambda wk: wk.short_name,
            WorkKind.objects.annotate(similarity=TrigramSimilarity('short_name', couple_data.work_kind))
            .filter(similarity__gt=0.3).order_by('-similarity').all()
        )) if kind is WrongKind.UNDISCOVERED else []
        return SearchResult(None, False, [WrongCoupleItem(couple_data, couple_data.work_kind, possible_values, kind)])

    @staticmethod
    def _try_find_periods(couple_data: CoupleData) -> SearchResult[list[Period]]:
        """Попытка найти периоды.

        :param couple_data: данные пары
        :return: результат поиска
        """

        if callable(couple_data.periods):
            return SearchResult([period for period in Period.objects.all() if couple_data.periods(period.short_name)])
        wrong_periods: list[WrongItem] = []
        periods: list[Period] = []
        for short_name in couple_data.periods:
            periods_qs = Period.objects.filter(short_name=short_name)
            if periods_qs.count() == 1:
                periods.append(periods_qs.first())
            else:
                kind = WrongKind.MULTIPLE if periods_qs.count() != 0 else WrongKind.UNDISCOVERED
                possible_values = list(map(
                    lambda p: p.short_name,
                    Period.objects.annotate(similarity=TrigramSimilarity('short_name', short_name))
                        .filter(similarity__gt=0.3).order_by('-similarity').all()
                )) if kind is WrongKind.UNDISCOVERED else []
                wrong_periods.append(WrongCoupleItem(couple_data, short_name, possible_values, kind))
        if len(wrong_periods):
            return SearchResult(None, False, wrong_periods)
        return SearchResult(periods)

    def _try_find_teachers(self, couple_data: CoupleData) -> SearchResult[list[User]]:
        """Попытка найти преподавателей.

        :param couple_data: данные пары
        :return: результат поиска
        """

        teachers: list[User] = []
        wrong_teachers: list[WrongItem] = []
        for teacher_data in couple_data.teachers:
            found_teachers = self._try_find_teacher(teacher_data)
            if found_teachers.count() == 0:
                possible_values = self._find_teacher_possible_values(teacher_data)
                wrong_teachers.append(WrongCoupleItem(couple_data, str(teacher_data), possible_values))
            elif found_teachers.count() == 1:
                teachers.append(found_teachers.first())
            elif teacher_data.position:
                teachers_with_rank = self._narrow_with_rank(found_teachers, teacher_data.position)
                if teachers_with_rank.count() == 1:
                    teachers.append(teachers_with_rank.first())
                else:
                    wrong_teachers.append(WrongCoupleItem(
                        couple_data, str(teacher_data), None, WrongKind.MULTIPLE)
                    )
        if len(wrong_teachers):
            return SearchResult(None, False, wrong_teachers)
        return SearchResult(teachers)

    @staticmethod
    def _try_find_teacher(teacher_data: TeacherData) -> QuerySet[User]:
        """Попытка найти преподавателя.

        :param teacher_data: данные преподавателя
        :return: найденные преподаватели
        """

        initials = teacher_data.initials.split('.')
        last_name_regex = '^' + re.sub(r'[её]', '(е|ё)', re.sub(r'[ЕЁ]', '(Е|Ё)', teacher_data.last_name)) + '$'
        return User.objects.filter(
            last_name__regex=last_name_regex,
            first_name__startswith=initials[0],
            sir_name__startswith=initials[1],
        )

    @staticmethod
    def _narrow_with_rank(found_teachers: QuerySet[User], position: str) -> QuerySet[User]:
        """Сужение поиска с учетом должности.

        :param found_teachers: найденные преподаватели
        :param position: должность
        :return: найденные преподаватели с учетом должности
        """

        return found_teachers.filter(
            Q(profilevalue__value__startswith=position[0:-1]) |
            Q(profilevalue__value__startswith=position[0:-1].replace('.', '. ')),
            profilevalue__profile__code='rank'
        )

    @staticmethod
    def _find_teacher_possible_values(teacher_data: TeacherData) -> list[str]:
        """Найти возможные значения для ненайденного преподавателя.

        :param teacher_data: данные преподавателя
        :return: возможные значения для ненайденного преподавателя
        """

        initials = teacher_data.initials.split('.')
        return list(map(
            lambda u: f'{u.last_name} {u.first_name[0]}.{u.sir_name[0]}.',
            User.objects.annotate(similarity=TrigramSimilarity('last_name', teacher_data.last_name))
                .filter(first_name__startswith=initials[0],
                        sir_name__startswith=initials[1],
                        similarity__gt=0.5)
                .order_by('-similarity').all()
        ))

    def _try_find_discipline(self,
                             couple_data: CoupleData,
                             edu_program: Optional[EduProgram]) -> SearchResult[Discipline]:
        """Попытка найти дисциплину.

        :param couple_data: данные пары
        :param edu_program: образовательная программа
        :return: результат поиска
        """

        for search_words in self._get_discipline_search_words(couple_data.discipline_words):
            edu_program_dict = {'edu_program': edu_program} if edu_program else {}
            disciplines = Discipline.objects.filter(name=' '.join(search_words), **edu_program_dict)
            if disciplines.count() in [2, 3] and disciplines.count() == \
                    len(set(map(lambda d: d.view.name, disciplines.all()))):
                return SearchResult(disciplines.order_by('view__order').first())
            if disciplines.count() > 1:
                return SearchResult(None, False, [
                    WrongCoupleItem(couple_data, ' '.join(search_words), None, WrongKind.MULTIPLE)
                ])
            elif disciplines.count() == 1:
                return SearchResult(disciplines.first())
        possible_values: Optional[list[str]] = \
            self._find_discipline_possible_values(couple_data.discipline_words, edu_program) if edu_program else None
        return SearchResult(
            None,
            False,
            [WrongCoupleItem(couple_data, ' '.join(couple_data.discipline_words), possible_values)]
        )

    @staticmethod
    def _get_discipline_search_words(discipline_words: list[str]) -> Iterable[list[str]]:
        """Получение слов для поиска дисциплины.

        :param discipline_words: слова дисциплины
        :return: слова для поиска дисциплины
        """

        yield discipline_words
        for words in [discipline_words, [word[0:-1].replace('-', '') + word[-1] for word in discipline_words]]:
            indexes_with_hyphen = [item[0] for item in enumerate(words) if item[1][-1] == '-']
            for delete_hyphen_indexes in chain.from_iterable(
                    combinations(indexes_with_hyphen, r) for r in range(len(indexes_with_hyphen) + 1)):
                search_words: list[str] = []
                i = 0
                while i < len(words):
                    if i in indexes_with_hyphen:
                        if i in delete_hyphen_indexes:
                            search_words.append(words[i][0:-1] + words[i + 1])
                        else:
                            search_words.append(words[i] + words[i + 1])
                        i += 2
                    else:
                        search_words.append(words[i])
                        i += 1
                yield search_words

    @staticmethod
    def _find_discipline_possible_values(discipline_words: list[str], edu_program: EduProgram) -> list[str]:
        """Найти возможные значения для ненайденной дисциплины.

        :param discipline_words: слова названия дисциплины
        :param edu_program: образовательная программа
        :return: возможные значения для ненайденной дисциплины
        """

        discipline_name = ' '.join(discipline_words)
        edu_program_disciplines = Discipline.objects.filter(edu_program=edu_program)
        disciplines = edu_program_disciplines.annotate(
            search=SearchVector('name', config='russian'), similarity=TrigramSimilarity('name', discipline_name)
        ).filter(Q(search=SearchQuery(discipline_name, config='russian')) | Q(similarity__gt=0.5)) \
         .order_by('-similarity')
        return list(map(lambda d: d.name, disciplines.all()))
