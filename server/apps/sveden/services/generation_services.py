from functools import reduce
from urllib.parse import urljoin
from django.db.models import Prefetch
from apps.eleden.models import Team, Discipline, Job, EduProgram
from devind_core.models import ProfileValue
from apps.sveden.models import Subsection, ItemPropContainer


def generate_edu_programs(eleden_link):
    non_adaptive = []
    adaptive = []
    edu_programs = EduProgram.objects \
        .values(
        'id',
        'name',
        'adaptive',
        'admission',
        'description',
        'syllabus',
        'calendar',
        'direction__code',
        'direction__edu_service__name',
        'edu_form__name') \
        .order_by('direction__code', 'direction__edu_service__name', 'admission')
    disciplines = Discipline.objects \
        .prefetch_related(Prefetch('methodologicalsupport_set')) \
        .filter(edu_program__in=[ep['id'] for ep in edu_programs]) \
        .exclude(pk__in=Discipline.objects.filter(parent_id__isnull=False).values_list('parent_id', flat=True)) \
        .all()
    disciplines = sorted(disciplines, key=lambda discipline: discipline.order)
    for ep in edu_programs:
        disc = [d for d in disciplines if d.edu_program_id == ep['id']]
        methodologi = reduce(lambda a, c: [*a, *c.methodologicalsupport_set.all()], disc,
                             [])

        description = [urljoin(eleden_link, ep['description'])]
        pw = []

        for x in disc:
            if x.kind_id == 2 and x.work_program:  # todo: пока словари не в сидерах возможны проблемы
                pw.append(urljoin(eleden_link, x.work_program.url))
            elif x.kind_id != 2 and x.work_program:
                description.append(urljoin(eleden_link, x.work_program.url))

        res = [
                ep['direction__code'],
                ep['name'],
                ep['direction__edu_service__name'],
                ep['edu_form__name'],
                '\n'.join(description),
                urljoin(eleden_link, ep['syllabus']),
                '\n'.join([urljoin(eleden_link, d.annotation.url) for d in disc if d.annotation.name]),
                urljoin(eleden_link, ep['calendar']),
                '\n'.join([urljoin(eleden_link, m.src.url) for m in methodologi]),
                '\n'.join(pw),
                '-'
            ]

        if ep['adaptive']:
            adaptive.append(res)
        else:
            non_adaptive.append(res)

    non_adaptive_ipc = Subsection.objects.get(url='education').itempropcontainer_set.filter(
        is_generated=True, itemprop__item_prop='eduOp').first()
    adaptive_ipc = Subsection.objects.get(url='education').itempropcontainer_set.filter(
        is_generated=True, itemprop__item_prop='eduAdOp').first()
    non_adaptive_ipc.values = non_adaptive
    adaptive_ipc.values = adaptive
    ItemPropContainer.objects.bulk_update((adaptive_ipc, non_adaptive_ipc,), ('values',))


def generate_users():
    codes = (
        'education_level',
        'qualification',
        'degree',
        'rank',
        'speciality',
        'internship',
        'general_experience',
        'specialty_experience',
    )
    disciplines = Discipline.objects.prefetch_related('users')
    res = []
    ids = []

    for team in Team.objects.filter(parent__isnull=True, edu_program__isnull=True).first().team_set.all():
        users: list = team.users.exclude(id__in=ids).values(
            'id',
            'last_name',
            'first_name',
            'sir_name'
        )
        pvs = ProfileValue.objects.select_related('user', 'profile').filter(
            profile__code__in=codes,
            user__in=[x['id'] for x in users]
        )

        for u in users:
            job = Job.objects.get(user=u['id'], team=team)
            u['post'] = ', '.join(job.job_post_set.values_list('post__name', flat=True))
            profile = {pv.profile.code: pv.value for pv in pvs.filter(user=u['id'])}
            u['disciplines'] = ', '.join(set(disciplines.filter(users=u['id']).values_list('name', flat=True)))
            res.append([
                f'{u.get("last_name", "")} {u.get("first_name", "")} {u.get("sir_name", "")}',
                u['post'],
                u['disciplines'],
                profile.get('education_level', ''),
                profile.get('qualification', ''),
                profile.get('degree', ''),
                profile.get('rank', ''),
                profile.get('speciality', ''),
                profile.get('internship', ''),
                profile.get('general_experience', ''),
                profile.get('specialty_experience', '')
            ])
            ids.append(u['id'])
    ipc = Subsection.objects.get(url='employees').itempropcontainer_set.filter(
        is_generated=True, itemprop__item_prop='teachingStaff').first()
    ipc.values = res
    ipc.save(update_fields=('values',))
