from auditlog.registry import auditlog
from .models import Team, EduForm, EduProgram, Discipline, MethodologicalSupport


auditlog.register(Team)
auditlog.register(EduForm)
auditlog.register(EduProgram)
auditlog.register(Discipline)
auditlog.register(MethodologicalSupport)
