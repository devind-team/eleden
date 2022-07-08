# Модуль types



## Класс ChildItemPropType

Оптимизирует запросы переопределяя метод get_queryset Является рабочей копией OptimizedDjangoObjectType из graphene_django_optimizer

## Класс ItemPropType

Оптимизирует запросы переопределяя метод get_queryset Является рабочей копией OptimizedDjangoObjectType из graphene_django_optimizer

### Методы

| Сигнатура                                                                                                              | Декораторы                                                          | Описание |
| :--------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------- |
| resolve_children( prop: apps.sveden.models.models.ItemProp, info: graphql.execution.base.ResolveInfo, *args, **kwargs) | ['staticmethod', "resolver_hints(model_field='childitemprop_set')"] | -        |

## Класс ItemPropContainerType

Оптимизирует запросы переопределяя метод get_queryset Является рабочей копией OptimizedDjangoObjectType из graphene_django_optimizer

### Методы

| Сигнатура                                                                                                                     | Декораторы                                                 | Описание |
| :---------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- | :------- |
| resolve_schema( prop: apps.sveden.models.models.ItemPropContainer, info: graphql.execution.base.ResolveInfo, *args, **kwargs) | ['staticmethod', "resolver_hints(model_field='itemprop')"] | -        |

## Класс SubsectionType

Оптимизирует запросы переопределяя метод get_queryset Является рабочей копией OptimizedDjangoObjectType из graphene_django_optimizer

### Методы

| Сигнатура                                                                                                                            | Декораторы                                                              | Описание |
| :----------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------- |
| resolve_item_prop_containers( prop: apps.sveden.models.models.Subsection, info: graphql.execution.base.ResolveInfo, *args, **kwargs) | ['staticmethod', "resolver_hints(model_field='itempropcontainer_set')"] | -        |

## Класс ChildItemPropInputType

Input Object Type Definition An input object defines a structured collection of fields which may be supplied to a field argument. Using ``graphene.NonNull`` will ensure that a input value must be provided by the query. All class attributes of ``graphene.InputObjectType`` are implicitly mounted as InputField using the below Meta class options. .. code:: python from graphene import InputObjectType, String, InputField class Person(InputObjectType): # implicitly mounted as Input Field first_name = String(required=True) # explicitly mounted as Input Field last_name = InputField(String, description="Surname") The fields on an input object type can themselves refer to input object types, but you can't mix input and output types in your schema. Meta class options (optional): name (str): the name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): the description of the GraphQL type in the schema. Defaults to class docstring. container (class): A class reference for a value object that allows for attribute initialization and access. Default InputObjectTypeContainer. fields (Dict[str, graphene.InputField]): Dictionary of field name to InputField. Not recommended to use (prefer class attributes).

## Класс ItemPropInputType

Input Object Type Definition An input object defines a structured collection of fields which may be supplied to a field argument. Using ``graphene.NonNull`` will ensure that a input value must be provided by the query. All class attributes of ``graphene.InputObjectType`` are implicitly mounted as InputField using the below Meta class options. .. code:: python from graphene import InputObjectType, String, InputField class Person(InputObjectType): # implicitly mounted as Input Field first_name = String(required=True) # explicitly mounted as Input Field last_name = InputField(String, description="Surname") The fields on an input object type can themselves refer to input object types, but you can't mix input and output types in your schema. Meta class options (optional): name (str): the name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): the description of the GraphQL type in the schema. Defaults to class docstring. container (class): A class reference for a value object that allows for attribute initialization and access. Default InputObjectTypeContainer. fields (Dict[str, graphene.InputField]): Dictionary of field name to InputField. Not recommended to use (prefer class attributes).

## Класс ItemPropContainerInputType

Input Object Type Definition An input object defines a structured collection of fields which may be supplied to a field argument. Using ``graphene.NonNull`` will ensure that a input value must be provided by the query. All class attributes of ``graphene.InputObjectType`` are implicitly mounted as InputField using the below Meta class options. .. code:: python from graphene import InputObjectType, String, InputField class Person(InputObjectType): # implicitly mounted as Input Field first_name = String(required=True) # explicitly mounted as Input Field last_name = InputField(String, description="Surname") The fields on an input object type can themselves refer to input object types, but you can't mix input and output types in your schema. Meta class options (optional): name (str): the name of the GraphQL type (must be unique in schema). Defaults to class name. description (str): the description of the GraphQL type in the schema. Defaults to class docstring. container (class): A class reference for a value object that allows for attribute initialization and access. Default InputObjectTypeContainer. fields (Dict[str, graphene.InputField]): Dictionary of field name to InputField. Not recommended to use (prefer class attributes).