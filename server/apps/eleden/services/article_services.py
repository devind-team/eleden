import json

from apps.core.models import User
from django.core.files.base import ContentFile
from apps.eleden.models import Article, Author


def create_article(file: ContentFile, user: User or None, **kwargs):
    """Создание публикации.
    :param file: загружаемый файл публикации
    :param user: пользователь загрузивший публикацию
    :param kwargs: необходимые данные
    """
    if 'title' in kwargs:
        kwargs['name'] = kwargs['title']
    return Article.objects.create(
        src=file,
        name=kwargs['name'],
        year=kwargs['year'],
        workload=kwargs['workload'],
        additional=json.loads(kwargs['additional']),
        index_id=kwargs['index_id'],
        kind_id=kwargs['kind_id'],
        user=user
    )


def create_author(
        name: str,
        weight: int,
        order: int,
        article: Article,
        user: User or None):
    """Создание автора публикации.
    :param name: ФИО автора
    :param weight: вклад автора
    :param order: позиция автора
    :param article: созданная публикация
    :param user: идентификатор пользователя
    """

    return Author.objects.create(
        name=name,
        weight=weight,
        order=order,
        article=article,
        user=user
    )
