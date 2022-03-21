from celery import shared_task
from apps.sveden.services import generate_users, generate_edu_programs


@shared_task
def fill_users():
    generate_users()


@shared_task
def fill_edu_programs(host):
    generate_edu_programs(host)
