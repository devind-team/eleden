from ..test_queries import get_token, \
    register_new_user
from ..test_setup import EducationTestCase


class TestGetToken(EducationTestCase):
    def test_get_token_mutation(self):
        payload_user = {
            'username': 'test_user',
            'email': 'test@gmail.com',
            'lastName': 'Иванов',
            'firstName': 'Иван',
            'sirName': 'Иванович',
            'birthday': '2001-06-05',
            'password': '123456789',
            'agreement': True,
        }
        response_user = self.client.execute(register_new_user, variables={'input': payload_user})
        success_register = response_user.get('data').get('register')

        payload_get_token = {
            'clientId': self.application.client_id,
            'clientSecret': self.application.client_secret,
            'grantType': 'password',
            'username': 'test_user',
            'password': '123456789'
        }
        response_get_token = self.client.execute(get_token, variables={'input': payload_get_token})
        success_get_token = response_get_token.get('data').get('getToken')
        access_token = success_get_token['accessToken']

        self.assertEqual(success_register['success'], True)
        self.assertEqual(success_register['errors'], [])
        self.assertEqual(success_get_token['success'], True)
        self.assertTrue(len(access_token))
