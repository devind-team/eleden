from typing import Iterable

import graphene
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField
from graphql import ResolveInfo

from apps.core.models import User
from apps.core.schema import UserType
from apps.eleden.models import Article, Author
from apps.eleden.schema.types import ArticleIndexType, ArticleType, AuthorType
from apps.eleden.schema.types.article_types import ArticleKindType


class ArticleQueries(graphene.ObjectType):
    article_indexes = DjangoListField(ArticleIndexType, required=True, description='Типы индексирования публикаций')
    article_kinds = DjangoListField(ArticleKindType, required=True, description='Виды публикаций')
    articles = DjangoFilterConnectionField(ArticleType, required=True, description='Публикации')
    articles_years = graphene.List(graphene.Int, required=True, description='Все года публикаций')
    articles_users = DjangoFilterConnectionField(UserType, required=True, description='Все авторы публикаций')
    articles_authors = DjangoFilterConnectionField(AuthorType, required=True, description='Авторы')

    @staticmethod
    def resolve_articles_years(root, info: ResolveInfo, *args, **kwargs) -> Iterable[int]:
        return set(Article.objects.values_list('year', flat=True))

    @staticmethod
    def resolve_articles_users(root, info: ResolveInfo, *args, **kwargs) -> Iterable[User]:
        users_ids = [uid for uid in set(Article.objects.values_list('users', flat=True)) if uid]
        return User.objects.filter(pk__in=users_ids)

    @staticmethod
    def resolve_authors(root, info: ResolveInfo, *args, **kwargs) -> Iterable[Author]:
        return Author.objects.all()
