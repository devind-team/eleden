from datetime import datetime
from typing import List, Optional

import graphene
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import F
from django.utils.timezone import make_aware
from graphene_file_upload.scalars import Upload
from graphql import ResolveInfo
from graphql_relay import from_global_id

from apps.core.models import User
from apps.messenger.models import Chat, Member, ChatMessage, Message, AttachedFile
from apps.messenger.schema.subscriptions import MembersSubscription
from apps.messenger.schema.types import MemberType, MessageType
from apps.messenger.services import message_notify_service
from devind_helpers.schema.types import ErrorFieldType, ConsumerActionType
from devind_helpers.decorators import permission_classes
from devind_helpers.orm_utils import get_object_or_404, get_object_or_none
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation
from devind_helpers.utils import from_gid_or_none


class AddChatMutation(BaseMutation):
    """ Добавление чата """

    class Input:
        user_ids = graphene.List(graphene.NonNull(graphene.ID), required=True, description='Пользователи')
        avatar = Upload(description='Аватар чата')
        name = graphene.String(description='Название чата')

    member = graphene.Field(MemberType)

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(
            root,
            info: ResolveInfo,
            user_ids: List[str],
            avatar: Optional[InMemoryUploadedFile] = None,
            name: Optional[str] = None):
        cu: User = info.context.user
        user_ids = [int(from_global_id(uid)[1]) for uid in user_ids]
        if len(user_ids) == 1 and user_ids[0] == cu.pk:
            name = 'Избранное'
        chat: Chat = Chat.objects.create(name=name, avatar=avatar, user=cu)
        users: List[User] = User.objects.filter(pk__in=[*user_ids, cu.id]).all()
        current_member: Optional[Member] = None
        for user in users:
            member: Member = Member.objects.create(
                user=user,
                chat=chat,
                role=Member.ADMINISTRATOR if len(users) == 1 or user == cu else Member.PARTICIPANT
            )
            MembersSubscription.notify(f'members.{user.id}', ConsumerActionType.ADD, member.id)
            if user == cu:
                current_member = member
        return AddChatMutation(member=current_member)


class ChangeMemberPropertyMutation(BaseMutation):
    """ Изменение свойств чата """

    class Input:
        member_id = graphene.ID(required=True, description='Идентификатор записи')
        field = graphene.String(required=True, description='Изменяемое поле')
        value = graphene.Boolean(required=True, description='Значение')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(root, info: ResolveInfo, member_id: str, field: str, value: bool, *args, **kwargs):
        if field not in ['notification', 'favorite']:
            return ChangeMemberPropertyMutation(success=False, errors=[
                ErrorFieldType(field, [f'Поле {member_id} не найдено'])
            ])
        member: Optional[Member] = get_object_or_none(Member, pk=from_global_id(member_id)[1])
        # Добавить проверку разрешений
        if member is None:
            return ChangeMemberPropertyMutation(success=False, errors=[
                ErrorFieldType('member', [f'Чат с идентификатором {member_id} не найден'])
            ])
        setattr(member, field, value)
        member.save(update_fields=(field,))
        MembersSubscription.notify(f'members.{member.user_id}', ConsumerActionType.CHANGE, member.id)
        return ChangeMemberPropertyMutation()


class DeleteMemberMutation(BaseMutation):
    """ Удаление чата """

    class Input:
        member_id = graphene.ID(required=True, description='Идентификатор записи')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(root, info: ResolveInfo, member_id: str, *args, **kwargs):
        member_id: int = from_gid_or_none(member_id)[1]
        member: Optional[Member] = get_object_or_none(Member, pk=member_id)
        # Добавить проверку разрешений
        if member:
            member.excluded = True
            member.save(update_fields=('excluded',))
        MembersSubscription.notify(f'members.{member.user_id}', ConsumerActionType.DELETE, member_id)
        return DeleteMemberMutation()


class AddMessageMutation(BaseMutation):
    """ Добавление сообщения """

    class Input:
        chat_id = graphene.ID(required=True, description='Идентификатор чата')
        text = graphene.String(description='Текст сообщения')
        files = graphene.List(graphene.NonNull(Upload), description='Прикреплённые файлы')
        forwarded_ids = graphene.List(graphene.NonNull(graphene.ID), description='Пересылаемые сообщения')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(
        root,
        info: ResolveInfo,
        chat_id: str,
        text: Optional[str],
        files: list[InMemoryUploadedFile],
        forwarded_ids: list[str]
    ):
        user: User = info.context.user
        chat: Chat = get_object_or_404(Chat, pk=from_gid_or_none(chat_id)[1])
        message: Message = Message.objects.create(text=text, user=user, forwarded=forwarded_ids)
        if files:
            message.attached_files.set(AttachedFile.objects.create(src=file, user=user) for file in files)
        dt_now = make_aware(datetime.utcnow())
        for member in chat.member_set.all():
            chat_message: ChatMessage = ChatMessage.objects.create(message=message, chat=chat, user_id=member.user_id)
            Member.objects.filter(pk=member.id).update(updated_at=dt_now)
            message_notify_service(
                user_id=member.user_id,
                chat_message_id=chat_message.pk,
                chat_id=chat.pk,
                member_id=member.pk
            )
        return AddMessageMutation()


class ChangeMessageStateMutation(BaseMutation):
    """ Доставка и прочтение сообщений """

    class Input:
        message_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы сообщений'
        )
        state = graphene.String(required=True, description='Изменяемое состояние: delivered|read')

    @staticmethod
    @permission_classes((IsAuthenticated,))
    def mutate_and_get_payload(root, info: ResolveInfo, message_ids: list[str], state: str):
        if state not in ['delivered', 'read']:
            return ChangeMessageStateMutation(success=False, errors=[
                ErrorFieldType(state, [f'Поле {state} не допускается'])
            ])
        user: User = info.context.user
        dt_now = make_aware(datetime.utcnow())
        message_ids = [from_gid_or_none(message_id)[1] for message_id in message_ids]
        chat_messages = ChatMessage.objects.filter(pk__in=message_ids, user_id=user.id).values('chat', 'message')
        chat_msgs = ChatMessage.objects \
            .filter(
                chat_id__in=[cm['chat'] for cm in chat_messages],
                message_id__in=[cm['message'] for cm in chat_messages]
            ) \
            .annotate(cm_user=F('chat__member__user')) \
            .exclude(user=user.id) \
            .exclude(cm_user=user.id) \
            .values('id', 'chat', 'chat__member', 'cm_user')
        updates = {'delivered': dt_now, 'read': dt_now} if state == 'read' else {'delivered': dt_now}
        ChatMessage.objects.filter(pk__in=[chat_msg['id'] for chat_msg in chat_msgs]).update(**updates)
        for chat_msg in chat_msgs:
            print('----')
            print(user)
            print(chat_msg)
            message_notify_service(
                user_id=chat_msg['cm_user'],
                chat_message_id=chat_msg['id'],
                chat_id=chat_msg['chat'],
                member_id=chat_msg['chat__member'],
                cm_action=ConsumerActionType.CHANGE,
                email=False
            )
            print('----')
        return ChangeMessageStateMutation()


class FavoriteMessage(BaseMutation):
    """ Добавление сообщения в избранные """

    class Input:
        message_id = graphene.ID(required=True, description='Идентификатор сообщения')

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, message_id: str):
        chat_message: ChatMessage = get_object_or_404(ChatMessage, message_id=message_id, user_id=info.context.user.pk)
        chat_message.favorite = not chat_message.favorite
        chat_message.save(update_fields=['favorite'])
        return FavoriteMessage()


class PinnedMessage(BaseMutation):
    """ Закрепления сообщения """

    class Input:
        message_id = graphene.ID(required=True, description='Идентификатор сообщения')
        chat_id = graphene.ID(required=True, description='Идентификатор чата')

    message = graphene.Field(MessageType, description='Закреленное сообщение')

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, message_id: str, chat_id: str):
        message: Message = get_object_or_404(Message, pk=message_id)
        message.pinned = not message.pinned
        message.save(update_fields=['pinned'])
        return PinnedMessage(message=message)


class DeleteMessages(BaseMutation):
    """ Удаление сообщения """

    class Input:
        message_ids = graphene.List(
            graphene.NonNull(graphene.ID),
            required=True,
            description='Идентификаторы сообщений'
        )
        chat_id = graphene.ID(required=True, description='Идентификатор чата')
        for_everyone = graphene.Boolean(required=True, description='Удалять для всех')

    @staticmethod
    def mutate_and_get_payload(root, info: ResolveInfo, message_ids: list[str], for_everyone: bool, chat_id: str):
        for message_id in message_ids:
            chat_message: ChatMessage = get_object_or_404(ChatMessage, message_id=message_id)
            chat_message.deleted = False
            chat_message.save(update_fields='deleted')
        return DeleteMessages()


class MessengerMutations(graphene.ObjectType):
    add_chat = AddChatMutation.Field(required=True, description='Добавление чата')
    change_member_property = ChangeMemberPropertyMutation.Field(required=True, description='Изменение свойств чата')
    delete_member = DeleteMemberMutation.Field(required=True, description='Удаление чата')

    add_message = AddMessageMutation.Field(required=True, description='Добавления сообщения')

    change_message_state = ChangeMessageStateMutation.Field(required=True, description='Прочтение сообщений')
    favorite_message = FavoriteMessage.Field(required=True, description='Добавление сообщения в избранные')
    pinned_message = PinnedMessage.Field(required=True, description='Закрепления сообщения')
    delete_messages = DeleteMessages.Field(required=True, description='Удаления сообщения')

