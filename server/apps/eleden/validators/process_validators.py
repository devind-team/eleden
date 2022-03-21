""""
Файл содержащий валидацию занятия, период, учебные недели, 1 - 18, допуск, зачет, экзамен, кр, кр, кн1, кн2,
    тип учета студентов на занятиях, курс, аттестацию, описывающая прикрепленные файлы,
    Раздаточный материал для курсов
"""
from devind_helpers.validator import Validator


class CourseValidator(Validator):
    team_id = 'exist:eleden.Team,id'
    edu_hours_id = 'exist:eleden.EduHours,id'

    message = {
        'team_id': {
            'exist': 'Группа пользователей с указанным идентификатором не существует'
        },
        'edu_hours_id': {
            'exist': 'Часы по плану с указанным идентификатором не существуют'
        }
    }


class AttestationValidator(Validator):
    registration_id = 'exist:eleden.Registration,id'
    course_id = 'exist:eleden.Course,id'
    period_id = 'exist:eleden.Period,id'
    set_by_id = 'exist:core.User,id'
    user_id = 'exist:core.User,id'
    confirmed_by_id = 'exist:core.User,id'

    message = {
        'registration_id': {
            'exist': 'Учет студентов с указанным идентификатором не существует'
        },
        'course_id': {
            'exist': 'Курс с указанным идентификатором не существует'
        },
        'period_id': {
            'exist': 'Период с указанным идентификатором не существует'
        },
        'set_by_id': {
            'exist': 'Пользователь с указанным идентификатором не существует'
        },
        'user_id': {
            'exist': 'Пользователь с указанным идентификатором не существует'
        },
        'confirmed_by_id': {
            'exist': 'Пользователь с указанным идентификатором не существует'
        }
    }


class AttachmentValidator(Validator):
    course_id = 'exist:eleden.Course,id'
    period_id = 'exist:eleden.Period,id'
    user_id = 'exist:core.User,id'
    confirmed_by_id = 'exist:core.User,id'

    message = {
        'course_id': {
            'exist': 'Курс с указанным идентификатором не существует'
        },
        'period_id': {
            'exist': 'Период с указанным идентификатором не существует'
        },
        'user_id': {
            'exist': 'Пользователь с указанным идентификатором не существует'
        },
        'confirmed_by_id': {
            'exist': 'Пользователь с указанным идентификатором не существует'
        }
    }


class HandoutValidator(Validator):
    description = 'required'
    course_id = 'exist:eleden.Course,id'
    period_id = 'exist:eleden.Period,id'

    message = {
        'description': {
            'required': 'Поле "описание раздаточного материала" обязательное для заполнения'
        },
        'course_id': {
            'exist': 'Курс с указанным идентификатором не существует'
        },
        'period_id': {
            'exist': 'Период с указанным идентификатором не существует'
        }
    }


class TypeSessionValidator(Validator):
    name = 'required|max_length:255'
    short_name = 'required|max_length:10'

    message = {
        'name': {
            'required': 'Поле "Название занятия" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'short_name': {
            'required': 'Поле "Сокращенное название занятия (лк, у, лб...)" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 10 символа'
        }
    }


class PeriodValidator(Validator):
    name = 'required|max_length:255'
    short_name = 'required|max_length:10'

    message = {
        'name': {
            'required': 'Поле "Имя периода" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'short_name': {
            'required': 'Поле "Сокращенное наименования" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 10 символа'

        }
    }


class RegistrationValidator(Validator):
    name = 'required|max_length:255'
    short_name = 'required|max_length:10'

    message = {
        'name': {
            'required': 'Поле "Название учета" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'short_name': {
            'required': 'Поле "Сокращенное название учета" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 10 символа'
        }
    }
