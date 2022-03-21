import zipfile
from datetime import datetime
from os import path, makedirs, remove
from typing import Optional, Iterable

from django.conf import settings
from django.template import Context

from apps.eleden.models import Job, JobPost, JobPostStatusHistory, JobPostStatus
from devind_helpers.generators import DocumentData, DocumentGenerator


def add_job_post_status(
        job_post: JobPost,
        status_id: str,
        status_created_at: datetime,
        generate_docx: bool,
        generate_pdf: bool) -> JobPostStatusHistory:
    """Добавление статуса места работы пользователя

    :param job_post: должность пользователя на месте работы
    :param status_id: идентификатор статуса должности пользователя на месте работы
    :param status_created_at: дата присвоения статуса должности пользователя на месте работы
    :param generate_docx: создавать приказ в формате docx
    :param generate_pdf: создавать приказ в формате pdf
    :return: история стасусов должности пользователя на месте работы
    """

    status = JobPostStatus.objects.get(pk=status_id)
    docx_data, pdf_data = _create_decrees(
        job_post,
        status,
        path.join(settings.BASE_DIR, JobPostStatusHistory._meta.get_field('decree_docx').upload_to)
        if generate_docx else None,
        path.join(settings.BASE_DIR, JobPostStatusHistory._meta.get_field('decree_pdf').upload_to)
        if generate_pdf else None,
        status_created_at
    ) if status.template_docx and status.template_xml else (None, None)
    job_status_history = JobPostStatusHistory.objects.create(
        decree_docx=docx_data.path if docx_data else None,
        decree_pdf=pdf_data.path if pdf_data else None,
        job_post=job_post,
        status=status
    )
    job_status_history.created_at = status_created_at
    job_status_history.save()
    return job_status_history


def add_job_post_with_status(
        job: Job,
        created_at: datetime,
        generate_docx: bool,
        generate_pdf: bool,
        **kwargs) -> tuple[JobPost, JobPostStatusHistory]:
    """Добавление должности пользователя на месте работы со статусом.

    :param job: место работы пользователя
    :param created_at: дата добавления статуса
    :param generate_docx: создавать приказ в формате docx
    :param generate_pdf: создавать приказ в формате pdf
    :param kwargs: данные для создания записей
    :return: (должность пользователя на месте работы, история стасусов должности пользователя на месте работы)
    """

    job_post = JobPost.objects.create(
        rate=kwargs['rate'],
        kind=kwargs['kind'],
        job=job,
        post_id=kwargs['post_id']
    )
    job_status_history = add_job_post_status(
        job_post,
        kwargs['status_id'],
        created_at,
        generate_docx,
        generate_pdf
    )
    return job_post, job_status_history


def get_decrees_src(job_post_status_history: JobPostStatusHistory, created_at: datetime) -> str:
    """Получение пути к файлу с приказами для одного статуса.

    :param job_post_status_history: история стасусов должности пользователя на месте работы
    :param created_at: дата создания
    :return: путь к файлу с приказами
    """

    if job_post_status_history.decree_docx and job_post_status_history.decree_pdf:
        archive_path, archive_full_path = _get_archive_paths(created_at)
        with zipfile.ZipFile(archive_full_path, 'w') as zf:
            zf.write(job_post_status_history.decree_docx.path, path.basename(job_post_status_history.decree_docx.path))
            zf.write(job_post_status_history.decree_pdf.path, path.basename(job_post_status_history.decree_pdf.path))
        return archive_path
    elif job_post_status_history.decree_docx:
        return str(job_post_status_history.decree_docx)
    elif job_post_status_history.decree_pdf:
        return str(job_post_status_history.decree_pdf)


def get_multiple_decrees_src(
        job_post_status_history: Iterable[JobPostStatusHistory],
        created_at: datetime) -> Optional[str]:
    """Получение пути к файлу с приказами для нескольких статусов.

    :param job_post_status_history: история стасусов должностей пользователей на месте работы
    :param created_at: дата создания
    :return: путь к файлу с приказами
    """

    archive_path, archive_full_path = _get_archive_paths(created_at)
    files_count = 0
    with zipfile.ZipFile(archive_full_path, 'w') as zf:
        for jsh in job_post_status_history:
            if jsh.decree_docx:
                zf.write(jsh.decree_docx.path, path.basename(jsh.decree_docx.path))
                files_count += 1
            if jsh.decree_pdf:
                zf.write(jsh.decree_pdf.path, path.basename(jsh.decree_pdf.path))
                files_count += 1
    if files_count:
        return archive_path
    else:
        remove(archive_full_path)
        return None


class _DecreeDocumentGenerator(DocumentGenerator):
    """Генератор приказа"""

    def __init__(self, context: Context, template_xml: str, template_docx: str, created_at: datetime):
        super().__init__(context, template_xml, template_docx)
        self.created_at = created_at

    def get_document_name(self) -> str:
        status_name = path.splitext(path.basename(self.template_docx))[0]
        user = self.context['user']
        user_name = f'{user["last_name"]} {user["first_name"]}'
        if user['sir_name']:
            user_name += f' {user["sir_name"]}'
        return f'{status_name}_{user_name}_{self.created_at.strftime("%H-%M-%d-%m-%Y")}'


def _make_dir(dir_path: str) -> None:
    """Создание директории в storage.

    :param dir_path: путь к директории, которую необходимо создать
    """

    full_path = path.join(settings.BASE_DIR, dir_path)
    if not path.exists(full_path):
        makedirs(full_path)


def _create_decrees(
        job_post: JobPost,
        status: JobPostStatus,
        docx_dir: Optional[str],
        pdf_dir: Optional[str],
        created_at: datetime) -> tuple[Optional[DocumentData], Optional[DocumentData]]:
    """Создание приказа по присвоению статуса.

    :param job_post: должность пользователя на месте работы
    :param status: статус должности пользователя на месте работы
    :param docx_dir: абсолютный путь к директории, в которой необходимо создавать docx
    :param pdf_dir: абсолютный путь к директории, к которой необходимо создавать pdf
    :param created_at: дата создания
    :return: (данные документа docx, данные документа pdf)
    """

    if docx_dir:
        _make_dir(docx_dir)
    if pdf_dir:
        _make_dir(pdf_dir)
    document_generator = _DecreeDocumentGenerator(Context({
        'rate': job_post.rate,
        'kind': job_post.kind,
        'team': {
            'name': job_post.job.team.name,
            'short_name': job_post.job.team.short_name,
            'admission': job_post.job.team.admission
        },
        'user': {
            'first_name': job_post.job.user.first_name,
            'last_name': job_post.job.user.last_name,
            'sir_name': job_post.job.user.sir_name,
            'birthday': job_post.job.user.birthday
        },
        'post': {
            'name': job_post.post.name
        },
        'status': {
            'name': status.name,
            'active': status.active
        },
        'created_at': created_at.strftime('%d.%m.%Y')
    }), status.template_xml.path, status.template_docx.path, created_at)
    docx_data = document_generator.generate_docx(docx_dir) if docx_dir else None
    if pdf_dir:
        document_generator.documents_dir = pdf_dir
        pdf_data = document_generator.generate_pdf(pdf_dir, docx_dir if docx_dir else pdf_dir, not docx_dir)
    else:
        pdf_data = None
    return docx_data, pdf_data


def _get_archive_document_name(created_at: datetime) -> str:
    """Получение названия документа, указывающего на временный архив.

    :param created_at: дата создания архива
    :return: название документа
    """

    return f'document_{created_at.strftime("%H-%M-%d-%m-%Y")}_tmp'


def _get_archive_paths(created_at: datetime) -> tuple[str, str]:
    """Получение путей к создаваемому архиву.

    :param created_at: дата создания архива
    :return: (путь к архиву относительно storage, полный путь к архиву)
    """

    archive_full_name = f'{_get_archive_document_name(created_at)}.zip'
    archive_full_path = path.join(settings.DOCUMENTS_DIR, archive_full_name)
    archive_path = path.join(path.relpath(settings.DOCUMENTS_DIR, settings.BASE_DIR), archive_full_name)
    return archive_path, archive_full_path


__all__ = ['add_job_post_status', 'add_job_post_with_status', 'get_decrees_src', 'get_multiple_decrees_src']
