# Модуль article_types



## Класс ArticleIndexType

Описание типа индексирования публикации.

## Класс ArticleKindType

Тип публикации

## Класс AuthorType

Автор публикации

## Класс ArticleType

Статья.

### Методы

| Сигнатура                                                                                               | Декораторы                                                | Описание |
| :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------- | :------- |
| resolve_authors( article: apps.eleden.models.article.Article, info: graphql.execution.base.ResolveInfo) | ['staticmethod', "resolver_hints(model_field='authors')"] | -        |
| resolve_users( article: apps.eleden.models.article.Article, info: graphql.execution.base.ResolveInfo)   | ['staticmethod', "resolver_hints(model_field='users')"]   | -        |

## Класс AuthorInputType

Автор публикации