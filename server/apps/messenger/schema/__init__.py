from apps.messenger.schema.mutations import MessengerMutations
from apps.messenger.schema.queries import MessengerQueries
from apps.messenger.schema.subscriptions import MessengerSubscriptions
from apps.messenger.schema.types import ChatType, MessageType, MemberType, ChatMessageType


class Query(MessengerQueries):
    """Запросы приложения messanger"""

    pass


class Mutation(MessengerMutations):

    pass


class Subscription(MessengerSubscriptions):

    pass
