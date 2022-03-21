from devind_helpers.validator import Validator


class PortfolioFileValidator(Validator):
    describe = 'required|min_length:3|max_length:255'
    kind_id = 'exist:eleden.FileKind,id'
    annotation_id = 'exist:eleden.Discipline,id'

    message = {
        'describe': {
            'required': 'Поле "Описание" обязательно для заполнения',
            'min_length': 'Минимальная длина описания 3 символов',
            'max_length': 'Максимальная длина описания 255 символов'
        },
        'kind_id': {
            'exist': 'Тип с таким идентификатором не существует'
        },
        'annotation_id': {
            'exist': 'Аннотация с таким идентификатором не существует'
        }
    }


class FileKindValidator(Validator):
    name = 'required|max_length:255'
    accept = 'required|max_length:255'

    message = {
        'name': {
            'required': 'Поле "Наименование цели загрузки файла" обязательно для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        },
        'accept': {
            'required': 'Поле "Допустимый формат загрузки файлов" обязательно для заполнения',
            'max_length': 'Максимальная длина не более 255 символа'
        }
    }
