export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

/** Токен. */
export type AccessTokenType = {
  __typename?: 'AccessTokenType';
  application?: Maybe<ApplicationType>;
  created: Scalars['DateTime'];
  expires: Scalars['DateTime'];
  id: Scalars['ID'];
  scope: Scalars['String'];
  session?: Maybe<SessionType>;
  token: Scalars['String'];
  updated: Scalars['DateTime'];
  user?: Maybe<UserType>;
};

/**
 * Типы измнения связей между записями в базе данных
 * - ADD - Добавление
 * - DELETE - Удаление
 */
export type ActionRelationShip =
  | 'ADD'
  | 'DELETE';

/** Информация активности пользователей и времени ответа браузеров. */
export type ActiveStatisticsType = {
  __typename?: 'ActiveStatisticsType';
  /** Запросы */
  queries: Array<Maybe<DateStatisticsType>>;
  /** Время ответа сервера */
  times: Array<Maybe<DateStatisticsType>>;
};

export type AddArticleFromBibtexMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Файл bibtex публикации */
  file?: InputMaybe<Scalars['Upload']>;
};

/** Добавление публикации из файла bibtex. */
export type AddArticleFromBibtexMutationPayload = {
  __typename?: 'AddArticleFromBibtexMutationPayload';
  /** Новая статья */
  articles?: Maybe<Array<ArticleType>>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddArticleMutationInput = {
  /** Дополнительные поля публикации */
  additional: Scalars['String'];
  /** Все авторы публикации */
  authors: Array<AuthorInputType>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Файл публикации */
  file?: InputMaybe<Scalars['Upload']>;
  /** Ссылка на файл публикации */
  fileLink?: InputMaybe<Scalars['String']>;
  /** Идентификатор типа индексирования статьи */
  indexId: Scalars['ID'];
  /** Тип публикации */
  kindId: Scalars['ID'];
  /** Название работы */
  name: Scalars['String'];
  /** Объем работы */
  workload?: InputMaybe<Scalars['Float']>;
  /** Год публикации */
  year: Scalars['Int'];
};

/** Добавление публикации. */
export type AddArticleMutationPayload = {
  __typename?: 'AddArticleMutationPayload';
  /** Новая статья */
  article?: Maybe<ArticleType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Загруженный файл статьи */
  file?: Maybe<FileType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddAttestationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор пользователя, который подтвердил аттестацию */
  confirmedById?: InputMaybe<Scalars['ID']>;
  /** Идентификатор курса */
  courseId: Scalars['ID'];
  /** Описание */
  description: Scalars['String'];
  /** Идентификатор периода */
  periodId: Scalars['ID'];
  /** Идентификатор учета студентов */
  registrationId: Scalars['ID'];
  /** Идентификатор пользователя, который выставил аттестацию */
  setById: Scalars['ID'];
  /** Идентификатор учащегося */
  userId: Scalars['ID'];
};

/** Добавление аттестации */
export type AddAttestationMutationPayload = {
  __typename?: 'AddAttestationMutationPayload';
  /** Новая аттестация */
  attestation?: Maybe<AttestationType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddCategoryMutationInput = {
  /** Аватар */
  avatar?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор родительской категории */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Название категории */
  text: Scalars['String'];
};

/** Мутация для добавления категории */
export type AddCategoryMutationPayload = {
  __typename?: 'AddCategoryMutationPayload';
  /** Добавленная котегория */
  category?: Maybe<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddChatMutationInput = {
  /** Аватар чата */
  avatar?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название чата */
  name?: InputMaybe<Scalars['String']>;
  /** Пользователи */
  userIds: Array<Scalars['ID']>;
};

/** Добавление чата  */
export type AddChatMutationPayload = {
  __typename?: 'AddChatMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  member?: Maybe<MemberType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddChildItemPropMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Заголовок столбца */
  header: Scalars['String'];
  /** Дочерний тег */
  itemProp: Scalars['String'];
  /** Идентификатор родительского тега */
  itemPropId: Scalars['ID'];
  /** Положение при выводе */
  showPosition: Scalars['Int'];
};

export type AddChildItemPropMutationPayload = {
  __typename?: 'AddChildItemPropMutationPayload';
  childItemProp: ChildItemPropType;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddCompetencesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор дисциплины */
  competenceIds: Array<Scalars['ID']>;
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
};

/** Добавление компетенций дисциплины */
export type AddCompetencesMutationPayload = {
  __typename?: 'AddCompetencesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Добавленные компетенции */
  competences?: Maybe<Array<CompetenceType>>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddCoursesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Частичные данные курсов */
  courses?: InputMaybe<Array<CourseInputType>>;
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Добавление курсов */
export type AddCoursesMutationPayload = {
  __typename?: 'AddCoursesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новые курсы */
  courses?: Maybe<Array<CourseType>>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddDirectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название */
  code: Scalars['String'];
  /** Код специальности */
  name: Scalars['String'];
};

/** Добавление направления подготовки */
export type AddDirectionMutationPayload = {
  __typename?: 'AddDirectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новое направление подготовки */
  direction?: Maybe<DirectionType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddDisciplineMethodologicalSupportsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
  /** Архивный файл */
  file?: InputMaybe<Scalars['Upload']>;
};

/** Добавление методического обеспечения дисциплины. */
export type AddDisciplineMethodologicalSupportsMutationPayload = {
  __typename?: 'AddDisciplineMethodologicalSupportsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новое методическое обеспечение */
  methodologicalSupports?: Maybe<Array<MethodologicalSupportType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddDisciplineMutationInput = {
  /** Аннотация к рабочей программе дисциплины/практики/ГИА */
  annotation?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Код дисциплины */
  code: Scalars['String'];
  /** Идентификатор учебной программы */
  eduProgramId: Scalars['ID'];
  /** Методическое обеспечение дисциплины */
  methodologicalSupport?: InputMaybe<Array<InputMaybe<MethodologicalSupportInputType>>>;
  /** Название дисциплины */
  name: Scalars['String'];
  /** Родительская дисциплина */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Идентификаторы авторов */
  userIds: Array<Scalars['ID']>;
  /** Форма представления дисциплины */
  viewId?: InputMaybe<Scalars['ID']>;
  /** Рабочая программа дисциплины */
  workProgram?: InputMaybe<Scalars['Upload']>;
};

/** Добавление дисциплины. */
export type AddDisciplineMutationPayload = {
  __typename?: 'AddDisciplineMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новая дисциплина */
  discipline?: Maybe<DisciplineType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddDisciplinesFilesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор учебной программы */
  eduProgramId: Scalars['ID'];
  /** Архивный файл */
  file?: InputMaybe<Scalars['Upload']>;
};

/**
 * Добавление файлов дисциплин (аннотаций и рабочих программ)
 *
 * Примеры названий файлов в архиве:
 * анн_13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf;
 * 13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf.
 * Если дисциплина существует, то к ней прикрепится файл, иначе ошибка.
 */
export type AddDisciplinesFilesMutationPayload = {
  __typename?: 'AddDisciplinesFilesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененные дисциплины */
  disciplines?: Maybe<Array<DisciplineType>>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduFormMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название */
  name: Scalars['String'];
  /** Идентификатор родительской формы обучения */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Короткое название */
  shortName: Scalars['String'];
};

/** Добавление формы обучения */
export type AddEduFormMutationPayload = {
  __typename?: 'AddEduFormMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новая форма обучения */
  eduForm?: Maybe<EduFormType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduHoursMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Курс */
  courseNumber: Scalars['Int'];
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
  /** Тип часов */
  hoursKindId: Scalars['ID'];
  /** Семестр */
  semesterNumber: Scalars['Int'];
  /** Значение */
  value: Scalars['Int'];
  /** Идентификатор вида работ */
  workKindId: Scalars['ID'];
};

/** Добавление часов по плану дисциплины */
export type AddEduHoursMutationPayload = {
  __typename?: 'AddEduHoursMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Добавленный вид работы */
  eduHour?: Maybe<EduHoursType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduProgramFromPlxMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Файл plx */
  file: Scalars['Upload'];
};

/** Добавление образовательной программы из файла plx. */
export type AddEduProgramFromPlxMutationPayload = {
  __typename?: 'AddEduProgramFromPlxMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новая образовательная программа */
  eduProgram?: Maybe<EduProgramType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduProgramMethodologicalSupportsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор учебной программы */
  eduProgramId: Scalars['ID'];
  /** Архивный файл */
  file?: InputMaybe<Scalars['Upload']>;
};

/**
 * Добавление методического обеспечения дисциплин одной образовательной программы
 *
 * Пример названия файла в архиве: Б1.О.03_Философия.docx.
 */
export type AddEduProgramMethodologicalSupportsMutationPayload = {
  __typename?: 'AddEduProgramMethodologicalSupportsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новое методическое обеспечение */
  methodologicalSupports?: Maybe<Array<MethodologicalSupportType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduProgramMutationInput = {
  /** Признак адапативности программ */
  adaptive: Scalars['Boolean'];
  /** Год поступления */
  admission: Scalars['Int'];
  /** Календарный учебный график */
  calendar?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Описание */
  description?: InputMaybe<Scalars['Upload']>;
  /** Идентификатор направления подготовки */
  directionId: Scalars['ID'];
  /** Идентификатор формы обучения */
  eduFormId: Scalars['Int'];
  /** Индентификатор образовательной программы, откуда необходимо копировать дисциплины */
  eduProgramId?: InputMaybe<Scalars['ID']>;
  /** Ускоренная программа */
  expedited: Scalars['Boolean'];
  /** Профиль подготовки */
  name: Scalars['String'];
  /** Учебный план */
  syllabus?: InputMaybe<Scalars['Upload']>;
};

/** Добавление образовательной программы. */
export type AddEduProgramMutationPayload = {
  __typename?: 'AddEduProgramMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новая образовательная программа */
  eduProgram?: Maybe<EduProgramType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddEduProgramsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Источник данных: файл xlsx, csv, json */
  file: Scalars['Upload'];
};

/** Добавление образовательных программ. */
export type AddEduProgramsMutationPayload = {
  __typename?: 'AddEduProgramsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Новые образовательные программы */
  eduPrograms?: Maybe<Array<Maybe<EduProgramType>>>;
  /** Ошибки валидации */
  errors: Array<Maybe<RowFieldErrorType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Валидируемый документ */
  table?: Maybe<TableType>;
};

export type AddFileAttachmentsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор пользователя, который подтвердил файлы */
  confirmedById?: InputMaybe<Scalars['ID']>;
  /** Идентификатор курса */
  courseId: Scalars['ID'];
  /** Описание файла */
  describe: Scalars['String'];
  /** Идентификатор типа файла */
  fileKindId: Scalars['ID'];
  /** Файлы */
  files: Array<Scalars['Upload']>;
  /** Идентификатор периода */
  periodId: Scalars['ID'];
  /** Идентификатор учащегося */
  userId: Scalars['ID'];
};

/** Добавление прикрепленных файлов из файлов */
export type AddFileAttachmentsMutationPayload = {
  __typename?: 'AddFileAttachmentsMutationPayload';
  /** Новые прикрепленные файлы */
  attachments?: Maybe<Array<Maybe<AttachmentType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddFileKindMutationInput = {
  /** Допустимый формат загрузки файлов */
  accept: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Наименование цели загрузки файла */
  name: Scalars['String'];
};

/** Добавление типа загружаемых файлов в портфолио */
export type AddFileKindMutationPayload = {
  __typename?: 'AddFileKindMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленный тип загружаемых файлов в портфолио */
  fileKind?: Maybe<FileKindType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые файлы */
  files: Array<Scalars['Upload']>;
  /** Идентификатор пользователя */
  userId?: InputMaybe<Scalars['ID']>;
};

/** Мутация для загрузки файлов */
export type AddFileMutationPayload = {
  __typename?: 'AddFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Загруженные файлы */
  files: Array<Maybe<FileType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название группы */
  name: Scalars['String'];
  permissionFrom?: InputMaybe<Scalars['Int']>;
};

/** Мутация для добавления группы. */
export type AddGroupMutationPayload = {
  __typename?: 'AddGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленная группа */
  group?: Maybe<GroupType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddHandoutMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор курса */
  courseId: Scalars['ID'];
  /** Описание раздаточного материала */
  description: Scalars['String'];
  /** Файл пользователя */
  file: Scalars['Upload'];
  /** Идентификатор периода */
  periodId: Scalars['ID'];
};

/** Добавление раздаточного материала */
export type AddHandoutMutationPayload = {
  __typename?: 'AddHandoutMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новый раздаточный материал */
  handout?: Maybe<HandoutType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddItemPropContainerMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Добавляемая структура */
  itemPropContainer: ItemPropContainerInputType;
  /** Идентификатор подраздела */
  urlId: Scalars['ID'];
};

export type AddItemPropContainerMutationPayload = {
  __typename?: 'AddItemPropContainerMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  itemPropContainer?: Maybe<ItemPropContainerType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddJobMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Создавать приказ в формате docx */
  generateDocx: Scalars['Boolean'];
  /** Создавать приказ в формате pdf */
  generatePdf: Scalars['Boolean'];
  /** Тип работы */
  kind: Scalars['String'];
  /** Идентификатор занимаемой должности */
  postId: Scalars['ID'];
  /** Занимаемая ставка */
  rate: Scalars['Float'];
  /** Дата присвоения статуса должности пользователя на месте работы */
  statusCreatedAt: Scalars['Date'];
  /** Идентификатор статуса должности пользователя на месте работы */
  statusId: Scalars['ID'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

/** Добавление пользователя в группу */
export type AddJobMutationPayload = {
  __typename?: 'AddJobMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новое место работы пользователя */
  job?: Maybe<JobType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddJobPostMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Создавать приказ в формате docx */
  generateDocx: Scalars['Boolean'];
  /** Создавать приказ в формате pdf */
  generatePdf: Scalars['Boolean'];
  jobId: Scalars['ID'];
  /** Тип работы */
  kind: Scalars['String'];
  /** Идентификатор занимаемой должности */
  postId: Scalars['ID'];
  /** Занимаемая ставка */
  rate: Scalars['Float'];
  /** Дата присвоения статуса должности пользователя на месте работы */
  statusCreatedAt: Scalars['Date'];
  /** Идентификатор статуса должности пользователя на месте работы */
  statusId: Scalars['ID'];
};

/** Добавление должности пользователя в группе */
export type AddJobPostMutationPayload = {
  __typename?: 'AddJobPostMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новая должность пользователя на месте работы */
  jobPost?: Maybe<JobPostType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddJobPostStatusHistoryMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Завершить предыдущие статусы */
  completePrevious?: InputMaybe<Scalars['Boolean']>;
  /** Создавать приказ в формате docx */
  generateDocx: Scalars['Boolean'];
  /** Создавать приказ в формате pdf */
  generatePdf: Scalars['Boolean'];
  /** Идентификатор должности пользователя на месте работы */
  jobPostId: Scalars['ID'];
  /** Дата присвоения статуса должности пользователя на месте работы */
  statusCreatedAt: Scalars['Date'];
  /** Идентификатор статуса должности пользователя на месте работы */
  statusId: Scalars['ID'];
};

/** Добавление истории статусов должности пользователя на месте работы */
export type AddJobPostStatusHistoryMutationPayload = {
  __typename?: 'AddJobPostStatusHistoryMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Завершенные истории статусов должности пользователя на месте работы */
  completedJobPostStatusHistory?: Maybe<Array<JobPostStatusHistoryType>>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новая история статусов должности пользователя на месте работы */
  newJobPostStatusHistory?: Maybe<JobPostStatusHistoryType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddMessageMutationInput = {
  /** Идентификатор чата */
  chatId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Прикреплённые файлы */
  files?: InputMaybe<Array<Scalars['Upload']>>;
  /** Пересылаемые сообщения */
  forwardedIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Текст сообщения */
  text?: InputMaybe<Scalars['String']>;
};

/** Добавление сообщения  */
export type AddMessageMutationPayload = {
  __typename?: 'AddMessageMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddMethodologicalSupportMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
  /** Подпись файла */
  name: Scalars['String'];
  /** Файл */
  src: Scalars['Upload'];
};

/** Добавление методического обеспечения */
export type AddMethodologicalSupportMutationPayload = {
  __typename?: 'AddMethodologicalSupportMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новое методическое обеспечение */
  methodologicalSupport?: Maybe<MethodologicalSupportType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddPageMutationInput = {
  /** Аватар */
  avatar?: InputMaybe<Scalars['Upload']>;
  /** Категория страницы */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Скрываем ли страницу */
  hide?: InputMaybe<Scalars['Boolean']>;
  /** Тип страницы */
  kindId?: InputMaybe<Scalars['Int']>;
  /** Показывать параллакс или нет */
  parallax?: InputMaybe<Scalars['Boolean']>;
  /** Приоритет */
  priority?: InputMaybe<Scalars['Boolean']>;
  /** Подпись страницы */
  signature?: InputMaybe<Scalars['String']>;
  /** Теги на странице */
  tagNames?: InputMaybe<Array<Scalars['String']>>;
  /** Первоначальное добавление текста страницы */
  text?: InputMaybe<Scalars['String']>;
  /** Заголовок */
  title: Scalars['String'];
};

/** Добавление страницы */
export type AddPageMutationPayload = {
  __typename?: 'AddPageMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddPeriodMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  shortName: Scalars['String'];
};

/** Добавление периода */
export type AddPeriodMutationPayload = {
  __typename?: 'AddPeriodMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddPortfolioFileAttachmentsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор пользователя, который подтвердил файлы */
  confirmedById?: InputMaybe<Scalars['ID']>;
  /** Идентификатор курса */
  courseId: Scalars['ID'];
  /** Идентификатор периода */
  periodId: Scalars['ID'];
  /** Идентификаторы файлов портфолио */
  portfolioFileIds: Array<Scalars['ID']>;
  /** Идентификатор учащегося */
  userId: Scalars['ID'];
};

/** Добавление прикрепленных файлов из файлов портофолио */
export type AddPortfolioFileAttachmentsMutationPayload = {
  __typename?: 'AddPortfolioFileAttachmentsMutationPayload';
  /** Новые прикрепленные файлы */
  attachments?: Maybe<Array<Maybe<AttachmentType>>>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddPortfolioFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Подтверждение файла при загрузке */
  confirm?: InputMaybe<Scalars['Boolean']>;
  /** Описание */
  describe: Scalars['String'];
  /** Дисциплина */
  disciplineId?: InputMaybe<Scalars['ID']>;
  /** Привязанный к портфолио файл */
  file: Scalars['Upload'];
  /** Тип файла из портфолио */
  kindId: Scalars['ID'];
  /** Пользователь */
  userId: Scalars['ID'];
};

/** Добавление файла в портфолио */
export type AddPortfolioFileMutationPayload = {
  __typename?: 'AddPortfolioFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленный в портфолио файл */
  portfolioFile?: Maybe<PortfolioFileType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddPortfolioFilesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Подтверждение файлов при загрузке */
  confirm?: InputMaybe<Scalars['Boolean']>;
  /** Описание */
  describe: Scalars['String'];
  /** Идентификатор дисциплины */
  disciplineId?: InputMaybe<Scalars['ID']>;
  /** Архивный файл */
  file?: InputMaybe<Scalars['Upload']>;
  /** Тип файла из портфолио */
  kindId: Scalars['ID'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Добавление файлов в портфолио */
export type AddPortfolioFilesMutationPayload = {
  __typename?: 'AddPortfolioFilesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленные в портфолио файлы */
  portfolioFiles?: Maybe<Array<Maybe<PortfolioFileType>>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddProfileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Уникальный код настройки */
  code: Scalars['String'];
  /** Тип настройки: [0-3] */
  kind?: InputMaybe<Scalars['Int']>;
  /** Название настройки */
  name: Scalars['String'];
  /** Родительская настройка */
  parentId?: InputMaybe<Scalars['Int']>;
};

/** Мутация для добавления записи профиля. */
export type AddProfileMutationPayload = {
  __typename?: 'AddProfileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленный профайл */
  profile?: Maybe<ProfileType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddRegistrationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  shortName: Scalars['String'];
};

/** Добавление регистрации */
export type AddRegistrationMutationPayload = {
  __typename?: 'AddRegistrationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddRowMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Позиция при добавлении */
  index?: InputMaybe<Scalars['Int']>;
  /** Идентификатор контейнера */
  itemPropContainerId: Scalars['ID'];
  /** Значение */
  values: Array<InputMaybe<Scalars['String']>>;
};

/** Мутация добавления строки в таблицу. */
export type AddRowMutationPayload = {
  __typename?: 'AddRowMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  itemPropContainer: ItemPropContainerType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddSectionFilesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые изображения */
  files: Array<Scalars['Upload']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Текст страницы */
  text: Scalars['String'];
};

/** Добавление секции */
export type AddSectionFilesMutationPayload = {
  __typename?: 'AddSectionFilesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Поле с файлами */
  section?: Maybe<SectionFilesType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddSectionGalleryMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые изображения */
  images: Array<Scalars['Upload']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Текст страницы */
  text: Scalars['String'];
};

/** Добавление секции */
export type AddSectionGalleryMutationPayload = {
  __typename?: 'AddSectionGalleryMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Поле с файлами */
  section?: Maybe<SectionGalleryType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddSectionTextMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Текст страницы */
  text: Scalars['String'];
};

/** Добавление секции */
export type AddSectionTextMutationPayload = {
  __typename?: 'AddSectionTextMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Текстовое поле */
  section?: Maybe<SectionTextType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddSubsectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название подраздела */
  header: Scalars['String'];
  /** Путь до подраздела */
  url?: InputMaybe<Scalars['String']>;
};

/** Мутация добавления подраздела. */
export type AddSubsectionMutationPayload = {
  __typename?: 'AddSubsectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  subsection: SubsectionType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type AddTagMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

/** Добавление тега */
export type AddTagMutationPayload = {
  __typename?: 'AddTagMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Добавленный тег */
  tag?: Maybe<TagType>;
};

export type AddTeamMutationInput = {
  /** Год образования группы/поступления */
  admission: Scalars['Int'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Группа, от которой назначаем права пользователю при добавлении */
  groupId?: InputMaybe<Scalars['ID']>;
  /** Название группы */
  name: Scalars['String'];
  /** Родительская группа (Администрация -> Кафедра -> Студенты) */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Сокращенное название группы */
  shortName: Scalars['String'];
};

/** Добавление группы пользователей */
export type AddTeamMutationPayload = {
  __typename?: 'AddTeamMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Новая группа пользователей */
  team?: Maybe<TeamType>;
};

/** An enumeration. */
export type ApplicationAlgorithm =
  /** No OIDC support */
  | 'A_'
  /** HMAC with SHA-2 256 */
  | 'HS256'
  /** RSA with SHA-2 256 */
  | 'RS256';

/** An enumeration. */
export type ApplicationAuthorizationGrantType =
  /** Authorization code */
  | 'AUTHORIZATION_CODE'
  /** Client credentials */
  | 'CLIENT_CREDENTIALS'
  /** Implicit */
  | 'IMPLICIT'
  /** OpenID connect hybrid */
  | 'OPENID_HYBRID'
  /** Resource owner password-based */
  | 'PASSWORD';

/** An enumeration. */
export type ApplicationClientType =
  /** Confidential */
  | 'CONFIDENTIAL'
  /** Public */
  | 'PUBLIC';

/** Приложение. */
export type ApplicationType = Node & {
  __typename?: 'ApplicationType';
  accesstokenSet: Array<AccessTokenType>;
  algorithm?: Maybe<ApplicationAlgorithm>;
  authorizationGrantType: ApplicationAuthorizationGrantType;
  clientId: Scalars['String'];
  clientSecret: Scalars['String'];
  clientType: ApplicationClientType;
  created: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Allowed URIs list, space separated */
  redirectUris: Scalars['String'];
  skipAuthorization: Scalars['Boolean'];
  updated: Scalars['DateTime'];
  user?: Maybe<UserType>;
};

/** Описание типа индексирования публикации. */
export type ArticleIndexType = {
  __typename?: 'ArticleIndexType';
  /** Коэффициент учета */
  coefficient: Scalars['Float'];
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Название рецензирования */
  name: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

/** Тип публикации */
export type ArticleKindType = {
  __typename?: 'ArticleKindType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Название типа публикации */
  name: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

/** Статья. */
export type ArticleType = Node & {
  __typename?: 'ArticleType';
  /** Дополнительные параметры */
  additionalText: Scalars['String'];
  /** Авторы */
  authors: Array<AuthorType>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип индексирования статьи */
  index?: Maybe<ArticleIndexType>;
  /** Тип публикации */
  kind?: Maybe<ArticleKindType>;
  /** Выходные параметры статьи */
  name: Scalars['String'];
  /** Путь к файлу */
  src: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, добавивший публикацию */
  user: UserType;
  /** Авторы публикации */
  users: Array<UserType>;
  /** Объем работы */
  workload?: Maybe<Scalars['Float']>;
  /** Год выхода статьи */
  year: Scalars['Int'];
};

export type ArticleTypeConnection = {
  __typename?: 'ArticleTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ArticleTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ArticleType` and its cursor. */
export type ArticleTypeEdge = {
  __typename?: 'ArticleTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ArticleType>;
};

/** Прикрепленные файлы  */
export type AttachedFileType = {
  __typename?: 'AttachedFileType';
  /** Дата добавления файла */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Прикрепленные файлы */
  messageSet: Array<MessageType>;
  /** Путь к файлу */
  src: Scalars['String'];
  /** Пользователь, загрузивший файл */
  user?: Maybe<UserType>;
};

/** Прикрепленный файл. */
export type AttachmentType = {
  __typename?: 'AttachmentType';
  /** Курс */
  course: CourseType;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Идентификатор */
  id: Scalars['ID'];
  /** Период */
  period: PeriodType;
  /** Файл портфоли */
  portfolioFile: PortfolioFileType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

/** Аттестация. */
export type AttestationType = Node & {
  __typename?: 'AttestationType';
  /** Пользователь, который подтвердил аттестацию */
  confirmedBy?: Maybe<UserType>;
  /** Курс */
  course: CourseType;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Описание */
  description: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Период */
  period: PeriodType;
  /** Оценка */
  registration: RegistrationType;
  /** Пользователь, который выставил аттестацию */
  setBy: UserType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Учайщийся */
  user: UserType;
};

/** Автор публикации */
export type AuthorInputType = {
  /** Автор */
  authorId?: InputMaybe<Scalars['ID']>;
  /** ФИО автора */
  name: Scalars['String'];
  /** Пользователь */
  userId?: InputMaybe<Scalars['ID']>;
};

/** Автор публикации */
export type AuthorType = Node & {
  __typename?: 'AuthorType';
  /** Публикация */
  article: ArticleType;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Фамилия и инициалы автора */
  name: Scalars['String'];
  /** Позиция в авторах публикации */
  order: Scalars['Int'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь */
  user?: Maybe<UserType>;
  /** Вклад автора в работу */
  weight: Scalars['Float'];
};

export type AuthorTypeConnection = {
  __typename?: 'AuthorTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AuthorTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AuthorType` and its cursor. */
export type AuthorTypeEdge = {
  __typename?: 'AuthorTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AuthorType>;
};

/** Тип блока образовательной программы. */
export type BlockKindType = {
  __typename?: 'BlockKindType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
};

/** Категория */
export type CategoryType = Node & {
  __typename?: 'CategoryType';
  /** Аватар */
  avatar?: Maybe<Scalars['String']>;
  /** Дочерние категории */
  children: Array<Maybe<CategoryType>>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Соседние категории */
  nc: Array<Maybe<CategoryType>>;
  /** Страницы */
  pages?: Maybe<PageTypeConnection>;
  /** Родительская категория */
  parent?: Maybe<CategoryType>;
  /** Позиция вывода */
  position: Scalars['Int'];
  /** Текст */
  text: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

/** Категория */
export type CategoryTypePagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  category_Id?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  kind_Id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  title_Icontains?: InputMaybe<Scalars['String']>;
};

export type CategoryTypeConnection = {
  __typename?: 'CategoryTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CategoryTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `CategoryType` and its cursor. */
export type CategoryTypeEdge = {
  __typename?: 'CategoryTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CategoryType>;
};

export type ChangeArticleMutationInput = {
  /** Дополнительные поля публикации */
  additional: Scalars['String'];
  /** Публикация */
  articleId: Scalars['ID'];
  /** Все авторы публикации */
  authors: Array<AuthorInputType>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор типа индексирования статьи */
  indexId: Scalars['ID'];
  /** Тип публикации */
  kindId: Scalars['ID'];
  /** Название работы */
  name: Scalars['String'];
  /** Объем работы */
  workload?: InputMaybe<Scalars['Float']>;
  /** Год публикации */
  year: Scalars['Int'];
};

/** Изменение публикации. */
export type ChangeArticleMutationPayload = {
  __typename?: 'ChangeArticleMutationPayload';
  /** Измененная публикация */
  article?: Maybe<ArticleType>;
  /** Измененные авторы публикации */
  authors: Array<AuthorType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeAttestationMutationInput = {
  /** Идентификатор аттестации */
  attestationId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор пользователя, который подтвердил аттестацию */
  confirmedById?: InputMaybe<Scalars['ID']>;
  /** Описание */
  description?: InputMaybe<Scalars['String']>;
  /** Идентификатор курса */
  registrationId?: InputMaybe<Scalars['ID']>;
  /** Идентификатор пользователя, который выставил аттестацию */
  setById?: InputMaybe<Scalars['ID']>;
};

/** Изменение аттестации */
export type ChangeAttestationMutationPayload = {
  __typename?: 'ChangeAttestationMutationPayload';
  /** Измененная аттестация */
  attestation?: Maybe<AttestationType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeAvatarMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемый файл аватара */
  file: Scalars['Upload'];
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
};

/** Мутация для изменения аватара пользователя. */
export type ChangeAvatarMutationPayload = {
  __typename?: 'ChangeAvatarMutationPayload';
  /** Загруженный аватар */
  avatar: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeCategoryAvatarMutationInput = {
  /** Аватар */
  avatar?: InputMaybe<Scalars['Upload']>;
  /** Идентификатор мутации */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Мутация для изменения аватара категории */
export type ChangeCategoryAvatarMutationPayload = {
  __typename?: 'ChangeCategoryAvatarMutationPayload';
  /** Добавленная котегория */
  category?: Maybe<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeCategoryMutationInput = {
  /** Идентификатор мутации */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название категории */
  text: Scalars['String'];
};

/** Мутации для изменения категории */
export type ChangeCategoryMutationPayload = {
  __typename?: 'ChangeCategoryMutationPayload';
  /** Добавленная котегория */
  category?: Maybe<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeCategoryParentMutationInput = {
  /** Идентификатор категории */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор родителя */
  parentId?: InputMaybe<Scalars['ID']>;
};

/** Мутация для изменения родителя */
export type ChangeCategoryParentMutationPayload = {
  __typename?: 'ChangeCategoryParentMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeCategoryPositionMutationInput = {
  /** Идентификаторы категорий */
  categoriesId: Array<InputMaybe<Scalars['ID']>>;
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Мутация для изменения порядка следования вывода категорий */
export type ChangeCategoryPositionMutationPayload = {
  __typename?: 'ChangeCategoryPositionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeChildItemPropMutationInput = {
  /** Идентификатор дочернего тега */
  childItemPropId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Новый заголовок */
  header: Scalars['String'];
  /** Новый дочерний тег */
  itemProp: Scalars['String'];
  /** Новое положение для вывода */
  showPosition: Scalars['Int'];
};

export type ChangeChildItemPropMutationPayload = {
  __typename?: 'ChangeChildItemPropMutationPayload';
  childItemProp: ChildItemPropType;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeCoursesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Частичные данные курсов */
  courses?: InputMaybe<Array<CourseInputType>>;
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Изменение курсов */
export type ChangeCoursesMutationPayload = {
  __typename?: 'ChangeCoursesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененные курсы */
  courses?: Maybe<Array<CourseType>>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Остались ли курсы у группы */
  hasCourses?: Maybe<Scalars['Boolean']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeDirectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название */
  code: Scalars['String'];
  /** Идентификатор направления подготовки */
  directionId: Scalars['ID'];
  /** Код специальности */
  name: Scalars['String'];
};

/** Изменение направления подготовки */
export type ChangeDirectionMutationPayload = {
  __typename?: 'ChangeDirectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененное направление подготовки */
  direction?: Maybe<DirectionType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeDisciplineMutationInput = {
  /** Аннотация к рабочей программе дисциплины/практики/ГИА */
  annotation?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Код дисциплины */
  code?: InputMaybe<Scalars['String']>;
  /** Удалять ли аннотацию */
  deleteAnnotation: Scalars['Boolean'];
  /** Удалять ли файл */
  deleteWorkProgram: Scalars['Boolean'];
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
  /** Название дисциплины */
  name?: InputMaybe<Scalars['String']>;
  /** Родительская дисциплина */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Идентификаторы авторов */
  userIds: Array<Scalars['ID']>;
  /** Форма представления дисциплины */
  viewId: Scalars['ID'];
  /** Рабочая программа дисциплины */
  workProgram?: InputMaybe<Scalars['Upload']>;
};

/** Изменение дисциплины */
export type ChangeDisciplineMutationPayload = {
  __typename?: 'ChangeDisciplineMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененная дисциплина */
  discipline?: Maybe<DisciplineType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeEduFormMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор формы обучения */
  eduFormId: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Идентификатор родительской формы обучения */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Короткое название */
  shortName: Scalars['String'];
};

/** Изменение формы обучения */
export type ChangeEduFormMutationPayload = {
  __typename?: 'ChangeEduFormMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененная форма обучения */
  eduForm?: Maybe<EduFormType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeEduProgramMutationInput = {
  /** Признак адапативности программ */
  adaptive?: InputMaybe<Scalars['Boolean']>;
  /** Год поступления */
  admission?: InputMaybe<Scalars['Int']>;
  /** Календарный учебный график */
  calendar?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Удалять ли календарный учебный график */
  deleteCalendar: Scalars['Boolean'];
  /** Удалять ли описание */
  deleteDescription: Scalars['Boolean'];
  /** Удалять ли учебный план */
  deleteSyllabus: Scalars['Boolean'];
  /** Описание */
  description?: InputMaybe<Scalars['Upload']>;
  /** Идентификатор направления подготовки */
  directionId?: InputMaybe<Scalars['ID']>;
  /** Идентификатор формы обучения */
  eduFormId?: InputMaybe<Scalars['Int']>;
  /** Идентификатор образовательной программы */
  eduProgramId: Scalars['ID'];
  /** Ускоренная программа */
  expedited?: InputMaybe<Scalars['Boolean']>;
  /** Профиль подготовки */
  name?: InputMaybe<Scalars['String']>;
  /** Учебный план */
  syllabus?: InputMaybe<Scalars['Upload']>;
};

/** Изменение образовательной программы. */
export type ChangeEduProgramMutationPayload = {
  __typename?: 'ChangeEduProgramMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Измененая образовательная программа */
  eduProgram?: Maybe<EduProgramType>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeFileKindMutationInput = {
  /** Допустимый формат загрузки файлов */
  accept: Scalars['String'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор типа загружаемых файлов в портфолио */
  fileKindId: Scalars['ID'];
  /** Наименование цели загрузки файла */
  name: Scalars['String'];
};

/** Изменение типа загружаемых файлов в портфолио */
export type ChangeFileKindMutationPayload = {
  __typename?: 'ChangeFileKindMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененный тип загружаемых файлов в портфолио */
  fileKind?: Maybe<FileKindType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Поле файла */
  field: Scalars['String'];
  /** Идентификатор файла */
  fileId: Scalars['ID'];
  /** Значение поля файла */
  value: Scalars['String'];
};

/** Мутация для изменения файла */
export type ChangeFileMutationPayload = {
  __typename?: 'ChangeFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененный файл */
  file?: Maybe<FileType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeGroupNameMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы */
  groupId: Scalars['Int'];
  /** Название группы */
  name: Scalars['String'];
};

/** Мутация для изменения имени группы. */
export type ChangeGroupNameMutationPayload = {
  __typename?: 'ChangeGroupNameMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная группа */
  group?: Maybe<GroupType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeGroupPermissionsMutationInput = {
  /** Действие */
  action: ActionRelationShip;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы */
  groupId: Scalars['Int'];
  /** Идентификаторы привилегий */
  permissionsId: Array<InputMaybe<Scalars['Int']>>;
};

/** Мутация для изменения привилегий группы. */
export type ChangeGroupPermissionsMutationPayload = {
  __typename?: 'ChangeGroupPermissionsMutationPayload';
  /** Действие */
  action: ActionRelationShip;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификаторы привилегий */
  permissionsId: Array<Maybe<Scalars['Int']>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeHandoutMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Описание раздаточного материала */
  description?: InputMaybe<Scalars['String']>;
  /** Идентификатор раздаточного материала */
  handoutId: Scalars['ID'];
  /** Идентификатор периода */
  periodId?: InputMaybe<Scalars['ID']>;
};

/** Изменение раздаточного материала */
export type ChangeHandoutMutationPayload = {
  __typename?: 'ChangeHandoutMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененнный раздаточный материал */
  handout?: Maybe<HandoutType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeItemPropContainerMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Новый заголовок */
  header: Scalars['String'];
  /** Флаг генерации данных */
  isGenerated: Scalars['Boolean'];
  /** Главный тег */
  itemProp: Scalars['String'];
  /** Идентификатор контейнера */
  itemPropContainerId: Scalars['ID'];
};

export type ChangeItemPropContainerMutationPayload = {
  __typename?: 'ChangeItemPropContainerMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  itemPropContainer: ItemPropContainerType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeMemberPropertyMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Изменяемое поле */
  field: Scalars['String'];
  /** Идентификатор записи */
  memberId: Scalars['ID'];
  /** Значение */
  value: Scalars['Boolean'];
};

/** Изменение свойств чата  */
export type ChangeMemberPropertyMutationPayload = {
  __typename?: 'ChangeMemberPropertyMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeMessageStateMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификаторы сообщений */
  messageIds: Array<Scalars['ID']>;
  /** Изменяемое состояние: delivered|read */
  state: Scalars['String'];
};

/** Доставка и прочтение сообщений  */
export type ChangeMessageStateMutationPayload = {
  __typename?: 'ChangeMessageStateMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeMethodologicalSupportMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор методического обеспечения */
  methodologicalSupportId: Scalars['ID'];
  /** Подпись файла */
  name: Scalars['String'];
};

/** Изменение методического обеспечения. */
export type ChangeMethodologicalSupportMutationPayload = {
  __typename?: 'ChangeMethodologicalSupportMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененное методическое обеспечение */
  methodologicalSupport?: Maybe<MethodologicalSupportType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeNotificationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название поля */
  field: Scalars['String'];
  /** Идентификатор уведомления */
  notificationId: Scalars['ID'];
  /** Значение */
  value: Scalars['Boolean'];
};

/** Изменение уведомления */
export type ChangeNotificationMutationPayload = {
  __typename?: 'ChangeNotificationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeNotificationsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Название поля */
  field: Scalars['String'];
  /** Идентификаторы уведомлений */
  notificationsId: Array<InputMaybe<Scalars['ID']>>;
  /** Значение */
  value: Scalars['Boolean'];
};

/** Изменение всех уведомлений */
export type ChangeNotificationsMutationPayload = {
  __typename?: 'ChangeNotificationsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageAvatarMutationInput = {
  /** Новый аватар страницы */
  avatar?: InputMaybe<Scalars['Upload']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
};

/** Изменение аватара на странице */
export type ChangePageAvatarMutationPayload = {
  __typename?: 'ChangePageAvatarMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageBooleanPropertyMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  field: Scalars['String'];
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Значение */
  value: Scalars['Boolean'];
};

/** Изменение boolean свойств страницы */
export type ChangePageBooleanPropertyMutationPayload = {
  __typename?: 'ChangePageBooleanPropertyMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageCategoryMutationInput = {
  /** Идентификатор категории */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
};

/** Изменение категории страницы */
export type ChangePageCategoryMutationPayload = {
  __typename?: 'ChangePageCategoryMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageKindMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Идентификатор типа страницы */
  pageKindId?: InputMaybe<Scalars['Int']>;
};

/** Изменение типа страницы */
export type ChangePageKindMutationPayload = {
  __typename?: 'ChangePageKindMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageTagsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Теги */
  tagNames: Array<Scalars['String']>;
};

/** Изменения тегов страницы */
export type ChangePageTagsMutationPayload = {
  __typename?: 'ChangePageTagsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePageTitleMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор страницы */
  pageId: Scalars['ID'];
  /** Заголовок страницы */
  title: Scalars['String'];
};

/** Изменение названия страницы */
export type ChangePageTitleMutationPayload = {
  __typename?: 'ChangePageTitleMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная страница */
  page?: Maybe<PageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePasswordMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Старый пароль */
  password: Scalars['String'];
  /** Новый пароль */
  passwordNew: Scalars['String'];
};

/** Мутация для изменения пароля пользователя. */
export type ChangePasswordMutationPayload = {
  __typename?: 'ChangePasswordMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangePeriodMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  periodId: Scalars['Int'];
  shortName: Scalars['String'];
};

/** Изменение периода */
export type ChangePeriodMutationPayload = {
  __typename?: 'ChangePeriodMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeProfileValueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор записи профиля */
  profileId: Scalars['ID'];
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
  /** Значение записи */
  value: Scalars['String'];
};

/** Мутация на изменение значения профиля. */
export type ChangeProfileValueMutationPayload = {
  __typename?: 'ChangeProfileValueMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Добавленное значение профиля */
  profileValue?: Maybe<ProfileValueType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeProfileVisibilityMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор записи */
  profileValueId: Scalars['ID'];
  /** Значение доступности */
  visibility: Scalars['Boolean'];
};

/** Матция для изменения видимости. */
export type ChangeProfileVisibilityMutationPayload = {
  __typename?: 'ChangeProfileVisibilityMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененное значение поля */
  profileValue?: Maybe<ProfileValueType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeRegistrationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  registrationId: Scalars['Int'];
  shortName: Scalars['String'];
};

/** Изменение регистрации */
export type ChangeRegistrationMutationPayload = {
  __typename?: 'ChangeRegistrationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeRowMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Позиция данных */
  index: Scalars['Int'];
  /** Идентификатор контейнера */
  itemPropContainerId: Scalars['ID'];
  /** Новые значения */
  values: Array<InputMaybe<Scalars['String']>>;
};

/** Мутация изменения данных. */
export type ChangeRowMutationPayload = {
  __typename?: 'ChangeRowMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  itemPropContainer: ItemPropContainerType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeSectionFilesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые изображения */
  newFiles?: InputMaybe<Array<Scalars['Upload']>>;
  /** Изображения */
  oldFiles: Array<Scalars['ID']>;
  /** Идентификатор секции */
  sectionId: Scalars['ID'];
  /** Текст мутации */
  text: Scalars['String'];
};

/** Изменение текста секции */
export type ChangeSectionFilesMutationPayload = {
  __typename?: 'ChangeSectionFilesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Секция галереи */
  section?: Maybe<SectionFilesType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeSectionGalleryMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые изображения */
  newImages?: InputMaybe<Array<Scalars['Upload']>>;
  /** Изображения */
  oldImages: Array<Scalars['ID']>;
  /** Идентификатор секции */
  sectionId: Scalars['ID'];
  /** Текст мутации */
  text: Scalars['String'];
};

/** Изменение текста секции */
export type ChangeSectionGalleryMutationPayload = {
  __typename?: 'ChangeSectionGalleryMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Секция галереи */
  section?: Maybe<SectionGalleryType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeSectionTextMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор секции */
  sectionId: Scalars['ID'];
  /** Текст мутации */
  text: Scalars['String'];
};

/** Изменение текста секции */
export type ChangeSectionTextMutationPayload = {
  __typename?: 'ChangeSectionTextMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Текстовая секция */
  section?: Maybe<SectionTextType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeSettingsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор настройки */
  key: Scalars['String'];
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
  /** Значение настройки */
  value: Scalars['String'];
};

/** Мутация для изменения настроек */
export type ChangeSettingsMutationPayload = {
  __typename?: 'ChangeSettingsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Измененная настройка */
  setting?: Maybe<SettingType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeSubsectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Новое название подраздела */
  header: Scalars['String'];
  /** Идентификатор подраздела */
  subsectionId: Scalars['ID'];
  /** Новый путь до подраздела */
  url?: InputMaybe<Scalars['String']>;
};

/** Мутация изменения подраздела. */
export type ChangeSubsectionMutationPayload = {
  __typename?: 'ChangeSubsectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  subsection: SubsectionType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeTeamDeleteMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Удалена ли группа (закончено обучение) */
  delete: Scalars['Boolean'];
  /** Идентификатор группы пользователей */
  teamId: Scalars['ID'];
};

/** Мягкое удаление или восстановление группы пользователей */
export type ChangeTeamDeleteMutationPayload = {
  __typename?: 'ChangeTeamDeleteMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Измененная группа */
  team?: Maybe<TeamType>;
};

export type ChangeTeamEduProgramMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор образовательной программы */
  eduProgramId?: InputMaybe<Scalars['ID']>;
  /** Идентификатор группы пользователей */
  teamId: Scalars['ID'];
  /** Переносить курсы с удалением ненайденных */
  transferCourses: Scalars['Boolean'];
};

/** Изменение образовательной программы для группы пользователей */
export type ChangeTeamEduProgramMutationPayload = {
  __typename?: 'ChangeTeamEduProgramMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Измененная группа */
  team?: Maybe<TeamType>;
};

export type ChangeTeamMutationInput = {
  /** Год образования группы/поступления */
  admission?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  groupId?: InputMaybe<Scalars['ID']>;
  /** Название группы */
  name?: InputMaybe<Scalars['String']>;
  /** Родительская группа (Администрация -> Кафедра -> Студенты) */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Сокращенное название группы */
  shortName?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы пользователей */
  teamId: Scalars['ID'];
};

/** Изменения группы пользователей */
export type ChangeTeamMutationPayload = {
  __typename?: 'ChangeTeamMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Измененная группа */
  team?: Maybe<TeamType>;
};

export type ChangeTeamResponsibleUsersMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы пользователей */
  teamId: Scalars['ID'];
  /** Идентификаторы пользователей */
  usersId: Array<Scalars['ID']>;
};

/** Изменение ответственных пользователей в группе */
export type ChangeTeamResponsibleUsersMutationPayload = {
  __typename?: 'ChangeTeamResponsibleUsersMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Измененная группа */
  team?: Maybe<TeamType>;
};

export type ChangeUserGroupsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор групп */
  groupsId: Array<InputMaybe<Scalars['Int']>>;
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
};

/** Мутация для изменения групп конкретного пользователя. */
export type ChangeUserGroupsMutationPayload = {
  __typename?: 'ChangeUserGroupsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Новые группы */
  groups?: Maybe<Array<Maybe<GroupType>>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type ChangeUserPropsMutationInput = {
  /** Дата рождения */
  birthday: Scalars['Date'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Email */
  email: Scalars['String'];
  /** Имя */
  firstName: Scalars['String'];
  /** Фамилия */
  lastName: Scalars['String'];
  /** Отчество */
  sirName: Scalars['String'];
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
};

/** Мутация для изменения полей пользователя. */
export type ChangeUserPropsMutationPayload = {
  __typename?: 'ChangeUserPropsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Измененный пользователь */
  user: UserType;
};

/** Сообщения чата */
export type ChatMessageType = Node & {
  __typename?: 'ChatMessageType';
  /** Чат */
  chat?: Maybe<ChatType>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Сообщение удалено */
  deleted: Scalars['Boolean'];
  /** Сообщение доставлено */
  delivered?: Maybe<Scalars['DateTime']>;
  /** Избранное сообщение */
  favorite: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Сообщение */
  message?: Maybe<MessageType>;
  /** Сообщение прочитано */
  read?: Maybe<Scalars['DateTime']>;
  /** Пользователь */
  user?: Maybe<UserType>;
};

export type ChatMessageTypeConnection = {
  __typename?: 'ChatMessageTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChatMessageTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ChatMessageType` and its cursor. */
export type ChatMessageTypeEdge = {
  __typename?: 'ChatMessageTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ChatMessageType>;
};

/** Подписка на сообщения в выбранном чате  */
export type ChatMessagesSubscription = {
  __typename?: 'ChatMessagesSubscription';
  /** Действие пользователя */
  action: ConsumerActionType;
  /** Сообщение */
  chatMessage?: Maybe<ChatMessageType>;
  /** Идентификатор объекта */
  id: Scalars['ID'];
};

/** Чат */
export type ChatType = {
  __typename?: 'ChatType';
  /** Аватар */
  avatar?: Maybe<Scalars['String']>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Последнее сообщение */
  lastMessage?: Maybe<MessageType>;
  /** Название */
  name?: Maybe<Scalars['String']>;
  /** Дата изменения */
  updatedAt: Scalars['DateTime'];
  /** Организатор чата */
  user: UserType;
  /** Участники чата */
  users: Array<UserType>;
};

export type ChildItemPropInputType = {
  /** Заголовок столбца */
  header: Scalars['String'];
  /** Дочерний тег */
  itemProp: Scalars['String'];
};

export type ChildItemPropType = Node & {
  __typename?: 'ChildItemPropType';
  /** Подпись к единице информации */
  header: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Дочерний тег */
  itemProp: Scalars['String'];
  /** Позиция дочернего тега при выводе */
  showPosition: Scalars['Int'];
  /** Индекс под которым хранится данные с тегом */
  valuePosition: Scalars['Int'];
};

/** Комментарии */
export type CommentType = Node & {
  __typename?: 'CommentType';
  /** Дочерние комментарии */
  children: Array<Maybe<CategoryType>>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Страница */
  page: PageType;
  /** Рейтинг */
  rating: Scalars['Int'];
  /** Текст */
  text: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, оставивший комментарий */
  user: UserType;
};

export type CommentTypeConnection = {
  __typename?: 'CommentTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CommentTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `CommentType` and its cursor. */
export type CommentTypeEdge = {
  __typename?: 'CommentTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CommentType>;
};

/** Компетенция. */
export type CompetenceType = Node & {
  __typename?: 'CompetenceType';
  /** Категория */
  category: Scalars['String'];
  /** Код */
  code: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
};

export type CompetenceTypeConnection = {
  __typename?: 'CompetenceTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CompetenceTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `CompetenceType` and its cursor. */
export type CompetenceTypeEdge = {
  __typename?: 'CompetenceTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CompetenceType>;
};

export type ConfirmEmailMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Код, полученный по Email */
  code: Scalars['String'];
  /** Email адрес */
  email: Scalars['String'];
};

/** Подтверждение кода. */
export type ConfirmEmailMutationPayload = {
  __typename?: 'ConfirmEmailMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

export type ConfirmPortfolioFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор файла портфолио */
  portfolioFileId: Scalars['ID'];
};

/** Подтверждение файла портфолио */
export type ConfirmPortfolioFileMutationPayload = {
  __typename?: 'ConfirmPortfolioFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Пользователь, подтвердивший файл портфолио */
  portfolioFile?: Maybe<PortfolioFileType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/**
 * Типы уведомления пользователей
 * - CONNECT - Присоединился
 * - DISCONNECT - Отсоединился
 * - ADD - Пользователь добавил данные (по умолчанию)
 * - CHANGE - Пользователь изменил данные
 * - DELETE - Удаление объекта
 * - ERROR - Ошибка ввода данных
 * - TYPING - Печатет, готовиться отправить сообщение
 * - TYPING_FINISH - Закончил печатать
 * - EXCEPTION - Пользователь исключен из потока уведомлений
 */
export type ConsumerActionType =
  | 'ADD'
  | 'CHANGE'
  | 'CONNECT'
  | 'DELETE'
  | 'DISCONNECT'
  | 'ERROR'
  | 'EXCEPTION'
  | 'TYPING'
  | 'TYPING_FINISH';

/** Тип модели Django. */
export type ContentTypeType = {
  __typename?: 'ContentTypeType';
  appLabel: Scalars['String'];
  id: Scalars['ID'];
  /** Модель, связанная с действием */
  logentrySet: LogEntryTypeConnection;
  model: Scalars['String'];
  permissionSet: Array<PermissionType>;
};

/** Тип модели Django. */
export type ContentTypeTypeLogentrySetArgs = {
  action_Contains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  contentType_Model_Icontains?: InputMaybe<Scalars['String']>;
  createdAt_Gt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Gte?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lte?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  objectId_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Частичные входные данные курса. */
export type CourseInputType = {
  /** Идентификатор часов по плану */
  eduHoursId: Scalars['ID'];
  /** Идентификаторы периодов обучения */
  periodIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Идентификаторы преподавателей */
  teacherIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Курс. */
export type CourseType = Node & {
  __typename?: 'CourseType';
  /** Прикрепленные файлы */
  attachments?: Maybe<Array<AttachmentType>>;
  /** Аттестации */
  attestations?: Maybe<Array<AttestationType>>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Часы по плану */
  eduHours: EduHoursType;
  /** Раздаточные материалы */
  handouts?: Maybe<Array<HandoutType>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Периоды обучения */
  periods?: Maybe<Array<PeriodType>>;
  /** Номер семестра с учетом номера курса */
  semester?: Maybe<Scalars['Int']>;
  /** Преподаватели курса */
  teachers?: Maybe<Array<UserType>>;
  /** Группа пользователей, которая обучается */
  team: TeamType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

export type CourseTypeConnection = {
  __typename?: 'CourseTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `CourseType` and its cursor. */
export type CourseTypeEdge = {
  __typename?: 'CourseTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CourseType>;
};

/** Информация по показателям во временной развертке. */
export type DateStatisticsType = {
  __typename?: 'DateStatisticsType';
  /** Дата */
  date: Scalars['Date'];
  /** Значение */
  value: Scalars['Float'];
};

export type DeleteArticleMutationInput = {
  /** Идентификатор файла публикации */
  articleId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Пользователь */
  userId: Scalars['ID'];
};

/** Удаление публикации. */
export type DeleteArticleMutationPayload = {
  __typename?: 'DeleteArticleMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteAttachmentsMutationInput = {
  /** Идентификаторы прикрепленных файлов */
  attachmentIds: Array<Scalars['ID']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Удаление прикрепленных файлов */
export type DeleteAttachmentsMutationPayload = {
  __typename?: 'DeleteAttachmentsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteAttestationMutationInput = {
  /** Идентификатор аттестации */
  attestationId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Удаление аттестации */
export type DeleteAttestationMutationPayload = {
  __typename?: 'DeleteAttestationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteCategoryMutationInput = {
  /** Идентификатор мутации */
  categoryId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Мутация для удаления категории */
export type DeleteCategoryMutationPayload = {
  __typename?: 'DeleteCategoryMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteChildItemPropMutationInput = {
  /** Идентификатор модели "Дочерний тег" */
  childItemPropId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Удаление записи модели "ChildItemProp" */
export type DeleteChildItemPropMutationPayload = {
  __typename?: 'DeleteChildItemPropMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteCompetenceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор компетенции */
  competenceId: Scalars['ID'];
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
};

/** Удаление компетенций */
export type DeleteCompetenceMutationPayload = {
  __typename?: 'DeleteCompetenceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор компетенции */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteCourseMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор курса */
  courseId: Scalars['ID'];
};

/** Удаление курса */
export type DeleteCourseMutationPayload = {
  __typename?: 'DeleteCourseMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteCoursesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Удаление всех курсов группы */
export type DeleteCoursesMutationPayload = {
  __typename?: 'DeleteCoursesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteDirectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Направление подготовки" */
  directionId: Scalars['ID'];
};

/** Удаление записи модели "Direction" */
export type DeleteDirectionMutationPayload = {
  __typename?: 'DeleteDirectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteDisciplineMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор дисциплины */
  disciplineId: Scalars['ID'];
};

/** Удаление дисциплины */
export type DeleteDisciplineMutationPayload = {
  __typename?: 'DeleteDisciplineMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор дисциплины */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteEduFormMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Форма обучения" */
  eduFormId: Scalars['ID'];
};

/** Удаление записи модели "EduForm" */
export type DeleteEduFormMutationPayload = {
  __typename?: 'DeleteEduFormMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteEduHourMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор вида работ */
  eduHourId: Scalars['ID'];
};

/** Удаление часов по плану */
export type DeleteEduHourMutationPayload = {
  __typename?: 'DeleteEduHourMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор вида работ */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteEduProgramMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор образовательной программы */
  eduProgramId: Scalars['ID'];
};

/** Удаление образовательной программы. */
export type DeleteEduProgramMutationPayload = {
  __typename?: 'DeleteEduProgramMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор образовательной программы */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteFileKindMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Тип загружаемых файлов в портфолио" */
  fileKindId: Scalars['ID'];
};

/** Удаление записи модели "FileKind" */
export type DeleteFileKindMutationPayload = {
  __typename?: 'DeleteFileKindMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор файла */
  fileId: Scalars['ID'];
};

/** Мутация для полного удаления файла */
export type DeleteFileMutationPayload = {
  __typename?: 'DeleteFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор удаляемого файла */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор группы */
  groupId: Scalars['Int'];
};

/** Мутация для удаления группы. */
export type DeleteGroupMutationPayload = {
  __typename?: 'DeleteGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор группы */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteHandoutsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификаторы раздаточных материалов */
  handoutIds: Array<Scalars['ID']>;
};

/** Удаление раздаточных материалов */
export type DeleteHandoutsMutationPayload = {
  __typename?: 'DeleteHandoutsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteItemPropContainerMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Контейнер с данными и структурой" */
  itemPropContainerId: Scalars['ID'];
};

/** Удаление записи модели "ItemPropContainer" */
export type DeleteItemPropContainerMutationPayload = {
  __typename?: 'DeleteItemPropContainerMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteJobMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Место работы пользователя" */
  jobId: Scalars['ID'];
};

/** Удаление записи модели "Job" */
export type DeleteJobMutationPayload = {
  __typename?: 'DeleteJobMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteJobPostMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Должность пользователя на месте работы" */
  jobPostId: Scalars['ID'];
};

/** Удаление записи модели "JobPost" */
export type DeleteJobPostMutationPayload = {
  __typename?: 'DeleteJobPostMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteMemberMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор записи */
  memberId: Scalars['ID'];
};

/** Удаление чата  */
export type DeleteMemberMutationPayload = {
  __typename?: 'DeleteMemberMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteMessagesInput = {
  /** Идентификатор чата */
  chatId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Удалять для всех */
  forEveryone: Scalars['Boolean'];
  /** Идентификаторы сообщений */
  messageIds: Array<Scalars['ID']>;
};

/** Удаление сообщения  */
export type DeleteMessagesPayload = {
  __typename?: 'DeleteMessagesPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteMethodologicalSupportMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор методического обеспечения */
  methodologicalSupportId: Scalars['ID'];
};

/** Удаление методического обеспечения */
export type DeleteMethodologicalSupportMutationPayload = {
  __typename?: 'DeleteMethodologicalSupportMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Идентификатор методического обеспечения */
  id: Scalars['ID'];
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteNoticeMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор уведомления */
  noticeId: Scalars['ID'];
};

/** Удаление всех уведомлений */
export type DeleteNoticeMutationPayload = {
  __typename?: 'DeleteNoticeMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeletePageMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  pageId: Scalars['ID'];
};

/** Удаление страницы */
export type DeletePageMutationPayload = {
  __typename?: 'DeletePageMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeletePeriodMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  periodId: Scalars['Int'];
};

/** Удаление периода */
export type DeletePeriodMutationPayload = {
  __typename?: 'DeletePeriodMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeletePortfolioFileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Файл в портфолио" */
  portfolioFileId: Scalars['ID'];
};

/** Удаление записи модели "PortfolioFile" */
export type DeletePortfolioFileMutationPayload = {
  __typename?: 'DeletePortfolioFileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteProfileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор записи */
  profileId: Scalars['Int'];
};

/** Мутация для удаления записи профиля. */
export type DeleteProfileMutationPayload = {
  __typename?: 'DeleteProfileMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteRegistrationMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  registrationId: Scalars['Int'];
};

/** Удаление регистрации */
export type DeleteRegistrationMutationPayload = {
  __typename?: 'DeleteRegistrationMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteRowMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Позиция данных */
  index?: InputMaybe<Scalars['Int']>;
  /** Идентификатор контейнера */
  itemPropContainerId: Scalars['ID'];
};

/** Мутация удаления данных. */
export type DeleteRowMutationPayload = {
  __typename?: 'DeleteRowMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  itemPropContainer: ItemPropContainerType;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteSectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор секции */
  sectionId: Scalars['ID'];
};

/** Удаление секции */
export type DeleteSectionMutationPayload = {
  __typename?: 'DeleteSectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteSessionsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Мутация для удаления всех сессий кроме текущей. */
export type DeleteSessionsMutationPayload = {
  __typename?: 'DeleteSessionsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteSubsectionMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Подраздел" */
  subsectionId: Scalars['ID'];
};

/** Удаление записи модели "Subsection" */
export type DeleteSubsectionMutationPayload = {
  __typename?: 'DeleteSubsectionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type DeleteTeamMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор модели "Группа пользователей" */
  teamId: Scalars['ID'];
};

/** Удаление записи модели "Team" */
export type DeleteTeamMutationPayload = {
  __typename?: 'DeleteTeamMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Направление подготовки. */
export type DirectionType = Node & {
  __typename?: 'DirectionType';
  /** Дочерние направления */
  children?: Maybe<Array<Maybe<DirectionType>>>;
  /** Код специальности */
  code: Scalars['String'];
  /** Теперь не проводиться обучения по данному направлению */
  delete: Scalars['Boolean'];
  /** Образовательная услуга */
  eduService: EduServiceType;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Секретное направление подготовки */
  secret: Scalars['Boolean'];
};

/** Тип дисциплины. */
export type DisciplineKindType = {
  __typename?: 'DisciplineKindType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
};

/** Дисциплина. */
export type DisciplineType = Node & {
  __typename?: 'DisciplineType';
  /** Аннотация к рабочей программе дисциплины/практики/ГИА */
  annotation?: Maybe<Scalars['String']>;
  /** Электронная подпись аннотации к рабочей программе дисциплины/практики/ГИА */
  annotationSign?: Maybe<Scalars['String']>;
  /** Код */
  code: Scalars['String'];
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Образовательная программа */
  eduProgram: EduProgramType;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Методическое обеспечение */
  methodologicalSupport: Array<MethodologicalSupportType>;
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Родительская дисциплина */
  parent?: Maybe<DisciplineType>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Авторы */
  users: Array<UserType>;
  /** Форма представления */
  view: DisciplineViewType;
  /** Рабочая программа дисциплины */
  workProgram?: Maybe<Scalars['String']>;
  /** Электронная подпись рабочей программы дисциплины */
  workProgramSign?: Maybe<Scalars['String']>;
};

export type DisciplineTypeConnection = {
  __typename?: 'DisciplineTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DisciplineTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `DisciplineType` and its cursor. */
export type DisciplineTypeEdge = {
  __typename?: 'DisciplineTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<DisciplineType>;
};

/** Форма представления дисциплины (Базовая, Выборная, Альтернативная). */
export type DisciplineViewType = {
  __typename?: 'DisciplineViewType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
};

/** Debugging information for the current query. */
export type DjangoDebug = {
  __typename?: 'DjangoDebug';
  /** Executed SQL queries for this API query. */
  sql?: Maybe<Array<Maybe<DjangoDebugSql>>>;
};

/** Represents a single database query made to a Django managed DB. */
export type DjangoDebugSql = {
  __typename?: 'DjangoDebugSQL';
  /** The Django database alias (e.g. 'default'). */
  alias: Scalars['String'];
  /** Duration of this database query in seconds. */
  duration: Scalars['Float'];
  /** Postgres connection encoding if available. */
  encoding?: Maybe<Scalars['String']>;
  /** Whether this database query was a SELECT. */
  isSelect: Scalars['Boolean'];
  /** Whether this database query took more than 10 seconds. */
  isSlow: Scalars['Boolean'];
  /** Postgres isolation level if available. */
  isoLevel?: Maybe<Scalars['String']>;
  /** JSON encoded database query parameters. */
  params: Scalars['String'];
  /** The raw SQL of this query, without params. */
  rawSql: Scalars['String'];
  /** The actual SQL sent to this database. */
  sql?: Maybe<Scalars['String']>;
  /** Start time of this database query. */
  startTime: Scalars['Float'];
  /** Stop time of this database query. */
  stopTime: Scalars['Float'];
  /** Postgres transaction ID if available. */
  transId?: Maybe<Scalars['String']>;
  /** Postgres transaction status if available. */
  transStatus?: Maybe<Scalars['String']>;
  /** The type of database being used (e.g. postrgesql, mysql, sqlite). */
  vendor: Scalars['String'];
};

/** Цикл образовательных программ. */
export type EduCycleType = {
  __typename?: 'EduCycleType';
  /** Тип блока образовательной программы */
  blockKind: BlockKindType;
  /** Код */
  code: Scalars['String'];
  /** Тип дисциплины */
  disciplineKind: DisciplineKindType;
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Порядок сортировки */
  order: Scalars['Int'];
};

/** Форма обучения. */
export type EduFormType = {
  __typename?: 'EduFormType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Родительская форма обучения */
  parent?: Maybe<EduFormType>;
  /** Короткое название */
  shortName: Scalars['String'];
};

/** Часы по плану. */
export type EduHoursType = {
  __typename?: 'EduHoursType';
  /** Курс */
  courseNumber: Scalars['Int'];
  /** Дисциплина */
  discipline: DisciplineType;
  /** Тип часов */
  hoursKind: HoursKindType;
  id: Scalars['ID'];
  /** Семестр */
  semesterNumber: Scalars['Int'];
  /** Значение */
  value: Scalars['Float'];
  /** Вид работ */
  workKind: WorkKindType;
};

/** Статистика образовательных программ. */
export type EduProgramStatisticsType = {
  __typename?: 'EduProgramStatisticsType';
  /** Год набора */
  admission: Scalars['Int'];
  /** Код образовательной программы */
  directionCode: Scalars['String'];
  /** Название образовательной программы */
  directionName: Scalars['String'];
  /** Форма обучения */
  eduForm: Scalars['String'];
  /** Идентификатор записи */
  id: Scalars['ID'];
  /** Имя образовательной программы */
  name: Scalars['String'];
  /** Значения показателей */
  points: Array<Maybe<PointTotalStatisticsType>>;
};

/** Образовательная программа. */
export type EduProgramType = Node & {
  __typename?: 'EduProgramType';
  /** Признак адапативности программ */
  adaptive: Scalars['Boolean'];
  /** Год поступления */
  admission: Scalars['Int'];
  /** Календарный учебный график */
  calendar?: Maybe<Scalars['String']>;
  /** Электронная подпись календарного учебного графика */
  calendarSign?: Maybe<Scalars['String']>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Описание */
  description?: Maybe<Scalars['String']>;
  /** Электронная подпись описания */
  descriptionSign?: Maybe<Scalars['String']>;
  /** Направление подготовки */
  direction: DirectionType;
  /** Дисциплины */
  disciplines: Array<Maybe<DisciplineType>>;
  /** Форма обучения */
  eduForm: EduFormType;
  /** Ускоренная программа */
  expedited: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Профиль подготовки */
  name: Scalars['String'];
  /** Учебный план */
  syllabus?: Maybe<Scalars['String']>;
  /** Электронная подпись учебного плана */
  syllabusSign?: Maybe<Scalars['String']>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

export type EduProgramTypeConnection = {
  __typename?: 'EduProgramTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EduProgramTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `EduProgramType` and its cursor. */
export type EduProgramTypeEdge = {
  __typename?: 'EduProgramTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<EduProgramType>;
};

/** Образовательная услуга (Бакалавриат, Специалитет). */
export type EduServiceType = {
  __typename?: 'EduServiceType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
};

/** Ошибка в поле формы */
export type ErrorFieldType = {
  __typename?: 'ErrorFieldType';
  /** Поле формы */
  field: Scalars['String'];
  /** Ошибки */
  messages: Array<Scalars['String']>;
};

export type FavoriteMessageInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор сообщения */
  messageId: Scalars['ID'];
};

/** Добавление сообщения в избранные  */
export type FavoriteMessagePayload = {
  __typename?: 'FavoriteMessagePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Тип загружаемых файлов в портфолио. */
export type FileKindType = {
  __typename?: 'FileKindType';
  /** Допустимый формат загрузки файлов */
  accept: Scalars['String'];
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Наименование цели загрузки файла */
  name: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

/** Файл пользователя. */
export type FileType = Node & {
  __typename?: 'FileType';
  /** Дата добавления файла */
  createdAt: Scalars['DateTime'];
  /** Помечаем удаленный файл */
  deleted: Scalars['Boolean'];
  /** Расширение файла */
  ext?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Название файла */
  name: Scalars['String'];
  /** Размер файла в байтах */
  size?: Maybe<Scalars['Int']>;
  /** Путь к файлу */
  src: Scalars['String'];
  /** Дата обновления файла */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, добавивший файл */
  user?: Maybe<UserType>;
};

export type FileTypeConnection = {
  __typename?: 'FileTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FileTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `FileType` and its cursor. */
export type FileTypeEdge = {
  __typename?: 'FileTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FileType>;
};

export type GenerateTeamNewPasswordsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Дата генерации паролей */
  date: Scalars['String'];
  /** Идентификатор группы пользователей */
  teamId: Scalars['ID'];
  /** Идентификаторы пользователей */
  usersId: Array<Scalars['ID']>;
};

/** Генерация паролей заданным пользователям */
export type GenerateTeamNewPasswordsMutationPayload = {
  __typename?: 'GenerateTeamNewPasswordsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type GetTokenMutationInput = {
  /** Открытый идентификатор приложения */
  clientId?: InputMaybe<Scalars['String']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Секретный идентификатор приложения */
  clientSecret?: InputMaybe<Scalars['String']>;
  /** Тип авторизации */
  grantType?: InputMaybe<Scalars['String']>;
  /** Пароль */
  password?: InputMaybe<Scalars['String']>;
  /** Имя пользователя */
  username?: InputMaybe<Scalars['String']>;
};

/** Мутация для получения токена авторизации. */
export type GetTokenMutationPayload = {
  __typename?: 'GetTokenMutationPayload';
  /** Токен доступа */
  accessToken?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Время жизни токена */
  expiresIn?: Maybe<Scalars['Int']>;
  /** Токен обновления */
  refreshToken?: Maybe<Scalars['String']>;
  /** Разрешения */
  scope?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Тип токена */
  tokenType?: Maybe<Scalars['String']>;
  /** Авторизованный пользователь */
  user?: Maybe<UserType>;
};

/** Группа пользователей. */
export type GroupType = {
  __typename?: 'GroupType';
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions: Array<PermissionType>;
  /** Группа прав */
  teamSet: TeamTypeConnection;
  /** Группы, к которым принадлежит данный пользователь. Пользователь получит все права, указанные в каждой из его/её групп. */
  userSet: UserTypeConnection;
};

/** Группа пользователей. */
export type GroupTypeTeamSetArgs = {
  admission_Icontains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCount_Gt?: InputMaybe<Scalars['Float']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  shortName_Icontains?: InputMaybe<Scalars['String']>;
};

/** Группа пользователей. */
export type GroupTypeUserSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  email_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  firstName_Icontains?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  lastName_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  sirName_Icontains?: InputMaybe<Scalars['String']>;
  username_Icontains?: InputMaybe<Scalars['String']>;
};

/** Раздаточный материал для курса. */
export type HandoutType = Node & {
  __typename?: 'HandoutType';
  /** Курс */
  course: CourseType;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Описание раздаточного материала */
  description: Scalars['String'];
  /** Файл пользователя */
  file: FileType;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Период обучения */
  period?: Maybe<PeriodType>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, который загрузил файл */
  user?: Maybe<UserType>;
};

export type HandoutTypeConnection = {
  __typename?: 'HandoutTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<HandoutTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `HandoutType` and its cursor. */
export type HandoutTypeEdge = {
  __typename?: 'HandoutTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<HandoutType>;
};

/** Тип часов. */
export type HoursKindType = {
  __typename?: 'HoursKindType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
};

export type ItemPropContainerInputType = {
  /** Заголовок структуры данных */
  header: Scalars['String'];
  /** Структура данных */
  schema: ItemPropInputType;
};

export type ItemPropContainerType = Node & {
  __typename?: 'ItemPropContainerType';
  /** Подпись к данным */
  header: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Флаг, что данные заполняются автоматически */
  isGenerated: Scalars['Boolean'];
  schema?: Maybe<ItemPropType>;
  values: Array<Maybe<Array<Maybe<Scalars['String']>>>>;
};

export type ItemPropInputType = {
  /** Дочерние теги */
  childItemProps: Array<InputMaybe<ChildItemPropInputType>>;
  /** Главный тег */
  itemProp: Scalars['String'];
};

export type ItemPropType = Node & {
  __typename?: 'ItemPropType';
  children?: Maybe<Array<ChildItemPropType>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Главный тег */
  itemProp: Scalars['String'];
};

/** An enumeration. */
export type JobPostKind =
  /** Договор гражданско правового характера */
  | 'CC'
  /** Внешний совместитель */
  | 'EP'
  /** Внутренний совместитель */
  | 'IP'
  /** Основное место работы */
  | 'MJ';

/** История стасусов должности пользователя на месте работы */
export type JobPostStatusHistoryType = {
  __typename?: 'JobPostStatusHistoryType';
  /** Дата получения статуса */
  createdAt: Scalars['DateTime'];
  /** Приказ по присвоению статуса в формате docx */
  decreeDocx?: Maybe<Scalars['String']>;
  /** Приказ по присвоению статуса в формате pdf */
  decreePdf?: Maybe<Scalars['String']>;
  /** Дата потери статуса */
  endAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** Место работы пользователя */
  job: JobType;
  /** Статус места работы пользователя */
  status: JobPostStatusType;
};

/** Статус должности пользователя на месте работы */
export type JobPostStatusType = {
  __typename?: 'JobPostStatusType';
  /** Является ли статус активным */
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Шаблон docx для формрования приказа по присвоению статуса */
  templateDocx?: Maybe<Scalars['String']>;
  /** Шаблон xml для формирования приказа по присвоению статуса */
  templateXml?: Maybe<Scalars['String']>;
};

/** Должность пользователя на месте работы */
export type JobPostType = {
  __typename?: 'JobPostType';
  id: Scalars['ID'];
  /** Место работы пользователя */
  job: JobType;
  /** Тип работы */
  kind: JobPostKind;
  /** Должность пользователя на месте работы */
  post: PostType;
  /** Занимаемая ставка */
  rate: Scalars['Float'];
  /** История статусов */
  statusHistory: Array<JobPostStatusHistoryType>;
};

/** Место работы пользователя */
export type JobType = {
  __typename?: 'JobType';
  id: Scalars['ID'];
  /** Должности пользователя на месте работы */
  jobPosts: Array<JobPostType>;
  /** Группа */
  team: TeamType;
  /** Пользователь */
  user: UserType;
};

/** An enumeration. */
export type LogEntryAction =
  /** addition */
  | 'A_1'
  /** change */
  | 'A_2'
  /** deletion */
  | 'A_3';

/** Логирование действия пользователя. */
export type LogEntryType = Node & {
  __typename?: 'LogEntryType';
  /** Действие пользователя */
  action: LogEntryAction;
  /** Модель, связанная с действием */
  contentType?: Maybe<ContentTypeType>;
  /** Дата и время действия */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Идентификатор модели */
  objectId?: Maybe<Scalars['String']>;
  /** Измененные данные */
  payload: Scalars['JSONString'];
  /** Сессия пользователя */
  session?: Maybe<SessionType>;
};

export type LogEntryTypeConnection = {
  __typename?: 'LogEntryTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LogEntryTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `LogEntryType` and its cursor. */
export type LogEntryTypeEdge = {
  __typename?: 'LogEntryTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<LogEntryType>;
};

/** Лог запроса. */
export type LogRequestType = Node & {
  __typename?: 'LogRequestType';
  /** Дата и время запроса */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Страница, с которой отправлен запрос */
  page?: Maybe<Scalars['String']>;
  /** Сессия пользователя */
  session?: Maybe<SessionType>;
  /** Время работы страницы */
  time: Scalars['Float'];
};

export type LogRequestTypeConnection = {
  __typename?: 'LogRequestTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LogRequestTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `LogRequestType` and its cursor. */
export type LogRequestTypeEdge = {
  __typename?: 'LogRequestTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<LogRequestType>;
};

export type LogoutMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор сессии */
  sessionId: Scalars['ID'];
};

/** Мутация выхода */
export type LogoutMutationPayload = {
  __typename?: 'LogoutMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Оповещение */
export type MailingType = {
  __typename?: 'MailingType';
  /** Адрес отправки */
  address: Scalars['String'];
  /** Массив прикрепленных файлов */
  attachments?: Maybe<Scalars['JSONString']>;
  /** Дата добавления */
  createdAt: Scalars['DateTime'];
  /** Средства отправки */
  dispatchers: Scalars['JSONString'];
  /** Заголовок сообщения */
  header: Scalars['String'];
  id: Scalars['ID'];
  /** Текст сообщения */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

/** An enumeration. */
export type MemberRole =
  /** participant */
  | 'A_0'
  /** administrator */
  | 'A_1';

/** Участники чата */
export type MemberType = Node & {
  __typename?: 'MemberType';
  /** Чат */
  chat?: Maybe<ChatType>;
  /** Дата добавления */
  createdAt: Scalars['DateTime'];
  /** Исключен ли пользователь из чата */
  excluded: Scalars['Boolean'];
  /** Избранный чат */
  favorite: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Уведомлять о сообщениях */
  notification: Scalars['Boolean'];
  /** Роль пользователя */
  role: MemberRole;
  /** Дата изменения */
  updatedAt: Scalars['DateTime'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

export type MemberTypeConnection = {
  __typename?: 'MemberTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MemberTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `MemberType` and its cursor. */
export type MemberTypeEdge = {
  __typename?: 'MemberTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<MemberType>;
};

/**
 * Подписка на добавления чатов
 *     - member_id - идентификатор объекта
 */
export type MembersSubscription = {
  __typename?: 'MembersSubscription';
  /** Действие пользователя */
  action: ConsumerActionType;
  /** Идентификатор объекта */
  id: Scalars['ID'];
  member?: Maybe<MemberType>;
  update?: Maybe<Scalars['Boolean']>;
};

/** Сообщение пользователя */
export type MessageType = {
  __typename?: 'MessageType';
  /** Прикрепленные файлы */
  attachedFiles: Array<AttachedFileType>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Пересланные сообщения */
  forwarded?: Maybe<Array<Maybe<MessageType>>>;
  id: Scalars['ID'];
  /** Закреплено ли сообщение */
  pinned: Scalars['Boolean'];
  /** Текст сообщения */
  text: Scalars['String'];
  /** Дата изменения */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, создавший сообщение */
  user?: Maybe<UserType>;
};

/** Методическое обеспечение дисциплины. */
export type MethodologicalSupportInputType = {
  /** Подпись файла */
  name: Scalars['String'];
  /** Файл */
  src: Scalars['Upload'];
};

/** Методическое обеспечение. */
export type MethodologicalSupportType = Node & {
  __typename?: 'MethodologicalSupportType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Дисциплина */
  discipline: DisciplineType;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Подпись файла */
  name: Scalars['String'];
  /** Файл */
  src?: Maybe<Scalars['String']>;
  /** Электронная подпись файла */
  srcSign?: Maybe<Scalars['String']>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

export type MethodologicalSupportTypeConnection = {
  __typename?: 'MethodologicalSupportTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MethodologicalSupportTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `MethodologicalSupportType` and its cursor. */
export type MethodologicalSupportTypeEdge = {
  __typename?: 'MethodologicalSupportTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<MethodologicalSupportType>;
};

/** Мутации на изменение чего-либо */
export type Mutation = {
  __typename?: 'Mutation';
  /** Добавление публикации. */
  addArticle: AddArticleMutationPayload;
  /** Добавление публикации из файла bibtex. */
  addArticleFromBibtex: AddArticleFromBibtexMutationPayload;
  /** Добавление аттестации */
  addAttestation: AddAttestationMutationPayload;
  /** Мутация для добавления категории */
  addCategory: AddCategoryMutationPayload;
  /** Добавление чата */
  addChat: AddChatMutationPayload;
  /** Мутация добавления дочернего тега */
  addChildItemProp: AddChildItemPropMutationPayload;
  /** Добавление компетенций дисциплины */
  addCompetences: AddCompetencesMutationPayload;
  /** Добавление курсов */
  addCourses: AddCoursesMutationPayload;
  /** Добавление направления подготовки */
  addDirection: AddDirectionMutationPayload;
  /** Добавление дисциплины. */
  addDiscipline: AddDisciplineMutationPayload;
  /** Добавление методического обеспечения дисциплины. */
  addDisciplineMethodologicalSupports: AddDisciplineMethodologicalSupportsMutationPayload;
  /**
   * Добавление файлов дисциплин (аннотаций и рабочих программ)
   *
   * Примеры названий файлов в архиве:
   * анн_13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf;
   * 13.03.02_ЭЭ_РЭМС_Б1.В.07_Теория автоматического управления_о_2019.pdf.
   * Если дисциплина существует, то к ней прикрепится файл, иначе ошибка.
   */
  addDisciplinesFiles: AddDisciplinesFilesMutationPayload;
  /** Добавление формы обучения */
  addEduForm: AddEduFormMutationPayload;
  /** Добавление часов по плану дисциплины */
  addEduHours: AddEduHoursMutationPayload;
  /** Добавление образовательной программы. */
  addEduProgram: AddEduProgramMutationPayload;
  /** Добавление образовательной программы из файла plx. */
  addEduProgramFromPlx: AddEduProgramFromPlxMutationPayload;
  /**
   * Добавление методического обеспечения дисциплин одной образовательной программы
   *
   * Пример названия файла в архиве: Б1.О.03_Философия.docx.
   */
  addEduProgramMethodologicalSupports: AddEduProgramMethodologicalSupportsMutationPayload;
  /** Добавление образовательных программ. */
  addEduPrograms: AddEduProgramsMutationPayload;
  /** Мутация для загрузки файлов */
  addFile: AddFileMutationPayload;
  /** Добавление прикрепленных файлов из файлов */
  addFileAttachments: AddFileAttachmentsMutationPayload;
  /** Добавление типа загружаемых файлов в портфолио */
  addFileKind: AddFileKindMutationPayload;
  /** Мутация для добавления группы. */
  addGroup: AddGroupMutationPayload;
  /** Добавление раздаточного материала */
  addHandout: AddHandoutMutationPayload;
  /** Мутация добавления структуры */
  addItemPropContainer: AddItemPropContainerMutationPayload;
  /** Добавление пользователя в группу */
  addJob: AddJobMutationPayload;
  /** Добавление должности пользователя в группе */
  addJobPost: AddJobPostMutationPayload;
  /** Добавление истории статусов должности пользователя на месте работы */
  addJobPostStatusHistory: AddJobPostStatusHistoryMutationPayload;
  /** Добавления сообщения */
  addMessage: AddMessageMutationPayload;
  /** Добавление методического обеспечения */
  addMethodologicalSupport: AddMethodologicalSupportMutationPayload;
  /** Добавление страницы */
  addPage: AddPageMutationPayload;
  /** Добавление периода */
  addPeriod: AddPeriodMutationPayload;
  /** Добавление файла в портфолио */
  addPortfolioFile: AddPortfolioFileMutationPayload;
  /** Добавление прикрепленных файлов из файлов портофолио */
  addPortfolioFileAttachments: AddPortfolioFileAttachmentsMutationPayload;
  /** Добавление файлов в портфолио */
  addPortfolioFiles: AddPortfolioFilesMutationPayload;
  /** Мутация для добавления записи профиля. */
  addProfile: AddProfileMutationPayload;
  /** Добавление регистрации */
  addRegistration: AddRegistrationMutationPayload;
  /** Мутация добавления строки в таблицу */
  addRow: AddRowMutationPayload;
  /** Добавление секции */
  addSectionFiles: AddSectionFilesMutationPayload;
  /** Добавление секции */
  addSectionGallery: AddSectionGalleryMutationPayload;
  /** Добавление секции */
  addSectionText: AddSectionTextMutationPayload;
  /** Мутация добавления подраздела */
  addSubsection: AddSubsectionMutationPayload;
  /** Добавление тега */
  addTag: AddTagMutationPayload;
  /** Добавление группы пользователей */
  addTeam: AddTeamMutationPayload;
  /** Изменение публикации. */
  changeArticle: ChangeArticleMutationPayload;
  /** Изменение аттестации */
  changeAttestation: ChangeAttestationMutationPayload;
  /** Мутация для изменения аватара пользователя. */
  changeAvatar: ChangeAvatarMutationPayload;
  /** Мутации для изменения категории */
  changeCategory: ChangeCategoryMutationPayload;
  /** Мутация для изменения аватара категории */
  changeCategoryAvatar: ChangeCategoryAvatarMutationPayload;
  /** Мутация для изменения родителя */
  changeCategoryParent: ChangeCategoryParentMutationPayload;
  /** Мутация для изменения порядка следования вывода категорий */
  changeCategoryPosition: ChangeCategoryPositionMutationPayload;
  /** Мутация изменения дочернего тега */
  changeChildItemProp: ChangeChildItemPropMutationPayload;
  /** Изменение курсов */
  changeCourses: ChangeCoursesMutationPayload;
  /** Изменение направления подготовки */
  changeDirection: ChangeDirectionMutationPayload;
  /** Изменение дисциплины */
  changeDiscipline: ChangeDisciplineMutationPayload;
  /** Изменение формы обучения */
  changeEduForm: ChangeEduFormMutationPayload;
  /** Изменение образовательной программы. */
  changeEduProgram: ChangeEduProgramMutationPayload;
  /** Мутация для изменения файла */
  changeFile: ChangeFileMutationPayload;
  /** Изменение типа загружаемых файлов в портфолио */
  changeFileKind: ChangeFileKindMutationPayload;
  /** Мутация для изменения имени группы. */
  changeGroupName: ChangeGroupNameMutationPayload;
  /** Мутация для изменения привилегий группы. */
  changeGroupPermissions: ChangeGroupPermissionsMutationPayload;
  /** Изменение раздаточного материала */
  changeHandout: ChangeHandoutMutationPayload;
  /** Мутация изменения контейнера */
  changeItemPropContainer: ChangeItemPropContainerMutationPayload;
  /** Изменение свойств чата */
  changeMemberProperty: ChangeMemberPropertyMutationPayload;
  /** Прочтение сообщений */
  changeMessageState: ChangeMessageStateMutationPayload;
  /** Изменение методического обеспечения. */
  changeMethodologicalSupport: ChangeMethodologicalSupportMutationPayload;
  /** Изменение свойств уведомления */
  changeNotification: ChangeNotificationMutationPayload;
  /** Изменение свойств уведомлений */
  changeNotifications: ChangeNotificationsMutationPayload;
  /** Изменение аватара на странице */
  changePageAvatar: ChangePageAvatarMutationPayload;
  /** Изменение boolean свойств страницы */
  changePageBooleanProperty: ChangePageBooleanPropertyMutationPayload;
  /** Изменение категории страницы */
  changePageCategory: ChangePageCategoryMutationPayload;
  /** Изменение типа страницы */
  changePageKind: ChangePageKindMutationPayload;
  /** Изменения тегов страницы */
  changePageTags: ChangePageTagsMutationPayload;
  /** Изменение названия страницы */
  changePageTitle: ChangePageTitleMutationPayload;
  /** Мутация для изменения пароля пользователя. */
  changePassword: ChangePasswordMutationPayload;
  /** Изменение периода */
  changePeriod: ChangePeriodMutationPayload;
  /** Мутация на изменение значения профиля. */
  changeProfileValue: ChangeProfileValueMutationPayload;
  /** Матция для изменения видимости. */
  changeProfileVisibility: ChangeProfileVisibilityMutationPayload;
  /** Изменение регистрации */
  changeRegistration: ChangeRegistrationMutationPayload;
  /** Мутация изменения данных */
  changeRow: ChangeRowMutationPayload;
  /** Изменение текста секции */
  changeSectionFiles: ChangeSectionFilesMutationPayload;
  /** Изменение текста секции */
  changeSectionGallery: ChangeSectionGalleryMutationPayload;
  /** Изменение текста секции */
  changeSectionText: ChangeSectionTextMutationPayload;
  /** Мутация для изменения настроек */
  changeSettings: ChangeSettingsMutationPayload;
  /** Мутация изменения подраздела */
  changeSubsection: ChangeSubsectionMutationPayload;
  /** Изменения группы пользователей */
  changeTeam: ChangeTeamMutationPayload;
  /** Мягкое удаление или восстановление группы пользователей */
  changeTeamDelete: ChangeTeamDeleteMutationPayload;
  /** Изменение образовательной программы для группы пользователей */
  changeTeamEduProgram: ChangeTeamEduProgramMutationPayload;
  /** Изменение ответственных пользователей в группе */
  changeTeamResponsibleUsers: ChangeTeamResponsibleUsersMutationPayload;
  /** Мутация для изменения групп конкретного пользователя. */
  changeUserGroups: ChangeUserGroupsMutationPayload;
  /** Мутация для изменения полей пользователя. */
  changeUserProps: ChangeUserPropsMutationPayload;
  /** Подтверждение кода. */
  confirmEmail: ConfirmEmailMutationPayload;
  /** Подтверждение файла портфолио */
  confirmPortfolioFile: ConfirmPortfolioFileMutationPayload;
  /** Удаление публикации. */
  deleteArticle: DeleteArticleMutationPayload;
  /** Удаление прикрепленных файлов */
  deleteAttachments: DeleteAttachmentsMutationPayload;
  /** Удаление аттестации */
  deleteAttestation: DeleteAttestationMutationPayload;
  /** Мутация для удаления категории */
  deleteCategory: DeleteCategoryMutationPayload;
  /** Удаление записи модели "ChildItemProp" */
  deleteChildItemProp: DeleteChildItemPropMutationPayload;
  /** Удаление компетенций */
  deleteCompetence: DeleteCompetenceMutationPayload;
  /** Удаление курса */
  deleteCourse: DeleteCourseMutationPayload;
  /** Удаление всех курсов группы */
  deleteCourses: DeleteCoursesMutationPayload;
  /** Удаление записи модели "Direction" */
  deleteDirection: DeleteDirectionMutationPayload;
  /** Удаление дисциплины */
  deleteDiscipline: DeleteDisciplineMutationPayload;
  /** Удаление записи модели "EduForm" */
  deleteEduForm: DeleteEduFormMutationPayload;
  /** Удаление часов по плану */
  deleteEduHour: DeleteEduHourMutationPayload;
  /** Удаление образовательной программы. */
  deleteEduProgram: DeleteEduProgramMutationPayload;
  /** Мутация для полного удаления файла */
  deleteFile: DeleteFileMutationPayload;
  /** Удаление записи модели "FileKind" */
  deleteFileKind: DeleteFileKindMutationPayload;
  /** Мутация для удаления группы. */
  deleteGroup: DeleteGroupMutationPayload;
  /** Удаление раздаточных материалов */
  deleteHandouts: DeleteHandoutsMutationPayload;
  /** Удаление записи модели "ItemPropContainer" */
  deleteItemPropContainer: DeleteItemPropContainerMutationPayload;
  /** Удаление записи модели "Job" */
  deleteJob: DeleteJobMutationPayload;
  /** Удаление записи модели "JobPost" */
  deleteJobPost: DeleteJobPostMutationPayload;
  /** Удаление чата */
  deleteMember: DeleteMemberMutationPayload;
  /** Удаления сообщения */
  deleteMessages: DeleteMessagesPayload;
  /** Удаление методического обеспечения */
  deleteMethodologicalSupport: DeleteMethodologicalSupportMutationPayload;
  /** Удаление уведомления */
  deleteNotice: DeleteNoticeMutationPayload;
  /** Удаление страницы */
  deletePage: DeletePageMutationPayload;
  /** Удаление периода */
  deletePeriod: DeletePeriodMutationPayload;
  /** Удаление записи модели "PortfolioFile" */
  deletePortfolioFile: DeletePortfolioFileMutationPayload;
  /** Мутация для удаления записи профиля. */
  deleteProfile: DeleteProfileMutationPayload;
  /** Удаление регистрации */
  deleteRegistration: DeleteRegistrationMutationPayload;
  /** Мутация удаления данных */
  deleteRow: DeleteRowMutationPayload;
  /** Удаление секции */
  deleteSection: DeleteSectionMutationPayload;
  /** Мутация для удаления всех сессий кроме текущей. */
  deleteSessions: DeleteSessionsMutationPayload;
  /** Удаление записи модели "Subsection" */
  deleteSubsection: DeleteSubsectionMutationPayload;
  /** Удаление записи модели "Team" */
  deleteTeam: DeleteTeamMutationPayload;
  /** Добавление сообщения в избранные */
  favoriteMessage: FavoriteMessagePayload;
  /** Генерация паролей заданным пользователям */
  generateTeamNewPasswords: GenerateTeamNewPasswordsMutationPayload;
  /** Мутация для получения токена авторизации. */
  getToken: GetTokenMutationPayload;
  /** Мутация выхода */
  logout: LogoutMutationPayload;
  /** Закрепления сообщения */
  pinnedMessage: PinnedMessagePayload;
  /** Мутация для сброса пароля пользователя. */
  recoveryPassword: RecoveryPasswordMutationPayload;
  /** Мутация регистрации новых пользователей. */
  register: RegisterMutationPayload;
  /** Отправка email с кодом на электронную почту. */
  requestCode: RequestCodeMutationPayload;
  /** Мутация для сброса настроек по умолчанию */
  resetSettings: ResetSettingsMutationPayload;
  /** Мутация для сброса пароля пользователя. */
  restorePassword: RestorePasswordMutationPayload;
  /** Отправка письма поддержки */
  supportSubmit: SupportSubmitMutationPayload;
  /** Выгрузка публикаций в различных форматах. */
  unloadArticles: UnloadArticlesMutationPayload;
  /** Выгрузка данных в различных форматах. */
  unloadEduPrograms: UnloadEduProgramsMutationPayload;
  /** Выгрузка пользователей группы  */
  unloadUsers: UnloadUsersMutationPayload;
  /** Загрузка существующих пользователей в группу из файла */
  uploadJobs: UploadJobsMutationPayload;
  /** Загрузка новых пользователей в группу из файла */
  uploadJobsUser: UploadJobsUserMutationPayload;
  /** Загрузка групп пользователей */
  uploadTeams: UploadTeamsMutationPayload;
  /** Мутация для загрузки пользователей из файла excel | csv. */
  uploadUsers: UploadUsersMutationPayload;
};

/** Мутации на изменение чего-либо */
export type MutationAddArticleArgs = {
  input: AddArticleMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddArticleFromBibtexArgs = {
  input: AddArticleFromBibtexMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddAttestationArgs = {
  input: AddAttestationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddCategoryArgs = {
  input: AddCategoryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddChatArgs = {
  input: AddChatMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddChildItemPropArgs = {
  input: AddChildItemPropMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddCompetencesArgs = {
  input: AddCompetencesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddCoursesArgs = {
  input: AddCoursesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddDirectionArgs = {
  input: AddDirectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddDisciplineArgs = {
  input: AddDisciplineMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddDisciplineMethodologicalSupportsArgs = {
  input: AddDisciplineMethodologicalSupportsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddDisciplinesFilesArgs = {
  input: AddDisciplinesFilesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduFormArgs = {
  input: AddEduFormMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduHoursArgs = {
  input: AddEduHoursMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduProgramArgs = {
  input: AddEduProgramMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduProgramFromPlxArgs = {
  input: AddEduProgramFromPlxMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduProgramMethodologicalSupportsArgs = {
  input: AddEduProgramMethodologicalSupportsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddEduProgramsArgs = {
  input: AddEduProgramsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddFileArgs = {
  input: AddFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddFileAttachmentsArgs = {
  input: AddFileAttachmentsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddFileKindArgs = {
  input: AddFileKindMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddGroupArgs = {
  input: AddGroupMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddHandoutArgs = {
  input: AddHandoutMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddItemPropContainerArgs = {
  input: AddItemPropContainerMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddJobArgs = {
  input: AddJobMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddJobPostArgs = {
  input: AddJobPostMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddJobPostStatusHistoryArgs = {
  input: AddJobPostStatusHistoryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddMessageArgs = {
  input: AddMessageMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddMethodologicalSupportArgs = {
  input: AddMethodologicalSupportMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddPageArgs = {
  input: AddPageMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddPeriodArgs = {
  input: AddPeriodMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddPortfolioFileArgs = {
  input: AddPortfolioFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddPortfolioFileAttachmentsArgs = {
  input: AddPortfolioFileAttachmentsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddPortfolioFilesArgs = {
  input: AddPortfolioFilesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddProfileArgs = {
  input: AddProfileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddRegistrationArgs = {
  input: AddRegistrationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddRowArgs = {
  input: AddRowMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddSectionFilesArgs = {
  input: AddSectionFilesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddSectionGalleryArgs = {
  input: AddSectionGalleryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddSectionTextArgs = {
  input: AddSectionTextMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddSubsectionArgs = {
  input: AddSubsectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddTagArgs = {
  input: AddTagMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationAddTeamArgs = {
  input: AddTeamMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeArticleArgs = {
  input: ChangeArticleMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeAttestationArgs = {
  input: ChangeAttestationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeAvatarArgs = {
  input: ChangeAvatarMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeCategoryArgs = {
  input: ChangeCategoryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeCategoryAvatarArgs = {
  input: ChangeCategoryAvatarMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeCategoryParentArgs = {
  input: ChangeCategoryParentMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeCategoryPositionArgs = {
  input: ChangeCategoryPositionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeChildItemPropArgs = {
  input: ChangeChildItemPropMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeCoursesArgs = {
  input: ChangeCoursesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeDirectionArgs = {
  input: ChangeDirectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeDisciplineArgs = {
  input: ChangeDisciplineMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeEduFormArgs = {
  input: ChangeEduFormMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeEduProgramArgs = {
  input: ChangeEduProgramMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeFileArgs = {
  input: ChangeFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeFileKindArgs = {
  input: ChangeFileKindMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeGroupNameArgs = {
  input: ChangeGroupNameMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeGroupPermissionsArgs = {
  input: ChangeGroupPermissionsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeHandoutArgs = {
  input: ChangeHandoutMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeItemPropContainerArgs = {
  input: ChangeItemPropContainerMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeMemberPropertyArgs = {
  input: ChangeMemberPropertyMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeMessageStateArgs = {
  input: ChangeMessageStateMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeMethodologicalSupportArgs = {
  input: ChangeMethodologicalSupportMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeNotificationArgs = {
  input: ChangeNotificationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeNotificationsArgs = {
  input: ChangeNotificationsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageAvatarArgs = {
  input: ChangePageAvatarMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageBooleanPropertyArgs = {
  input: ChangePageBooleanPropertyMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageCategoryArgs = {
  input: ChangePageCategoryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageKindArgs = {
  input: ChangePageKindMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageTagsArgs = {
  input: ChangePageTagsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePageTitleArgs = {
  input: ChangePageTitleMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePasswordArgs = {
  input: ChangePasswordMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangePeriodArgs = {
  input: ChangePeriodMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeProfileValueArgs = {
  input: ChangeProfileValueMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeProfileVisibilityArgs = {
  input: ChangeProfileVisibilityMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeRegistrationArgs = {
  input: ChangeRegistrationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeRowArgs = {
  input: ChangeRowMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeSectionFilesArgs = {
  input: ChangeSectionFilesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeSectionGalleryArgs = {
  input: ChangeSectionGalleryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeSectionTextArgs = {
  input: ChangeSectionTextMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeSettingsArgs = {
  input: ChangeSettingsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeSubsectionArgs = {
  input: ChangeSubsectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeTeamArgs = {
  input: ChangeTeamMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeTeamDeleteArgs = {
  input: ChangeTeamDeleteMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeTeamEduProgramArgs = {
  input: ChangeTeamEduProgramMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeTeamResponsibleUsersArgs = {
  input: ChangeTeamResponsibleUsersMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeUserGroupsArgs = {
  input: ChangeUserGroupsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationChangeUserPropsArgs = {
  input: ChangeUserPropsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationConfirmEmailArgs = {
  input: ConfirmEmailMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationConfirmPortfolioFileArgs = {
  input: ConfirmPortfolioFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteArticleArgs = {
  input: DeleteArticleMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteAttachmentsArgs = {
  input: DeleteAttachmentsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteAttestationArgs = {
  input: DeleteAttestationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteChildItemPropArgs = {
  input: DeleteChildItemPropMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteCompetenceArgs = {
  input: DeleteCompetenceMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteCourseArgs = {
  input: DeleteCourseMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteCoursesArgs = {
  input: DeleteCoursesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteDirectionArgs = {
  input: DeleteDirectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteDisciplineArgs = {
  input: DeleteDisciplineMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteEduFormArgs = {
  input: DeleteEduFormMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteEduHourArgs = {
  input: DeleteEduHourMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteEduProgramArgs = {
  input: DeleteEduProgramMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteFileArgs = {
  input: DeleteFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteFileKindArgs = {
  input: DeleteFileKindMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteGroupArgs = {
  input: DeleteGroupMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteHandoutsArgs = {
  input: DeleteHandoutsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteItemPropContainerArgs = {
  input: DeleteItemPropContainerMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteJobArgs = {
  input: DeleteJobMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteJobPostArgs = {
  input: DeleteJobPostMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteMemberArgs = {
  input: DeleteMemberMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteMessagesArgs = {
  input: DeleteMessagesInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteMethodologicalSupportArgs = {
  input: DeleteMethodologicalSupportMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteNoticeArgs = {
  input: DeleteNoticeMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeletePageArgs = {
  input: DeletePageMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeletePeriodArgs = {
  input: DeletePeriodMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeletePortfolioFileArgs = {
  input: DeletePortfolioFileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteProfileArgs = {
  input: DeleteProfileMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteRegistrationArgs = {
  input: DeleteRegistrationMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteRowArgs = {
  input: DeleteRowMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteSectionArgs = {
  input: DeleteSectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteSessionsArgs = {
  input: DeleteSessionsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteSubsectionArgs = {
  input: DeleteSubsectionMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationDeleteTeamArgs = {
  input: DeleteTeamMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationFavoriteMessageArgs = {
  input: FavoriteMessageInput;
};

/** Мутации на изменение чего-либо */
export type MutationGenerateTeamNewPasswordsArgs = {
  input: GenerateTeamNewPasswordsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationGetTokenArgs = {
  input: GetTokenMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationLogoutArgs = {
  input: LogoutMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationPinnedMessageArgs = {
  input: PinnedMessageInput;
};

/** Мутации на изменение чего-либо */
export type MutationRecoveryPasswordArgs = {
  input: RecoveryPasswordMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationRegisterArgs = {
  input: RegisterMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationRequestCodeArgs = {
  input: RequestCodeMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationResetSettingsArgs = {
  input: ResetSettingsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationRestorePasswordArgs = {
  input: RestorePasswordMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationSupportSubmitArgs = {
  input: SupportSubmitMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUnloadArticlesArgs = {
  input: UnloadArticlesMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUnloadEduProgramsArgs = {
  input: UnloadEduProgramsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUnloadUsersArgs = {
  input: UnloadUsersMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUploadJobsArgs = {
  input: UploadJobsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUploadJobsUserArgs = {
  input: UploadJobsUserMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUploadTeamsArgs = {
  input: UploadTeamsMutationInput;
};

/** Мутации на изменение чего-либо */
export type MutationUploadUsersArgs = {
  input: UploadUsersMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** Уведомление без дополнительного содержимого */
export type NoticeEmptyType = NoticeInterface & {
  __typename?: 'NoticeEmptyType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип уведомления */
  kind: Scalars['Int'];
  /** Идентификатор объекта */
  objectId: Scalars['String'];
  /** Полезная нагрузка */
  payload: Scalars['String'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

/** Переопределение стандартного интерфейса уведомлений. */
export type NoticeInterface = {
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип уведомления */
  kind: Scalars['Int'];
  /** Идентификатор объекта */
  objectId: Scalars['String'];
  /** Полезная нагрузка */
  payload: Scalars['String'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

/** An enumeration. */
export type NoticeKind =
  /** info */
  | 'A_0'
  /** page */
  | 'A_1'
  /** comment */
  | 'A_2'
  /** message */
  | 'A_3'
  /** task */
  | 'A_4'
  /** billing */
  | 'A_5'
  /** paid */
  | 'A_6'
  /** mailing */
  | 'A_7'
  /** happy_birthday */
  | 'A_8';

/** Уведомление типа 'Пришло уведомление'. */
export type NoticeMailingType = NoticeInterface & {
  __typename?: 'NoticeMailingType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип уведомления */
  kind: Scalars['Int'];
  /** Оповещение пользователя */
  mailing?: Maybe<MailingType>;
  /** Идентификатор объекта */
  objectId: Scalars['String'];
  /** Полезная нагрузка */
  payload: Scalars['String'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

/** Уведомление типа 'Добавлена новая страница' */
export type NoticePageType = NoticeInterface & {
  __typename?: 'NoticePageType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип уведомления */
  kind: Scalars['Int'];
  /** Идентификатор объекта */
  objectId: Scalars['String'];
  /** Страница */
  page?: Maybe<PageType>;
  /** Полезная нагрузка */
  payload: Scalars['String'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

/** Уведомление */
export type NoticeType = Node & {
  __typename?: 'NoticeType';
  /** Дата добавления */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип уведомления */
  kind: NoticeKind;
  /** Идентификатор объекта */
  objectId: Scalars['String'];
  /** Полезная нагрузка */
  payload: Scalars['String'];
  /** Пользователь */
  user?: Maybe<UserType>;
};

export type NoticeTypeConnection = {
  __typename?: 'NoticeTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<NoticeTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `NoticeType` and its cursor. */
export type NoticeTypeEdge = {
  __typename?: 'NoticeTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<NoticeType>;
};

/** Оповещение пользователей */
export type NotificationType = Node & {
  __typename?: 'NotificationType';
  /** Дата добавления */
  createdAt: Scalars['DateTime'];
  /** Скрыть уведомление */
  hide: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Уведомление */
  notice: NoticeInterface;
  /** Прочитано ли уведомление */
  read: Scalars['Boolean'];
  /** Пользователь */
  user: UserType;
};

export type NotificationTypeConnection = {
  __typename?: 'NotificationTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<NotificationTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `NotificationType` and its cursor. */
export type NotificationTypeEdge = {
  __typename?: 'NotificationTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<NotificationType>;
};

/** Подписка на обновление событий. */
export type NotificationsSubscription = {
  __typename?: 'NotificationsSubscription';
  /** Действие пользователя */
  action: ConsumerActionType;
  /** Идентификатор объекта */
  id: Scalars['ID'];
  notification?: Maybe<NotificationType>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** Тип страницы */
export type PageKindType = {
  __typename?: 'PageKindType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Странички */
  pages: Array<Maybe<PageType>>;
  /** Сегментные элементы */
  segmentElements: Array<Maybe<SegmentElementType>>;
};

/** Страница */
export type PageType = Node & {
  __typename?: 'PageType';
  /** Аватар */
  avatar?: Maybe<Scalars['String']>;
  /** Категория */
  category: CategoryType;
  /** Комментарии */
  comments: CommentTypeConnection;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Скрываем ли страницу */
  hide: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип */
  kind?: Maybe<PageKindType>;
  /** Показывать параллакс или нет */
  parallax: Scalars['Boolean'];
  /** Приоритет */
  priority: Scalars['Boolean'];
  /** Секции */
  sections: Array<Maybe<SectionInterface>>;
  /** Подпись страницы */
  signature?: Maybe<Scalars['String']>;
  /** Теги на странице */
  tags: Array<Maybe<TagType>>;
  /** Заголовок */
  title: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, создавший страницу */
  user?: Maybe<UserType>;
  /** Количество просмотров */
  views: Scalars['Int'];
};

/** Страница */
export type PageTypeCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  text_Icontains?: InputMaybe<Scalars['String']>;
};

export type PageTypeConnection = {
  __typename?: 'PageTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PageTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `PageType` and its cursor. */
export type PageTypeEdge = {
  __typename?: 'PageTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PageType>;
};

/** Период, учебные недели, 1 - 18, допуск, зачет, экзамен, кр, кр, кн1, кн2. */
export type PeriodType = {
  __typename?: 'PeriodType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Возможные учеты студентов на занятиях */
  registrations: Array<RegistrationType>;
  /** Короткое название */
  shortName: Scalars['String'];
  /** Шаблон doc */
  templateDoc?: Maybe<Scalars['String']>;
  /** Шаблон xml */
  templateXml?: Maybe<Scalars['String']>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

/** Привилегия пользователя или группы пользователей. */
export type PermissionType = {
  __typename?: 'PermissionType';
  codename: Scalars['String'];
  /** Тип модели Django */
  contentType: ContentTypeType;
  /** Группы */
  groups?: Maybe<GroupType>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Интерфейс разрешений на действия с объектом модели */
export type PermissionsInterface = {
  /** Есть ли права на изменение объекта модели */
  canChange: Scalars['Boolean'];
  /** Есть ли права на удаление объекта модели */
  canDelete: Scalars['Boolean'];
};

export type PinnedMessageInput = {
  /** Идентификатор чата */
  chatId: Scalars['ID'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор сообщения */
  messageId: Scalars['ID'];
};

/** Закрепления сообщения  */
export type PinnedMessagePayload = {
  __typename?: 'PinnedMessagePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Закреленное сообщение */
  message?: Maybe<MessageType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Информация по показателям для типов различных показателей. */
export type PointStatisticsType = {
  __typename?: 'PointStatisticsType';
  /** Название */
  name: Scalars['String'];
  /** Текущее значение */
  value: Scalars['Int'];
};

/** Точка статистики. */
export type PointTotalStatisticsType = {
  __typename?: 'PointTotalStatisticsType';
  /** Название */
  name: Scalars['String'];
  /** Общее значение */
  total: Scalars['Int'];
  /** Текущее значение */
  value: Scalars['Int'];
};

/** Файл в портфолио. */
export type PortfolioFileType = Node & {
  __typename?: 'PortfolioFileType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Описание файла в портфолио */
  describe: Scalars['String'];
  /** Дисциплина */
  discipline?: Maybe<DisciplineType>;
  /** Привязанный к портфолио файл */
  file: FileType;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Тип файла из портфолио */
  kind?: Maybe<FileKindType>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь, который подтверждает правильность файла, занесенного в портфолио */
  user?: Maybe<UserType>;
};

export type PortfolioFileTypeConnection = {
  __typename?: 'PortfolioFileTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PortfolioFileTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `PortfolioFileType` and its cursor. */
export type PortfolioFileTypeEdge = {
  __typename?: 'PortfolioFileTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PortfolioFileType>;
};

/** Занимаемая должность */
export type PostType = {
  __typename?: 'PostType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Возможные статусы */
  statuses: Array<JobPostStatusType>;
};

/** An enumeration. */
export type ProfileKind =
  /** text */
  | 'A_0'
  /** date */
  | 'A_1'
  /** bool */
  | 'A_2'
  /** file */
  | 'A_3'
  /** choice */
  | 'A_4';

/** Тип параметров пользователей. */
export type ProfileType = {
  __typename?: 'ProfileType';
  /** Доступные дочерние поля */
  available: Array<ProfileType>;
  /** Дочерние */
  children: Array<ProfileType>;
  /** Уникальный код настройки */
  code: Scalars['String'];
  id: Scalars['ID'];
  /** Тип настройки */
  kind: ProfileKind;
  /** Название настройки */
  name: Scalars['String'];
  /** Позиция */
  position: Scalars['Int'];
  /** Значение пользователя */
  value?: Maybe<ProfileValueType>;
};

/** Значение параметров пользователей. */
export type ProfileValueType = {
  __typename?: 'ProfileValueType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Профиль */
  profile: ProfileType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь */
  user: UserType;
  /** Значение хранимой информации */
  value: Scalars['String'];
  /** Доступность настройки */
  visibility: Scalars['Boolean'];
};

/** Схема запросов данных */
export type Query = {
  __typename?: 'Query';
  _debug?: Maybe<DjangoDebug>;
  /** Статистика активности */
  activeStatistics: ActiveStatisticsType;
  /** Приложения */
  applications: Array<ApplicationType>;
  /** Типы индексирования публикаций */
  articleIndexes: Array<ArticleIndexType>;
  /** Виды публикаций */
  articleKinds: Array<ArticleKindType>;
  /** Публикации */
  articles: ArticleTypeConnection;
  /** Авторы */
  articlesAuthors: AuthorTypeConnection;
  /** Все авторы публикаций */
  articlesUsers: UserTypeConnection;
  /** Все года публикаций */
  articlesYears: Array<Maybe<Scalars['Int']>>;
  /** Файлы */
  attachedFiles: Array<AttachedFileType>;
  /** Тип блока образовательной программы */
  blockKinds: Array<BlockKindType>;
  /** Категории */
  categories: CategoryTypeConnection;
  /** Категория */
  category: CategoryType;
  /** Сообщения в чатах */
  chatMessages: ChatMessageTypeConnection;
  /** Компетенции */
  competences: CompetenceTypeConnection;
  /** Курс */
  course: CourseType;
  /** Раздаточный материал курса */
  courseHandouts: HandoutTypeConnection;
  /** Курсы группы пользователей */
  courses: CourseTypeConnection;
  /** Направления подготовки */
  directions: Array<DirectionType>;
  /** Дисциплина */
  discipline: DisciplineType;
  /** Компетенция */
  disciplineCompetences: Array<Maybe<CompetenceType>>;
  /** Часы */
  disciplineEduHours: Array<Maybe<EduHoursType>>;
  /** Тип дисциплины */
  disciplineKinds: Array<DisciplineKindType>;
  /** Часы дисциплины семестра по плану */
  disciplineSemesterEduHours?: Maybe<Array<EduHoursType>>;
  /** Формы представления дисциплины */
  disciplineViews: Array<DisciplineViewType>;
  /** Дисциплины */
  disciplines: DisciplineTypeConnection;
  /** Цикл образовательных программ */
  eduCycles: Array<EduCycleType>;
  /** Формы обучения */
  eduForms: Array<EduFormType>;
  /** Образовательная программа */
  eduProgram: EduProgramType;
  /** Курсы образовательной программы */
  eduProgramCoursesNumbers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Образовательные программы */
  eduPrograms: EduProgramTypeConnection;
  /** Статистика ОП */
  eduProgramsStatistics: Array<Maybe<EduProgramStatisticsType>>;
  /** Образовательные услуги */
  eduServices: Array<EduServiceType>;
  /** Типы загружаемых файлов */
  fileKinds: Array<FileKindType>;
  files: FileTypeConnection;
  groups: Array<GroupType>;
  /** Установлены ли настройки приложения */
  hasSettings: Scalars['Boolean'];
  /** Тип часов */
  hoursKinds: Array<HoursKindType>;
  logEntry: LogEntryTypeConnection;
  logRequests: LogRequestTypeConnection;
  /** Информация обо мне */
  me?: Maybe<UserType>;
  /** Участник */
  member: MemberType;
  /** Участники в чатах */
  members: MemberTypeConnection;
  /** Методическое обеспечение */
  methodologicalSupports: MethodologicalSupportTypeConnection;
  /** Источник уведомлений */
  notices: NoticeTypeConnection;
  /** Детализация уведомления */
  notification: NotificationType;
  /** Уведомления пользователя */
  notifications: NotificationTypeConnection;
  /** Страница */
  page: PageType;
  /** Получение типа страницы */
  pageKind: PageKindType;
  /** Типы страниц */
  pageKinds: Array<PageKindType>;
  /** Страницы */
  pages: PageTypeConnection;
  /** Периоды */
  periods: Array<PeriodType>;
  permissions: Array<PermissionType>;
  portfolioFiles: PortfolioFileTypeConnection;
  /** Должности */
  posts: Array<PostType>;
  /** Группы, в которые включен пользователь и по иерархии вниз с наличием курсов */
  processTeams: TeamTypeConnection;
  /** Доступные значения профиля пользователя */
  profileInformation: Array<ProfileType>;
  /** Список настроек профиля */
  profiles: Array<ProfileType>;
  /** Значение профиля пользователя */
  profilesValue: Array<ProfileValueType>;
  /** Учет студентов на занятиях */
  registrations: Array<RegistrationType>;
  /** Группы пользователей, связанные с пользователем */
  relativeTeams: TeamTypeConnection;
  /** Статистика запросов */
  requestStatistics: RequestStatisticsType;
  /** Сегменты страницы */
  segments: Array<SegmentType>;
  /** Дисциплины семестра */
  semesterDisciplines?: Maybe<Array<DisciplineType>>;
  /** Доступные сессии */
  sessions: Array<SessionType>;
  /** Настройки приложения */
  settings: Array<SettingType>;
  subsection?: Maybe<SubsectionType>;
  subsections: Array<SubsectionType>;
  /** Теги */
  tags: TagTypeConnection;
  /** Группа пользователей */
  team: TeamType;
  /** Группы пользователей */
  teams: TeamTypeConnection;
  /** Итоговый отчет по оценкам группы */
  teamsSummaryReport: Array<Maybe<TeamSummaryReportType>>;
  /** Информация о указанном пользователе */
  user?: Maybe<UserType>;
  /** Доступная информация о пользователе */
  userInformation?: Maybe<UserType>;
  /** Пользователи приложения */
  users: UserTypeConnection;
  /** Итоговый отчет по оценкам пользователей */
  usersSummaryReport: Array<Maybe<TeamSummaryReportType>>;
  /** Форма работы */
  workForms: Array<WorkFormType>;
  /** Виды работ */
  workKinds: Array<WorkKindType>;
};

/** Схема запросов данных */
export type QueryArticlesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  year?: InputMaybe<Scalars['Int']>;
  year_In?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

/** Схема запросов данных */
export type QueryArticlesAuthorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  article?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryArticlesUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  email_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  firstName_Icontains?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  lastName_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  sirName_Icontains?: InputMaybe<Scalars['String']>;
  username_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryAttachedFilesArgs = {
  chatId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  parent?: InputMaybe<Scalars['ID']>;
  parent_Isnull?: InputMaybe<Scalars['Boolean']>;
  text_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryCategoryArgs = {
  categoryId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryChatMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chat?: InputMaybe<Scalars['ID']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  favorite?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  message_Text_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryCompetencesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  excludeDisciplineId?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Схема запросов данных */
export type QueryCourseArgs = {
  courseId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryCourseHandoutsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  courseId: Scalars['ID'];
  description_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  periodId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Схема запросов данных */
export type QueryCoursesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  disciplineId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  disciplineName_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  semester?: InputMaybe<Scalars['Float']>;
  semester_Icontains?: InputMaybe<Scalars['String']>;
  teacherId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  teachersNames_Icontains?: InputMaybe<Scalars['String']>;
  teamId?: InputMaybe<Scalars['ID']>;
  workKindId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  workKindName_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryDisciplineArgs = {
  disciplineId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryDisciplineCompetencesArgs = {
  disciplineId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryDisciplineEduHoursArgs = {
  disciplineId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryDisciplineSemesterEduHoursArgs = {
  courseNumber: Scalars['Int'];
  disciplineId: Scalars['ID'];
  semesterNumber: Scalars['Int'];
};

/** Схема запросов данных */
export type QueryDisciplinesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  code_Icontains?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  eduProgramId?: InputMaybe<Scalars['ID']>;
  eduProgram_Id?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  viewId?: InputMaybe<Scalars['ID']>;
  view_Id?: InputMaybe<Scalars['Float']>;
};

/** Схема запросов данных */
export type QueryEduProgramArgs = {
  eduProgramId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryEduProgramCoursesNumbersArgs = {
  eduProgramId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryEduProgramsArgs = {
  admission_Icontains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  direction_Code_Icontains?: InputMaybe<Scalars['String']>;
  direction_Name_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Схема запросов данных */
export type QueryEduProgramsStatisticsArgs = {
  admissions: Array<InputMaybe<Scalars['String']>>;
  directions: Array<InputMaybe<Scalars['ID']>>;
  eduForms: Array<InputMaybe<Scalars['String']>>;
};

/** Схема запросов данных */
export type QueryFilesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryLogEntryArgs = {
  action_Contains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  contentType_Model_Icontains?: InputMaybe<Scalars['String']>;
  createdAt_Gt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Gte?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lte?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  objectId_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryLogRequestsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  createdAt_Gt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Gte?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lt?: InputMaybe<Scalars['DateTime']>;
  createdAt_Lte?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page_Icontains?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryMemberArgs = {
  memberId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chat?: InputMaybe<Scalars['ID']>;
  chat_Name_Icontains?: InputMaybe<Scalars['String']>;
  excluded?: InputMaybe<Scalars['Boolean']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryMethodologicalSupportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  discipline_Id?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

/** Схема запросов данных */
export type QueryNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryNotificationArgs = {
  notificationId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hide?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  notice?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryPageArgs = {
  pageId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryPageKindArgs = {
  pageKindId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryPagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  category_Id?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  kind_Id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  title_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryPortfolioFilesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  describe_Icontains?: InputMaybe<Scalars['String']>;
  disciplineId?: InputMaybe<Scalars['ID']>;
  file_UserId_In?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  first?: InputMaybe<Scalars['Int']>;
  isConfirmed?: InputMaybe<Scalars['Boolean']>;
  kindId?: InputMaybe<Scalars['Float']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Схема запросов данных */
export type QueryProcessTeamsArgs = {
  admission_Icontains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCount_Gt?: InputMaybe<Scalars['Float']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  shortName_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryProfileInformationArgs = {
  userId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryProfilesValueArgs = {
  userId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryRelativeTeamsArgs = {
  admission_Icontains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCount_Gt?: InputMaybe<Scalars['Float']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  shortName_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QuerySemesterDisciplinesArgs = {
  courseNumber: Scalars['Int'];
  hasCourses: Scalars['Boolean'];
  semesterNumber: Scalars['Int'];
  teamId: Scalars['ID'];
};

/** Схема запросов данных */
export type QuerySessionsArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QuerySubsectionArgs = {
  url: Scalars['String'];
};

/** Схема запросов данных */
export type QueryTagsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Схема запросов данных */
export type QueryTeamArgs = {
  teamId?: InputMaybe<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryTeamsArgs = {
  admission_Icontains?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCount_Gt?: InputMaybe<Scalars['Float']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  name_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  shortName_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryTeamsSummaryReportArgs = {
  teamIds: Array<Scalars['ID']>;
};

/** Схема запросов данных */
export type QueryUserArgs = {
  userId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryUserInformationArgs = {
  userId: Scalars['ID'];
};

/** Схема запросов данных */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  email_Icontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  firstName_Icontains?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  lastName_Icontains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  sirName_Icontains?: InputMaybe<Scalars['String']>;
  username_Icontains?: InputMaybe<Scalars['String']>;
};

/** Схема запросов данных */
export type QueryUsersSummaryReportArgs = {
  userIds: Array<Scalars['ID']>;
};

export type RecoveryPasswordMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Email адрес */
  email: Scalars['String'];
};

/** Мутация для сброса пароля пользователя. */
export type RecoveryPasswordMutationPayload = {
  __typename?: 'RecoveryPasswordMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type RegisterMutationInput = {
  /** Согласие на обработку персональных данных */
  agreement: Scalars['Boolean'];
  /** Дата рождения */
  birthday: Scalars['Date'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Email */
  email: Scalars['String'];
  /** Имя */
  firstName: Scalars['String'];
  /** Фамилия */
  lastName: Scalars['String'];
  /** Пароль */
  password: Scalars['String'];
  /** Отчество */
  sirName?: InputMaybe<Scalars['String']>;
  /** Логин */
  username: Scalars['String'];
};

/** Мутация регистрации новых пользователей. */
export type RegisterMutationPayload = {
  __typename?: 'RegisterMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** An enumeration. */
export type RegistrationKind =
  /** attendance */
  | 'A_0'
  /** mark */
  | 'A_1';

/** Тип учета студентов на занятиях. */
export type RegistrationType = {
  __typename?: 'RegistrationType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Тип записи */
  kind: RegistrationKind;
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Короткое название */
  shortName: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
};

export type RequestCodeMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Email адрес */
  email: Scalars['String'];
};

/** Отправка email с кодом на электронную почту. */
export type RequestCodeMutationPayload = {
  __typename?: 'RequestCodeMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Информация по клиентам, с которых делаются запросы. */
export type RequestStatisticsType = {
  __typename?: 'RequestStatisticsType';
  /** Клиенты */
  browsers: Array<Maybe<PointStatisticsType>>;
  /** Устройства */
  device: Array<Maybe<PointStatisticsType>>;
  /** Операционные системы */
  os: Array<Maybe<PointStatisticsType>>;
};

export type ResetSettingsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Идентификатор пользователя */
  userId: Scalars['ID'];
};

/** Мутация для сброса настроек по умолчанию */
export type ResetSettingsMutationPayload = {
  __typename?: 'ResetSettingsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Лист настроек */
  settings?: Maybe<Array<SettingType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type RestorePasswordMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Пароль */
  password: Scalars['String'];
  /** Токен */
  token: Scalars['String'];
};

/** Мутация для сброса пароля пользователя. */
export type RestorePasswordMutationPayload = {
  __typename?: 'RestorePasswordMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Ошибка в строке. */
export type RowFieldErrorType = {
  __typename?: 'RowFieldErrorType';
  /** Ошибки, возникающие в строке */
  errors: Array<Maybe<ErrorFieldType>>;
  /** Номер строки с ошибкой */
  row: Scalars['Int'];
};

export type SectionFilesType = SectionInterface & {
  __typename?: 'SectionFilesType';
  /** Файлы */
  files: Array<Maybe<FileType>>;
  /** Идентификатор */
  id: Scalars['Int'];
  /** Тип страницы */
  kind: Scalars['Int'];
  /** Страница */
  page: PageType;
  /** Конструкции */
  payload?: Maybe<Scalars['JSONString']>;
  /** Порядок вывода */
  position: Scalars['Int'];
  /** Текст страницы */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

export type SectionGalleryType = SectionInterface & {
  __typename?: 'SectionGalleryType';
  /** Идентификатор */
  id: Scalars['Int'];
  /** Изображения */
  images: Array<Maybe<FileType>>;
  /** Тип страницы */
  kind: Scalars['Int'];
  /** Страница */
  page: PageType;
  /** Конструкции */
  payload?: Maybe<Scalars['JSONString']>;
  /** Порядок вывода */
  position: Scalars['Int'];
  /** Текст страницы */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

export type SectionInterface = {
  /** Идентификатор */
  id: Scalars['Int'];
  /** Тип страницы */
  kind: Scalars['Int'];
  /** Страница */
  page: PageType;
  /** Порядок вывода */
  position: Scalars['Int'];
  /** Текст страницы */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

/** Секции */
export type SectionTextType = SectionInterface & {
  __typename?: 'SectionTextType';
  /** Идентификатор */
  id: Scalars['Int'];
  /** Тип страницы */
  kind: Scalars['Int'];
  /** Страница */
  page: PageType;
  /** Порядок вывода */
  position: Scalars['Int'];
  /** Текст страницы */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

export type SectionUsersType = SectionInterface & {
  __typename?: 'SectionUsersType';
  /** Идентификатор */
  id: Scalars['Int'];
  /** Тип страницы */
  kind: Scalars['Int'];
  /** Страница */
  page: PageType;
  /** Конструкции */
  payload?: Maybe<Scalars['JSONString']>;
  /** Порядок вывода */
  position: Scalars['Int'];
  /** Текст страницы */
  text: Scalars['String'];
  /** Пользователь */
  user: UserType;
  /** Пользователи */
  users: Array<Maybe<UserType>>;
};

/** An enumeration. */
export type SegmentAlign =
  /** Left */
  | 'A_0'
  /** Center */
  | 'A_1'
  /** Right */
  | 'A_2';

/** An enumeration. */
export type SegmentElementRepresent =
  /** grid */
  | 'A_0'
  /** card */
  | 'A_1'
  /** list */
  | 'A_2'
  /** slider */
  | 'A_3';

/** Элемент сегмента */
export type SegmentElementType = {
  __typename?: 'SegmentElementType';
  /** Колонок в элементе */
  columns: Scalars['Int'];
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Тип страницы */
  pageKind: PageKindType;
  /** Количество страниц в запросе */
  pageSize: Scalars['Int'];
  /** Позиция в сортировке */
  position: Scalars['Int'];
  /** Представление */
  represent?: Maybe<SegmentElementRepresent>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Пользователь */
  user: UserType;
  /** Тип элемента для рендера */
  view?: Maybe<SegmentElementView>;
  /** Ширина колонки */
  width: Scalars['Int'];
};

/** An enumeration. */
export type SegmentElementView =
  /** empty */
  | 'A_0'
  /** card */
  | 'A_1';

/** Сегмент */
export type SegmentType = {
  __typename?: 'SegmentType';
  /** Выравнивание заголовка */
  align: SegmentAlign;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Элементы сегмента страницы */
  elements: Array<Maybe<SegmentElementType>>;
  id: Scalars['ID'];
  /** Заголовок страницы */
  name?: Maybe<Scalars['String']>;
  /** Позиция в сортировке */
  position: Scalars['Int'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Тип элемента для рендера */
  view?: Maybe<SegmentView>;
};

/** An enumeration. */
export type SegmentView =
  /** empty */
  | 'A_0'
  /** card */
  | 'A_1';

/** Сессия пользователя. */
export type SessionType = Node & {
  __typename?: 'SessionType';
  /** Количество действий в сессии пользователя */
  activity: Scalars['Int'];
  /** Браузер пользователя */
  browser: Scalars['String'];
  /** Дата сессии пользователя */
  date?: Maybe<Scalars['DateTime']>;
  /** Устройство пользователя */
  device: Scalars['String'];
  /** Количество запросов в сессии пользователя */
  history: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** ip-адрес сессии */
  ip: Scalars['String'];
  /** Операционная система пользователя */
  os: Scalars['String'];
  /** Пользователь */
  user: UserType;
};

/** An enumeration. */
export type SettingKindValue =
  /** text */
  | 'A_0'
  /** file */
  | 'A_1'
  /** json */
  | 'A_2'
  /** bool */
  | 'A_4';

/** Настройка приложения. */
export type SettingType = {
  __typename?: 'SettingType';
  id: Scalars['ID'];
  /** Ключ настройки */
  key: Scalars['String'];
  /** Тип значения настройки */
  kindValue: SettingKindValue;
  /** Может ли поле быть изменено */
  readonly: Scalars['Boolean'];
  /** Значение */
  value: Scalars['String'];
};

/** Подписки на сокеты */
export type Subscription = {
  __typename?: 'Subscription';
  /** Получение собщений */
  chatMessages: ChatMessagesSubscription;
  /** Получение чатов */
  members: MembersSubscription;
  /** Поток новых уведомлений */
  notifications: NotificationsSubscription;
};

/** Подписки на сокеты */
export type SubscriptionChatMessagesArgs = {
  chatId?: InputMaybe<Scalars['ID']>;
};

export type SubsectionType = Node & {
  __typename?: 'SubsectionType';
  /** Название подраздела */
  header: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  itemPropContainers: Array<ItemPropContainerType>;
  /** Адрес подраздела */
  url: Scalars['String'];
};

export type SupportSubmitMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Загружаемые файлы */
  files?: InputMaybe<Array<Scalars['Upload']>>;
  /** Текст */
  text: Scalars['String'];
  /** Тема */
  topic: Scalars['String'];
};

/** Отправка письма поддержки */
export type SupportSubmitMutationPayload = {
  __typename?: 'SupportSubmitMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

/** Ячейка документа. */
export type TableCellType = {
  __typename?: 'TableCellType';
  /** Выравнивание */
  align?: Maybe<Scalars['String']>;
  /** Заголовок ячейки */
  header: Scalars['String'];
  /** Тип ячейки */
  type?: Maybe<Scalars['String']>;
  /** Значение ячейки */
  value?: Maybe<Scalars['String']>;
};

/** Строка документа. */
export type TableRowType = {
  __typename?: 'TableRowType';
  /** Строка документа */
  cells: Array<Maybe<TableCellType>>;
  /** Индекс строки */
  index: Scalars['Int'];
};

/** Документ, представлющий собой таблицу. */
export type TableType = {
  __typename?: 'TableType';
  /** Заголовки документа */
  headers: Array<Maybe<Scalars['String']>>;
  /** Строки документа */
  rows: Array<Maybe<TableRowType>>;
};

/** Тег. */
export type TagType = Node & {
  __typename?: 'TagType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Пользователь, создавший тег */
  user?: Maybe<UserType>;
};

export type TagTypeConnection = {
  __typename?: 'TagTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TagTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `TagType` and its cursor. */
export type TagTypeEdge = {
  __typename?: 'TagTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TagType>;
};

/** Разрешения группы пользователей */
export type TeamPermissionsType = PermissionsInterface & {
  __typename?: 'TeamPermissionsType';
  /** Есть ли права на изменение объекта модели */
  canChange: Scalars['Boolean'];
  /** Есть ли права на удаление объекта модели */
  canDelete: Scalars['Boolean'];
  /** Есть ли права на просмотр участников группы */
  canViewTeamMembers: Scalars['Boolean'];
};

/** Итоговый отчет по оценкам группы. */
export type TeamSummaryReportType = {
  __typename?: 'TeamSummaryReportType';
  /** Оценки */
  attestations: Array<AttestationType>;
  /** Часы по плану */
  eduHours: Array<EduHoursType>;
  /** Группа */
  team: TeamType;
};

/** Группа пользователей */
export type TeamType = Node & {
  __typename?: 'TeamType';
  /** Год образования/поступления */
  admission: Scalars['Int'];
  /** Курсы */
  courses: Array<CourseType>;
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  /** Удалена ли группа (закончено обучение) */
  delete: Scalars['Boolean'];
  /** Реализуемая образовательная программа */
  eduProgram?: Maybe<EduProgramType>;
  /** Группа прав */
  group?: Maybe<GroupType>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Пользователи с учетом работы */
  jobs: Array<JobType>;
  /** Название */
  name: Scalars['String'];
  /** Родительская группа (Администрация -> Кафедра -> Студенты) */
  parent?: Maybe<TeamType>;
  /** Разрешения на действия с объектом модели */
  permissions: TeamPermissionsType;
  /** Пользователи, ответственные за группу */
  responsibleUsers: Array<UserType>;
  /** Сокращенное название */
  shortName: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Участники */
  users: Array<UserType>;
};

export type TeamTypeConnection = {
  __typename?: 'TeamTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TeamTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `TeamType` and its cursor. */
export type TeamTypeEdge = {
  __typename?: 'TeamTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TeamType>;
};

export type UnloadArticlesMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Формат выгрузки: docx, xlsx, bibtex */
  extension: Scalars['String'];
};

/** Выгрузка публикаций в различных форматах. */
export type UnloadArticlesMutationPayload = {
  __typename?: 'UnloadArticlesMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type UnloadEduProgramsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Формат выгрузки: html, xlsx */
  extension: Scalars['String'];
};

/** Выгрузка данных в различных форматах. */
export type UnloadEduProgramsMutationPayload = {
  __typename?: 'UnloadEduProgramsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type UnloadUsersMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Формат выгрузки: html, xlsx */
  extension: Scalars['String'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
  /** Идентификаторы пользователей */
  usersId: Array<Scalars['ID']>;
};

/** Выгрузка пользователей группы  */
export type UnloadUsersMutationPayload = {
  __typename?: 'UnloadUsersMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки мутации */
  errors: Array<ErrorFieldType>;
  /** Ссылка на сгенерированный файл */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
};

export type UploadJobsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Источник данных, файл xlsx, csv, json */
  file: Scalars['Upload'];
  /** Создавать приказ в формате docx */
  generateDocx: Scalars['Boolean'];
  /** Создавать приказ в формате pdf */
  generatePdf: Scalars['Boolean'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Загрузка существующих пользователей в группу из файла */
export type UploadJobsMutationPayload = {
  __typename?: 'UploadJobsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки валидации */
  errors: Array<Maybe<RowFieldErrorType>>;
  /** Новые места работы пользователей */
  jobs?: Maybe<Array<Maybe<JobType>>>;
  /** Ссылка на сгенерированный архив с приказами */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Валидируемый документ */
  table?: Maybe<TableType>;
};

export type UploadJobsUserMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Источник данных, файл xlsx, csv, json */
  file: Scalars['Upload'];
  /** Создавать приказ в формате docx */
  generateDocx: Scalars['Boolean'];
  /** Создавать приказ в формате pdf */
  generatePdf: Scalars['Boolean'];
  /** Тип работы */
  kind: Scalars['String'];
  /** Идентификатор занимаемой должности */
  postId: Scalars['ID'];
  /** Занимаемая ставка */
  rate: Scalars['Float'];
  /** Дата присвоения статуса места работы пользователя */
  statusCreatedAt: Scalars['Date'];
  /** Идентификатор статуса места работы пользователя */
  statusId: Scalars['ID'];
  /** Идентификатор группы */
  teamId: Scalars['ID'];
};

/** Загрузка новых пользователей в группу из файла */
export type UploadJobsUserMutationPayload = {
  __typename?: 'UploadJobsUserMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки валидации */
  errors: Array<Maybe<RowFieldErrorType>>;
  /** Ошибки мутации */
  errorsJob: Array<ErrorFieldType>;
  /** Новые места работы пользователей */
  jobs?: Maybe<Array<Maybe<JobType>>>;
  /** Ссылка на сгенерированный архив с приказами */
  src?: Maybe<Scalars['String']>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Валидируемый документ */
  table?: Maybe<TableType>;
};

export type UploadTeamsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Источник данных, файл xlsx, csv, json */
  file: Scalars['Upload'];
};

/** Загрузка групп пользователей */
export type UploadTeamsMutationPayload = {
  __typename?: 'UploadTeamsMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки валидации */
  errors: Array<Maybe<RowFieldErrorType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Валидируемый документ */
  table?: Maybe<TableType>;
  /** Загруженные группы пользователей */
  teams?: Maybe<Array<Maybe<TeamType>>>;
};

export type UploadUsersMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Источник данных, файл xlsx или csv */
  file: Scalars['Upload'];
  /** Для загрузки пользователей */
  groupsId?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

/** Мутация для загрузки пользователей из файла excel | csv. */
export type UploadUsersMutationPayload = {
  __typename?: 'UploadUsersMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  /** Ошибки валидации */
  errors: Array<Maybe<RowFieldErrorType>>;
  /** Успех мутации */
  success: Scalars['Boolean'];
  /** Валидируемый документ */
  table?: Maybe<TableType>;
  /** Загруженные пользователи */
  users?: Maybe<Array<Maybe<UserType>>>;
};

/** Описание пользовательского типа. */
export type UserType = Node & {
  __typename?: 'UserType';
  /** Пользовательское соглашение */
  agreement?: Maybe<Scalars['DateTime']>;
  articles: Array<Maybe<ArticleType>>;
  /** Аватар */
  avatar?: Maybe<Scalars['String']>;
  /** День рождения */
  birthday?: Maybe<Scalars['Date']>;
  change: Scalars['Boolean'];
  /** Дата добавления */
  createdAt: Scalars['DateTime'];
  /** email */
  email: Scalars['String'];
  /** Имя */
  firstName: Scalars['String'];
  /** Группы пользователя */
  groups: Array<Maybe<GroupType>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Является ли пользователь активным */
  isActive: Scalars['Boolean'];
  jobs: Array<Maybe<JobType>>;
  /** Фамилия */
  lastName: Scalars['String'];
  notices: NoticeTypeConnection;
  notifications: NotificationTypeConnection;
  /** Привилегии пользователя */
  permissions: Array<Maybe<Scalars['String']>>;
  profileValues: Array<Maybe<ProfileValueType>>;
  responsibleTeams: Array<Maybe<TeamType>>;
  /** Сессия пользователя */
  session?: Maybe<SessionType>;
  /** Отчество */
  sirName?: Maybe<Scalars['String']>;
  teams: Array<Maybe<TeamType>>;
  /** login */
  username: Scalars['String'];
};

/** Описание пользовательского типа. */
export type UserTypeNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** Описание пользовательского типа. */
export type UserTypeNotificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hide?: InputMaybe<Scalars['Boolean']>;
  last?: InputMaybe<Scalars['Int']>;
  notice?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  user?: InputMaybe<Scalars['ID']>;
};

export type UserTypeConnection = {
  __typename?: 'UserTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserTypeEdge>>;
  /** Number of nodes. */
  nodeCount: Scalars['Int'];
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Number of items in the queryset. */
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `UserType` and its cursor. */
export type UserTypeEdge = {
  __typename?: 'UserTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<UserType>;
};

/** Форма работы. */
export type WorkFormType = {
  __typename?: 'WorkFormType';
  id: Scalars['ID'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
};

/** Вид работы. */
export type WorkKindType = {
  __typename?: 'WorkKindType';
  /** Дата создания */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Скрыт ли вид работы */
  isHidden: Scalars['Boolean'];
  /** Название */
  name: Scalars['String'];
  /** Позиция для сортировки */
  order: Scalars['Int'];
  /** Короткое название */
  shortName: Scalars['String'];
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Форма работы */
  workForm?: Maybe<WorkFormType>;
};

export type FileFieldsFragment = { __typename: 'FileType', id: string, name: string, src: string, ext?: string | null, size?: number | null, deleted: boolean, createdAt: any, updatedAt: any };

export type PermissionsInterfaceFieldsFragment = { __typename?: 'TeamPermissionsType', canChange: boolean, canDelete: boolean };

export type ProfileFieldsFragment = { __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number };

export type ProfileValueFieldsFragment = { __typename: 'ProfileValueType', id: string, value: string, visibility: boolean, createdAt: any, updatedAt: any };

export type SessionFieldsFragment = { __typename: 'SessionType', id: string, ip: string, browser: string, os: string, device: string, date?: any | null };

export type SettingFieldsFragment = { __typename: 'SettingType', id: string, key: string, value: string, kindValue: SettingKindValue, readonly: boolean };

export type UserFieldsFragment = { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any };

export type UserTeamFieldsFragment = { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, teams: Array<{ __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, createdAt: any, updatedAt: any, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> } | null> };

export type AddFileMutationVariables = Exact<{
  userId: Scalars['ID'];
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;

export type AddFileMutation = { __typename?: 'Mutation', addFile: { __typename?: 'AddFileMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, ext?: string | null, size?: number | null, deleted: boolean, createdAt: any, updatedAt: any } | null> } };

export type ChangeFileMutationVariables = Exact<{
  fileId: Scalars['ID'];
  field: Scalars['String'];
  value: Scalars['String'];
}>;

export type ChangeFileMutation = { __typename?: 'Mutation', changeFile: { __typename: 'ChangeFileMutationPayload', success: boolean, file?: { __typename: 'FileType', id: string, name: string, src: string, ext?: string | null, size?: number | null, deleted: boolean, createdAt: any, updatedAt: any } | null } };

export type DeleteFileMutationVariables = Exact<{
  fileId: Scalars['ID'];
}>;

export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: { __typename: 'DeleteFileMutationPayload', success: boolean, id: string } };

export type AddGroupMutationVariables = Exact<{
  name: Scalars['String'];
  permissionFrom?: InputMaybe<Scalars['Int']>;
}>;

export type AddGroupMutation = { __typename?: 'Mutation', addGroup: { __typename: 'AddGroupMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, group?: { __typename: 'GroupType', id: string, name: string, permissions: Array<{ __typename: 'PermissionType', id: string, name: string, codename: string }> } | null } };

export type ChangeGroupNameMutationVariables = Exact<{
  name: Scalars['String'];
  groupId: Scalars['Int'];
}>;

export type ChangeGroupNameMutation = { __typename?: 'Mutation', changeGroupName: { __typename: 'ChangeGroupNameMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, group?: { __typename: 'GroupType', id: string, name: string, permissions: Array<{ __typename: 'PermissionType', id: string, name: string, codename: string }> } | null } };

export type ChangeGroupPermissionsMutationVariables = Exact<{
  groupId: Scalars['Int'];
  permissionsId: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
  action: ActionRelationShip;
}>;

export type ChangeGroupPermissionsMutation = { __typename?: 'Mutation', changeGroupPermissions: { __typename: 'ChangeGroupPermissionsMutationPayload', success: boolean, permissionsId: Array<number | null>, action: ActionRelationShip, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteGroupMutationVariables = Exact<{
  groupId: Scalars['Int'];
}>;

export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename: 'DeleteGroupMutationPayload', success: boolean, id: string, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeProfileValueMutationVariables = Exact<{
  profileId: Scalars['ID'];
  userId: Scalars['ID'];
  value: Scalars['String'];
}>;

export type ChangeProfileValueMutation = { __typename?: 'Mutation', changeProfileValue: { __typename: 'ChangeProfileValueMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, profileValue?: { __typename: 'ProfileValueType', id: string, value: string, visibility: boolean, createdAt: any, updatedAt: any, profile: { __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number } } | null } };

export type ChangeProfileVisibilityMutationVariables = Exact<{
  profileValueId: Scalars['ID'];
  visibility: Scalars['Boolean'];
}>;

export type ChangeProfileVisibilityMutation = { __typename?: 'Mutation', changeProfileVisibility: { __typename: 'ChangeProfileVisibilityMutationPayload', success: boolean, profileValue?: { __typename: 'ProfileValueType', id: string, value: string, visibility: boolean, createdAt: any, updatedAt: any, profile: { __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number } } | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeSettingsMutationVariables = Exact<{
  userId: Scalars['ID'];
  key: Scalars['String'];
  value: Scalars['String'];
}>;

export type ChangeSettingsMutation = { __typename?: 'Mutation', changeSettings: { __typename: 'ChangeSettingsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, setting?: { __typename: 'SettingType', id: string, key: string, value: string, kindValue: SettingKindValue, readonly: boolean } | null } };

export type ResetSettingsMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type ResetSettingsMutation = { __typename?: 'Mutation', resetSettings: { __typename: 'ResetSettingsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, settings?: Array<{ __typename: 'SettingType', id: string, key: string, value: string, kindValue: SettingKindValue, readonly: boolean }> | null } };

export type SupportSubmitMutationVariables = Exact<{
  topic: Scalars['String'];
  text: Scalars['String'];
  files?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
}>;

export type SupportSubmitMutation = { __typename?: 'Mutation', supportSubmit: { __typename?: 'SupportSubmitMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeAvatarMutationVariables = Exact<{
  userId: Scalars['ID'];
  file: Scalars['Upload'];
}>;

export type ChangeAvatarMutation = { __typename?: 'Mutation', changeAvatar: { __typename?: 'ChangeAvatarMutationPayload', success: boolean, avatar: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
  passwordNew: Scalars['String'];
}>;

export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeUserGroupsMutationVariables = Exact<{
  userId: Scalars['ID'];
  groupsId: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
}>;

export type ChangeUserGroupsMutation = { __typename?: 'Mutation', changeUserGroups: { __typename: 'ChangeUserGroupsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, groups?: Array<{ __typename: 'GroupType', id: string, name: string } | null> | null } };

export type ChangeUserPropsMutationVariables = Exact<{
  userId: Scalars['ID'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  sirName: Scalars['String'];
  birthday: Scalars['Date'];
}>;

export type ChangeUserPropsMutation = { __typename?: 'Mutation', changeUserProps: { __typename: 'ChangeUserPropsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } } };

export type ConfirmEmailMutationVariables = Exact<{
  email: Scalars['String'];
  code: Scalars['String'];
}>;

export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: { __typename: 'ConfirmEmailMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, user?: { __typename: 'UserType', email: string, agreement?: any | null } | null } };

export type DeleteSessionsMutationVariables = Exact<{ [key: string]: never; }>;

export type DeleteSessionsMutation = { __typename?: 'Mutation', deleteSessions: { __typename?: 'DeleteSessionsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type GetTokenMutationVariables = Exact<{
  clientId: Scalars['String'];
  clientSecret: Scalars['String'];
  grantType: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type GetTokenMutation = { __typename?: 'Mutation', getToken: { __typename?: 'GetTokenMutationPayload', success: boolean, accessToken?: string | null, expiresIn?: number | null, tokenType?: string | null, scope?: string | null, refreshToken?: string | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, user?: { __typename: 'UserType', birthday?: any | null, isActive: boolean, agreement?: any | null, permissions: Array<string | null>, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, createdAt: any, session?: { __typename: 'SessionType', id: string, ip: string, browser: string, os: string, device: string, date?: any | null } | null } | null } };

export type LogoutMutationVariables = Exact<{
  sessionId: Scalars['ID'];
}>;

export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename: 'LogoutMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type RecoveryPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type RecoveryPasswordMutation = { __typename?: 'Mutation', recoveryPassword: { __typename: 'RecoveryPasswordMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type RegistrationMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
  sirName?: InputMaybe<Scalars['String']>;
  birthday: Scalars['Date'];
  password: Scalars['String'];
  agreement: Scalars['Boolean'];
}>;

export type RegistrationMutation = { __typename?: 'Mutation', register: { __typename: 'RegisterMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type RequestCodeMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type RequestCodeMutation = { __typename?: 'Mutation', requestCode: { __typename: 'RequestCodeMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type RestorePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;

export type RestorePasswordMutation = { __typename?: 'Mutation', restorePassword: { __typename: 'RestorePasswordMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type UnloadUsersMutationVariables = Exact<{
  extension: Scalars['String'];
  usersId: Array<Scalars['ID']> | Scalars['ID'];
  teamId: Scalars['ID'];
}>;

export type UnloadUsersMutation = { __typename?: 'Mutation', unloadUsers: { __typename: 'UnloadUsersMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type UploadUserMutationVariables = Exact<{
  groupsId?: InputMaybe<Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>>;
  file: Scalars['Upload'];
}>;

export type UploadUserMutation = { __typename?: 'Mutation', uploadUsers: { __typename?: 'UploadUsersMutationPayload', success: boolean, errors: Array<{ __typename: 'RowFieldErrorType', row: number, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename?: 'TableType', headers: Array<string | null>, rows: Array<{ __typename?: 'TableRowType', index: number, cells: Array<{ __typename?: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, users?: Array<{ __typename: 'UserType', id: string, avatar?: string | null, username: string, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, groups: Array<{ __typename: 'GroupType', id: string, name: string } | null> } | null> | null } };

export type FilesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId: Scalars['ID'];
  nameContains?: InputMaybe<Scalars['String']>;
}>;

export type FilesQuery = { __typename?: 'Query', files: { __typename: 'FileTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'FileTypeEdge', node?: { __typename: 'FileType', id: string, name: string, src: string, ext?: string | null, size?: number | null, deleted: boolean, createdAt: any, updatedAt: any } | null } | null> } };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;

export type GroupsQuery = { __typename?: 'Query', groups: Array<{ __typename: 'GroupType', id: string, name: string, permissions: Array<{ __typename: 'PermissionType', id: string, name: string, codename: string }> }> };

export type LogEntryQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;

export type LogEntryQuery = { __typename?: 'Query', logEntry: { __typename: 'LogEntryTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'LogEntryTypeEdge', node?: { __typename: 'LogEntryType', id: string, action: LogEntryAction, objectId?: string | null, payload: any, createdAt: any, session?: { __typename: 'SessionType', os: string, browser: string } | null, contentType?: { __typename: 'ContentTypeType', appLabel: string, model: string } | null } | null } | null> } };

export type LogEntryGeneralQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  modelContains?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type LogEntryGeneralQuery = { __typename?: 'Query', logEntry: { __typename: 'LogEntryTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'LogEntryTypeEdge', node?: { __typename: 'LogEntryType', id: string, action: LogEntryAction, objectId?: string | null, payload: any, createdAt: any, session?: { __typename: 'SessionType', os: string, browser: string, user: { __typename?: 'UserType', id: string, username: string, lastName: string, firstName: string, sirName?: string | null, email: string } } | null, contentType?: { __typename: 'ContentTypeType', appLabel: string, model: string } | null } | null } | null> } };

export type LogGeneralRequestsQueryVariables = Exact<{
  pageContains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;

export type LogGeneralRequestsQuery = { __typename?: 'Query', logRequests: { __typename: 'LogRequestTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'LogRequestTypeEdge', node?: { __typename: 'LogRequestType', id: string, page?: string | null, time: number, createdAt: any, session?: { __typename: 'SessionType', browser: string, device: string, os: string, user: { __typename: 'UserType', id: string, username: string, lastName: string, firstName: string, sirName?: string | null, email: string } } | null } | null } | null> } };

export type LogRequestsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['ID']>;
  pageContains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;

export type LogRequestsQuery = { __typename?: 'Query', logRequests: { __typename: 'LogRequestTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'LogRequestTypeEdge', node?: { __typename: 'LogRequestType', id: string, page?: string | null, time: number, createdAt: any, session?: { __typename: 'SessionType', browser: string, device: string, os: string } | null } | null } | null> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;

export type MeQuery = { __typename?: 'Query', me?: { __typename: 'UserType', birthday?: any | null, isActive: boolean, agreement?: any | null, permissions: Array<string | null>, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, createdAt: any, session?: { __typename: 'SessionType', id: string, ip: string, browser: string, os: string, device: string, date?: any | null } | null } | null };

export type PermissionsQueryVariables = Exact<{ [key: string]: never; }>;

export type PermissionsQuery = { __typename?: 'Query', permissions: Array<{ __typename: 'PermissionType', id: string, name: string, codename: string, contentType: { __typename: 'ContentTypeType', appLabel: string, model: string } }> };

export type ProfileInformationQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type ProfileInformationQuery = { __typename?: 'Query', profileInformation: Array<{ __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number, available: Array<{ __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number, value?: { __typename: 'ProfileValueType', id: string, value: string, visibility: boolean, createdAt: any, updatedAt: any } | null }> }> };

export type ProfilesQueryVariables = Exact<{ [key: string]: never; }>;

export type ProfilesQuery = { __typename?: 'Query', profiles: Array<{ __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number, children: Array<{ __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number }> }> };

export type ProfilesValueQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type ProfilesValueQuery = { __typename?: 'Query', profilesValue: Array<{ __typename: 'ProfileValueType', id: string, value: string, visibility: boolean, createdAt: any, updatedAt: any, profile: { __typename: 'ProfileType', id: string, name: string, code: string, kind: ProfileKind, position: number } }> };

export type SessionsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['ID']>;
}>;

export type SessionsQuery = { __typename?: 'Query', sessions: Array<{ __typename?: 'SessionType', id: string, ip: string, browser: string, device: string, os: string, date?: any | null, activity: number, history: number }> };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;

export type SettingsQuery = { __typename?: 'Query', settings: Array<{ __typename: 'SettingType', id: string, key: string, value: string, kindValue: SettingKindValue, readonly: boolean }> };

export type UsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'UserTypeEdge', node?: { __typename: 'UserType', id: string, avatar?: string | null, username: string, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, groups: Array<{ __typename: 'GroupType', id: string, name: string } | null> } | null } | null> } };

export type ActiveStatisticsQueryVariables = Exact<{ [key: string]: never; }>;

export type ActiveStatisticsQuery = { __typename?: 'Query', activeStatistics: { __typename: 'ActiveStatisticsType', queries: Array<{ __typename: 'DateStatisticsType', date: any, value: number } | null>, times: Array<{ __typename: 'DateStatisticsType', date: any, value: number } | null> } };

export type RequestStatisticsQueryVariables = Exact<{ [key: string]: never; }>;

export type RequestStatisticsQuery = { __typename?: 'Query', requestStatistics: { __typename?: 'RequestStatisticsType', browsers: Array<{ __typename?: 'PointStatisticsType', name: string, value: number } | null>, os: Array<{ __typename?: 'PointStatisticsType', name: string, value: number } | null>, device: Array<{ __typename?: 'PointStatisticsType', name: string, value: number } | null> } };

export type ArticleAuthorFieldsFragment = { __typename: 'AuthorType', id: string, name: string, weight: number, order: number, createdAt: any, updatedAt: any };

export type ArticleFieldsFragment = { __typename: 'ArticleType', id: string, name: string, year: number, src: string, workload?: number | null, createdAt: any, additionalText: string };

export type ArticleIndexFieldsFragment = { __typename: 'ArticleIndexType', id: string, name: string, coefficient: number };

export type ArticleKindFieldsFragment = { __typename: 'ArticleKindType', id: string, name: string };

export type AttachmentFieldsFragment = { __typename: 'AttachmentType', id: string, createdAt: any, period: { __typename: 'PeriodType', id: string }, portfolioFile: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } };

export type AttestationCourseFieldsFragment = { __typename: 'CourseType', id: string, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string, registrations: Array<{ __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }> }> | null, attestations?: Array<{ __typename: 'AttestationType', id: string, description: string, updatedAt: any, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, period: { __typename: 'PeriodType', id: string }, setBy: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, confirmedBy?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } }> | null, attachments?: Array<{ __typename: 'AttachmentType', id: string, createdAt: any, period: { __typename: 'PeriodType', id: string }, portfolioFile: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } }> | null, handouts?: Array<{ __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null }> | null };

export type AttestationFieldsFragment = { __typename: 'AttestationType', id: string, description: string, updatedAt: any, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, period: { __typename: 'PeriodType', id: string }, setBy: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, confirmedBy?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } };

export type CourseFieldsFragment = { __typename: 'CourseType', id: string, semester?: number | null, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string }> | null };

export type DisciplineFieldsFragment = { __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> };

export type EduHourFieldsFragment = { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null }, hoursKind: { __typename: 'HoursKindType', id: string, name: string } };

export type EduHoursFieldsFragment = { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } };

export type EduProgramFieldsFragment = { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } };

export type HandoutFieldsFragment = { __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null };

export type JobFieldsFragment = { __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> };

export type JobPostFieldsFragment = { __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> };

export type JobPostStatusHistoryFieldsFragment = { __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } };

export type MethodologicalSupportFieldsFragment = { __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any };

export type PortfolioFileFieldsFragment = { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

export type PostFieldsFragment = { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> };

export type ProcessTeamFieldsFragment = { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null };

export type RegistrationFieldsFragment = { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number };

export type TeamFieldsFragment = { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, createdAt: any, updatedAt: any, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> };

export type TeamGroupsUserFieldsFragment = { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } };

export type TeamSummaryReportFieldsFragment = { __typename: 'TeamSummaryReportType', team: { __typename: 'TeamType', id: string, name: string }, eduHours: Array<{ __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string } }>, attestations: Array<{ __typename: 'AttestationType', id: string, course: { __typename: 'CourseType', id: string, eduHours: { __typename: 'EduHoursType', id: string } }, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } }> };

export type UserFullFieldsFragment = { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, responsibleTeams: Array<{ __typename?: 'TeamType', id: string, name: string, shortName: string, admission: number } | null>, jobs: Array<{ __typename: 'JobType', id: string, jobPosts: Array<{ __typename?: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string } }>, team: { __typename: 'TeamType', id: string, name: string, shortName: string, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } } | null> };

export type WorkKindFieldsFragment = { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null };

export type AddArticleMutationVariables = Exact<{
  name: Scalars['String'];
  year: Scalars['Int'];
  fileLink?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
  indexId: Scalars['ID'];
  kindId: Scalars['ID'];
  workload?: InputMaybe<Scalars['Float']>;
  authors: Array<AuthorInputType> | AuthorInputType;
  additional: Scalars['String'];
}>;

export type AddArticleMutation = { __typename?: 'Mutation', addArticle: { __typename: 'AddArticleMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string> }>, article?: { __typename: 'ArticleType', id: string, name: string, year: number, src: string, workload?: number | null, createdAt: any, additionalText: string, kind?: { __typename: 'ArticleKindType', id: string, name: string } | null, index?: { __typename: 'ArticleIndexType', id: string, name: string, coefficient: number } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, authors: Array<{ __typename: 'AuthorType', id: string, name: string, weight: number, order: number, createdAt: any, updatedAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> } | null } };

export type AddArticleFromBibtexMutationVariables = Exact<{
  file?: InputMaybe<Scalars['Upload']>;
}>;

export type AddArticleFromBibtexMutation = { __typename?: 'Mutation', addArticleFromBibtex: { __typename: 'AddArticleFromBibtexMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string> }>, articles?: Array<{ __typename: 'ArticleType', id: string, name: string, year: number, src: string, workload?: number | null, createdAt: any, additionalText: string, kind?: { __typename: 'ArticleKindType', id: string, name: string } | null, index?: { __typename: 'ArticleIndexType', id: string, name: string, coefficient: number } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> }> | null } };

export type ChangeArticleMutationVariables = Exact<{
  articleId: Scalars['ID'];
  name: Scalars['String'];
  year: Scalars['Int'];
  indexId: Scalars['ID'];
  kindId: Scalars['ID'];
  workload?: InputMaybe<Scalars['Float']>;
  authors: Array<AuthorInputType> | AuthorInputType;
  additional: Scalars['String'];
}>;

export type ChangeArticleMutation = { __typename?: 'Mutation', changeArticle: { __typename: 'ChangeArticleMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string> }>, article?: { __typename: 'ArticleType', id: string, name: string, year: number, src: string, workload?: number | null, createdAt: any, additionalText: string, kind?: { __typename: 'ArticleKindType', id: string, name: string } | null, index?: { __typename: 'ArticleIndexType', id: string, name: string, coefficient: number } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, authors: Array<{ __typename: 'AuthorType', id: string, name: string, weight: number, order: number, createdAt: any, updatedAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> } | null } };

export type DeleteArticleMutationVariables = Exact<{
  articleId: Scalars['ID'];
  userId: Scalars['ID'];
}>;

export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: { __typename: 'DeleteArticleMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string> }> } };

export type UnloadArticlesMutationVariables = Exact<{
  extension: Scalars['String'];
}>;

export type UnloadArticlesMutation = { __typename?: 'Mutation', unloadArticles: { __typename: 'UnloadArticlesMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type UploadEledenUserMutationVariables = Exact<{
  groupsId?: InputMaybe<Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>>;
  file: Scalars['Upload'];
}>;

export type UploadEledenUserMutation = { __typename?: 'Mutation', uploadUsers: { __typename?: 'UploadUsersMutationPayload', success: boolean, errors: Array<{ __typename: 'RowFieldErrorType', row: number, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename?: 'TableType', headers: Array<string | null>, rows: Array<{ __typename?: 'TableRowType', index: number, cells: Array<{ __typename?: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, users?: Array<{ __typename: 'UserType', id: string, avatar?: string | null, username: string, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, groups: Array<{ __typename: 'GroupType', id: string, name: string } | null>, teams: Array<{ __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, createdAt: any, updatedAt: any, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> } | null> } | null> | null } };

export type AddCompetencesMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  competenceIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type AddCompetencesMutation = { __typename?: 'Mutation', addCompetences: { __typename: 'AddCompetencesMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, competences?: Array<{ __typename: 'CompetenceType', id: string, name: string, code: string, category: string }> | null } };

export type AddDisciplineMutationVariables = Exact<{
  code: Scalars['String'];
  name: Scalars['String'];
  eduProgramId: Scalars['ID'];
  userIds: Array<Scalars['ID']> | Scalars['ID'];
  viewId?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
  annotation?: InputMaybe<Scalars['Upload']>;
  workProgram?: InputMaybe<Scalars['Upload']>;
  methodologicalSupport?: InputMaybe<Array<InputMaybe<MethodologicalSupportInputType>> | InputMaybe<MethodologicalSupportInputType>>;
}>;

export type AddDisciplineMutation = { __typename?: 'Mutation', addDiscipline: { __typename: 'AddDisciplineMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, eduProgram: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } }, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> } | null } };

export type AddDisciplineMethodologicalSupportsMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  file: Scalars['Upload'];
}>;

export type AddDisciplineMethodologicalSupportsMutation = { __typename?: 'Mutation', addDisciplineMethodologicalSupports: { __typename?: 'AddDisciplineMethodologicalSupportsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, methodologicalSupports?: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> | null } };

export type AddDisciplinesFilesMutationVariables = Exact<{
  eduProgramId: Scalars['ID'];
  file: Scalars['Upload'];
}>;

export type AddDisciplinesFilesMutation = { __typename?: 'Mutation', addDisciplinesFiles: { __typename?: 'AddDisciplinesFilesMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, disciplines?: Array<{ __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> }> | null } };

export type AddEduHoursMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  workKindId: Scalars['ID'];
  courseNumber: Scalars['Int'];
  semesterNumber: Scalars['Int'];
  value: Scalars['Int'];
  hoursKindId: Scalars['ID'];
}>;

export type AddEduHoursMutation = { __typename?: 'Mutation', addEduHours: { __typename?: 'AddEduHoursMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, eduHour?: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null }, hoursKind: { __typename: 'HoursKindType', id: string, name: string } } | null } };

export type AddEduProgramMutationVariables = Exact<{
  name: Scalars['String'];
  adaptive: Scalars['Boolean'];
  admission: Scalars['Int'];
  expedited: Scalars['Boolean'];
  eduFormId: Scalars['Int'];
  directionId: Scalars['ID'];
  description?: InputMaybe<Scalars['Upload']>;
  syllabus?: InputMaybe<Scalars['Upload']>;
  calendar?: InputMaybe<Scalars['Upload']>;
  eduProgramId?: InputMaybe<Scalars['ID']>;
}>;

export type AddEduProgramMutation = { __typename?: 'Mutation', addEduProgram: { __typename?: 'AddEduProgramMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } };

export type AddEduProgramFromPlxMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;

export type AddEduProgramFromPlxMutation = { __typename?: 'Mutation', addEduProgramFromPlx: { __typename?: 'AddEduProgramFromPlxMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } };

export type AddEduProgramMethodologicalSupportsMutationVariables = Exact<{
  eduProgramId: Scalars['ID'];
  file: Scalars['Upload'];
}>;

export type AddEduProgramMethodologicalSupportsMutation = { __typename?: 'Mutation', addEduProgramMethodologicalSupports: { __typename?: 'AddEduProgramMethodologicalSupportsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, methodologicalSupports?: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> | null } };

export type AddEduProgramsMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;

export type AddEduProgramsMutation = { __typename?: 'Mutation', addEduPrograms: { __typename?: 'AddEduProgramsMutationPayload', success: boolean, errors: Array<{ __typename?: 'RowFieldErrorType', row: number, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename?: 'TableType', headers: Array<string | null>, rows: Array<{ __typename?: 'TableRowType', index: number, cells: Array<{ __typename?: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, eduPrograms?: Array<{ __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null> | null } };

export type AddMethodologicalSupportMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  name: Scalars['String'];
  src: Scalars['Upload'];
}>;

export type AddMethodologicalSupportMutation = { __typename?: 'Mutation', addMethodologicalSupport: { __typename?: 'AddMethodologicalSupportMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, methodologicalSupport?: { __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any } | null } };

export type ChangeDisciplineMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  viewId: Scalars['ID'];
  userIds: Array<Scalars['ID']> | Scalars['ID'];
  deleteAnnotation: Scalars['Boolean'];
  deleteWorkProgram: Scalars['Boolean'];
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  annotation?: InputMaybe<Scalars['Upload']>;
  workProgram?: InputMaybe<Scalars['Upload']>;
  parentId?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeDisciplineMutation = { __typename?: 'Mutation', changeDiscipline: { __typename?: 'ChangeDisciplineMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> } | null } };

export type ChangeEduProgramMutationVariables = Exact<{
  eduProgramId: Scalars['ID'];
  deleteDescription: Scalars['Boolean'];
  deleteSyllabus: Scalars['Boolean'];
  deleteCalendar: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  adaptive?: InputMaybe<Scalars['Boolean']>;
  admission?: InputMaybe<Scalars['Int']>;
  expedited?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['Upload']>;
  syllabus?: InputMaybe<Scalars['Upload']>;
  calendar?: InputMaybe<Scalars['Upload']>;
  eduFormId?: InputMaybe<Scalars['Int']>;
  directionId?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeEduProgramMutation = { __typename?: 'Mutation', changeEduProgram: { __typename?: 'ChangeEduProgramMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } };

export type ChangeMethodologicalSupportMutationVariables = Exact<{
  methodologicalSupportId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type ChangeMethodologicalSupportMutation = { __typename?: 'Mutation', changeMethodologicalSupport: { __typename?: 'ChangeMethodologicalSupportMutationPayload', success: boolean, methodologicalSupport?: { __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any } | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteCompetenceMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  competenceId: Scalars['ID'];
}>;

export type DeleteCompetenceMutation = { __typename?: 'Mutation', deleteCompetence: { __typename: 'DeleteCompetenceMutationPayload', success: boolean, id: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteDisciplineMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
}>;

export type DeleteDisciplineMutation = { __typename?: 'Mutation', deleteDiscipline: { __typename: 'DeleteDisciplineMutationPayload', success: boolean, id: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteEduHourMutationVariables = Exact<{
  eduHourId: Scalars['ID'];
}>;

export type DeleteEduHourMutation = { __typename?: 'Mutation', deleteEduHour: { __typename: 'DeleteEduHourMutationPayload', success: boolean, id: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteEduProgramMutationVariables = Exact<{
  eduProgramId: Scalars['ID'];
}>;

export type DeleteEduProgramMutation = { __typename?: 'Mutation', deleteEduProgram: { __typename: 'DeleteEduProgramMutationPayload', success: boolean, id: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteMethodologicalSupportMutationVariables = Exact<{
  methodologicalSupportId: Scalars['ID'];
}>;

export type DeleteMethodologicalSupportMutation = { __typename?: 'Mutation', deleteMethodologicalSupport: { __typename: 'DeleteMethodologicalSupportMutationPayload', success: boolean, id: string, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type UnloadEduProgramsMutationVariables = Exact<{
  extension: Scalars['String'];
}>;

export type UnloadEduProgramsMutation = { __typename?: 'Mutation', unloadEduPrograms: { __typename: 'UnloadEduProgramsMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AddJobMutationVariables = Exact<{
  rate: Scalars['Float'];
  kind: Scalars['String'];
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
  postId: Scalars['ID'];
  statusId: Scalars['ID'];
  statusCreatedAt: Scalars['Date'];
  generateDocx: Scalars['Boolean'];
  generatePdf: Scalars['Boolean'];
}>;

export type AddJobMutation = { __typename?: 'Mutation', addJob: { __typename?: 'AddJobMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, job?: { __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> } | null } };

export type DeleteJobMutationVariables = Exact<{
  jobId: Scalars['ID'];
}>;

export type DeleteJobMutation = { __typename?: 'Mutation', deleteJob: { __typename?: 'DeleteJobMutationPayload', success: boolean } };

export type UploadJobsMutationVariables = Exact<{
  teamId: Scalars['ID'];
  file: Scalars['Upload'];
  generateDocx: Scalars['Boolean'];
  generatePdf: Scalars['Boolean'];
}>;

export type UploadJobsMutation = { __typename?: 'Mutation', uploadJobs: { __typename?: 'UploadJobsMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename: 'RowFieldErrorType', row: number, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename: 'TableType', headers: Array<string | null>, rows: Array<{ __typename: 'TableRowType', index: number, cells: Array<{ __typename: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, jobs?: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> } | null> | null } };

export type UploadJobsUserMutationVariables = Exact<{
  rate: Scalars['Float'];
  kind: Scalars['String'];
  file: Scalars['Upload'];
  teamId: Scalars['ID'];
  postId: Scalars['ID'];
  statusId: Scalars['ID'];
  statusCreatedAt: Scalars['Date'];
  generateDocx: Scalars['Boolean'];
  generatePdf: Scalars['Boolean'];
}>;

export type UploadJobsUserMutation = { __typename?: 'Mutation', uploadJobsUser: { __typename?: 'UploadJobsUserMutationPayload', success: boolean, src?: string | null, errorsJob: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, errors: Array<{ __typename?: 'RowFieldErrorType', row: number, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename?: 'TableType', headers: Array<string | null>, rows: Array<{ __typename?: 'TableRowType', index: number, cells: Array<{ __typename?: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, jobs?: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> } | null> | null } };

export type AddJobPostMutationVariables = Exact<{
  jobId: Scalars['ID'];
  rate: Scalars['Float'];
  kind: Scalars['String'];
  postId: Scalars['ID'];
  statusId: Scalars['ID'];
  statusCreatedAt: Scalars['Date'];
  generateDocx: Scalars['Boolean'];
  generatePdf: Scalars['Boolean'];
}>;

export type AddJobPostMutation = { __typename?: 'Mutation', addJobPost: { __typename?: 'AddJobPostMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, jobPost?: { __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> } | null } };

export type AddJobPostStatusHistoryMutationVariables = Exact<{
  jobPostId: Scalars['ID'];
  statusId: Scalars['ID'];
  statusCreatedAt: Scalars['Date'];
  generateDocx: Scalars['Boolean'];
  generatePdf: Scalars['Boolean'];
  completePrevious?: InputMaybe<Scalars['Boolean']>;
}>;

export type AddJobPostStatusHistoryMutation = { __typename?: 'Mutation', addJobPostStatusHistory: { __typename?: 'AddJobPostStatusHistoryMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, newJobPostStatusHistory?: { __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } } | null, completedJobPostStatusHistory?: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> | null } };

export type DeleteJobPostMutationVariables = Exact<{
  jobPostId: Scalars['ID'];
}>;

export type DeleteJobPostMutation = { __typename?: 'Mutation', deleteJobPost: { __typename?: 'DeleteJobPostMutationPayload', success: boolean } };

export type AddPortfolioFileMutationVariables = Exact<{
  userId: Scalars['ID'];
  describe: Scalars['String'];
  typeId: Scalars['ID'];
  file: Scalars['Upload'];
  disciplineId?: InputMaybe<Scalars['ID']>;
  confirm?: InputMaybe<Scalars['Boolean']>;
}>;

export type AddPortfolioFileMutation = { __typename?: 'Mutation', addPortfolioFile: { __typename?: 'AddPortfolioFileMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, portfolioFile?: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type AddPortfolioFilesMutationVariables = Exact<{
  teamId: Scalars['ID'];
  describe: Scalars['String'];
  typeId: Scalars['ID'];
  file: Scalars['Upload'];
  disciplineId?: InputMaybe<Scalars['ID']>;
  confirm?: InputMaybe<Scalars['Boolean']>;
}>;

export type AddPortfolioFilesMutation = { __typename?: 'Mutation', addPortfolioFiles: { __typename?: 'AddPortfolioFilesMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, portfolioFiles?: Array<{ __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null> | null } };

export type ConfirmPortfolioFileMutationVariables = Exact<{
  portfolioFileId: Scalars['ID'];
}>;

export type ConfirmPortfolioFileMutation = { __typename?: 'Mutation', confirmPortfolioFile: { __typename?: 'ConfirmPortfolioFileMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, portfolioFile?: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type DeletePortfolioFileMutationVariables = Exact<{
  portfolioFileId: Scalars['ID'];
}>;

export type DeletePortfolioFileMutation = { __typename?: 'Mutation', deletePortfolioFile: { __typename?: 'DeletePortfolioFileMutationPayload', success: boolean } };

export type AddAttestationMutationVariables = Exact<{
  description: Scalars['String'];
  registrationId: Scalars['ID'];
  courseId: Scalars['ID'];
  periodId: Scalars['ID'];
  setById: Scalars['ID'];
  userId: Scalars['ID'];
  confirmedById?: InputMaybe<Scalars['ID']>;
}>;

export type AddAttestationMutation = { __typename?: 'Mutation', addAttestation: { __typename?: 'AddAttestationMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, attestation?: { __typename: 'AttestationType', id: string, description: string, updatedAt: any, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, period: { __typename: 'PeriodType', id: string }, setBy: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, confirmedBy?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } } | null } };

export type AddCoursesMutationVariables = Exact<{
  teamId: Scalars['ID'];
  courses?: InputMaybe<Array<CourseInputType> | CourseInputType>;
}>;

export type AddCoursesMutation = { __typename?: 'Mutation', addCourses: { __typename?: 'AddCoursesMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, courses?: Array<{ __typename: 'CourseType', id: string, semester?: number | null, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string }> | null }> | null } };

export type AddFileAttachmentsMutationVariables = Exact<{
  courseId: Scalars['ID'];
  periodId: Scalars['ID'];
  userId: Scalars['ID'];
  files: Array<Scalars['Upload']> | Scalars['Upload'];
  describe: Scalars['String'];
  fileKindId: Scalars['ID'];
  confirmedById?: InputMaybe<Scalars['ID']>;
}>;

export type AddFileAttachmentsMutation = { __typename?: 'Mutation', addFileAttachments: { __typename?: 'AddFileAttachmentsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, attachments?: Array<{ __typename: 'AttachmentType', id: string, createdAt: any, period: { __typename: 'PeriodType', id: string }, portfolioFile: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } } | null> | null } };

export type AddHandoutMutationVariables = Exact<{
  description: Scalars['String'];
  file: Scalars['Upload'];
  courseId: Scalars['ID'];
  periodId: Scalars['ID'];
}>;

export type AddHandoutMutation = { __typename?: 'Mutation', addHandout: { __typename?: 'AddHandoutMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, handout?: { __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null } | null } };

export type AddPortfolioFileAttachmentsMutationVariables = Exact<{
  courseId: Scalars['ID'];
  periodId: Scalars['ID'];
  userId: Scalars['ID'];
  portfolioFileIds: Array<Scalars['ID']> | Scalars['ID'];
  confirmedById?: InputMaybe<Scalars['ID']>;
}>;

export type AddPortfolioFileAttachmentsMutation = { __typename?: 'Mutation', addPortfolioFileAttachments: { __typename?: 'AddPortfolioFileAttachmentsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, attachments?: Array<{ __typename: 'AttachmentType', id: string, createdAt: any, period: { __typename: 'PeriodType', id: string }, portfolioFile: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } } | null> | null } };

export type ChangeAttestationMutationVariables = Exact<{
  attestationId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  registrationId?: InputMaybe<Scalars['ID']>;
  setById?: InputMaybe<Scalars['ID']>;
  confirmedById?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeAttestationMutation = { __typename?: 'Mutation', changeAttestation: { __typename?: 'ChangeAttestationMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, attestation?: { __typename: 'AttestationType', id: string, description: string, updatedAt: any, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, period: { __typename: 'PeriodType', id: string }, setBy: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, confirmedBy?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } } | null } };

export type ChangeCoursesMutationVariables = Exact<{
  disciplineId: Scalars['ID'];
  teamId: Scalars['ID'];
  courses?: InputMaybe<Array<CourseInputType> | CourseInputType>;
}>;

export type ChangeCoursesMutation = { __typename?: 'Mutation', changeCourses: { __typename?: 'ChangeCoursesMutationPayload', success: boolean, hasCourses?: boolean | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, courses?: Array<{ __typename: 'CourseType', id: string, semester?: number | null, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string }> | null }> | null } };

export type ChangeHandoutMutationVariables = Exact<{
  handoutId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  periodId?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeHandoutMutation = { __typename?: 'Mutation', changeHandout: { __typename?: 'ChangeHandoutMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, handout?: { __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null } | null } };

export type DeleteAttachmentsMutationVariables = Exact<{
  attachmentIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteAttachmentsMutation = { __typename?: 'Mutation', deleteAttachments: { __typename?: 'DeleteAttachmentsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteAttestationMutationVariables = Exact<{
  attestationId: Scalars['ID'];
}>;

export type DeleteAttestationMutation = { __typename?: 'Mutation', deleteAttestation: { __typename?: 'DeleteAttestationMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteCourseMutationVariables = Exact<{
  courseId: Scalars['ID'];
}>;

export type DeleteCourseMutation = { __typename?: 'Mutation', deleteCourse: { __typename?: 'DeleteCourseMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteCoursesMutationVariables = Exact<{
  teamId: Scalars['ID'];
}>;

export type DeleteCoursesMutation = { __typename?: 'Mutation', deleteCourses: { __typename?: 'DeleteCoursesMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteHandoutsMutationVariables = Exact<{
  handoutIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteHandoutsMutation = { __typename?: 'Mutation', deleteHandouts: { __typename?: 'DeleteHandoutsMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AddTeamMutationVariables = Exact<{
  name: Scalars['String'];
  shortName: Scalars['String'];
  admission: Scalars['Int'];
  groupId?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
}>;

export type AddTeamMutation = { __typename?: 'Mutation', addTeam: { __typename?: 'AddTeamMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, team?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } };

export type ChangeTeamMutationVariables = Exact<{
  teamId: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  shortName?: InputMaybe<Scalars['String']>;
  admission?: InputMaybe<Scalars['Int']>;
  groupId?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeTeamMutation = { __typename?: 'Mutation', changeTeam: { __typename?: 'ChangeTeamMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, team?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, jobs: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } };

export type ChangeTeamDeleteMutationVariables = Exact<{
  teamId: Scalars['ID'];
  delete: Scalars['Boolean'];
}>;

export type ChangeTeamDeleteMutation = { __typename?: 'Mutation', changeTeamDelete: { __typename?: 'ChangeTeamDeleteMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, team?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, jobs: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } };

export type ChangeTeamEduProgramMutationVariables = Exact<{
  teamId: Scalars['ID'];
  transferCourses: Scalars['Boolean'];
  eduProgramId?: InputMaybe<Scalars['ID']>;
}>;

export type ChangeTeamEduProgramMutation = { __typename?: 'Mutation', changeTeamEduProgram: { __typename?: 'ChangeTeamEduProgramMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, team?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, jobs: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } };

export type ChangeTeamResponsibleUsersMutationVariables = Exact<{
  teamId: Scalars['ID'];
  usersId: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type ChangeTeamResponsibleUsersMutation = { __typename?: 'Mutation', changeTeamResponsibleUsers: { __typename?: 'ChangeTeamResponsibleUsersMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, team?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, jobs: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } };

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars['ID'];
}>;

export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename: 'DeleteTeamMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', messages: Array<string>, field: string }> } };

export type GenerateTeamNewPasswordsMutationVariables = Exact<{
  teamId: Scalars['ID'];
  usersId: Array<Scalars['ID']> | Scalars['ID'];
  date: Scalars['String'];
}>;

export type GenerateTeamNewPasswordsMutation = { __typename?: 'Mutation', generateTeamNewPasswords: { __typename?: 'GenerateTeamNewPasswordsMutationPayload', success: boolean, src?: string | null, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type UploadTeamsMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;

export type UploadTeamsMutation = { __typename?: 'Mutation', uploadTeams: { __typename?: 'UploadTeamsMutationPayload', success: boolean, errors: Array<{ __typename?: 'RowFieldErrorType', row: number, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> } | null> } | null>, table?: { __typename?: 'TableType', headers: Array<string | null>, rows: Array<{ __typename?: 'TableRowType', index: number, cells: Array<{ __typename?: 'TableCellType', header: string, value?: string | null } | null> } | null> } | null, teams?: Array<{ __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null> | null } };

export type ArticleIndexesQueryVariables = Exact<{ [key: string]: never; }>;

export type ArticleIndexesQuery = { __typename?: 'Query', articleIndexes: Array<{ __typename: 'ArticleIndexType', id: string, name: string, coefficient: number }> };

export type ArticleKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type ArticleKindsQuery = { __typename?: 'Query', articleKinds: Array<{ __typename: 'ArticleKindType', id: string, name: string }> };

export type ArticlesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  years?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;

export type ArticlesQuery = { __typename?: 'Query', articles: { __typename?: 'ArticleTypeConnection', totalCount: number, edges: Array<{ __typename: 'ArticleTypeEdge', node?: { __typename: 'ArticleType', id: string, name: string, year: number, src: string, workload?: number | null, createdAt: any, additionalText: string, kind?: { __typename: 'ArticleKindType', id: string, name: string } | null, index?: { __typename: 'ArticleIndexType', id: string, name: string, coefficient: number } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, authors: Array<{ __typename: 'AuthorType', id: string, name: string, weight: number, order: number, createdAt: any, updatedAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> } | null } | null> } };

export type ArticlesUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type ArticlesUsersQuery = { __typename?: 'Query', articlesUsers: { __typename?: 'UserTypeConnection', edges: Array<{ __typename?: 'UserTypeEdge', node?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null> } };

export type ArticlesYearsQueryVariables = Exact<{ [key: string]: never; }>;

export type ArticlesYearsQuery = { __typename?: 'Query', articlesYears: Array<number | null>, articlesUsers: { __typename?: 'UserTypeConnection', edges: Array<{ __typename?: 'UserTypeEdge', node?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null> } };

export type RawGroupsQueryVariables = Exact<{ [key: string]: never; }>;

export type RawGroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'GroupType', id: string, name: string }> };

export type SearchUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type SearchUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserTypeConnection', totalCount: number, edges: Array<{ __typename?: 'UserTypeEdge', node?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null> } };

export type UserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type UserQuery = { __typename?: 'Query', user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, responsibleTeams: Array<{ __typename?: 'TeamType', id: string, name: string, shortName: string, admission: number } | null>, jobs: Array<{ __typename: 'JobType', id: string, jobPosts: Array<{ __typename?: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string } }>, team: { __typename: 'TeamType', id: string, name: string, shortName: string, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } } | null> } | null };

export type EledenUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type EledenUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserTypeConnection', totalCount: number, edges: Array<{ __typename?: 'UserTypeEdge', node?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any, teams: Array<{ __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, createdAt: any, updatedAt: any, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> } | null> } | null } | null> } };

export type BlockKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type BlockKindsQuery = { __typename?: 'Query', blockKinds: Array<{ __typename: 'BlockKindType', id: string, name: string, order: number }> };

export type CompetencesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  excludeDisciplineId?: InputMaybe<Scalars['ID']>;
}>;

export type CompetencesQuery = { __typename?: 'Query', competences: { __typename: 'CompetenceTypeConnection', edges: Array<{ __typename: 'CompetenceTypeEdge', node?: { __typename: 'CompetenceType', id: string, name: string, code: string, category: string } | null } | null> } };

export type CourseTeamsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCountGt?: InputMaybe<Scalars['Float']>;
}>;

export type CourseTeamsQuery = { __typename?: 'Query', teams: { __typename?: 'TeamTypeConnection', totalCount: number, edges: Array<{ __typename?: 'TeamTypeEdge', node?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null } | null } | null> } };

export type DirectionsQueryVariables = Exact<{ [key: string]: never; }>;

export type DirectionsQuery = { __typename?: 'Query', directions: Array<{ __typename: 'DirectionType', id: string, code: string, name: string, secret: boolean, delete: boolean, eduService: { __typename: 'EduServiceType', id: string, name: string } }> };

export type DisciplineQueryVariables = Exact<{
  disciplineId: Scalars['ID'];
}>;

export type DisciplineQuery = { __typename?: 'Query', discipline: { __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, eduProgram: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } }, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> } };

export type CompetenceQueryVariables = Exact<{
  disciplineId: Scalars['ID'];
}>;

export type CompetenceQuery = { __typename?: 'Query', disciplineCompetences: Array<{ __typename: 'CompetenceType', id: string, name: string, code: string, category: string } | null> };

export type DisciplineEduHoursQueryVariables = Exact<{
  disciplineId: Scalars['ID'];
}>;

export type DisciplineEduHoursQuery = { __typename?: 'Query', disciplineEduHours: Array<{ __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null }, hoursKind: { __typename: 'HoursKindType', id: string, name: string } } | null> };

export type DisciplineKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type DisciplineKindsQuery = { __typename?: 'Query', disciplineKinds: Array<{ __typename: 'DisciplineKindType', id: string, name: string, order: number }> };

export type DisciplineViewsQueryVariables = Exact<{ [key: string]: never; }>;

export type DisciplineViewsQuery = { __typename?: 'Query', disciplineViews: Array<{ __typename: 'DisciplineViewType', id: string, name: string, order: number }> };

export type DisciplinesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  eduProgramId: Scalars['ID'];
  viewId?: InputMaybe<Scalars['Float']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type DisciplinesQuery = { __typename?: 'Query', disciplines: { __typename: 'DisciplineTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'DisciplineTypeEdge', node?: { __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, eduProgram: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } }, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> } | null } | null> } };

export type EduCyclesQueryVariables = Exact<{ [key: string]: never; }>;

export type EduCyclesQuery = { __typename?: 'Query', eduCycles: Array<{ __typename: 'EduCycleType', id: string, name: string, code: string, order: number, blockKind: { __typename: 'BlockKindType', id: string, name: string, order: number }, disciplineKind: { __typename: 'DisciplineKindType', id: string, name: string, order: number } }> };

export type EduFormsQueryVariables = Exact<{ [key: string]: never; }>;

export type EduFormsQuery = { __typename?: 'Query', eduForms: Array<{ __typename: 'EduFormType', id: string, name: string, shortName: string }> };

export type EduProgramQueryVariables = Exact<{
  eduProgramId: Scalars['ID'];
}>;

export type EduProgramQuery = { __typename?: 'Query', eduProgram: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } };

export type EduProgramsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type EduProgramsQuery = { __typename?: 'Query', eduPrograms: { __typename: 'EduProgramTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'EduProgramTypeEdge', node?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null } | null> } };

export type EduServicesQueryVariables = Exact<{ [key: string]: never; }>;

export type EduServicesQuery = { __typename?: 'Query', eduServices: Array<{ __typename: 'EduServiceType', id: string, name: string }> };

export type HoursKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type HoursKindsQuery = { __typename?: 'Query', hoursKinds: Array<{ __typename: 'HoursKindType', id: string, name: string }> };

export type MethodologicalSupportsQueryVariables = Exact<{
  disciplineId: Scalars['ID'];
}>;

export type MethodologicalSupportsQuery = { __typename?: 'Query', methodologicalSupports: { __typename: 'MethodologicalSupportTypeConnection', edges: Array<{ __typename: 'MethodologicalSupportTypeEdge', node?: { __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any } | null } | null> } };

export type WorkFormsQueryVariables = Exact<{ [key: string]: never; }>;

export type WorkFormsQuery = { __typename?: 'Query', workForms: Array<{ __typename: 'WorkFormType', id: string, name: string }> };

export type AttestationCourseQueryVariables = Exact<{
  courseId: Scalars['ID'];
}>;

export type AttestationCourseQuery = { __typename?: 'Query', course: { __typename: 'CourseType', id: string, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string, registrations: Array<{ __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }> }> | null, attestations?: Array<{ __typename: 'AttestationType', id: string, description: string, updatedAt: any, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, period: { __typename: 'PeriodType', id: string }, setBy: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, confirmedBy?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } }> | null, attachments?: Array<{ __typename: 'AttachmentType', id: string, createdAt: any, period: { __typename: 'PeriodType', id: string }, portfolioFile: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } }> | null, handouts?: Array<{ __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null }> | null } };

export type CourseQueryVariables = Exact<{
  courseId: Scalars['ID'];
}>;

export type CourseQuery = { __typename?: 'Query', course: { __typename: 'CourseType', id: string, semester?: number | null, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string }> | null } };

export type CourseHandoutsQueryVariables = Exact<{
  courseId: Scalars['ID'];
  periodIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;

export type CourseHandoutsQuery = { __typename?: 'Query', courseHandouts: { __typename: 'HandoutTypeConnection', totalCount: number, edges: Array<{ __typename?: 'HandoutTypeEdge', node?: { __typename: 'HandoutType', id: string, description: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, file: { __typename: 'FileType', id: string, name: string, src: string }, period?: { __typename: 'PeriodType', id: string, name: string } | null } | null } | null> } };

export type CoursesQueryVariables = Exact<{
  teamId?: InputMaybe<Scalars['ID']>;
  semester?: InputMaybe<Scalars['Float']>;
  disciplineIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  workKindIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  teachersIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
}>;

export type CoursesQuery = { __typename?: 'Query', courses: { __typename: 'CourseTypeConnection', totalCount: number, edges: Array<{ __typename?: 'CourseTypeEdge', node?: { __typename: 'CourseType', id: string, semester?: number | null, eduHours: { __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, value: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }, team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null }, teachers?: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> | null, periods?: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string }> | null } | null } | null> } };

export type DisciplineSemesterEduHoursQueryVariables = Exact<{
  disciplineId: Scalars['ID'];
  courseNumber: Scalars['Int'];
  semesterNumber: Scalars['Int'];
}>;

export type DisciplineSemesterEduHoursQuery = { __typename?: 'Query', disciplineSemesterEduHours?: Array<{ __typename: 'EduHoursType', id: string, value: number, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string, order: number } | null } }> | null };

export type EduProgramCoursesNumbersQueryVariables = Exact<{
  eduProgramId: Scalars['ID'];
}>;

export type EduProgramCoursesNumbersQuery = { __typename?: 'Query', eduProgramCoursesNumbers?: Array<number | null> | null };

export type PeriodsQueryVariables = Exact<{ [key: string]: never; }>;

export type PeriodsQuery = { __typename?: 'Query', periods: Array<{ __typename: 'PeriodType', id: string, name: string, shortName: string, templateDoc?: string | null, templateXml?: string | null, order: number, registrations: Array<{ __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }> }> };

export type ProcessTeamsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCountGt?: InputMaybe<Scalars['Float']>;
}>;

export type ProcessTeamsQuery = { __typename?: 'Query', processTeams: { __typename?: 'TeamTypeConnection', totalCount: number, edges: Array<{ __typename?: 'TeamTypeEdge', node?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, eduProgram?: { __typename: 'EduProgramType', id: string } | null } | null } | null> } };

export type RegistrationsQueryVariables = Exact<{ [key: string]: never; }>;

export type RegistrationsQuery = { __typename?: 'Query', registrations: Array<{ __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }> };

export type SemesterDisciplinesQueryVariables = Exact<{
  teamId: Scalars['ID'];
  courseNumber: Scalars['Int'];
  semesterNumber: Scalars['Int'];
  hasCourses: Scalars['Boolean'];
}>;

export type SemesterDisciplinesQuery = { __typename?: 'Query', semesterDisciplines?: Array<{ __typename: 'DisciplineType', id: string, code: string, name: string, annotation?: string | null, annotationSign?: string | null, workProgram?: string | null, workProgramSign?: string | null, updatedAt: any, order: number, view: { __typename: 'DisciplineViewType', id: string, name: string, order: number }, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, methodologicalSupport: Array<{ __typename: 'MethodologicalSupportType', id: string, name: string, src?: string | null, srcSign?: string | null, createdAt: any, updatedAt: any }> }> | null };

export type TeamsSummaryReportQueryVariables = Exact<{
  teamIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type TeamsSummaryReportQuery = { __typename?: 'Query', teamsSummaryReport: Array<{ __typename: 'TeamSummaryReportType', team: { __typename: 'TeamType', id: string, name: string }, eduHours: Array<{ __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string } }>, attestations: Array<{ __typename: 'AttestationType', id: string, course: { __typename: 'CourseType', id: string, eduHours: { __typename: 'EduHoursType', id: string } }, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } }> } | null> };

export type UsersSummaryReportQueryVariables = Exact<{
  userIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type UsersSummaryReportQuery = { __typename?: 'Query', usersSummaryReport: Array<{ __typename: 'TeamSummaryReportType', team: { __typename: 'TeamType', id: string, name: string }, eduHours: Array<{ __typename: 'EduHoursType', id: string, courseNumber: number, semesterNumber: number, discipline: { __typename: 'DisciplineType', id: string, name: string }, workKind: { __typename: 'WorkKindType', id: string, name: string, shortName: string } }>, attestations: Array<{ __typename: 'AttestationType', id: string, course: { __typename: 'CourseType', id: string, eduHours: { __typename: 'EduHoursType', id: string } }, registration: { __typename: 'RegistrationType', id: string, name: string, shortName: string, kind: RegistrationKind, order: number }, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } }> } | null> };

export type WorkKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type WorkKindsQuery = { __typename?: 'Query', workKinds: Array<{ __typename: 'WorkKindType', id: string, name: string, shortName: string, order: number, workForm?: { __typename: 'WorkFormType', id: string, name: string } | null }> };

export type FileKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type FileKindsQuery = { __typename?: 'Query', fileKinds: Array<{ __typename: 'FileKindType', id: string, name: string, accept: string, createdAt: any, updatedAt: any }> };

export type PortfolioFilesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  usersId?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  disciplineId?: InputMaybe<Scalars['ID']>;
  kindId?: InputMaybe<Scalars['Float']>;
  isConfirmed?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type PortfolioFilesQuery = { __typename?: 'Query', portfolioFiles: { __typename: 'PortfolioFileTypeConnection', totalCount: number, edges: Array<{ __typename: 'PortfolioFileTypeEdge', node?: { __typename: 'PortfolioFileType', id: string, describe: string, updatedAt: any, createdAt: any, file: { __typename: 'FileType', id: string, name: string, src: string, user?: { __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null, change: boolean } | null }, kind?: { __typename: 'FileKindType', id: string, name: string } | null, discipline?: { __typename: 'DisciplineType', id: string, code: string, name: string } | null, user?: { __typename: 'UserType', change: boolean, id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } | null> } };

export type EduProgramsStatisticsQueryVariables = Exact<{
  directions: Array<Scalars['ID']> | Scalars['ID'];
  admissions: Array<Scalars['String']> | Scalars['String'];
  eduForms: Array<Scalars['String']> | Scalars['String'];
}>;

export type EduProgramsStatisticsQuery = { __typename?: 'Query', eduProgramsStatistics: Array<{ __typename: 'EduProgramStatisticsType', id: string, directionCode: string, directionName: string, eduForm: string, name: string, admission: number, points: Array<{ __typename: 'PointTotalStatisticsType', name: string, value: number, total: number } | null> } | null> };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;

export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }> };

export type RelativeTeamsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCountGt?: InputMaybe<Scalars['Float']>;
}>;

export type RelativeTeamsQuery = { __typename?: 'Query', relativeTeams: { __typename: 'TeamTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'TeamTypeEdge', node?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } | null> } };

export type TeamQueryVariables = Exact<{
  teamId: Scalars['ID'];
}>;

export type TeamQuery = { __typename?: 'Query', team: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, jobs: Array<{ __typename: 'JobType', id: string, user: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }, jobPosts: Array<{ __typename: 'JobPostType', id: string, rate: number, kind: JobPostKind, post: { __typename: 'PostType', id: string, name: string, statuses: Array<{ __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null, order: number }> }, statusHistory: Array<{ __typename: 'JobPostStatusHistoryType', id: string, decreeDocx?: string | null, decreePdf?: string | null, createdAt: any, endAt?: any | null, status: { __typename: 'JobPostStatusType', id: string, name: string, active: boolean, templateDocx?: string | null, templateXml?: string | null } }> }> }>, eduProgram?: { __typename: 'EduProgramType', id: string, name: string, adaptive: boolean, admission: number, expedited: boolean, description?: string | null, descriptionSign?: string | null, calendar?: string | null, calendarSign?: string | null, syllabus?: string | null, syllabusSign?: string | null, createdAt: any, updatedAt: any, eduForm: { __typename: 'EduFormType', id: string, name: string, shortName: string }, direction: { __typename: 'DirectionType', id: string, name: string, code: string, eduService: { __typename: 'EduServiceType', id: string, name: string } } } | null, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } };

export type TeamsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  courseCount?: InputMaybe<Scalars['Float']>;
  courseCountGt?: InputMaybe<Scalars['Float']>;
}>;

export type TeamsQuery = { __typename?: 'Query', teams: { __typename: 'TeamTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename: 'TeamTypeEdge', node?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number, delete: boolean, createdAt: any, updatedAt: any, group?: { __typename: 'GroupType', id: string, name: string } | null, responsibleUsers: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, parent?: { __typename: 'TeamType', id: string, name: string, shortName: string, admission: number } | null, permissions: { __typename?: 'TeamPermissionsType', canViewTeamMembers: boolean, canChange: boolean, canDelete: boolean } } | null } | null> } };

export type ChatFieldsFragment = { __typename: 'ChatType', id: string, name?: string | null, avatar?: string | null, createdAt: any, updatedAt: any };

export type MembersFragment = { __typename: 'MemberType', id: string, role: MemberRole, notification: boolean, createdAt: any, updatedAt: any };

export type MessageFieldsFragment = { __typename: 'MessageType', id: string, text: string, pinned: boolean, createdAt: any, updatedAt: any, forwarded?: Array<{ __typename: 'MessageType', id: string } | null> | null, attachedFiles: Array<{ __typename: 'AttachedFileType', id: string, src: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> };

export type AddChatMutationVariables = Exact<{
  userIds: Array<Scalars['ID']> | Scalars['ID'];
  avatar?: InputMaybe<Scalars['Upload']>;
  name?: InputMaybe<Scalars['String']>;
}>;

export type AddChatMutation = { __typename?: 'Mutation', addChat: { __typename: 'AddChatMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, member?: { __typename?: 'MemberType', id: string } | null } };

export type AddMessageMutationVariables = Exact<{
  chatId: Scalars['ID'];
  text?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
  forwardedIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename: 'AddMessageMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeMemberPropertyMutationMutationVariables = Exact<{
  memberId: Scalars['ID'];
  field: Scalars['String'];
  value: Scalars['Boolean'];
}>;

export type ChangeMemberPropertyMutationMutation = { __typename?: 'Mutation', changeMemberProperty: { __typename: 'ChangeMemberPropertyMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeMessageStateMutationVariables = Exact<{
  messageIds: Array<Scalars['ID']> | Scalars['ID'];
  state: Scalars['String'];
}>;

export type ChangeMessageStateMutation = { __typename?: 'Mutation', changeMessageState: { __typename: 'ChangeMessageStateMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteMemberMutationVariables = Exact<{
  memberId: Scalars['ID'];
}>;

export type DeleteMemberMutation = { __typename?: 'Mutation', deleteMember: { __typename: 'DeleteMemberMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteMessagesMutationVariables = Exact<{
  messageIds: Array<Scalars['ID']> | Scalars['ID'];
  chatId: Scalars['ID'];
  forEveryone: Scalars['Boolean'];
}>;

export type DeleteMessagesMutation = { __typename?: 'Mutation', deleteMessages: { __typename: 'DeleteMessagesPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AttachedFilesQueryVariables = Exact<{
  chatId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
}>;

export type AttachedFilesQuery = { __typename?: 'Query', attachedFiles: Array<{ __typename: 'AttachedFileType', id: string, src: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> };

export type ChatMessagesQueryVariables = Exact<{
  chat?: InputMaybe<Scalars['ID']>;
  user?: InputMaybe<Scalars['ID']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  favorite?: InputMaybe<Scalars['Boolean']>;
  messageTextIcontains?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
}>;

export type ChatMessagesQuery = { __typename?: 'Query', chatMessages: { __typename?: 'ChatMessageTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'ChatMessageTypeEdge', node?: { __typename: 'ChatMessageType', id: string, delivered?: any | null, read?: any | null, favorite: boolean, deleted: boolean, createdAt: any, message?: { __typename: 'MessageType', id: string, text: string, pinned: boolean, createdAt: any, updatedAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, forwarded?: Array<{ __typename: 'MessageType', id: string } | null> | null, attachedFiles: Array<{ __typename: 'AttachedFileType', id: string, src: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> } | null } | null } | null> } };

export type MemberQueryVariables = Exact<{
  memberId: Scalars['ID'];
}>;

export type MemberQuery = { __typename?: 'Query', member: { __typename: 'MemberType', id: string, role: MemberRole, notification: boolean, favorite: boolean, createdAt: any, updatedAt: any, chat?: { __typename: 'ChatType', id: string, name?: string | null, avatar?: string | null, createdAt: any, updatedAt: any, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }> } | null } };

export type MembersQueryVariables = Exact<{
  chat?: InputMaybe<Scalars['ID']>;
  chatNameIcontains?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  excluded?: InputMaybe<Scalars['Boolean']>;
}>;

export type MembersQuery = { __typename?: 'Query', members: { __typename?: 'MemberTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename: 'MemberTypeEdge', node?: { __typename: 'MemberType', id: string, role: MemberRole, notification: boolean, favorite: boolean, excluded: boolean, createdAt: any, updatedAt: any, chat?: { __typename: 'ChatType', id: string, name?: string | null, avatar?: string | null, createdAt: any, updatedAt: any, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, lastMessage?: { __typename: 'MessageType', id: string, text: string, user?: { __typename: 'UserType', id: string, lastName: string, firstName: string } | null } | null } | null } | null } | null> } };

export type ChatMessagesSubscriptionSubscriptionVariables = Exact<{
  chatId?: InputMaybe<Scalars['ID']>;
}>;

export type ChatMessagesSubscriptionSubscription = { __typename?: 'Subscription', chatMessages: { __typename: 'ChatMessagesSubscription', action: ConsumerActionType, id: string, chatMessage?: { __typename: 'ChatMessageType', id: string, delivered?: any | null, read?: any | null, favorite: boolean, deleted: boolean, createdAt: any, message?: { __typename: 'MessageType', id: string, text: string, pinned: boolean, createdAt: any, updatedAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, forwarded?: Array<{ __typename: 'MessageType', id: string } | null> | null, attachedFiles: Array<{ __typename: 'AttachedFileType', id: string, src: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null }> } | null } | null } };

export type MembersSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;

export type MembersSubscriptionSubscription = { __typename?: 'Subscription', members: { __typename: 'MembersSubscription', action: ConsumerActionType, id: string, update?: boolean | null, member?: { __typename?: 'MemberType', id: string, role: MemberRole, notification: boolean, favorite: boolean, excluded: boolean, createdAt: any, updatedAt: any, chat?: { __typename: 'ChatType', id: string, name?: string | null, avatar?: string | null, createdAt: any, updatedAt: any, users: Array<{ __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any }>, lastMessage?: { __typename: 'MessageType', id: string, text: string, user?: { __typename: 'UserType', id: string, lastName: string, firstName: string } | null } | null } | null } | null } };

export type MailingFieldsFragment = { __typename: 'MailingType', id: string, dispatchers: any, address: string, header: string, text: string, attachments?: any | null, createdAt: any };

export type NoticeFieldsFragment = { __typename: 'NoticeType', id: string, kind: NoticeKind, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

type NoticeInterfaceFields_NoticeEmptyType_Fragment = { __typename: 'NoticeEmptyType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

type NoticeInterfaceFields_NoticeMailingType_Fragment = { __typename: 'NoticeMailingType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

type NoticeInterfaceFields_NoticePageType_Fragment = { __typename: 'NoticePageType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

export type NoticeInterfaceFieldsFragment = NoticeInterfaceFields_NoticeEmptyType_Fragment | NoticeInterfaceFields_NoticeMailingType_Fragment | NoticeInterfaceFields_NoticePageType_Fragment;

export type NotificationFieldsFragment = { __typename: 'NotificationType', id: string, hide: boolean, read: boolean, createdAt: any };

export type ChangeNotificationMutationVariables = Exact<{
  notificationId: Scalars['ID'];
  field: Scalars['String'];
  value: Scalars['Boolean'];
}>;

export type ChangeNotificationMutation = { __typename?: 'Mutation', changeNotification: { __typename: 'ChangeNotificationMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeNotificationsMutationVariables = Exact<{
  notificationsId: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
  field: Scalars['String'];
  value: Scalars['Boolean'];
}>;

export type ChangeNotificationsMutation = { __typename?: 'Mutation', changeNotifications: { __typename: 'ChangeNotificationsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteNoticeMutationVariables = Exact<{
  noticeId: Scalars['ID'];
}>;

export type DeleteNoticeMutation = { __typename?: 'Mutation', deleteNotice: { __typename: 'DeleteNoticeMutationPayload', success: boolean } };

export type NotificationQueryVariables = Exact<{
  notificationId: Scalars['ID'];
}>;

export type NotificationQuery = { __typename?: 'Query', notification: { __typename: 'NotificationType', id: string, hide: boolean, read: boolean, createdAt: any, notice: { __typename: 'NoticeEmptyType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticeMailingType', id: string, kind: number, payload: string, objectId: string, createdAt: any, mailing?: { __typename: 'MailingType', id: string, dispatchers: any, address: string, header: string, text: string, attachments?: any | null, createdAt: any } | null, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticePageType', id: string, kind: number, payload: string, objectId: string, createdAt: any, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, sections: Array<{ __typename: 'SectionFilesType', text: string, id: number, kind: number, position: number, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, size?: number | null, ext?: string | null, createdAt: any } | null>, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionGalleryType', text: string, id: number, kind: number, position: number, images: Array<{ __typename: 'FileType', id: string, name: string, src: string } | null>, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionTextType', text: string, id: number, kind: number, position: number, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionUsersType', id: number, kind: number, position: number, users: Array<{ __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null } | null>, user: { __typename?: 'UserType', id: string } } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null> } | null, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } } };

export type NotificationsQueryVariables = Exact<{
  userId: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  hide?: InputMaybe<Scalars['Boolean']>;
}>;

export type NotificationsQuery = { __typename?: 'Query', notifications: { __typename: 'NotificationTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename: 'NotificationTypeEdge', node?: { __typename: 'NotificationType', id: string, hide: boolean, read: boolean, createdAt: any, notice: { __typename: 'NoticeEmptyType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticeMailingType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticePageType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } } | null } | null> } };

export type NotificationsSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;

export type NotificationsSubscriptionSubscription = { __typename?: 'Subscription', notifications: { __typename: 'NotificationsSubscription', action: ConsumerActionType, id: string, notification?: { __typename: 'NotificationType', id: string, hide: boolean, read: boolean, createdAt: any, notice: { __typename: 'NoticeEmptyType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticeMailingType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | { __typename: 'NoticePageType', id: string, kind: number, payload: string, objectId: string, createdAt: any, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } } | null } };

export type CategoryFieldsFragment = { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any };

export type PageFieldsFragment = { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };

export type PageKindFieldsFragment = { __typename: 'PageKindType', id: string, name: string };

type SectionFields_SectionFilesType_Fragment = { __typename: 'SectionFilesType', text: string, id: number, kind: number, position: number, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, size?: number | null, ext?: string | null, createdAt: any } | null>, user: { __typename?: 'UserType', id: string } };

type SectionFields_SectionGalleryType_Fragment = { __typename: 'SectionGalleryType', text: string, id: number, kind: number, position: number, images: Array<{ __typename: 'FileType', id: string, name: string, src: string } | null>, user: { __typename?: 'UserType', id: string } };

type SectionFields_SectionTextType_Fragment = { __typename: 'SectionTextType', text: string, id: number, kind: number, position: number, user: { __typename?: 'UserType', id: string } };

type SectionFields_SectionUsersType_Fragment = { __typename: 'SectionUsersType', id: number, kind: number, position: number, users: Array<{ __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null } | null>, user: { __typename?: 'UserType', id: string } };

export type SectionFieldsFragment = SectionFields_SectionFilesType_Fragment | SectionFields_SectionGalleryType_Fragment | SectionFields_SectionTextType_Fragment | SectionFields_SectionUsersType_Fragment;

export type SegmentElementFieldsFragment = { __typename: 'SegmentElementType', id: string, view?: SegmentElementView | null, represent?: SegmentElementRepresent | null, width: number, columns: number, pageSize: number };

export type SegementFieldsFragment = { __typename: 'SegmentType', id: string, name?: string | null, align: SegmentAlign, view?: SegmentView | null, position: number, createdAt: any, updatedAt: any };

export type TagFieldsFragment = { __typename: 'TagType', id: string, name: string, createdAt: any };

export type AddCategoryMutationVariables = Exact<{
  avatar?: InputMaybe<Scalars['Upload']>;
  text: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
}>;

export type AddCategoryMutation = { __typename?: 'Mutation', addCategory: { __typename: 'AddCategoryMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, category?: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any, parent?: { __typename: 'CategoryType', id: string } | null, children: Array<{ __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null> } | null } };

export type ChangeCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
  text: Scalars['String'];
}>;

export type ChangeCategoryMutation = { __typename?: 'Mutation', changeCategory: { __typename: 'ChangeCategoryMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, category?: { __typename: 'CategoryType', id: string, text: string } | null } };

export type ChangeCategoryAvatarMutationVariables = Exact<{
  categoryId: Scalars['ID'];
  avatar?: InputMaybe<Scalars['Upload']>;
}>;

export type ChangeCategoryAvatarMutation = { __typename?: 'Mutation', changeCategoryAvatar: { __typename: 'ChangeCategoryAvatarMutationPayload', success: boolean, category?: { __typename: 'CategoryType', id: string, avatar?: string | null } | null } };

export type DeleteCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
}>;

export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeleteCategoryMutationPayload', success: boolean } };

export type AddPageMutationVariables = Exact<{
  avatar?: InputMaybe<Scalars['Upload']>;
  parallax?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
  signature?: InputMaybe<Scalars['String']>;
  hide?: InputMaybe<Scalars['Boolean']>;
  priority?: InputMaybe<Scalars['Boolean']>;
  kindId?: InputMaybe<Scalars['Int']>;
  categoryId: Scalars['ID'];
  tagNames?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
}>;

export type AddPageMutation = { __typename?: 'Mutation', addPage: { __typename?: 'AddPageMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string } | null } };

export type ChangePageAvatarMutationVariables = Exact<{
  pageId: Scalars['ID'];
  avatar?: InputMaybe<Scalars['Upload']>;
}>;

export type ChangePageAvatarMutation = { __typename?: 'Mutation', changePageAvatar: { __typename?: 'ChangePageAvatarMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type ChangePageBooleanPropertyMutationVariables = Exact<{
  pageId: Scalars['ID'];
  field: Scalars['String'];
  value: Scalars['Boolean'];
}>;

export type ChangePageBooleanPropertyMutation = { __typename?: 'Mutation', changePageBooleanProperty: { __typename?: 'ChangePageBooleanPropertyMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type ChangePageCategoryMutationVariables = Exact<{
  pageId: Scalars['ID'];
  categoryId: Scalars['ID'];
}>;

export type ChangePageCategoryMutation = { __typename?: 'Mutation', changePageCategory: { __typename?: 'ChangePageCategoryMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type ChangePageKindMutationVariables = Exact<{
  pageId: Scalars['ID'];
  pageKindId?: InputMaybe<Scalars['Int']>;
}>;

export type ChangePageKindMutation = { __typename?: 'Mutation', changePageKind: { __typename?: 'ChangePageKindMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type ChangePageTagsMutationVariables = Exact<{
  pageId: Scalars['ID'];
  tagNames: Array<Scalars['String']> | Scalars['String'];
}>;

export type ChangePageTagsMutation = { __typename?: 'Mutation', changePageTags: { __typename?: 'ChangePageTagsMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type ChangePageTitleMutationVariables = Exact<{
  pageId: Scalars['ID'];
  title: Scalars['String'];
}>;

export type ChangePageTitleMutation = { __typename?: 'Mutation', changePageTitle: { __typename?: 'ChangePageTitleMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, page?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } };

export type DeletePageMutationVariables = Exact<{
  pageId: Scalars['ID'];
}>;

export type DeletePageMutation = { __typename?: 'Mutation', deletePage: { __typename?: 'DeletePageMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AddSectionFilesMutationVariables = Exact<{
  pageId: Scalars['ID'];
  text: Scalars['String'];
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;

export type AddSectionFilesMutation = { __typename?: 'Mutation', addSectionFiles: { __typename: 'AddSectionFilesMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionFilesType', text: string, id: number, kind: number, position: number, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, size?: number | null, ext?: string | null, createdAt: any } | null>, user: { __typename?: 'UserType', id: string } } | null } };

export type AddSectionGalleryMutationVariables = Exact<{
  pageId: Scalars['ID'];
  text: Scalars['String'];
  images: Array<Scalars['Upload']> | Scalars['Upload'];
}>;

export type AddSectionGalleryMutation = { __typename?: 'Mutation', addSectionGallery: { __typename: 'AddSectionGalleryMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionGalleryType', text: string, id: number, kind: number, position: number, images: Array<{ __typename: 'FileType', id: string, name: string, src: string } | null>, user: { __typename?: 'UserType', id: string } } | null } };

export type AddSectionTextMutationVariables = Exact<{
  pageId: Scalars['ID'];
  text: Scalars['String'];
}>;

export type AddSectionTextMutation = { __typename?: 'Mutation', addSectionText: { __typename: 'AddSectionTextMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionTextType', text: string, id: number, kind: number, position: number, user: { __typename?: 'UserType', id: string } } | null } };

export type ChangeSectionFilesMutationVariables = Exact<{
  sectionId: Scalars['ID'];
  text: Scalars['String'];
  newFiles?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
  oldFiles: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type ChangeSectionFilesMutation = { __typename?: 'Mutation', changeSectionFiles: { __typename: 'ChangeSectionFilesMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionFilesType', text: string, id: number, kind: number, position: number, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, size?: number | null, ext?: string | null, createdAt: any } | null>, user: { __typename?: 'UserType', id: string } } | null } };

export type ChangeSectionGalleryMutationVariables = Exact<{
  sectionId: Scalars['ID'];
  text: Scalars['String'];
  newImages?: InputMaybe<Array<Scalars['Upload']> | Scalars['Upload']>;
  oldImages: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type ChangeSectionGalleryMutation = { __typename?: 'Mutation', changeSectionGallery: { __typename: 'ChangeSectionGalleryMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionGalleryType', text: string, id: number, kind: number, position: number, images: Array<{ __typename: 'FileType', id: string, name: string, src: string } | null>, user: { __typename?: 'UserType', id: string } } | null } };

export type ChangeSectionTextMutationVariables = Exact<{
  sectionId: Scalars['ID'];
  text: Scalars['String'];
}>;

export type ChangeSectionTextMutation = { __typename?: 'Mutation', changeSectionText: { __typename: 'ChangeSectionTextMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, section?: { __typename: 'SectionTextType', id: number, text: string } | null } };

export type DeleteSectionMutationVariables = Exact<{
  sectionId: Scalars['ID'];
}>;

export type DeleteSectionMutation = { __typename?: 'Mutation', deleteSection: { __typename?: 'DeleteSectionMutationPayload', success: boolean } };

export type AddTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type AddTagMutation = { __typename?: 'Mutation', addTag: { __typename?: 'AddTagMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, tag?: { __typename: 'TagType', id: string, name: string, createdAt: any } | null } };

export type CategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  parent?: InputMaybe<Scalars['ID']>;
}>;

export type CategoriesQuery = { __typename?: 'Query', categories: { __typename: 'CategoryTypeConnection', totalCount: number, edges: Array<{ __typename: 'CategoryTypeEdge', node?: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any, children: Array<{ __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null> } | null } | null> } };

export type CategoryQueryVariables = Exact<{
  categoryId: Scalars['ID'];
}>;

export type CategoryQuery = { __typename?: 'Query', category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any, parent?: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null, children: Array<{ __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null>, nc: Array<{ __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null> } };

export type PageQueryVariables = Exact<{
  pageId: Scalars['ID'];
}>;

export type PageQuery = { __typename?: 'Query', page: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, sections: Array<{ __typename: 'SectionFilesType', text: string, id: number, kind: number, position: number, files: Array<{ __typename: 'FileType', id: string, name: string, src: string, size?: number | null, ext?: string | null, createdAt: any } | null>, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionGalleryType', text: string, id: number, kind: number, position: number, images: Array<{ __typename: 'FileType', id: string, name: string, src: string } | null>, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionTextType', text: string, id: number, kind: number, position: number, user: { __typename?: 'UserType', id: string } } | { __typename: 'SectionUsersType', id: number, kind: number, position: number, users: Array<{ __typename: 'UserType', id: string, avatar?: string | null, lastName: string, firstName: string, sirName?: string | null } | null>, user: { __typename?: 'UserType', id: string } } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any, parent?: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null, nc: Array<{ __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any } | null> }, kind?: { __typename: 'PageKindType', id: string, name: string } | null, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null> } };

export type PageKindQueryVariables = Exact<{
  pageKindId: Scalars['ID'];
}>;

export type PageKindQuery = { __typename?: 'Query', pageKind: { __typename: 'PageKindType', id: string, name: string } };

export type PageKindsQueryVariables = Exact<{ [key: string]: never; }>;

export type PageKindsQuery = { __typename?: 'Query', pageKinds: Array<{ __typename: 'PageKindType', id: string, name: string }> };

export type PagesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['ID']>;
  kindId?: InputMaybe<Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type PagesQuery = { __typename?: 'Query', pages: { __typename: 'PageTypeConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename: 'PageTypeEdge', node?: { __typename: 'PageType', id: string, avatar?: string | null, parallax: boolean, title: string, views: number, signature?: string | null, hide: boolean, priority: boolean, createdAt: any, updatedAt: any, kind?: { __typename: 'PageKindType', id: string, name: string } | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null>, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null } | null } | null> } };

export type SegmentsQueryVariables = Exact<{ [key: string]: never; }>;

export type SegmentsQuery = { __typename?: 'Query', segments: Array<{ __typename: 'SegmentType', id: string, name?: string | null, align: SegmentAlign, view?: SegmentView | null, position: number, createdAt: any, updatedAt: any, elements: Array<{ __typename: 'SegmentElementType', id: string, view?: SegmentElementView | null, represent?: SegmentElementRepresent | null, width: number, columns: number, pageSize: number, pageKind: { __typename: 'PageKindType', id: string, name: string, pages: Array<{ __typename: 'PageType', id: string, avatar?: string | null, title: string, createdAt: any, updatedAt: any, signature?: string | null, category: { __typename: 'CategoryType', id: string, avatar?: string | null, text: string, position: number, createdAt: any, updatedAt: any }, user?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null, tags: Array<{ __typename: 'TagType', id: string, name: string, createdAt: any } | null> } | null> } } | null> }> };

export type TagsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
}>;

export type TagsQuery = { __typename?: 'Query', tags: { __typename?: 'TagTypeConnection', totalCount: number, edges: Array<{ __typename?: 'TagTypeEdge', node?: { __typename?: 'TagType', id: string, name: string } | null } | null> } };

export type ChildItemPropFieldsFragment = { __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number };

export type ItemPropContainerFieldsFragment = { __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null };

export type ItemPropFieldsFragment = { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null };

export type SubsectionFieldsFragment = { __typename: 'SubsectionType', id: string, url: string, header: string, itemPropContainers: Array<{ __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null }> };

export type AddChildItemPropMutationVariables = Exact<{
  input: AddChildItemPropMutationInput;
}>;

export type AddChildItemPropMutation = { __typename?: 'Mutation', addChildItemProp: { __typename: 'AddChildItemPropMutationPayload', success: boolean, childItemProp: { __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AddItemPropContainerMutationVariables = Exact<{
  input: AddItemPropContainerMutationInput;
}>;

export type AddItemPropContainerMutation = { __typename?: 'Mutation', addItemPropContainer: { __typename?: 'AddItemPropContainerMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }>, itemPropContainer?: { __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null } | null } };

export type AddRowMutationVariables = Exact<{
  input: AddRowMutationInput;
}>;

export type AddRowMutation = { __typename?: 'Mutation', addRow: { __typename: 'AddRowMutationPayload', success: boolean, itemPropContainer: { __typename: 'ItemPropContainerType', id: string, values: Array<Array<string | null> | null> }, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeChildItemPropMutationVariables = Exact<{
  input: ChangeChildItemPropMutationInput;
}>;

export type ChangeChildItemPropMutation = { __typename?: 'Mutation', changeChildItemProp: { __typename: 'ChangeChildItemPropMutationPayload', success: boolean, childItemProp: { __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type ChangeItemPropContainerMutationVariables = Exact<{
  input: ChangeItemPropContainerMutationInput;
}>;

export type ChangeItemPropContainerMutation = { __typename?: 'Mutation', changeItemPropContainer: { __typename: 'ChangeItemPropContainerMutationPayload', success: boolean, itemPropContainer: { __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null }, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string>, field: string }> } };

export type ChangeRowMutationVariables = Exact<{
  input: ChangeRowMutationInput;
}>;

export type ChangeRowMutation = { __typename?: 'Mutation', changeRow: { __typename: 'ChangeRowMutationPayload', success: boolean, itemPropContainer: { __typename: 'ItemPropContainerType', id: string, values: Array<Array<string | null> | null> }, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteChildItemPropMutationVariables = Exact<{
  input: DeleteChildItemPropMutationInput;
}>;

export type DeleteChildItemPropMutation = { __typename?: 'Mutation', deleteChildItemProp: { __typename: 'DeleteChildItemPropMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteItemPropContainerMutationVariables = Exact<{
  input: DeleteItemPropContainerMutationInput;
}>;

export type DeleteItemPropContainerMutation = { __typename?: 'Mutation', deleteItemPropContainer: { __typename?: 'DeleteItemPropContainerMutationPayload', success: boolean, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type DeleteRowMutationVariables = Exact<{
  input: DeleteRowMutationInput;
}>;

export type DeleteRowMutation = { __typename?: 'Mutation', deleteRow: { __typename: 'DeleteRowMutationPayload', success: boolean, itemPropContainer: { __typename: 'ItemPropContainerType', id: string, values: Array<Array<string | null> | null> }, errors: Array<{ __typename?: 'ErrorFieldType', field: string, messages: Array<string> }> } };

export type AddSubsectionMutationVariables = Exact<{
  input: AddSubsectionMutationInput;
}>;

export type AddSubsectionMutation = { __typename?: 'Mutation', addSubsection: { __typename?: 'AddSubsectionMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, subsection: { __typename: 'SubsectionType', id: string, url: string, header: string, itemPropContainers: Array<{ __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null }> } } };

export type ChangeSubsectionMutationVariables = Exact<{
  input: ChangeSubsectionMutationInput;
}>;

export type ChangeSubsectionMutation = { __typename?: 'Mutation', changeSubsection: { __typename?: 'ChangeSubsectionMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', field: string, messages: Array<string> }>, subsection: { __typename: 'SubsectionType', id: string, url: string, header: string, itemPropContainers: Array<{ __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null }> } } };

export type DeleteSubsectionMutationVariables = Exact<{
  input: DeleteSubsectionMutationInput;
}>;

export type DeleteSubsectionMutation = { __typename?: 'Mutation', deleteSubsection: { __typename?: 'DeleteSubsectionMutationPayload', success: boolean, errors: Array<{ __typename: 'ErrorFieldType', messages: Array<string>, field: string }> } };

export type SchemaQueryVariables = Exact<{ [key: string]: never; }>;

export type SchemaQuery = { __typename?: 'Query', subsections: Array<{ __typename: 'SubsectionType', id: string, url: string, header: string, itemPropContainers: Array<{ __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number }> | null } | null }> }> };

export type SubsectionQueryVariables = Exact<{
  url: Scalars['String'];
}>;

export type SubsectionQuery = { __typename?: 'Query', subsection?: { __typename: 'SubsectionType', id: string, url: string, header: string, itemPropContainers: Array<{ __typename?: 'ItemPropContainerType', id: string, header: string, isGenerated: boolean, values: Array<Array<string | null> | null>, schema?: { __typename: 'ItemPropType', id: string, itemProp: string, children?: Array<{ __typename: 'ChildItemPropType', id: string, itemProp: string, header: string, showPosition: number, valuePosition: number }> | null } | null }> } | null };

export type SubsectionsQueryVariables = Exact<{ [key: string]: never; }>;

export type SubsectionsQuery = { __typename?: 'Query', subsections: Array<{ __typename: 'SubsectionType', id: string, url: string, header: string }> };

export type UserInformationQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type UserInformationQuery = { __typename?: 'Query', userInformation?: { __typename: 'UserType', id: string, username: string, avatar?: string | null, email: string, firstName: string, lastName: string, sirName?: string | null, isActive: boolean, createdAt: any } | null };
