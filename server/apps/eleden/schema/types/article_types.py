import graphene
from graphene.relay import Node
from graphene_django import DjangoListField
from graphene_django_optimizer import resolver_hints
from graphql import ResolveInfo

from apps.core.schema import UserType
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType
from apps.eleden.models import ArticleIndex, ArticleKind, Article, Author


class ArticleIndexType(OptimizedDjangoObjectType):
    """Описание типа индексирования публикации."""

    class Meta:
        model = ArticleIndex
        fields = ('id', 'name', 'coefficient', 'created_at', 'updated_at',)


class ArticleKindType(OptimizedDjangoObjectType):
    """Тип публикации"""

    class Meta:
        model = ArticleKind
        fields = ('id', 'name', 'created_at', 'updated_at',)


class AuthorType(OptimizedDjangoObjectType):
    """Автор публикации"""

    user = graphene.Field(UserType, description='Пользователь')

    class Meta:
        model = Author
        interfaces = (Node,)
        fields = (
            'id',
            'name',
            'weight',
            'order',
            'article',
            'user',
            'created_at',
            'updated_at',
        )
        filter_fields = {
            'name': ['icontains'],
            'article': ['exact'],
            'user': ['exact']
        }
        connection_class = CountableConnection


class ArticleType(OptimizedDjangoObjectType):
    """Статья."""

    additional_text = graphene.String(required=True, description='Дополнительные параметры')
    index = graphene.Field(ArticleIndexType, description='Тип индексирования статьи')
    kind = graphene.Field(ArticleKindType, description='Тип публикации')
    user = graphene.Field(UserType, required=True, description='Пользователь, добавивший публикацию')
    users = DjangoListField(UserType, required=True, description='Авторы публикации')
    authors = DjangoListField(AuthorType, required=True, description='Авторы')

    class Meta:
        model = Article
        interfaces = (Node,)
        fields = (
            'id',
            'src',
            'name',
            'year',
            'additional_text',
            'created_at',
            'updated_at',
            'index',
            'kind',
            'workload',
            'authors',
            'user',
            'users',
        )
        filter_fields = {
            'name': ['icontains'],
            'year': ['exact', 'in'],
            'users': ['exact']
        }
        connection_class = CountableConnection

    @staticmethod
    @resolver_hints(model_field='authors')
    def resolve_authors(article: Article, info: ResolveInfo):
        return article.author_set.all()

    @staticmethod
    @resolver_hints(model_field='users')
    def resolve_users(article: Article, info: ResolveInfo):
        return article.users.all()


class AuthorInputType(graphene.InputObjectType):
    """Автор публикации"""

    name = graphene.String(required=True, description='ФИО автора')
    author_id = graphene.ID(description='Автор')
    user_id = graphene.ID(description='Пользователь')