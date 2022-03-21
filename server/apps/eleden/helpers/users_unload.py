import posixpath
from datetime import datetime
from os.path import join

from django.conf import settings
from django.http import HttpRequest
from django.template import Template, Context
from graphql_relay import from_global_id

from devind_core.models import ProfileValue
from apps.core.models import User
from apps.eleden.models import Discipline, Job, Team


class UsersUnload:

    def __init__(self, users_id: list[int], team_id: str, request: HttpRequest):
        """ Генерация  """

        self.path: str = join(settings.DOCUMENTS_DIR, f'users_{datetime.now().strftime("%d-%m-%Y_%H-%M-%S")}')
        self.users: list = User.objects.filter(pk__in=users_id).values(
            'id',
            'last_name',
            'first_name',
            'sir_name',
            'avatar'
        )
        team = Team.objects.get(pk=from_global_id(team_id)[1])
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
        pvs = ProfileValue.objects.select_related('user', 'profile').filter(
            profile__code__in=codes,
            user__in=users_id
        )
        disciplines = Discipline.objects.prefetch_related('users')

        for u in self.users:
            job = Job.objects.get(user=u['id'], team=team)
            u['post'] = ', '.join(job.job_post_set.values_list('post__name', flat=True))
            u['profile_values'] = [{pv.profile.code: pv.value for pv in pvs.filter(user=u['id'])}]
            u['disciplines'] = ', '.join(set(disciplines.filter(users=u['id']).values_list('name', flat=True)))

    def html(self):
        """ Генерация выгрузки html """

        path_template: str = join(settings.BASE_DIR, 'apps', 'eleden', 'templates', 'users', 'index.html')
        with open(path_template) as f:
            template: Template = Template(f.read())
        context: Context = Context({'users': self.users})
        path_output = f'{self.path}.html'
        with open(path_output, 'w+') as f:
            f.write(template.render(context))
        return posixpath.relpath(path_output, settings.BASE_DIR)
