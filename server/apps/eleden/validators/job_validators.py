from devind_helpers.validator import Validator
from .job_post_validators import JobPostValidator


class AddJobValidator(Validator):
    rate = 'required|decimal'
    kind = 'required|min_length:2|max_length:2'
    post_id = 'required|exist:eleden.Post,id'
    team_id = 'required|exist:eleden.Team,id'
    user_id = 'required|exist:core.User,id'
    status_id = 'required|exist:eleden.JobPostStatus,id'
    status_created_at = 'required'

    message = {
        **JobPostValidator.message,
        'team_id': {
            'required': 'Поле "Группа" обязательно для заполнения',
            'exist': 'Группа пользователей с таким идентификатором не существут'
        },
        'user_id': {
            'required': 'Поле "Пользователь" обязательно для заполнения',
            'exist': 'Пользователь с таким идентификатором не существует'
        },
        'status_id': {
            'required': 'Поле "Статус" обязательно для заполнения',
            'exist': 'Статус с таким идентификатором не существует'
        },
        'status_created_at': {
            'required': 'Поле "Дата присвоения статуса" обязательно для заполнения'
        }
    }


class UploadJobsValidator(Validator):
    rate = 'required|decimal'
    kind = 'required|min_length:2|max_length:2'
    post_id = 'required|exist:eleden.Post,id'
    status_id = 'required|exist:eleden.JobPostStatus,id'
    status_created_at = 'required'

    message = {
        **JobPostValidator.message,
        'status_id': {
            'required': 'Поле "Статус" обязательно для заполнения',
            'exist': 'Статус с таким идентификатором не существует'
        },
        'status_created_at': {
            'required': 'Поле "Дата присвоения статуса" обязательно для заполнения'
        }
    }


class UploadJobsUserValidator(Validator):
    rate = 'required|decimal'
    kind = 'required|min_length:2|max_length:2'
    post_id = 'required|exist:eleden.Post,id'
    team_id = 'required|exist:eleden.Team,id'
    status_id = 'required|exist:eleden.JobPostStatus,id'
    status_created_at = 'required'

    message = {
        **JobPostValidator.message,
        'team_id': {
            'required': 'Поле "Группа" обязательно для заполнения',
            'exist': 'Группа пользователей с таким идентификатором не существут'
        },
        'status_id': {
            'required': 'Поле "Статус" обязательно для заполнения',
            'exist': 'Статус с таким идентификатором не существует'
        },
        'status_created_at': {
            'required': 'Поле "Дата присвоения статуса" обязательно для заполнения'
        }
    }
