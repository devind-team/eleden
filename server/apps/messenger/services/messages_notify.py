"""Сервис по отправки уведомлений пользователям."""
from typing import Optional

from apps.messenger.schema.subscriptions import MembersSubscription, ChatMessagesSubscription
from devind_helpers.schema.types import ConsumerActionType
from devind_helpers.redis_client import redis
from devind_helpers.utils import convert_str_to_int


def message_notify_service(
        user_id: int,
        chat_message_id: int,
        chat_id: Optional[int] = None,
        member_id: Optional[int] = None,
        cm_action: ConsumerActionType = ConsumerActionType.ADD,
        email: bool = True
):
    listening: Optional[int] = convert_str_to_int(redis.hget('listening', str(user_id)))
    chatting: Optional[int] = convert_str_to_int(redis.hget('chatting', str(user_id)))
    if listening:
        # Пользователь на сайте
        if chatting:
            ChatMessagesSubscription.notify(
                f'messages.{chat_id}.{user_id}',
                cm_action,
                chat_message_id
            )
            MembersSubscription.notify(f'members.{user_id}', ConsumerActionType.CHANGE, member_id)
        else:
            ChatMessagesSubscription.notify(
                f'messages.{user_id}',
                cm_action,
                chat_message_id
            )
    elif email:
        # Формируем celery таск для отправки пуш уведомления и по почте
        pass