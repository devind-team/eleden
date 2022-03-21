import graphene

from apps.eleden.schema.mutations import EduProgramsMutations, \
    ProcessMutations, \
    EducationMutations, \
    TeamMutations, \
    PortfolioMutations, \
    JobMutations, \
    JobPostMutations, \
    ArticleMutations
from apps.eleden.schema.queries import ArticleQueries, \
    EducationQueries, \
    ProcessQueries, \
    ProfileQueries, \
    StatisticsQueries, \
    TeamQueries
from apps.eleden.schema.types import ArticleType, ArticleIndexType
from apps.eleden.schema.types import EduFormType, \
    EduServiceType, \
    DirectionType, \
    EduProgramType, \
    DisciplineViewType, \
    DisciplineType, \
    MethodologicalSupportType, \
    TeamType, \
    JobType, \
    WorkFormType, \
    DisciplineKindType, \
    HoursKindType, \
    EduHoursType, \
    BlockKindType, \
    EduCycleType, \
    CompetenceType
from apps.eleden.schema.types import EduProgramStatisticsType
from apps.eleden.schema.types import FileKindType, PortfolioFileType
from apps.eleden.schema.types import WorkKindType, \
    PeriodType, \
    RegistrationType, \
    CourseType, \
    AttestationType, \
    AttachmentType, \
    HandoutType


class Query(
    ArticleQueries,
    EducationQueries,
    ProcessQueries,
    ProfileQueries,
    StatisticsQueries,
    TeamQueries,
    graphene.ObjectType
):
    """Запросы приложения eleden."""

    pass


class Mutation(
    EduProgramsMutations,
    EducationMutations,
    JobMutations,
    JobPostMutations,
    PortfolioMutations,
    ProcessMutations,
    TeamMutations,
    ArticleMutations,
    graphene.ObjectType
):
    """Мутации приложения eleden."""

    pass


class Subscription(graphene.ObjectType):
    """Подписки приложения eleden."""

    pass
