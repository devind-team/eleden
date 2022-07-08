# Модуль process_services



### Функции

| Сигнатура                                                                                                                                                                                                  | Декораторы | Описание                                                                                                                           |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| get_teams_summary_report( teams: Iterable[apps.eleden.models.team.Team], users: Optional[Iterable[apps.core.models.User]] = None) -&#62; Iterable[apps.eleden.services.process_services.TeamSummaryReport] | -          | Получение итогового отчета по оценкам групп.:param teams: группы:param users: пользователи:return: итоговый отчет по оценкам групп |
| get_users_summary_report( users: Iterable[apps.core.models.User]) -&#62; Iterable[apps.eleden.services.process_services.TeamSummaryReport]                                                                 | -          | Получение итогового отчета по оценкам пользователей.:param users: пользователи:return: итоговый отчет по оценкам пользователей     |

## Класс TeamSummaryReport

Итоговый отчет по оценкам группы.

### Методы

| Сигнатура                                                                                                                                                                       | Декораторы | Описание            |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :------------------ |
| __init__( self, team: apps.eleden.models.team.Team, edu_hours: Iterable[apps.eleden.models.education.EduHours], attestations: Iterable[apps.eleden.models.process.Attestation]) | -          | -                   |
| __repr__(self)                                                                                                                                                                  | -          | Return repr(self).  |
| __eq__(self, other)                                                                                                                                                             | -          | Return self==value. |