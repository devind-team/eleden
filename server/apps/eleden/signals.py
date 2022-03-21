from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from devind_core.models import LogEntry
from .models import Team, EduForm, EduProgram, Discipline, MethodologicalSupport


@receiver([post_save, pre_delete], sender=Team)
def handle_team(sender, instance: Team, **kwargs):
    LogEntry.logging(sender, instance, **kwargs)


@receiver([post_save, pre_delete], sender=EduForm)
def handle_edu_form(sender, instance: EduForm, **kwargs):
    LogEntry.logging(sender, instance, **kwargs)


@receiver([post_save, pre_delete], sender=EduProgram)
def handle_edu_program(sender, instance: EduProgram, **kwargs):
    LogEntry.logging(sender, instance, **kwargs)


@receiver([post_save, pre_delete], sender=Discipline)
def handle_discipline(sender, instance: Discipline, **kwargs):
    LogEntry.logging(sender, instance, **kwargs)


@receiver([post_save, pre_delete], sender=MethodologicalSupport)
def handle_methodological_support(sender, instance: MethodologicalSupport, **kwargs):
    LogEntry.logging(sender, instance, **kwargs)
