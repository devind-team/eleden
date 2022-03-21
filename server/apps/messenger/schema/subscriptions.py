from typing import Dict, Optional

import graphene
from graphql_relay import to_global_id

from apps.messenger.models import ChatMessage, Member
from apps.messenger.schema.types import MemberType, ChatMessageType
from devind_core.schema.subscriptions import BaseSubscription
from devind_helpers.schema.types import ConsumerActionType
from devind_helpers.decorators import register_users
from devind_helpers.orm_utils import get_object_or_none
from devind_helpers.utils import from_gid_or_none


class MembersSubscription(BaseSubscription):
    """
    Подписка на добавления чатов
        - member_id - идентификатор объекта
    """
    member = graphene.Field(MemberType)
    update = graphene.Boolean()

    @staticmethod
    @register_users('chatting')
    def subscribe(root, info, *args, **kwargs):
        """ Выбираем канал для прослушки, оставляем след в редисе """
        user_id = info.context.user.id if hasattr(info.context, 'user') else None
        return f'members.{user_id}',

    @staticmethod
    @register_users('chatting', True)
    def unsubscribed(root, info, *args, **kwargs):
        """ Убираем флаг из редиса для разрешения сообщений """
        pass

    @staticmethod
    def publish(payload: Dict, info, *args, **kwargs):
        action: ConsumerActionType = payload.get('action_value', ConsumerActionType.ADD)
        object_id: Optional[int] = payload.get('object_id', None)
        update: bool = payload.get('update', False)
        mr_id: str = to_global_id(str(MemberType), object_id)
        if action == ConsumerActionType.DELETE:
            return MembersSubscription(action=action, id=mr_id)
        member: Optional[Member] = get_object_or_none(Member, pk=object_id)
        if member is None:
            return MembersSubscription.SKIP
        return MembersSubscription(action=action, id=mr_id, member=member, update=update)

    @classmethod
    def notify(cls, group_name, action: ConsumerActionType, object_id: int, update: bool = False):
        cls.broadcast(group=group_name, payload={
            'action_value': action.value,
            'object_id': object_id,
            'update': update
        })


class ChatMessagesSubscription(BaseSubscription):
    """ Подписка на сообщения в выбранном чате """

    chat_message = graphene.Field(ChatMessageType, description='Сообщение')

    class Arguments:
        chat_id = graphene.ID(description='Идентификатор чата')

    @staticmethod
    def subscribe(root, info, *args, **kwargs):
        """
        Подписка на каналы
            - messages.{chat_id}.{user_id} - подписка на пользователя в чате
            - messages.{user_id} - подписка на обновления сообщений общего стрмминга
        """
        user_id = info.context.user.id if hasattr(info.context, 'user') else None
        if user_id is None:
            return None
        chat_id = from_gid_or_none(kwargs.get('chat_id', None))[1]
        return (f'messages.{chat_id}.{user_id}',) if chat_id and user_id else (f'messages.{user_id}',)

    @staticmethod
    def publish(payload: Dict, info, *args, **kwargs):
        action: ConsumerActionType = payload.get('action_value', ConsumerActionType.ADD)
        object_id: Optional[int] = payload.get('object_id', None)
        cm_id: str = to_global_id(str(ChatMessageType), object_id)
        if action in (ConsumerActionType.DELETE, ConsumerActionType.TYPING, ConsumerActionType.TYPING_FINISH,):
            return ChatMessagesSubscription(action=action, id=cm_id)
        chat_message: Optional[ChatMessage] = get_object_or_none(ChatMessage, pk=object_id, user_id=info.context.user.pk)
        if chat_message is None:
            return ChatMessagesSubscription.SKIP
        return ChatMessagesSubscription(action=action, id=cm_id, chat_message=chat_message)


class MessengerSubscriptions(graphene.ObjectType):
    members = MembersSubscription.Field(required=True, description='Получение чатов')
    chat_messages = ChatMessagesSubscription.Field(required=True, description='Получение собщений')
