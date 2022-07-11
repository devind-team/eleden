import json
import os
import urllib.request
from typing import Iterable

import bibtexparser
import graphene
from bibtexparser.customization import getnames
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.core.models import User
from apps.eleden.helpers import ArticlesUnload
from apps.eleden.models import Article, Author
from apps.eleden.permissions import AddArticle, ChangeArticle, DeleteArticle
from apps.eleden.schema.types import ArticleType, AuthorType, AuthorInputType
from apps.eleden.services import create_article, create_author
from apps.eleden.validators import ArticleValidator
from devind_core.models import File
from devind_core.schema.types import FileType
from devind_helpers.schema.types import ErrorFieldType
from devind_helpers.decorators import permission_classes, validation_classes
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation


class AddArticleMutation(BaseMutation):
    """Добавление публикации."""

    class Input:
        name = graphene.String(required=True, description='Название работы')
        year = graphene.Int(required=True, description='Год публикации')
        file_link = graphene.String(description='Ссылка на файл публикации')
        file = Upload(description='Файл публикации')
        index_id = graphene.ID(required=True, description='Идентификатор типа индексирования статьи')
        kind_id = graphene.ID(required=True, description='Тип публикации')
        workload = graphene.Float(description='Объем работы')
        authors = graphene.List(graphene.NonNull(AuthorInputType), required=True, description='Все авторы публикации')
        additional = graphene.String(required=True, description='Дополнительные поля публикации')

    article = graphene.Field(ArticleType, description='Новая статья')
    file = graphene.Field(FileType, description='Загруженный файл статьи')

    @classmethod
    @permission_classes((IsAuthenticated, AddArticle))
    @validation_classes((ArticleValidator,))
    def mutate_and_get_payload(cls, root: None, info: ResolveInfo, **kwargs):
        if kwargs['file_link']:
            kwargs.pop('file', None)
            with urllib.request.urlopen(kwargs['file_link']) as f:
                file = ContentFile(f.read(), name=kwargs['file_link'].split('/')[-1])
        elif kwargs['file']:
            file = kwargs.pop('file', None)
        else:
            return AddArticleMutation(success=False, errors=[ErrorFieldType(
                'file', ['Необходимо загрузить файл публикации'])])
        article = create_article(file, info.context.user, **kwargs)
        authors: Iterable[AuthorInputType] = kwargs['authors']
        for i, author in enumerate(authors):
            user = author.user_id
            if author.user_id:
                user: User = get_object_or_404(User, pk=from_global_id(author.user_id)[1])
            create_author(author.name, 1, i + 1, article, user)
        return AddArticleMutation(article=article, file=article.src)


class AddArticleFromBibtexMutation(BaseMutation):
    """Добавление публикации из файла bibtex."""

    class Input:
        file = Upload(description='Файл bibtex публикации')

    articles = graphene.List(graphene.NonNull(ArticleType), description='Новая статья')

    @staticmethod
    @permission_classes((IsAuthenticated, AddArticle,))
    def mutate_and_get_payload(root: None, info: ResolveInfo, file: InMemoryUploadedFile):
        file: File = File.objects.create(user=info.context.user, name=str(file), src=file, deleted=True)
        articles: list[Article] = []
        with open(file.src.path) as f:
            bib_database = bibtexparser.load(f)
        if bib_database.entries:
            entry_dict = bib_database.entries
            for entry in entry_dict:
                authors = entry['author']
                if 'url' in entry:
                    with urllib.request.urlopen(entry['url']) as f:
                        article_file = ContentFile(f.read(), name=entry['url'].split('/')[-1])
                    article = create_article(article_file, info.context.user, **entry)
                    articles.append(article)
                else:
                    return AddArticleFromBibtexMutation(success=False, errors=[ErrorFieldType(
                        'file', [f'Поле "url" - ссылка на pdf файл публикации "{entry["title"]}" не обнаружена'])])
                if 'author' in entry and authors:
                    authors_names = getnames([i.strip() for i in authors.split(' and ')])
                    for i, name in enumerate(authors_names):
                        if ',' and '.' in name:
                            last_name = name.split(',')[0].replace(' ', '')
                            initials = name.split(',')[1].replace(' ', '').split('.')[:-1]
                            user = User.objects.filter(
                                last_name=last_name,
                                first_name__startswith=initials[0],
                                sir_name__startswith=initials[1]
                            ).first()
                        else:
                            return AddArticleFromBibtexMutation(success=False, errors=[ErrorFieldType(
                                'file', [
                                    f'Необходимо оформить поле "authors" публикации {entry["title"]} в соответствии с '
                                    f'образцом: "Фамилия, инициалы"'])])
                        create_author(name.replace(',', ''), 1, i + 1, article, user)
        else:
            return AddArticleFromBibtexMutation(success=False, errors=[ErrorFieldType(
                'file', ['Недостаточно полей записи для добавления публикации'])])
        return AddArticleFromBibtexMutation(articles=articles)


class ChangeArticleMutation(BaseMutation):
    """Изменение публикации."""

    class Input:
        article_id = graphene.ID(required=True, description='Публикация')
        name = graphene.String(required=True, description='Название работы')
        year = graphene.Int(required=True, description='Год публикации')
        index_id = graphene.ID(required=True, description='Идентификатор типа индексирования статьи')
        kind_id = graphene.ID(required=True, description='Тип публикации')
        workload = graphene.Float(description='Объем работы')
        authors = graphene.List(graphene.NonNull(AuthorInputType), required=True, description='Все авторы публикации')
        additional = graphene.String(required=True, description='Дополнительные поля публикации')

    article = graphene.Field(ArticleType, description='Измененная публикация')
    authors = graphene.List(graphene.NonNull(AuthorType), required=True, description='Измененные авторы публикации')

    @staticmethod
    @permission_classes((IsAuthenticated, ChangeArticle,))
    def mutate_and_get_payload(root: None, info: ResolveInfo, article_id: str, **kwargs):
        validator: ArticleValidator = ArticleValidator({k: v for k, v in kwargs.items()})
        article: Article = Article.objects.get(pk=from_global_id(article_id)[1])
        all_authors: list[Author] = article.author_set.all()
        info.context.check_object_permissions(info.context, article)
        authors = list(Author.objects.filter(user=None, article=article).all())
        if validator.validate():
            kwargs['additional'] = json.loads(kwargs['additional'])
            authors_input = kwargs.pop('authors', None)
            authors_ids: list[str] = []
            users: list[User] = []
            for i, a in enumerate(authors_input):
                if a.user_id:
                    user: User = get_object_or_404(User, pk=from_global_id(a.user_id)[1])
                    users.append(user)
                    author_user, _ = Author.objects.update_or_create(user=user,
                                                                     article=article,
                                                                     defaults={'name': a.name,
                                                                               'order': i + 1,
                                                                               'weight': 1}
                                                                     )
                elif a.author_id:
                    authors_ids.append(from_global_id(a.author_id)[1])
                    Author.objects.filter(pk=from_global_id(a.author_id)[1]).update(order=i + 1)
                else:
                    create_author(a.name, 1, i + 1, article, None)
            for author in authors:
                if str(author.id) not in authors_ids:
                    author.delete()
            article.users.set(users)
            for k, v in kwargs.items():
                setattr(article, k, v)
            article.save(update_fields=(*kwargs.keys(), 'updated_at'))
            return ChangeArticleMutation(article=article, authors=all_authors)
        else:
            return ChangeArticleMutation(
                success=False,
                errors=ErrorFieldType.from_validator(validator.get_message())
            )


class DeleteArticleMutation(BaseMutation):
    """Удаление публикации."""

    class Input:
        article_id = graphene.ID(required=True, description='Идентификатор файла публикации')
        user_id = graphene.ID(required=True, description='Пользователь')

    id = graphene.ID(required=True, description='Идентификатор файла публикации')

    @staticmethod
    @permission_classes((IsAuthenticated, DeleteArticle,))
    def mutate_and_get_payload(root: None, info: ResolveInfo, article_id: str, user_id: str):
        user: User = get_object_or_404(User, pk=from_global_id(user_id)[1])
        article: Article = get_object_or_404(Article, pk=from_global_id(article_id)[1])
        info.context.check_object_permissions(info.context, user)
        os.remove(article.src.path)
        article.delete()
        return DeleteArticleMutation(id=article_id)


class UnloadArticlesMutation(BaseMutation):
    """Выгрузка публикаций в различных форматах."""

    class Input:
        extension = graphene.String(required=True, description='Формат выгрузки: docx, xlsx, bibtex')

    src = graphene.String(description='Ссылка на сгенерированный файл')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(root: None, info: ResolveInfo, extension: str):
        if extension not in ('xlsx', 'docx', 'bibtex',):
            return UnloadArticlesMutation(success=False, errors=[ErrorFieldType(
                'extension', ['Неверно выбран формат выгрузки публикаций'])])
        au: ArticlesUnload = ArticlesUnload(user=info.context.user)
        src = getattr(au, extension)()
        return UnloadArticlesMutation(src=src)


class ArticleMutations(graphene.ObjectType):
    add_article = AddArticleMutation.Field(required=True)
    add_article_from_bibtex = AddArticleFromBibtexMutation.Field(required=True)
    change_article = ChangeArticleMutation.Field(required=True)
    delete_article = DeleteArticleMutation.Field(required=True)
    unload_articles = UnloadArticlesMutation.Field(required=True)
