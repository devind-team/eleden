""""Файл содержащий валидацию статьи."""
from devind_helpers.validator import Validator


class ArticleValidator(Validator):
    name = 'required'
    year = 'required'

    message = {
        'name': {
            'required': 'Поле "Ссылка на статью" обязательное для заполнения'
        },
        'year': {
            'required': 'Поле "Ссылка на статью" обязательное для заполнения'
        }
    }
