from django.test import RequestFactory
from graphene.test import Client
from oauth2_provider.models import get_application_model
from rest_framework.test import APITestCase

from apps.core.models import User
from apps.eleden.models.education import Direction, EduService, EduForm, EduProgram
from devind.schema import schema


class MockContext(object):
    def __init__(self):
        self.headers = {' '}
        self.META = {
            'HTTP_USER_AGENT': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
            'REMOTE_ADDR': '127.0.0.1'
        }


Application = get_application_model()


class EducationTestCase(APITestCase):
    """
    SetUp for tests
    """

    context_value = MockContext()

    def setUp(self):
        self.client = Client(schema, context_value=self.context_value)
        self.user = User.objects.create(
            username='admin',
            email='admin@gmail.com',
            first_name='Foo',
            last_name='Bar',
            sir_name='Bar',
            is_active=True,
            is_superuser=True,
        )
        self.user.set_password('123456789')
        self.user.save()
        self.application = Application(
            name='Клиентское web-приложение',
            redirect_uris='/auth/login',
            user=self.user,
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_PASSWORD,
            client_id='WuMbmZBv9Up1fILxulSouRtZ5FSBrifV631jhy0X',
            client_secret='asBIDsk67qqenHdWNyqslPlwM2S2OqGEAjDyjVDB95hecm7HiiujdywsWNGtsHkJq3QSKf48qgBOP7p1tAGZ2GoBaHgVIydXAezJOHLKyJx5Lp7vdKMmgAy5iZDTwh1J',
            algorithm=''
        )
        self.application.save()

        self.edu_form = EduForm.objects.create(
            id=2,
            name='test_form',
            short_name='tf',
        )
        self.edu_form.save()

        self.edu_service = EduService.objects.create(
            id=2,
            name='test_name'
        )
        self.edu_service.save()

        self.direction = Direction.objects.create(
            id=2,
            name='test_name',
            code='Б1.Б2.33',
            edu_service_id=2,
        )
        self.direction.save()

        self.edu_program = EduProgram.objects.create(
            id=2,
            name='test_program',
            adaptive=False,
            admission=2019,
            expedited=False,
            edu_form_id=2,
            direction_id=2
        )
        self.edu_program.save()

        self.factory = RequestFactory()

    def tearDown(self):
        self.user.delete()
        self.application.delete()