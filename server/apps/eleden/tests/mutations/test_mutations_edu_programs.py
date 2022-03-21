import datetime

from graphene import ResolveInfo
from graphene_django.rest_framework.mutation import SerializerMutation
from rest_framework import serializers

from apps.eleden.models.education import EduProgram, EduForm
from apps.eleden.tests.test_setup import EducationTestCase
from devind.schema import schema


def mock_info():
    return ResolveInfo(
        None,
        None,
        None,
        None,
        path=None,
        schema=schema,
        fragments=None,
        root_value=None,
        operation=None,
        variable_values=None,
        context=None,
    )


class EduProgramModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduProgram
        fields = "__all__"


class EduFormModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduForm
        fields = "__all__"


class EduProgramModelMutation(SerializerMutation):
    class Meta:
        serializer_class = EduProgramModelSerializer


class EduFormModelMutation(SerializerMutation):
    class Meta:
        serializer_class = EduFormModelSerializer


class EduProgramSerializer(serializers.Serializer):
    text = serializers.CharField()
    model = EduProgramModelSerializer()

    def create(self, validated_data):
        return validated_data


class EduProgramTestFields(EducationTestCase):
    """
    Проверка работы SerializerMutation
    """

    def test_has_fields(self):
        class TestMutation(SerializerMutation):
            class Meta:
                serializer_class = EduProgramSerializer

        self.assertIn('text', TestMutation._meta.fields)
        self.assertIn('model', TestMutation._meta.fields)
        self.assertIn('errors', TestMutation._meta.fields)

    def test_has_input_fields(self):
        class TestMutation(SerializerMutation):
            class Meta:
                serializer_class = EduProgramSerializer

        self.assertIn('text', TestMutation._meta.fields)
        self.assertIn('model', TestMutation._meta.fields)
        self.assertIn('errors', TestMutation._meta.fields)

    def test_exclude_fields(self):
        class TestMutation(SerializerMutation):
            class Meta:
                serializer_class = EduProgramModelSerializer
                exclude_fields = ['created']

        self.assertIn('name', TestMutation._meta.fields)
        self.assertNotIn('created', TestMutation._meta.fields)
        self.assertIn('errors', TestMutation._meta.fields)
        self.assertIn('name', TestMutation.Input._meta.fields)
        self.assertNotIn('created', TestMutation.Input._meta.fields)

    def test_mutate_and_get_payload_success(self):
        class TestMutation(SerializerMutation):
            class Meta:
                serializer_class = EduProgramSerializer

        result = TestMutation.mutate_and_get_payload(
            None, mock_info(), **{'text': 'value', 'model': {'name': 'Testname',
                                                             'admission': 2019,
                                                             'expedited': False,
                                                             'edu_form': 2,
                                                             'direction': 2}})
        self.assertEqual(result.errors, None)

    def test_mutate_model_and_get_payload_success(self):
        result = EduProgramModelMutation.mutate_and_get_payload(
            None, mock_info(), **{'name': 'Testname',
                                  'admission': 2019,
                                  'expedited': False,
                                  'edu_form': 2,
                                  'direction': 2})
        self.assertEqual(result.errors, None)
        self.assertEqual(result.name, 'Testname')
        self.assertIsInstance(result.created_at, datetime.datetime)

    def test_model_partial_update_mutate_and_get_payload_success(self):
        instance = EduProgram.objects.create(
            id=1,
            name='New program',
            adaptive=False,
            admission=2019,
            expedited=False,
            edu_form_id=2,
            direction_id=2
        )
        result = EduProgramModelMutation.mutate_and_get_payload(
            None, mock_info(), **{'id': instance.id}
        )
        self.assertEqual(result.errors, None)
        self.assertEqual(result.name, 'New program')

    def test_model_invalid_update_mutate_and_get_payload_success(self):
        class InvalidModelMutation(SerializerMutation):
            class Meta:
                serializer_class = EduProgramModelSerializer
                model_operations = ["update"]

        with self.assertRaises(Exception) as exc:
            result = InvalidModelMutation.mutate_and_get_payload(
                None, mock_info(), **{'name': 'Testname',
                                      'admission': 2019,
                                      'expedited': False,
                                      'edu_form': 2,
                                      'direction': 2}
            )
        the_exc = exc.exception
        self.assertIn('Invalid update operation', str(the_exc.args))
