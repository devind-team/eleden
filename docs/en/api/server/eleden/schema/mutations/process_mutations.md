# Модуль process_mutations



## Класс CoursesMutation

Мутация курсов

### Методы

| Сигнатура                                                                                                                         | Декораторы       | Описание                                                                                                                    |
| :-------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| save_courses( course_method: Callable, **kwargs) -&#62; apps.eleden.schema.mutations.process_mutations.CoursesMutation.SaveResult | ['staticmethod'] | Сохранение курсов.:param course_method: метод для получения курса:param kwargs: входные данные курсов:return: список курсов |

## Класс AddCoursesMutation

Добавление курсов

### Методы

| Сигнатура                                                                        | Декораторы                                                           | Описание |
| :------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddCourse])'] | -        |

## Класс ChangeCoursesMutation

Изменение курсов

### Методы

| Сигнатура                                                                                             | Декораторы                                                              | Описание |
| :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, ChangeCourse])'] | -        |

## Класс DeleteCoursesMutation

Удаление всех курсов группы

### Методы

| Сигнатура                                                                            | Декораторы                                                              | Описание |
| :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, team_id: str) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteCourse])'] | -        |

## Класс DeleteCourseMutation

Удаление курса

### Методы

| Сигнатура                                                                              | Декораторы                                                              | Описание |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, course_id: str) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteCourse])'] | -        |

## Класс AddAttestationMutation

Добавление аттестации

### Методы

| Сигнатура                                                                        | Декораторы                                               | Описание |
| :------------------------------------------------------------------------------- | :------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([AddAttestation])'] | -        |

## Класс ChangeAttestationMutation

Изменение аттестации

### Методы

| Сигнатура                                                                                              | Декораторы                                                  | Описание |
| :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, attestation_id: str, **kwargs) | ['staticmethod', 'permission_classes([ChangeAttestation])'] | -        |

## Класс DeleteAttestationMutation

Удаление аттестации

### Методы

| Сигнатура                                                                                   | Декораторы                                                  | Описание |
| :------------------------------------------------------------------------------------------ | :---------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, attestation_id: str) | ['staticmethod', 'permission_classes([DeleteAttestation])'] | -        |

## Класс AttachmentsMutation

Мутация прикрепленных файлов

### Методы

| Сигнатура                                                                                                                                                                                   | Декораторы       | Описание             |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------- | :------------------- |
| check_permissions( info: graphql.execution.base.ResolveInfo, course: apps.eleden.models.process.Course, period: apps.eleden.models.process.Period, user: apps.core.models.User) -&#62; None | ['staticmethod'] | Проверка разрешений. |

## Класс AddAttachmentsMutation

Добавление прикрепленных файлов

### Методы

| Сигнатура                                                                                                                  | Декораторы       | Описание                                     |
| :------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------------------------------------- |
| resolve(kwargs: dict) -&#62; dict                                                                                          | ['staticmethod'] | Очистка данных и преобразование id.          |
| get_common_params( kwargs: dict) -&#62; apps.eleden.schema.mutations.process_mutations.AddAttachmentsMutation.CommonParams | ['staticmethod'] | Получение общих параметров дочерних мутаций. |

## Класс AddPortfolioFileAttachmentsMutation

Добавление прикрепленных файлов из файлов портофолио

### Методы

| Сигнатура                                                                        | Декораторы                                              | Описание |
| :------------------------------------------------------------------------------- | :------------------------------------------------------ | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([AddAttachment])'] | -        |

## Класс AddFileAttachmentsMutation

Добавление прикрепленных файлов из файлов

### Методы

| Сигнатура                                                                        | Декораторы                                              | Описание |
| :------------------------------------------------------------------------------- | :------------------------------------------------------ | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([AddAttachment])'] | -        |

## Класс DeleteAttachmentsMutation

Удаление прикрепленных файлов

### Методы

| Сигнатура                                                                                          | Декораторы                                                 | Описание |
| :------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, attachment_ids: list[str]) | ['staticmethod', 'permission_classes([DeleteAttachment])'] | -        |

## Класс AddHandoutMutation

Добавление раздаточного материала

### Методы

| Сигнатура                                                                        | Декораторы                                           | Описание |
| :------------------------------------------------------------------------------- | :--------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([AddHandout])'] | -        |

## Класс ChangeHandoutMutation

Изменение раздаточного материала

### Методы

| Сигнатура                                                                                          | Декораторы                                              | Описание |
| :------------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, handout_id: str, **kwargs) | ['staticmethod', 'permission_classes([ChangeHandout])'] | -        |

## Класс DeleteHandoutsMutation

Удаление раздаточных материалов

### Методы

| Сигнатура                                                                                       | Декораторы                                              | Описание |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, handout_ids: list[str]) | ['staticmethod', 'permission_classes([DeleteHandout])'] | -        |

## Класс AddRegistrationMutation

Добавление регистрации

### Методы

| Сигнатура                                                                        | Декораторы       | Описание |
| :------------------------------------------------------------------------------- | :--------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod'] | -        |

## Класс ChangeRegistrationMutation

Изменение регистрации

### Методы

| Сигнатура                                                                        | Декораторы       | Описание |
| :------------------------------------------------------------------------------- | :--------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod'] | -        |

## Класс DeleteRegistrationMutation

Удаление регистрации

### Методы

| Сигнатура                                                                                          | Декораторы       | Описание |
| :------------------------------------------------------------------------------------------------- | :--------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, registration_id, **kwargs) | ['staticmethod'] | -        |

## Класс AddPeriodMutation

Добавление периода

### Методы

| Сигнатура                                                                        | Декораторы       | Описание |
| :------------------------------------------------------------------------------- | :--------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod'] | -        |

## Класс ChangePeriodMutation

Изменение периода

### Методы

| Сигнатура                                                                        | Декораторы       | Описание |
| :------------------------------------------------------------------------------- | :--------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod'] | -        |

## Класс DeletePeriodMutation

Удаление периода

### Методы

| Сигнатура                                                                                   | Декораторы       | Описание |
| :------------------------------------------------------------------------------------------ | :--------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, period_id, **kwargs) | ['staticmethod'] | -        |

## Класс ProcessMutations

Object Type Definition Almost all of the GraphQL types you define will be object types. Object types have a name, but most importantly describe their fields. The name of the type defined by an _ObjectType_ defaults to the class name. The type description defaults to the class docstring. This can be overriden by adding attributes to a Meta inner class. The class attributes of an _ObjectType_ are mounted as instances of ``graphene.Field``. Methods starting with ``resolve_<field_name>`` are bound as resolvers of the matching Field name. If no resolver is provided, the default resolver is used. Ambiguous types with Interface and Union can be determined through``is_type_of`` method and ``Meta.possible_types`` attribute. .. code:: python from graphene import ObjectType, String, Field class Person(ObjectType): class Meta: description = 'A human' # implicitly mounted as Field first_name = String() # explicitly mounted as Field last_name = Field(String) def resolve_last_name(parent, info): return last_name ObjectType must be mounted using ``graphene.Field``. .. code:: python from graphene import ObjectType, Field class Query(ObjectType): person = Field(Person, description="My favorite person") Meta class options (optional): name (str): Name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): Description of the GraphQL type in the schema. Defaults to class docstring. interfaces (Iterable[graphene.Interface]): GraphQL interfaces to extend with this object. all fields from interface will be included in this object's schema. possible_types (Iterable[class]): Used to test parent value object via isintance to see if this type can be used to resolve an ambigous type (interface, union). default_resolver (any Callable resolver): Override the default resolver for this type. Defaults to graphene default resolver which returns an attribute or dictionary key with the same name as the field. fields (Dict[str, graphene.Field]): Dictionary of field name to Field. Not recommended to use (prefer class attributes). An _ObjectType_ can be used as a simple value object by creating an instance of the class. .. code:: python p = Person(first_name='Bob', last_name='Roberts') assert p.first_name == 'Bob' Args: *args (List[Any]): Positional values to use for Field values of value object **kwargs (Dict[str: Any]): Keyword arguments to use for Field values of value object