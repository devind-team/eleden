export default {
  name: 'Образовательные программы высшего образования',
  buttons: {
    add: '@:add',
    unload: '@:upload'
  },
  search: '@:search',
  shownOf: '@:shownOf',
  tableHeaders: {
    directionCode: 'Код направления подготовки',
    directionName: 'Название направления подготовки',
    admission: 'Год набора',
    name: 'Профиль подготовки',
    documents: 'Документы',
    eduLevel: 'Уровень образования',
    eduForm: 'Форма обучения'
  },
  files: {
    description: 'Описание образовательной программы',
    syllabus: 'Учебный план',
    calendar: 'Календарный график'
  },
  addMenu: {
    buttons: {
      fillForm: '@:fillForm',
      addFromPlx: 'Добавить из файла (plx)',
      addFromFile: 'Добавить из файла (excel, json, csv)',
      helpInstruction: 'Инструкция по добавлению'
    },
    addForm: {
      header: 'Добавление образовательной программы',
      buttonText: '@:add'
    },
    fromPlxForm: {
      header: 'Добавление образовательной программы из файла (plx)',
      file: 'Файл',
      buttonText: '@:add'
    },
    fromFileForm: {
      header: 'Добавление образовательных программ из файла (excel, json, csv)',
      file: 'Файл',
      buttonText: '@:add'
    },
    helpDialog: {
      helpInstruction: '@:eduPrograms.addMenu.buttons.helpInstruction'
    }
  },
  form: {
    name: 'Профиль подготовки',
    adaptive: 'Адаптивность программы',
    expedited: 'Ускоренная программа',
    admission: 'Год поступления',
    eduFormId: 'Форма обучения',
    directionId: 'Направление подготовки',
    description: 'Описание',
    syllabus: 'Учебный план',
    calendar: 'Календарный учебный график',
    donor: 'Откуда копировать дисциплины'
  },
  menu: {
    disciplines: 'Дисциплины',
    settings: '@:settings',
    description: 'Описание'
  },
  disciplines: {
    name: 'Дисциплины',
    buttons: {
      add: '@:add'
    },
    search: '@:search',
    shownOf: '@:shownOf',
    open: '@:open',
    tableHeaders: {
      code: 'Код',
      name: 'Название',
      view: 'Тип',
      users: 'Авторы',
      annotation: 'Аннотация',
      workProgram: 'Рабочая программа',
      actions: 'Действия'
    },
    changeForm: {
      header: '@:settings',
      subheader: '@:updatedAt',
      buttonText: '@:save'
    },
    tooltips: {
      change: '@:change'
    }
  },
  settings: {
    header: '@:settings',
    subheader: '@:updatedAt',
    buttonText: '@:save',
    deleteButtonText: '@:delete',
    deleteItemName: 'образовательную программу'
  },
  discipline: {
    eduPrograms: '@:eduPrograms.name',
    addMenu: {
      buttons: {
        fillForm: '@:fillForm',
        addDisciplinesFilesFromArchive: 'Добавить аннотации и/или рабочие программы из архива',
        addMethodologicalSupportFromArchive: 'Добавить методическое обеспечение из архива',
        helpInstruction: 'Инструкция по добавлению'
      },
      addForm: {
        header: 'Добавление дисциплины',
        buttonText: '@:add'
      },
      filesForm: {
        header: 'Добавление рабочих программ дисциплин',
        buttonText: '@:add',
        archive: '@:archive'
      },
      methodologicalSupportForm: {
        header: 'Добавление методического обеспечения дисциплин',
        buttonText: '@:add',
        archive: '@:archive'
      },
      helpDialog: {
        helpInstruction: '@:eduPrograms.discipline.addMenu.buttons.helpInstruction'
      }
    },
    form: {
      code: '@:eduPrograms.disciplines.tableHeaders.code',
      name: '@:eduPrograms.disciplines.tableHeaders.name',
      eduProgramId: 'Образовательная программа',
      viewId: '@:eduPrograms.disciplines.tableHeaders.view',
      parentId: 'Родительская дисциплина',
      annotation: '@:eduPrograms.disciplines.tableHeaders.annotation',
      workProgram: '@:eduPrograms.disciplines.tableHeaders.workProgram',
      userIds: '@:eduPrograms.disciplines.tableHeaders.users',
      methodologicalSupport: 'Методическое обеспечение'
    },
    menu: {
      methodologicalSupport: 'Методическое обеспечение',
      competences: 'Компетенции',
      eduHours: 'Виды работ',
      settings: '@:settings',
      description: 'Описание'
    },
    description: {
      name: 'Описание',
      updatedAt: '@:updatedAt',
      form: {
        code: '@:eduPrograms.disciplines.tableHeaders.code',
        name: '@:eduPrograms.disciplines.tableHeaders.name',
        view: '@:eduPrograms.disciplines.tableHeaders.view',
        parent: 'Родительская дисциплина',
        users: '@:eduPrograms.disciplines.tableHeaders.users',
        annotation: '@:eduPrograms.disciplines.tableHeaders.annotation',
        workProgram: '@:eduPrograms.disciplines.tableHeaders.workProgram'
      }
    },
    methodologicalSupport: {
      name: 'Методическое обеспечение',
      buttons: {
        add: '@:add'
      },
      search: '@:search',
      shownOf: '@:shownOf',
      addMenu: {
        buttons: {
          fillForm: '@:fillForm',
          addFromArchive: 'Добавить из архива',
          helpInstruction: 'Инструкция по добавлению'
        }
      },
      tableHeaders: {
        name: 'Файл',
        updatedAt: 'Обновлен',
        actions: 'Действия'
      },
      addForm: {
        header: 'Добавление методического обеспечения',
        name: 'Название',
        src: 'Файл',
        buttonText: '@:add'
      },
      addFromArchiveForm: {
        header: 'Добавление методического обеспечения',
        file: '@:archive',
        buttonText: '@:add'
      },
      helpDialog: {
        helpInstruction: '@:eduPrograms.discipline.methodologicalSupport.addMenu.buttons.helpInstruction'
      },
      changeForm: {
        header: 'Изменение методического обеспечения',
        name: 'Название',
        buttonText: '@:change'
      },
      tooltips: {
        open: '@:open',
        change: '@:change',
        delete: '@:delete'
      },
      deleteItemName: 'методическое обеспечение'
    },
    competences: {
      name: 'Компетенции',
      search: '@:search',
      shownOf: '@:shownOf',
      buttons: {
        add: '@:add',
        fillForm: 'Заполнить форму'
      },
      tableHeaders: {
        name: '@:name',
        code: 'Код',
        category: 'Категория',
        actions: 'Действия'
      },
      addForm: {
        header: 'Добавление компетенции',
        name: 'Название',
        buttonText: '@:add'
      },
      tooltips: {
        delete: '@:delete'
      },
      deleteItemName: 'компетенцию'
    },
    eduHours: {
      name: 'Виды работ',
      search: '@:search',
      shownOf: '@:shownOf',
      buttons: {
        add: '@:add',
        fillForm: 'Заполнить форму'
      },
      tableHeaders: {
        courseNumber: 'Курс',
        semesterNumber: 'Семестр',
        value: 'Количество часов',
        workKind: {
          name: 'Вид работы'
        },
        hoursKind: {
          name: 'Тип часов'
        },
        actions: 'Действия'
      },
      addForm: {
        header: 'Добавление видов работ',
        workKind: 'Вид работы',
        courseNumber: 'Курс',
        semesterNumber: 'Семестр',
        value: 'Количество часов',
        hoursKind: 'Тип часов',
        buttonText: '@:add'
      },
      tooltips: {
        delete: '@:delete'
      },
      deleteItemName: 'вид работы'
    },
    settings: {
      header: '@:settings',
      subheader: '@:updatedAt',
      buttonText: '@:save',
      deleteButtonText: '@:delete',
      deleteItemName: 'дисциплину'
    }
  },
  description: {
    name: 'Описание',
    updatedAt: '@:updatedAt',
    yes: '@:yes',
    no: '@:no',
    change: '@:change',
    delete: '@:delete',
    open: '@:open',
    form: {
      name: 'Профиль подготовки',
      adaptive: 'Адаптивность программы',
      expedited: 'Ускоренная программа',
      admission: 'Год поступления',
      eduForm: 'Форма обучения',
      direction: 'Направление подготовки',
      description: 'Описание',
      syllabus: 'Учебный план',
      calendar: 'Календарный учебный график'
    }
  },
  unload: {
    html: 'Выгрузить в html',
    excel: 'Выгрузить в xlsx'
  }
}
