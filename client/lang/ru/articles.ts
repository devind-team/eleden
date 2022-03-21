export default {
  name: 'Публикации',
  total: '@:shownOf',
  filters: {
    yearsFilter: {
      title: 'Фильтр по годам',
      noFiltrationMessage: 'Все года',
      multipleMessage: '{name} и еще {restLength} лет | {name} и еще {restLength} год |' +
        ' {name} и еще {restLength} года',
      year: '{year} год'
    }
  },
  tableHeaders: {
    id: '@:id',
    name: 'Публикация',
    year: 'Год публикации',
    users: 'Авторы',
    user: 'Загрузил',
    index: 'Индексирование',
    createdAt: 'Загружено',
    text: 'Поле',
    value: 'Значение'
  },
  addMenu: {
    addForm: {
      header: 'Добавление публикации',
      buttonText: '@:add',
      hint: 'Добавьте новых авторов, либо выберите из существующих'
    },
    addBibtexForm: {
      header: 'Добавление из файла bibtex',
      buttonText: '@:add',
      file: 'Файл публикации .bib',
      index: 'Индексирование статьи'
    }
  },
  editForm: {
    header: 'Изменение публикации',
    buttonText: 'Сохранить'
  },
  actions: {
    name: 'Удаление публикации',
    delete: 'Удалить',
    view: 'Загрузить (PDF)',
    unpin: 'Открепить',
    add: '@:add',
    unload: '@:upload',
    fillForm: '@:fillForm',
    edit: 'Редактировать',
    addFromBibTex: 'Добавить из файла (BibTex)'
  },
  unload: {
    docx: 'Выгрузить в word',
    xlsx: 'Выгрузить в xlsx',
    bibtex: 'Выгрузить в BibTeX'
  },
  articleFields: {
    additional: 'Дополнительные поля',
    title: 'Название работы',
    authors: 'Автор(ы) публикации',
    authUsers: 'Зарегистрированные авторы',
    year: 'Год публикации',
    file: 'Файл публикации',
    index: 'Тип индексирования статьи',
    fileInput: 'Прикрепить файл публикации',
    fileLink: 'Ссылка на файл публикации',
    address: 'Адрес издателя',
    annote: 'Аннотация',
    booktitle: 'Наименование книги',
    chapter: 'Номер главы',
    crossref: 'Ключ кросс-ссылки',
    edition: 'Издание',
    editor: 'Имена редакторов',
    eprint: 'Описание электронной публикации',
    howpublished: 'Способ публикации',
    institution: 'Институт, вовлечённый в публикацию',
    journal: 'Журнал',
    key: 'Ключевое поле',
    kind: 'Тип публикации',
    month: 'Месяц публикации',
    note: 'Заметки',
    number: 'Номер журнала',
    organization: 'Организатор конференции',
    pages: 'Номера страниц, количество',
    publisher: 'Издатель',
    school: 'Институт, в котором защищалась публикация',
    series: 'Серия, в которой вышла книга',
    type: 'Вид публикации',
    typeChoice: {
      printed: 'Печатная',
      handwritten: 'Рукописная'
    },
    url: 'Ссылка на публикацию',
    volume: 'Том журнала',
    workload: 'Объем работы'
  }
}
