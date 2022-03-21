# Изменения в приложении


## Версия 1.5.0 (21.10.2021)

### Предварительные действия
Переименование приложения `messAnger` -> `messEnger`. Перед выкаткой приложения выполнить следующие sql команды.
```sql
alter table eleden_course drop column chat_id;
delete from django_migrations where app = 'messanger';
delete from auth_permission where content_type_id in (select id from django_content_type where app_label = 'messanger');
delete from django_content_type where app_label = 'messanger';
drop table messanger_chatmessages;
drop table messanger_chatmembers;
drop table messanger_message_files;
drop table messanger_chat;
drop table messanger_message;
```
### Изменения 
