import graphene
from graphql import ResolveInfo

from apps.eleden.models.education import EduForm, Direction
from apps.eleden.permissions import AddEduForm, ChangeEduForm, AddDirection, ChangeDirection
from apps.eleden.schema.types import EduFormType, DirectionType
from apps.eleden.validators import EduFormValidator, DirectionValidator
from devind_helpers.decorators import permission_classes, validation_classes
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.orm_utils import get_object_or_none, get_object_or_404
from devind_helpers.schema.mutations import BaseMutation


class AddEduFormMutation(BaseMutation):
    """Добавление формы обучения"""

    class Input:
        name = graphene.String(required=True, description='Название')
        short_name = graphene.String(required=True, description='Короткое название')
        parent_id = graphene.ID(description='Идентификатор родительской формы обучения')

    edu_form = graphene.Field(EduFormType, description='Новая форма обучения')

    @classmethod
    @permission_classes([AddEduForm])
    @validation_classes([EduFormValidator])
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        return cls(edu_form=EduForm.objects.create(**kwargs))


class ChangeEduFormMutation(BaseMutation):
    """Изменение формы обучения"""

    class Input:
        edu_form_id = graphene.ID(required=True, description='Идентификатор формы обучения')
        name = graphene.String(required=True, description='Название')
        short_name = graphene.String(required=True, description='Короткое название')
        parent_id = graphene.ID(description='Идентификатор родительской формы обучения')

    edu_form = graphene.Field(EduFormType, description='Измененная форма обучения')

    @classmethod
    @permission_classes([ChangeEduForm])
    @validation_classes([EduFormValidator])
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        parent = get_object_or_none(EduForm, pk=kwargs.get('parent_id', None))
        edu_form = get_object_or_404(EduForm, pk=kwargs['edu_form_id'])
        edu_form.name = kwargs['name']
        edu_form.short_name = kwargs['short_name']
        edu_form.parent = parent
        edu_form.save(update_fields=('name', 'short_name', 'parent',))
        return cls(edu_form=edu_form)


class AddDirectionMutation(BaseMutation):
    """Добавление направления подготовки"""

    class Input:
        code = graphene.String(required=True, description='Название')
        name = graphene.String(required=True, description='Код специальности')

    direction = graphene.Field(DirectionType, description='Новое направление подготовки')

    @classmethod
    @permission_classes([AddDirection])
    @validation_classes([DirectionValidator])
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        return cls(direction=Direction.objects.create(**kwargs))


class ChangeDirectionMutation(BaseMutation):
    """Изменение направления подготовки"""

    class Input:
        direction_id = graphene.ID(required=True, description='Идентификатор направления подготовки')
        code = graphene.String(required=True, description='Название')
        name = graphene.String(required=True, description='Код специальности')

    direction = graphene.Field(DirectionType, description='Измененное направление подготовки')

    @classmethod
    @permission_classes([ChangeDirection])
    @validation_classes([DirectionValidator])
    def mutate_and_get_payload(cls, root, info: ResolveInfo, **kwargs):
        direction = get_object_or_404(Direction, pk=kwargs['direction_id'])
        direction.code = kwargs['code']
        direction.name = kwargs['name']
        direction.save(update_fields=('code', 'name',))
        return cls(direction=direction)


class EducationMutations(graphene.ObjectType):
    # Мутациия для форм обучения
    add_edu_form = AddEduFormMutation.Field(required=True)
    change_edu_form = ChangeEduFormMutation.Field(required=True)
    delete_edu_form = DeleteMutation(EduForm).Field(required=True)

    # Мутации для направлений подготовки
    add_direction = AddDirectionMutation.Field(required=True)
    change_direction = ChangeDirectionMutation.Field(required=True)
    delete_direction = DeleteMutation(model=Direction).Field(required=True)
