from devind_helpers.validator import Validator


class TeamValidator(Validator):
    name = 'required|min_length:2|max_length:255'
    short_name = 'required|min_length:1|max_length:50|unique:eleden.Team,short_name'
    admission = 'required|numberic'
    parent_id = 'exist:eleden.Team,id'
    group_id = 'exist:auth.Group,id'

    message = {
        'name': {
            'required': 'Поле "Название группы" обязательное для заполнения',
            'min_length': 'Минимальная длина не менее 2 символов',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'short_name': {
            'required': 'Поле "Название группы" обязательное для заполнения',
            'min_length': 'Минимальная длина не менее 1 символа',
            'max_length': 'Максимальная длина не более 50 символа',
            'unique': 'Группа с таким сокращенным именем уже существует'
        },
        'admission': {
            'required': 'Поле "Год образования/поступления" обязательное для заполнения',
            'numberic': 'Поле не является действительным годом'
        },
        'parent_id': {
            'exist': 'Группы пользователей с указанным идентификатором не существует'
        },
        'group_id': {
            'exist': 'Группы с указанным идентификатором не существует'
        }
    }


class TeamChangeValidator(Validator):
    name = 'min_length:2|max_length:255'
    short_name = 'min_length:1|max_length:50|unique:eleden.Team,short_name'
    admission = 'numberic'

    message = {
        'name': {
            'min_length': 'Минимальная длина не менее 2 символов',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'short_name': {
            'min_length': 'Минимальная длина не менее 1 символа',
            'max_length': 'Максимальная длина не более 50 символа',
            'unique': 'Группа с таким сокращенным именем уже существует'
        },
        'admission': {
            'numberic': 'Поле не является действительным годом'
        }
    }
