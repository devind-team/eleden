from typing import List, Type

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model
from lxml import etree, objectify

from apps.eleden.models import EduForm, \
    EduService, \
    EduProgram, \
    Direction, \
    DisciplineKind, \
    DisciplineView, \
    Team, \
    Discipline, \
    WorkForm, \
    WorkKind, \
    HoursKind, \
    EduHours, \
    BlockKind, \
    EduCycle, \
    Competence


class EduProgramParser:
    """Парсер файла формата pxl."""

    @staticmethod
    def get_dict_without_keys(d: dict, keys: list) -> dict:
        """Получение словаря без указанных ключей.

        :param d: словарь
        :param keys: исключаемые ключи
        :return: словарь без указанных ключей
        """
        return {k: d[k] for k in d.keys() - keys}

    @staticmethod
    def set_model_to_dicts(model_dicts: List[dict], key: str) -> None:
        """Установка модели в словари вместо другого словаря.

        :param model_dicts: словари
        :param key: ключ словаря, по которому устанавливается модель
        """
        for model_dict in model_dicts:
            model_dict[key] = model_dict[key]['model']

    @staticmethod
    def save(model: Type[Model], model_dicts: List[dict]) -> None:
        """Сохранение словарей в базу данных.

        :param model: модель для сохранения
        :param model_dicts: словари
        """
        for model_object in model_dicts:
            if 'parent' in model_object and model_object['parent'] is not None:
                EduProgramParser.set_model_to_dicts([model_object], 'parent')
            model_object['model'] = model.objects.get_or_create(
                **EduProgramParser.get_dict_without_keys(model_object, ['xml_id'])
            )[0]

    def __init__(self, *args, **kwargs):
        self.source: str = kwargs.pop('source', None)
        self.ignore_teams: bool = kwargs.pop('ignore_teams', False)
        self.ignore_teams = True
        self.file: bool = kwargs.pop('file', None)
        self.root_node = None
        self.program_node = None
        self.oop_node = None
        self.active_oop_node = None
        self.edu_forms = []
        self.edu_services = []
        self.edu_program = {}
        self.direction = {}
        self.discipline_kinds = []
        self.discipline_views = []
        self.teams = []
        self.disciplines = []
        self.work_forms = []
        self.work_kinds = []
        self.hours_kinds = []
        self.edu_hours = []
        self.block_kinds = []
        self.edu_cycles = []
        self.competences = []

    def parse_edu_forms(self) -> None:
        """Парсинг и заполнение словарей для модели EduForm."""
        for edu_form in self.root_node.findall('.//ФормаОбучения'):
            self.edu_forms.append({
                'xml_id': edu_form.get('Код'),
                'name': edu_form.get('ФормаОбучения'),
                'short_name': edu_form.get('Сокращение')
            })

    def parse_edu_services(self) -> None:
        """Парсинг и заполнение словарей для модели EduService."""
        for edu_level in self.root_node.findall('.//Уровень_образования'):
            self.edu_services.append({
                'xml_id': edu_level.get('Код_записи'),
                'name': edu_level.get('ВидПлана')
            })

    def parse_edu_program(self) -> None:
        """Парсинг и заполнение словаря для модели EduProgram."""
        self.program_node = self.root_node.find('.//Планы')
        oop_code = self.program_node.get('КодООП')
        active_oop_code = self.program_node.get('КодАктивногоООП')
        self.oop_node = self.root_node.find(f".//ООП[@Код='{oop_code}']")
        self.active_oop_node = self.root_node.find(f".//ООП[@Код='{active_oop_code}']")
        self.edu_program['name'] = self.active_oop_node.get('Название')
        self.edu_program['expedited'] = self.program_node.get('Сокращённое') == 'true'
        self.edu_program['admission'] = self.program_node.get('ГодНачалаПодготовки')
        self.edu_program['edu_form'] = next(
            edu_form for edu_form in self.edu_forms if edu_form['xml_id'] == self.program_node.get('КодФормыОбучения')
        )

    def parse_direction(self) -> None:
        """Парсинг и заполнение словаря для модели Direction."""
        self.direction['name'] = self.oop_node.get('Название').strip()
        self.direction['code'] = self.oop_node.get('Шифр')
        self.direction['edu_service'] = next(
            edu_service for edu_service in self.edu_services
            if edu_service['xml_id'] == self.program_node.get('КодУровняОбразования')
        )
        self.edu_program['direction'] = self.direction

    def parse_discipline_kinds(self) -> None:
        """Парсинг и заполнение словарей для модели DisciplineKind."""
        for discipline_kind in self.root_node.findall('.//СправочникТипОбъекта'):
            self.discipline_kinds.append({
                'xml_id': discipline_kind.get('Код'),
                'name': discipline_kind.get('Название'),
                'order': discipline_kind.get('rowOrder')
            })

    def parse_discipline_views(self) -> None:
        """Парсинг и заполнение словарей для модели DisciplineView."""
        for discipline_view in self.root_node.findall('.//СправочникВидОбъекта'):
            self.discipline_views.append({
                'xml_id': discipline_view.get('Код'),
                'name': discipline_view.get('Наименование'),
                'order': discipline_view.get('rowOrder')
            })

    def parse_teams(self) -> None:
        """Парсинг и заполнение словарей для модели Team."""
        for team in self.root_node.findall('.//Кафедры'):
            self.teams.append({
                'xml_id': team.get('Код'),
                'name': team.get('Название')
            })

    def parse_disciplines(self) -> None:
        """Парсинг и заполнение словарей для модели Discipline."""
        level = 1
        disciplines = self.root_node.findall(f".//ПланыСтроки[@УровеньВложения='{level}']")
        while len(disciplines) != 0:
            for discipline in disciplines:
                self.disciplines.append({
                    'xml_id': discipline.get('Код'),
                    'name': discipline.get('Дисциплина'),
                    'code': discipline.get('ДисциплинаКод'),
                    'units': discipline.get('ТрудоемкостьКредитов') or 0,
                    'hours': discipline.get('ЧасовПоПлану'),
                    'edu_program': self.edu_program,
                    'kind': next(
                        kind for kind in self.discipline_kinds if kind['xml_id'] == discipline.get('ТипОбъекта')
                    ),
                    'view': next(
                        view for view in self.discipline_views if view['xml_id'] == discipline.get('ВидОбъекта')
                    ),
                    'team': {'model': None} if discipline.get('КодКафедры') is None else next(
                        team for team in self.teams if team['xml_id'] == discipline.get('КодКафедры')
                    ),
                    'parent': {'model': None} if discipline.get('КодРодителя', None) is None else next(
                        parent for parent in self.disciplines if parent['xml_id'] == discipline.get('КодРодителя')
                    )
                })
            level += 1
            disciplines = self.root_node.findall(f".//ПланыСтроки[@УровеньВложения='{level}']")

    def parse_work_forms(self) -> None:
        """Парсинг и заполнение словарей для модели WorkForm."""
        for work_form in self.root_node.findall('.//СправочникТипаРабот'):
            self.work_forms.append({
                'xml_id': work_form.get('Код'),
                'name': work_form.get('Название')
            })

    def parse_work_kinds(self) -> None:
        """Парсинг и заполнение словарей для модели WorkKind."""
        for work_kind in self.root_node.findall('.//СправочникВидыРабот'):
            self.work_kinds.append({
                'xml_id': work_kind.get('Код'),
                'name': work_kind.get('Название'),
                'short_name': work_kind.get('Аббревиатура'),
                'order': work_kind.get('rowOrder'),
                'work_form': {'model': None} if work_kind.get('КодТипРабот') is None else next(
                    work_form for work_form in self.work_forms if work_form['xml_id'] == work_kind.get('КодТипРабот')
                )
            })

    def parse_hours_kinds(self) -> None:
        """Парсинг и заполнение словарей для модели HoursKind."""
        for hours_kind in self.root_node.findall('.//СправочникТипаЧасов'):
            self.hours_kinds.append({
                'xml_id': hours_kind.get('Код'),
                'name': hours_kind.get('Наименование')
            })

    def parse_edu_hours(self) -> None:
        """Парсинг и заполнение словарей для модели EduHours."""
        for edu_hours in self.root_node.findall('.//ПланыНовыеЧасы'):
            self.edu_hours.append({
                'xml_id': edu_hours.get('Код'),
                'course_number': edu_hours.get('Курс'),
                'semester_number': int(edu_hours.get('Семестр')) + 1
                if self.edu_program['edu_form']['short_name'] == 'З'
                else int(edu_hours.get('Семестр')),
                'value': edu_hours.get('Количество'),
                'discipline': next(
                    discipline for discipline in self.disciplines if discipline['xml_id'] == edu_hours.get('КодОбъекта')
                ),
                'work_kind': next(
                    work_kind for work_kind in self.work_kinds if work_kind['xml_id'] == edu_hours.get('КодВидаРаботы')
                ),
                'hours_kind': next(
                    hours_kind for hours_kind in self.hours_kinds
                    if hours_kind['xml_id'] == edu_hours.get('КодТипаЧасов')
                )
            })

    def parse_block_kinds(self):
        """Парсинг и заполнение словарей для модели BlockKind."""
        for block_kind in self.root_node.findall('.//СправочникТипБлока'):
            self.block_kinds.append({
                'xml_id': block_kind.get('Код'),
                'name': block_kind.get('Название'),
                'order': block_kind.get('rowOrder')
            })

    def parse_edu_cycles(self):
        """Парсинг и заполнение словарей для модели EduCycle."""
        for edu_cycle in self.root_node.findall('.//ПланыЦиклы'):
            self.edu_cycles.append({
                'xml_id': edu_cycle.get('Код'),
                'name': edu_cycle.get('Цикл'),
                'code': edu_cycle.get('Идентификатор'),
                'order': edu_cycle.get('rowOrder'),
                'block_kind': next(
                    block_kind for block_kind in self.block_kinds if block_kind['xml_id'] == edu_cycle.get('ТипБлока')
                ),
                'discipline_kind': next(
                    discipline_kind for discipline_kind in self.discipline_kinds
                    if discipline_kind['xml_id'] == edu_cycle.get('ТипОбъекта')
                ),
                'parent': {'model': None} if edu_cycle.get('КодРодителя') is None else next(
                    parent for parent in self.edu_cycles if parent['xml_id'] == edu_cycle.get('КодРодителя')
                )
            })

    def get_competence_disciplines(self, competence_xml_id) -> List[dict]:
        """Получение дисциплин для модели Competence.

        :param competence_xml_id: xml_id компетенции
        :return: словари дисциплин
        """
        return list(map(
            lambda competence_discipline: next(
                discipline for discipline in self.disciplines
                if discipline['xml_id'] == competence_discipline.get('КодСтроки')
            ),
            self.root_node.findall(
                f".//ПланыКомпетенцииДисциплины[@КодКомпетенции='{competence_xml_id}']"
            )
        ))

    def parse_competences(self) -> None:
        """Парсинг и заполнение словарей для модели Competence."""
        for competence in self.root_node.findall('.//ПланыКомпетенции'):
            self.competences.append({
                'xml_id': competence.get('Код'),
                'name': competence.get('Наименование'),
                'code': competence.get('ШифрКомпетенции'),
                'category': competence.get('Категория'),
                'order': competence.get('rowOrder'),
                'disciplines': self.get_competence_disciplines(competence.get('Код'))
            })

    def parse(self) -> None:
        """Парсинг и заполнение словарей."""
        if self.source:
            self.root_node = etree.parse(self.source).getroot()
        else:
            self.root_node = etree.parse(self.file).getroot()
        for elem in self.root_node.getiterator():
            elem.tag = etree.QName(elem).localname
            for key in elem.keys():
                elem.attrib[etree.QName(key).localname] = elem.attrib.pop(key)
        objectify.deannotate(self.root_node, cleanup_namespaces=True)
        self.parse_edu_forms()
        self.parse_edu_services()
        self.parse_edu_program()
        self.parse_direction()
        self.parse_discipline_kinds()
        self.parse_discipline_views()
        self.parse_teams()
        self.parse_disciplines()
        self.parse_work_forms()
        self.parse_work_kinds()
        self.parse_hours_kinds()
        self.parse_edu_hours()
        self.parse_block_kinds()
        self.parse_edu_cycles()
        self.parse_competences()

    def save_edu_forms(self) -> None:
        """Сохранение моделей EduForm в БД и установка их в словари."""
        self.save(EduForm, self.edu_forms)
        self.set_model_to_dicts([self.edu_program], 'edu_form')

    def save_edu_services(self) -> None:
        """Сохранение моделей EduService в БД и установка их в словари."""
        self.save(EduService, self.edu_services)
        self.set_model_to_dicts([self.direction], 'edu_service')

    def save_direction(self) -> None:
        """Сохранение модели Direction в БД и установка ее в словари."""
        self.save(Direction, [self.direction])
        self.set_model_to_dicts([self.edu_program], 'direction')

    def save_edu_program(self) -> None:
        """Сохранение модели EduProgram в БД и установка ее в словари."""
        self.save(EduProgram, [self.edu_program])
        self.set_model_to_dicts(self.disciplines, 'edu_program')

    def save_discipline_kinds(self) -> None:
        """Сохранение моделей DisciplineKind в БД и установка их в словари."""
        self.save(DisciplineKind, self.discipline_kinds)
        self.set_model_to_dicts(self.disciplines, 'kind')
        self.set_model_to_dicts(self.edu_cycles, 'discipline_kind')

    def save_discipline_views(self) -> None:
        """Сохранение моделей DisciplineView в БД и установка их в словари."""
        self.save(DisciplineView, self.discipline_views)
        self.set_model_to_dicts(self.disciplines, 'view')

    def set_teams(self) -> None:
        """Получение моделей Team и установка их в словари."""
        for team in self.teams:
            try:
                team['model'] = Team.objects.get(name=team['name'])
            except ObjectDoesNotExist:
                if self.ignore_teams:
                    team['model'] = None
                else:
                    raise ObjectDoesNotExist(f"Кафедра {team['name']} не существует")
        self.set_model_to_dicts(self.disciplines, 'team')

    def save_disciplines(self) -> None:
        """Сохранение моделей Discipline в БД и установка их в словари."""
        self.save(Discipline, self.disciplines)
        self.set_model_to_dicts(self.edu_hours, 'discipline')
        for competence in self.competences:
            competence['disciplines'] = map(
                lambda competence_discipline: competence_discipline['model'],
                competence['disciplines']
            )

    def save_work_forms(self) -> None:
        """Сохранение моделей WorkForm в БД и установка их в словари."""
        self.save(WorkForm, self.work_forms)
        self.set_model_to_dicts(self.work_kinds, 'work_form')

    def save_work_kinds(self) -> None:
        """Сохранение моделей WorkKind в БД и установка их в словари."""
        self.save(WorkKind, self.work_kinds)
        self.set_model_to_dicts(self.edu_hours, 'work_kind')

    def save_hours_kind(self) -> None:
        """Сохранение моделей HoursKind в БД и установка их в словари."""
        self.save(HoursKind, self.hours_kinds)
        self.set_model_to_dicts(self.edu_hours, 'hours_kind')

    def save_edu_hours(self) -> None:
        """Сохранение моделей EduHours в БД."""
        self.save(EduHours, self.edu_hours)

    def save_block_kind(self) -> None:
        """Сохранение моделей BlockKind в БД и установка их в словари."""
        self.save(BlockKind, self.block_kinds)
        self.set_model_to_dicts(self.edu_cycles, 'block_kind')

    def save_edu_cycles(self) -> None:
        """Сохранение моделей BlockKind в БД."""
        self.save(EduCycle, self.edu_cycles)

    def save_competences(self) -> None:
        """Сохранение моделей Competence в БД."""
        for competence in self.competences:
            competence['model'], created = Competence.objects.get_or_create(
                **EduProgramParser.get_dict_without_keys(competence, ['xml_id', 'disciplines'])
            )
            if created:
                competence['model'].disciplines.set(competence['disciplines'])

    def __call__(self, *args, **kwargs) -> EduProgram:
        """Сохранение моделей в базу данных."""
        self.save_edu_forms()
        self.save_edu_services()
        self.save_direction()
        self.save_edu_program()
        self.save_discipline_kinds()
        self.save_discipline_views()
        self.set_teams()
        self.save_disciplines()
        self.save_work_forms()
        self.save_work_kinds()
        self.save_hours_kind()
        self.save_edu_hours()
        self.save_block_kind()
        self.save_edu_cycles()
        self.save_competences()
        return self.edu_program['model']
