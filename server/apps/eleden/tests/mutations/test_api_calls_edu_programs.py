from graphene.test import Client

from apps.eleden.tests.test_setup import EducationTestCase
from devind.schema import schema
from ..test_queries import edu_form_query, \
    add_edu_form_mutation, \
    delete_edu_form_mutation, \
    edu_program_list_query, \
    get_token, \
    query_me


class EduFormTest(EducationTestCase):
    def test_single_edu_form_query(self):
        response = self.client.execute(edu_form_query)
        response_form = response.get('data').get('eduForms')
        self.assertEqual(response_form[0]['id'], str(self.edu_form.id))

    def test_list_edu_form_query(self):
        response = self.client.execute(edu_form_query)
        response_forms = response.get('data').get('eduForms')
        self.assertTrue(len(response_forms))

    def test_create_edu_form(self):
        payload = {
            'name': 'Очная',
            'shortName': 'О',
        }
        response = self.client.execute(add_edu_form_mutation, variables={'input': payload})
        response_form = response.get('data').get('addEduForm').get('eduForm')
        name = response_form.get('name')
        self.assertEqual(name, payload['name'])

    # def test_update_edu_form(self):
    #     payload = {
    #         'id': self.edu_form.id,
    #         'name': 'Заочная',
    #         'shortName': 'З'
    #     }
    #     response = self.client.execute(change_edu_form_mutation, variables={'input': payload})
    #     edu_form = response.get('data').get('changeEduForm').get('eduForm')
    #     name = edu_form.get('name')
    #     self.assertEqual(name, payload['name'])
    #     self.assertNotEqual(name, self.edu_form.name)

    def test_delete_edu_form(self):
        payload = {
            'eduFormId': self.edu_form.id
        }
        response = self.client.execute(delete_edu_form_mutation, variables={'input': payload})
        success = response.get('data').get('deleteEduForm').get('success')
        self.assertEqual(success, True)


class EduProgramTest(EducationTestCase):
    def test_single_edu_program_query(self):
        import base64
        response = self.client.execute(edu_program_list_query)
        response_program = response.get('data').get('eduPrograms').get('edges')
        response_id = response_program[0]['node']['id']
        decode_id = base64.b64decode(response_id.encode()).decode().split(':')
        self.assertIn(str(self.edu_form.id), decode_id)
        self.assertEqual(response_program[0]['node']['name'], self.edu_program.name)

    def test_list_edu_program_query(self):
        response = self.client.execute(edu_program_list_query)
        response_programs = response.get('data').get('eduPrograms')
        self.assertTrue(len(response_programs))

    def test_create_edu_program(self):
        payload_get_token = {
            'clientId': self.application.client_id,
            'clientSecret': self.application.client_secret,
            'grantType': 'password',
            'username': 'admin',
            'password': '123456789'
        }
        response_get_token = self.client.execute(get_token, variables={'input': payload_get_token})
        success_get_token = response_get_token.get('data').get('getToken')
        access_token = success_get_token['accessToken']

        class MockContext(object):
            def __init__(self):
                self.HEADERS = {'Authorization': 'Bearer ' + access_token}
                self.META = {
                    'HTTP_USER_AGENT': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
                    'REMOTE_ADDR': '127.0.0.1'
                }

        context_value = MockContext()
        self.client = Client(schema, context_value=context_value)
        response = self.client.execute(query_me)
        response_data = response.get('data')
        print(response_data)
        # payload = {
        #     'name': 'testname',
        #     'adaptive': False,
        #     'admission': 2021,
        #     'expedited': False,
        #     'eduFormId': 2,
        #     'directionId': 2
        # }
        # response = self.client.execute(add_edu_program_mutation, variables={'input': payload})
        # print(response)