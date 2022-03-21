import graphene
from graphql import ResolveInfo
from graphql_relay import from_global_id
from devind_helpers.decorators import permission_classes
from devind_helpers.mutation_factories import DeleteMutation
from devind_helpers.schema import BaseMutation
from apps.sveden.models import Subsection
from apps.sveden.schema.types import SubsectionType
from apps.sveden.permissions import AddSubsection, ChangeSubsection
from apps.sveden.services import create_subsection, change_subsection


class AddSubsectionMutation(BaseMutation):
    """Мутация добавления подраздела."""

    class Input:
        header = graphene.String(required=True, description='Название подраздела')
        url = graphene.String(requiured=True, description='Путь до подраздела')

    subsection = graphene.Field(SubsectionType, required=True)

    @staticmethod
    @permission_classes((AddSubsection,))
    def mutate_and_get_payload(root, info: ResolveInfo, url: str, header: str, *args, **kwargs):
        return AddSubsectionMutation(subsection=create_subsection(url, header))


class ChangeSubsectionMutation(BaseMutation):
    """Мутация изменения подраздела."""

    class Input:
        subsection_id = graphene.ID(required=True, description='Идентификатор подраздела')
        header = graphene.String(required=True, description='Новое название подраздела')
        url = graphene.String(requiured=True, description='Новый путь до подраздела')

    subsection = graphene.Field(SubsectionType, required=True)

    @staticmethod
    @permission_classes
    @permission_classes((ChangeSubsection,))
    def mutate_and_get_payload(root, info: ResolveInfo, subsection_id: str, *args, **kwargs):
        subsection = Subsection.objects.get(pk=from_global_id(subsection_id)[1])
        change_subsection(subsection, **kwargs)
        return ChangeSubsectionMutation(subsection=subsection)


class SubsectionMutations(graphene.ObjectType):
    add_subsection = AddSubsectionMutation.Field(required=True, description='Мутация добавления подраздела')
    change_subsection = ChangeSubsectionMutation.Field(required=True, description='Мутация изменения подраздела')
    delete_subsection = DeleteMutation(Subsection, is_global_id=True).Field(required=True)
