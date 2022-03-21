from devind_helpers.validator import Validator


class JobPostValidator(Validator):
    rate = 'required|decimal'
    kind = 'required|min_length:2|max_length:2'
    post_id = 'required|exist:eleden.Post,id'

    message = {
        'rate': {
            'required': 'Поле "Занимаемая ставка" обязательно для заполнения',
            'decimal': 'Поле должно быть числом'
        },
        'kind': {
            'required': 'Поле "Тип работы" обязательно для заполнения',
            'min_length': 'Минимальная длина не менее 2 символов',
            'max_length': 'Максимальная длина не более 2 символов'
        },
        'post_id': {
            'required': 'Поле "Занимаемая дожность" обязательно для заполнения',
            'exist': 'Занимаемая должность с таким идентификатором не существут'
        }
    }


class AddJobPostValidator(Validator):
    job_id = 'required|exist:eleden.Job,id'
    rate = 'required|decimal'
    kind = 'required|min_length:2|max_length:2'
    post_id = 'required|exist:eleden.Post,id'
    status_id = 'required|exist:eleden.JobPostStatus,id'
    status_created_at = 'required'

    message = {
        'job_id': {
            'required': 'Поле "Место работы пользователя" обязательно для заполнения',
            'exist': 'Место работы пользователя с таким идентификатором не существует'
        },
        **JobPostValidator.message,
        'status_id': {
            'required': 'Поле "Статус" обязательно для заполнения',
            'exist': 'Статус с таким идентификатором не существует'
        },
        'status_created_at': {
            'required': 'Поле "Дата присвоения статуса" обязательно для заполнения'
        }
    }


class AddJobPostStatusHistoryValidator(Validator):
    job_post_id = 'required|exist:eleden.JobPost,id'
    status_id = 'required|exist:eleden.JobPostStatus,id'
    status_created_at = 'required'

    message = {
        'job_post_id': {
            'required': 'Поле "Должность пользователя на месте работы" обязательно для заполнения',
            'exist': 'Должность пользователя на месте работы с таким идентификатором не существует'
        },
        'status_id': {
            'required': 'Поле "Статус" обязательно для заполнения',
            'exist': 'Статус с таким идентификатором не существует'
        },
        'status_created_at': {
            'required': 'Поле "Дата присвоения статуса" обязательно для заполнения'
        }
    }
