from typing import Optional, Iterable

import graphene
from graphene_django import DjangoListField
from graphene_django.filter import DjangoFilterConnectionField
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.messenger.models import Member, AttachedFile
from devind_helpers.orm_utils import get_object_or_404
from .types import AttachedFileType, MemberType, ChatMessageType


class MessengerQueries(graphene.ObjectType):
    members = DjangoFilterConnectionField(MemberType, required=True, description='Участники в чатах')
    member = graphene.Field(MemberType, member_id=graphene.ID(required=True), required=True, description='Участник')
    chat_messages = DjangoFilterConnectionField(ChatMessageType, required=True, description='Сообщения в чатах')
    attached_files = DjangoListField(
        AttachedFileType,
        chat_id=graphene.ID(required=True),
        user_id=graphene.ID(),
        required=True,
        description='Файлы'
    )

    @staticmethod
    def resolve_member(root, info: ResolveInfo, member_id: str, *args, **kwargs) -> Member:
        return get_object_or_404(Member, pk=from_global_id(member_id)[1])

    @staticmethod
    def resolve_attached_files(
            root,
            info: ResolveInfo,
            chat_id: str,
            user_id: Optional[str],
            *args,
            **kwargs) -> Iterable[AttachedFile]:
        condition = {'message__chat__id': chat_id}
        if user_id:
            condition['message__chat__users__id'] = user_id
        return AttachedFile.objects.filter(**condition).all()
