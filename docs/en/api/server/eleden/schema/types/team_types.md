# Модуль team_types



## Класс JobPostStatusType

Статус должности пользователя на месте работы

## Класс JobPostStatusHistoryType

История стасусов должности пользователя на месте работы

## Класс PostType

Занимаемая должность

### Методы

| Сигнатура                                                                                                                                                  | Декораторы                                                     | Описание |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- | :------- |
| resolve_job_statuses( post: apps.eleden.models.team.Post, info: graphql.execution.base.ResolveInfo) -&#62; Iterable[apps.eleden.models.team.JobPostStatus] | ['staticmethod', "resolver_hints(model_field='job_statuses')"] | -        |

## Класс JobPostType

Должность пользователя на месте работы

### Методы

| Сигнатура                                                                                                                                                                  | Декораторы                                                           | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :------- |
| resolve_status_history( job_post: apps.eleden.models.team.JobPost, info: graphql.execution.base.ResolveInfo) -&#62; Iterable[apps.eleden.models.team.JobPostStatusHistory] | ['staticmethod', "resolver_hints(model_field='status_history_set')"] | -        |

## Класс JobType

Место работы пользователя

### Методы

| Сигнатура                                                                                                                             | Декораторы                                                     | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- | :------- |
| resolve_job_posts( job: apps.eleden.models.team.Job, info: graphql.execution.base.ResolveInfo) -&#62; apps.eleden.models.team.JobPost | ['staticmethod', "resolver_hints(model_field='job_post_set')"] | -        |

## Класс TeamPermissionsType

Разрешения группы пользователей

### Методы

| Сигнатура                                                                                                                | Декораторы       | Описание |
| :----------------------------------------------------------------------------------------------------------------------- | :--------------- | :------- |
| resolve_can_change( team: apps.eleden.models.team.Team, info: graphql.execution.base.ResolveInfo) -&#62; bool            | ['staticmethod'] | -        |
| resolve_can_delete( team: apps.eleden.models.team.Team, info: graphql.execution.base.ResolveInfo) -&#62; bool            | ['staticmethod'] | -        |
| resolve_can_view_team_members( team: apps.eleden.models.team.Team, info: graphql.execution.base.ResolveInfo) -&#62; bool | ['staticmethod'] | -        |

## Класс TeamType

Группа пользователей

### Методы

| Сигнатура                                                                                                                                                 | Декораторы                                                          | Описание |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------- |
| resolve_responsible_users( team: apps.eleden.models.team.Team, info: graphql.execution.base.ResolveInfo) -&#62; Iterable[apps.core.schema.types.UserType] | ['staticmethod', "resolver_hints(model_field='responsible_users')"] | -        |
| resolve_jobs( team: apps.eleden.models.team.Team, info: graphql.execution.base.ResolveInfo) -&#62; Iterable[apps.eleden.models.team.Job]                  | ['staticmethod', "resolver_hints(model_field='job_set')"]           | -        |