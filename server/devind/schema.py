import graphene
import devind_core.schema
import devind_notifications.schema
import apps.dashboard.schema
import apps.eleden.schema
import apps.pages.schema
import apps.messenger.schema
import apps.notifications.schema
import apps.sveden.schema
from graphene_django.debug import DjangoDebug


class Query(
    devind_core.schema.Query,
    devind_notifications.schema.Query,
    apps.dashboard.schema.Query,
    apps.eleden.schema.Query,
    apps.pages.schema.Query,
    apps.messenger.schema.Query,
    apps.sveden.schema.Query,
    graphene.ObjectType
):
    """Схема запросов данных"""

    debug = graphene.Field(DjangoDebug, name='_debug')


class Mutation(
    devind_core.schema.Mutation,
    devind_notifications.schema.Mutation,
    apps.eleden.schema.Mutation,
    apps.pages.schema.Mutation,
    apps.messenger.schema.Mutation,
    apps.sveden.schema.Mutation,
    graphene.ObjectType
):
    """Мутации на изменение чего-либо"""

    pass


class Subscription(
    devind_notifications.schema.Subscription,
    apps.eleden.schema.Subscription,
    apps.messenger.schema.Subscription,
    graphene.ObjectType
):
    """Подписки на сокеты"""

    pass


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription,
    types=(*apps.pages.schema.types, *devind_notifications.schema.types, *apps.notifications.schema.types)
)
