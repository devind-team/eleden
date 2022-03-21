from devind_helpers.validator import Validator


class EduFormValidator(Validator):
    name = 'required'
    short_name = 'required|max_length:255'
    parent_id = 'exist:eleden.EduForm,id'

    message = {
        'name': {
            'required': 'Поле "Название формы обучения" обязательное для заполнения'
        },
        'short_name': {
            'required': 'Поле "Короткое название формы обучения" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'parent_id': {
            'exist': 'Такой формы обучения не существует'
        }
    }


class DirectionValidator(Validator):
    code = 'required|max_length:20'
    name = 'required'

    message = {
        'code': {
            'required': 'Поле "Код специальности" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 20 символа'
        },
        'name': {
            'required': 'Поле "Код специальности" обязательное для заполнения'
        }
    }


class EduProgramValidator(Validator):
    name = 'required|max_length:1024'
    admission = 'required|digits'
    edu_form_id = 'exist:eleden.EduForm,id'
    direction_id = 'exist:eleden.Direction,id'

    message = {
        'name': {
            'required': 'Поле "Профиль подготовки" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 1024 символа'
        },
        'admission': {
            'required': 'Поле "Год поступления" обязательное для заполнения',
            'digits': 'Поле "Год поступления" должно быть числовым'
        },
        'edu_form_id': {
            'exist': 'Формы обучения с указанным идентификатором не существует'
        },
        'direction_id': {
            'exist': 'Направления подготовки с указанным идентификатором не существует'
        }
    }


class EduProgramChangeValidator(Validator):
    name = 'max_length:1024'
    edu_form_id = 'exist:eleden.EduForm,id'
    direction_id = 'exist:eleden.Direction,id'

    message = {
        'name': {
            'max_length': 'Максимальная длина не более 1024 символа'
        },
        'edu_form_id': {
            'exist': 'Формы обучения с указанным идентификатором не существует'
        },
        'direction_id': {
            'exist': 'Направления подготовки с указанным идентификатором не существует'
        }
    }


class DisciplineValidator(Validator):
    code = 'required|max_length:1024'
    name = 'required|max_length:1024'

    message = {
        'code': {
            'required': 'Поле "Код аннотации" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 1024 символа'
        },
        'name': {
            'required': 'Поле "Название аннотации" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 1024 символа'
        }
    }


class DisciplineChangeValidator(Validator):
    code = 'max_length:1024'
    name = 'max_length:1024'
    view_id = 'exist:eleden.DisciplineView,id'

    message = {
        'code': {
            'max_length': 'Максимальная длина не более 1024 символа'
        },
        'name': {
            'max_length': 'Максимальная длина не более 1024 символа'
        },
        'view_id': {
            'exist': 'Тип дисциплины с указанным идентификатором не существует'
        }
    }


class MethodologicalSupportValidator(Validator):
    name = 'required|max_length:1024'

    message = {
        'name': {
            'required': 'Поле "Название аннотации" обязательное для заполнения',
            'max_length': 'Максимальная длина не более 1024 символа'
        }
    }
