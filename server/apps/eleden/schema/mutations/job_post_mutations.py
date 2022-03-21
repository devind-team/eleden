from datetime import datetime

import graphene
from graphql import ResolveInfo

from apps.eleden.helpers.job_status import add_job_post_status, add_job_post_with_status, get_decrees_src
from apps.eleden.models import Job, JobPost
from apps.eleden.permissions import AddJobPost, DeleteJobPost, AddJobPostStatusHistory
from apps.eleden.schema.types import JobPostType, JobPostStatusHistoryType
from apps.eleden.validators import AddJobPostValidator, AddJobPostStatusHistoryValidator
from devind_helpers.decorators import permission_classes, validation_classes
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_404
from devind_helpers.permissions import IsAuthenticated
from devind_helpers.schema.mutations import BaseMutation


class AddJobPostMutation(BaseMutation):
    """Добавление должности пользователя в группе"""

    class Input:
        job_id = graphene.ID(required=True, descriptions='Идентификатор места работы пользователя')
        rate = graphene.Float(required=True, description='Занимаемая ставка')
        kind = graphene.String(required=True, description='Тип работы')
        post_id = graphene.ID(required=True, description='Идентификатор занимаемой должности')
        status_id = graphene.ID(
            required=True,
            description='Идентификатор статуса должности пользователя на месте работы'
        )
        status_created_at = graphene.Date(
            required=True,
            description='Дата присвоения статуса должности пользователя на месте работы'
        )
        generate_docx = graphene.Boolean(required=True, description='Создавать приказ в формате docx')
        generate_pdf = graphene.Boolean(required=True, description='Создавать приказ в формате pdf')

    job_post = graphene.Field(JobPostType, description='Новая должность пользователя на месте работы')
    src = graphene.String(description='Ссылка на сгенерированный файл')

    @classmethod
    @permission_classes((IsAuthenticated, AddJobPost,))
    @validation_classes((AddJobPostValidator,))
    def mutate_and_get_payload(cls, root, info: ResolveInfo, generate_docx: bool, generate_pdf: bool, **kwargs):
        job: Job = get_object_or_404(Job, id=kwargs['job_id'])
        info.context.check_object_permissions(info.context, job.team)
        created_at = datetime.combine(kwargs['status_created_at'], datetime.now().time())
        job_post, job_post_status_history = add_job_post_with_status(
            job,
            created_at,
            generate_docx,
            generate_pdf,
            **kwargs
        )
        src = get_decrees_src(job_post_status_history, created_at) if generate_docx or generate_pdf else None
        return cls(job_post=job_post, src=src)


class AddJobPostStatusHistoryMutation(BaseMutation):
    """Добавление истории статусов должности пользователя на месте работы"""

    class Input:
        job_post_id = graphene.ID(required=True, description='Идентификатор должности пользователя на месте работы')
        status_id = graphene.ID(
            required=True,
            description='Идентификатор статуса должности пользователя на месте работы'
        )
        status_created_at = graphene.Date(
            required=True,
            description='Дата присвоения статуса должности пользователя на месте работы'
        )
        generate_docx = graphene.Boolean(required=True, description='Создавать приказ в формате docx')
        generate_pdf = graphene.Boolean(required=True, description='Создавать приказ в формате pdf')
        complete_previous = graphene.Boolean(default=True, description='Завершить предыдущие статусы')

    new_job_post_status_history = graphene.Field(
        JobPostStatusHistoryType,
        description='Новая история статусов должности пользователя на месте работы'
    )
    completed_job_post_status_history = graphene.List(
        graphene.NonNull(JobPostStatusHistoryType),
        description='Завершенные истории статусов должности пользователя на месте работы'
    )
    src = graphene.String(description='Ссылка на сгенерированный файл')

    @classmethod
    @permission_classes((IsAuthenticated, AddJobPostStatusHistory,))
    @validation_classes((AddJobPostStatusHistoryValidator,))
    def mutate_and_get_payload(
            cls,
            root,
            info: ResolveInfo,
            generate_docx: bool,
            generate_pdf: bool,
            complete_previous: bool,
            **kwargs):
        job_post: JobPost = JobPost.objects.get(pk=kwargs['job_post_id'])
        info.context.check_object_permissions(info.context, job_post.job.team)
        completed_job_post_status_history = []
        if complete_previous:
            for status_history in job_post.status_history_set.all():
                status_history.end_at = datetime.now()
                status_history.save()
                completed_job_post_status_history.append(status_history)
        created_at = datetime.combine(kwargs['status_created_at'], datetime.now().time())
        job_post_status_history = add_job_post_status(
            job_post,
            kwargs['status_id'],
            created_at,
            generate_docx,
            generate_pdf
        )
        src = get_decrees_src(job_post_status_history, created_at) if generate_docx or generate_pdf else None
        return cls(
            new_job_post_status_history=job_post_status_history,
            completed_job_post_status_history=completed_job_post_status_history,
            src=src
        )


class JobPostMutations(graphene.ObjectType):
    add_job_post = AddJobPostMutation.Field(required=True)
    delete_job_post = DeleteMutation(
        model=JobPost,
        permissions=(IsAuthenticated, DeleteJobPost),
        check_permissions=lambda context, job_post: context.check_object_permissions(context, job_post.job.team)
    ).Field(required=True)
    add_job_post_status_history = AddJobPostStatusHistoryMutation.Field(required=True)
