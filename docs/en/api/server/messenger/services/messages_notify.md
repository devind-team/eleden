# Модуль messages_notify

Сервис по отправки уведомлений пользователям.

### Функции

| Сигнатура                                                                                                                                                                                                                              | Декораторы | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------- |
| message_notify_service( user_id: int, chat_message_id: int, chat_id: Optional[int] = None, member_id: Optional[int] = None, cm_action: devind_helpers.schema.types.ConsumerActionType = &#60;EnumMeta.ADD: 3&#62;, email: bool = True) | -          | -        |