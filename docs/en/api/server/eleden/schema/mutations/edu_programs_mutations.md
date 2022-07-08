# Модуль edu_programs_mutations



## Класс AddEduProgramMutation

Добавление образовательной программы.

### Методы

| Сигнатура                                                                        | Декораторы                                                               | Описание |
| :------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddEduProgram])'] | -        |

## Класс AddEduProgramFromPlxMutation

Добавление образовательной программы из файла plx.

### Методы

| Сигнатура                                                                                                                                    | Декораторы                                                               | Описание |
| :------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, file: django.core.files.uploadedfile.InMemoryUploadedFile, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddEduProgram])'] | -        |

## Класс AddEduProgramsMutation

Добавление образовательных программ.

### Методы

| Сигнатура                                                                                                                          | Декораторы                                                               | Описание |
| :--------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, file: django.core.files.uploadedfile.InMemoryUploadedFile) | ['staticmethod', 'permission_classes([IsAuthenticated, AddEduProgram])'] | -        |

## Класс ChangeEduProgramMutation

Изменение образовательной программы.

### Методы

| Сигнатура                                                                                         | Декораторы                                                                  | Описание |
| :------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, edu_program_id, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, ChangeEduProgram])'] | -        |

## Класс UnloadEduProgramsMutation

Выгрузка данных в различных форматах.

### Методы

| Сигнатура                                                                                                | Декораторы                                                | Описание |
| :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, extension: str, *args, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated])'] | -        |

## Класс DeleteEduProgramMutation

Удаление образовательной программы.

### Методы

| Сигнатура                                                                              | Декораторы                                                                  | Описание |
| :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, edu_program_id) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteEduProgram])'] | -        |

## Класс AddDisciplineMutation

Добавление дисциплины.

### Методы

| Сигнатура                                                                        | Декораторы                                                               | Описание |
| :------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddDiscipline])'] | -        |

## Класс AddDisciplinesFilesMutation

Добавление файлов дисциплин (аннотаций и рабочих программ) Примеры названий файлов в архиве: анн_13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf; 13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf. Если дисциплина существует, то к ней прикрепится файл, иначе ошибка.

### Методы

| Сигнатура                                                                                                                                                                                                                   | Декораторы                                                               | Описание                                                                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| get_file_name_params( params_list: List[str]) -&#62; apps.eleden.schema.mutations.edu_programs_mutations.AddDisciplinesFilesMutation.FileNameParams                                                                         | ['staticmethod']                                                         | Получение параметров имени файла из списка.:param params_list: список параметров:return: параметры имени файла                                 |
| check_params_list(file_name: str, params_list: List[str], is_annotation: bool) -&#62; None                                                                                                                                  | ['staticmethod']                                                         | Проверка списка параметров:param file_name: имя файла:param params_list: список параметров:param is_annotation: является ли файл аннотацией    |
| check_file_name_params( edu_program: apps.eleden.models.education.EduProgram, file_name: str, file_name_params: apps.eleden.schema.mutations.edu_programs_mutations.AddDisciplinesFilesMutation.FileNameParams) -&#62; None | ['staticmethod']                                                         | Проверка параметров имени файла.:param edu_program: учебная программа:param file_name: имя файла:param file_name_params: параметры имени файла |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, edu_program_id: str, file: django.core.files.uploadedfile.InMemoryUploadedFile, *args, **kwargs)                                                    | ['staticmethod', 'permission_classes([IsAuthenticated, AddDiscipline])'] | -                                                                                                                                              |

## Класс ChangeDisciplineMutation

Изменение дисциплины

### Методы

| Сигнатура                                                                                             | Декораторы                                                                  | Описание |
| :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, ChangeDiscipline])'] | -        |

## Класс DeleteDisciplineMutation

Удаление дисциплины

### Методы

| Сигнатура                                                                                  | Декораторы                                                                  | Описание |
| :----------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, discipline_id: str) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteDiscipline])'] | -        |

## Класс AddMethodologicalSupportMutation

Добавление методического обеспечения

### Методы

| Сигнатура                                                                        | Декораторы                                                                          | Описание |
| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload(root, info: graphql.execution.base.ResolveInfo, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddMethodologicalSupport])'] | -        |

## Класс AddEduProgramMethodologicalSupportsMutation

Добавление методического обеспечения дисциплин одной образовательной программы Пример названия файла в архиве: Б1.О.03_Философия.docx.

### Методы

| Сигнатура                                                                                                                                                                                                                                                                      | Декораторы                                                                          | Описание                                                                                                                                                                                    |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| try_fix_params_list_len(file_name: str, params_list: List[str]) -&#62; List[str]                                                                                                                                                                                               | ['staticmethod']                                                                    | Попытка исправления неверного числа параметров:param file_name: имя файла:param params_list: список параметров:return: правильный список параметров                                         |
| get_file_name_params( params_list: List[str]) -&#62; apps.eleden.schema.mutations.edu_programs_mutations.AddEduProgramMethodologicalSupportsMutation.FileNameParams                                                                                                            | ['staticmethod']                                                                    | Получение параметров имени файла из списка.:param params_list: список параметров:return: параметры имени файла                                                                              |
| check_file_name_params( edu_program: apps.eleden.models.education.EduProgram, file_name: str, file_name_params: apps.eleden.schema.mutations.edu_programs_mutations.AddEduProgramMethodologicalSupportsMutation.FileNameParams) -&#62; apps.eleden.models.education.Discipline | ['staticmethod']                                                                    | Проверка параметров имени файла.:param edu_program: учебная программа:param file_name: имя файла:param file_name_params: параметры имени файла:return: дисциплина, которой принадлежит файл |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, edu_program_id: str, file: django.core.files.uploadedfile.InMemoryUploadedFile)                                                                                                                        | ['staticmethod', 'permission_classes([IsAuthenticated, AddMethodologicalSupport])'] | -                                                                                                                                                                                           |

## Класс AddDisciplineMethodologicalSupportsMutation

Добавление методического обеспечения дисциплины.

### Методы

| Сигнатура                                                                                                                                              | Декораторы                                                                          | Описание |
| :----------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, file: django.core.files.uploadedfile.InMemoryUploadedFile) | ['staticmethod', 'permission_classes([IsAuthenticated, AddMethodologicalSupport])'] | -        |

## Класс ChangeMethodologicalSupportMutation

Изменение методического обеспечения.

### Методы

| Сигнатура                                                                                                    | Декораторы                                                                             | Описание |
| :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, methodological_support_id, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, ChangeMethodologicalSupport])'] | -        |

## Класс DeleteMethodologicalSupportMutation

Удаление методического обеспечения

### Методы

| Сигнатура                                                                                                    | Декораторы                                                                             | Описание |
| :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, methodological_support_id, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteMethodologicalSupport])'] | -        |

## Класс AddCompetencesMutation

Добавление компетенций дисциплины

### Методы

| Сигнатура                                                                                                                  | Декораторы                                                               | Описание |
| :------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, competence_ids: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddCompetence])'] | -        |

## Класс DeleteCompetenceMutation

Удаление компетенций

### Методы

| Сигнатура                                                                                                                 | Декораторы                                                                  | Описание |
| :------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, competence_id: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteCompetence])'] | -        |

## Класс AddEduHoursMutation

Добавление часов по плану дисциплины

### Методы

| Сигнатура                                                                                             | Декораторы                                                             | Описание |
| :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, discipline_id: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, AddEduHours])'] | -        |

## Класс DeleteEduHourMutation

Удаление часов по плану

### Методы

| Сигнатура                                                                                           | Декораторы                                                                | Описание |
| :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :------- |
| mutate_and_get_payload( root, info: graphql.execution.base.ResolveInfo, edu_hour_id: str, **kwargs) | ['staticmethod', 'permission_classes([IsAuthenticated, DeleteEduHours])'] | -        |

## Класс EduProgramsMutations

Object Type Definition Almost all of the GraphQL types you define will be object types. Object types have a name, but most importantly describe their fields. The name of the type defined by an _ObjectType_ defaults to the class name. The type description defaults to the class docstring. This can be overriden by adding attributes to a Meta inner class. The class attributes of an _ObjectType_ are mounted as instances of ``graphene.Field``. Methods starting with ``resolve_<field_name>`` are bound as resolvers of the matching Field name. If no resolver is provided, the default resolver is used. Ambiguous types with Interface and Union can be determined through``is_type_of`` method and ``Meta.possible_types`` attribute. .. code:: python from graphene import ObjectType, String, Field class Person(ObjectType): class Meta: description = 'A human' # implicitly mounted as Field first_name = String() # explicitly mounted as Field last_name = Field(String) def resolve_last_name(parent, info): return last_name ObjectType must be mounted using ``graphene.Field``. .. code:: python from graphene import ObjectType, Field class Query(ObjectType): person = Field(Person, description="My favorite person") Meta class options (optional): name (str): Name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): Description of the GraphQL type in the schema. Defaults to class docstring. interfaces (Iterable[graphene.Interface]): GraphQL interfaces to extend with this object. all fields from interface will be included in this object's schema. possible_types (Iterable[class]): Used to test parent value object via isintance to see if this type can be used to resolve an ambigous type (interface, union). default_resolver (any Callable resolver): Override the default resolver for this type. Defaults to graphene default resolver which returns an attribute or dictionary key with the same name as the field. fields (Dict[str, graphene.Field]): Dictionary of field name to Field. Not recommended to use (prefer class attributes). An _ObjectType_ can be used as a simple value object by creating an instance of the class. .. code:: python p = Person(first_name='Bob', last_name='Roberts') assert p.first_name == 'Bob' Args: *args (List[Any]): Positional values to use for Field values of value object **kwargs (Dict[str: Any]): Keyword arguments to use for Field values of value object