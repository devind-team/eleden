from typing import List

import graphene
from graphene.relay import Node
from graphene_django import DjangoListField
from graphql import ResolveInfo

from apps.core.schema import UserType
from devind_core.schema.connections.countable_connection import CountableConnection
from devind_core.schema.types import OptimizedDjangoObjectType
from ..models import AttachedFile, Chat, Member, ChatMessage, Message


class AttachedFileType(OptimizedDjangoObjectType):
    """ Прикрепленные файлы """

    user = graphene.Field(UserType, description='Пользователь, загрузивший файл')

    class Meta:
        model = AttachedFile


class MessageType(OptimizedDjangoObjectType):
    """Сообщение пользователя"""

    forwarded = graphene.List(lambda: MessageType, description='Пересланные сообщения')
    attached_files = DjangoListField(AttachedFileType, required=True, description='Прикрепленные файлы')
    user = graphene.Field(UserType, description='Пользователь, создавший сообщение')

    class Meta:
        model = Message
        fields = ('id', 'text', 'pinned', 'created_at', 'updated_at', 'forwarded', 'attached_files', 'user')
        connection_class = CountableConnection

    @staticmethod
    def resolve_forwarded(message: Message, info: ResolveInfo) -> List[Message]:
        return Message.objects.filter(pk__in=message.forwarded) if message.forwarded else []


class ChatType(OptimizedDjangoObjectType):
    """Чат"""

    user = graphene.Field(UserType, required=True, description='Организатор чата')
    users = DjangoListField(UserType, required=True, description='Участники чата')
    last_message = graphene.Field(MessageType, description='Последнее сообщение')

    class Meta:
        model = Chat
        fields = ('id', 'name', 'avatar', 'created_at', 'updated_at', 'user', 'users', 'last_message',)

    @staticmethod
    def resolve_last_message(chat: Chat, info) -> Message:
        return chat.messages.filter(chatmessage__user=info.context.user).order_by('-chatmessage__created_at').first()


class MemberType(OptimizedDjangoObjectType):
    """Участники чата"""

    chat = graphene.Field(ChatType, description='Чат')
    user = graphene.Field(UserType, description='Пользователь')

    class Meta:
        model = Member
        interfaces = (Node,)
        fields = ('role', 'notification', 'favorite', 'excluded', 'created_at', 'updated_at', 'chat', 'user',)
        filter_fields = {
            'chat': ['exact'],
            'chat__name': ['icontains'],
            'user': ['exact'],
            'excluded': ['exact']
        }
        connection_class = CountableConnection


class ChatMessageType(OptimizedDjangoObjectType):
    """Сообщения чата"""

    chat = graphene.Field(ChatType, description='Чат')
    message = graphene.Field(MessageType, description='Сообщение')
    user = graphene.Field(UserType, description='Пользователь')

    class Meta:
        model = ChatMessage
        interfaces = (Node,)
        fields = ('id', 'delivered', 'read', 'favorite', 'deleted', 'created_at', 'chat', 'message', 'user')
        filter_fields = {
            'chat': ['exact'],
            'user': ['exact'],
            'deleted': ['exact'],
            'favorite': ['exact'],
            'message__text': ['icontains']
        }
        connection_class = CountableConnection
