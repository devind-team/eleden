# Модуль types



## Класс AttachedFileType

Прикрепленные файлы

## Класс MessageType

Сообщение пользователя

### Методы

| Сигнатура                                                                                                                                       | Декораторы       | Описание |
| :---------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------- |
| resolve_forwarded( message: apps.messenger.models.Message, info: graphql.execution.base.ResolveInfo) -&#62; List[apps.messenger.models.Message] | ['staticmethod'] | -        |

## Класс ChatType

Чат

### Методы

| Сигнатура                                                                                         | Декораторы       | Описание |
| :------------------------------------------------------------------------------------------------ | :--------------- | :------- |
| resolve_last_message(chat: apps.messenger.models.Chat, info) -&#62; apps.messenger.models.Message | ['staticmethod'] | -        |

## Класс MemberType

Участники чата

## Класс ChatMessageType

Сообщения чата