# Модуль test_mutations_edu_programs



### Функции

| Сигнатура   | Декораторы | Описание |
| :---------- | :--------- | :------- |
| mock_info() | -          | -        |

## Класс EduProgramModelSerializer

A `ModelSerializer` is just a regular `Serializer`, except that: * A set of default fields are automatically populated. * A set of default validators are automatically populated. * Default `.create()` and `.update()` implementations are provided. The process of automatically determining a set of serializer fields based on the model fields is reasonably complex, but you almost certainly don't need to dig into the implementation. If the `ModelSerializer` class *doesn't* generate the set of fields that you need you should either declare the extra/differing fields explicitly on the serializer class, or simply use a `Serializer` class.

## Класс EduFormModelSerializer

A `ModelSerializer` is just a regular `Serializer`, except that: * A set of default fields are automatically populated. * A set of default validators are automatically populated. * Default `.create()` and `.update()` implementations are provided. The process of automatically determining a set of serializer fields based on the model fields is reasonably complex, but you almost certainly don't need to dig into the implementation. If the `ModelSerializer` class *doesn't* generate the set of fields that you need you should either declare the extra/differing fields explicitly on the serializer class, or simply use a `Serializer` class.

## Класс EduProgramModelMutation

Object Type Definition (mutation field) Mutation is a convenience type that helps us build a Field which takes Arguments and returns a mutation Output ObjectType. .. code:: python from graphene import Mutation, ObjectType, String, Boolean, Field class CreatePerson(Mutation): class Arguments: name = String() ok = Boolean() person = Field(Person) def mutate(parent, info, name): person = Person(name=name) ok = True return CreatePerson(person=person, ok=ok) class Mutation(ObjectType): create_person = CreatePerson.Field() Meta class options (optional): output (graphene.ObjectType): Or ``Output`` inner class with attributes on Mutation class. Or attributes from Mutation class. Fields which can be returned from this mutation field. resolver (Callable resolver method): Or ``mutate`` method on Mutation class. Perform data change and return output. arguments (Dict[str, graphene.Argument]): Or ``Arguments`` inner class with attributes on Mutation class. Arguments to use for the mutation Field. name (str): Name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): Description of the GraphQL type in the schema. Defaults to class docstring. interfaces (Iterable[graphene.Interface]): GraphQL interfaces to extend with the payload object. All fields from interface will be included in this object's schema. fields (Dict[str, graphene.Field]): Dictionary of field name to Field. Not recommended to use (prefer class attributes or ``Meta.output``).

## Класс EduFormModelMutation

Object Type Definition (mutation field) Mutation is a convenience type that helps us build a Field which takes Arguments and returns a mutation Output ObjectType. .. code:: python from graphene import Mutation, ObjectType, String, Boolean, Field class CreatePerson(Mutation): class Arguments: name = String() ok = Boolean() person = Field(Person) def mutate(parent, info, name): person = Person(name=name) ok = True return CreatePerson(person=person, ok=ok) class Mutation(ObjectType): create_person = CreatePerson.Field() Meta class options (optional): output (graphene.ObjectType): Or ``Output`` inner class with attributes on Mutation class. Or attributes from Mutation class. Fields which can be returned from this mutation field. resolver (Callable resolver method): Or ``mutate`` method on Mutation class. Perform data change and return output. arguments (Dict[str, graphene.Argument]): Or ``Arguments`` inner class with attributes on Mutation class. Arguments to use for the mutation Field. name (str): Name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): Description of the GraphQL type in the schema. Defaults to class docstring. interfaces (Iterable[graphene.Interface]): GraphQL interfaces to extend with the payload object. All fields from interface will be included in this object's schema. fields (Dict[str, graphene.Field]): Dictionary of field name to Field. Not recommended to use (prefer class attributes or ``Meta.output``).

## Класс EduProgramSerializer

The BaseSerializer class provides a minimal class which may be used for writing custom serializer implementations. Note that we strongly restrict the ordering of operations/properties that may be used on the serializer in order to enforce correct usage. In particular, if a `data=` argument is passed then: .is_valid() - Available. .initial_data - Available. .validated_data - Only available after calling `is_valid()` .errors - Only available after calling `is_valid()` .data - Only available after calling `is_valid()` If a `data=` argument is not passed then: .is_valid() - Not available. .initial_data - Not available. .validated_data - Not available. .errors - Not available. .data - Available.

### Методы

| Сигнатура                    | Декораторы | Описание |
| :--------------------------- | :--------- | :------- |
| create(self, validated_data) | -          | -        |

## Класс EduProgramTestFields

Проверка работы SerializerMutation

### Методы

| Сигнатура                                                      | Декораторы | Описание |
| :------------------------------------------------------------- | :--------- | :------- |
| test_has_fields(self)                                          | -          | -        |
| test_has_input_fields(self)                                    | -          | -        |
| test_exclude_fields(self)                                      | -          | -        |
| test_mutate_and_get_payload_success(self)                      | -          | -        |
| test_mutate_model_and_get_payload_success(self)                | -          | -        |
| test_model_partial_update_mutate_and_get_payload_success(self) | -          | -        |
| test_model_invalid_update_mutate_and_get_payload_success(self) | -          | -        |