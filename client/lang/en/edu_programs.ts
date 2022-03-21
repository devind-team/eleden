export default {
  name: 'Educational program of higher education',
  buttons: {
    add: '@:add',
    unload: '@:upload'
  },
  search: '@:search',
  shownOf: '@:shownOf',
  tableHeaders: {
    directionCode: 'Field of study code',
    directionName: 'Field of study name',
    admission: 'Recruitment year',
    name: 'Training profile',
    documents: 'Documents',
    eduLevel: 'Level of education',
    eduForm: 'Form of study'
  },
  files: {
    description: 'Description of educational program',
    syllabus: 'Syllabus',
    calendar: 'Academic calendar'
  },
  addMenu: {
    buttons: {
      fillForm: '@:fillForm',
      addFromPlx: 'Add from file (plx)',
      addFromFile: 'Add from file (excel, json, csv)',
      helpInstruction: 'Instruction to add'
    },
    addForm: {
      header: 'Add educational program',
      buttonText: '@:add'
    },
    fromPlxForm: {
      header: 'Add educational program from file (plx)',
      file: 'File',
      buttonText: '@:add'
    },
    fromFileForm: {
      header: 'Add educational program from file (excel, json, csv)',
      file: 'File',
      buttonText: '@:add'
    },
    helpDialog: {
      helpInstruction: '@:eduPrograms.addMenu.buttons.helpInstruction'
    }
  },
  form: {
    name: 'Training profile',
    adaptive: 'Program adaptivity',
    expedited: 'Accelerated program',
    admission: 'Admission year',
    eduFormId: 'Form of study',
    directionId: 'Field of study',
    description: 'Description',
    syllabus: 'Syllabus',
    calendar: 'Academic calendar',
    donor: 'Where to copy disciplines from'
  },
  menu: {
    disciplines: 'DisciplinesTable.vue',
    settings: '@:settings',
    description: 'Description'
  },
  disciplines: {
    name: 'DisciplinesTable.vue',
    buttons: {
      add: '@:add'
    },
    search: '@:search',
    shownOf: '@:shownOf',
    open: '@:open',
    tableHeaders: {
      code: 'Code',
      name: '@:name',
      view: 'Type',
      users: 'Authors',
      annotation: 'Annotation',
      workProgram: 'Work program',
      actions: 'Actions'
    }
  },
  settings: {
    header: '@:settings',
    subheader: '@:updatedAt',
    buttonText: '@:save',
    deleteButtonText: '@:delete',
    deleteItemName: 'educational program'
  },
  discipline: {
    eduPrograms: '@:eduPrograms.name',
    addMenu: {
      buttons: {
        fillForm: '@:fillForm',
        addDisciplinesFilesFromArchive: 'Add annotations and/or work program from archive',
        addMethodologicalSupportFromArchive: 'Add methodological support from archive',
        helpInstruction: '@:eduPrograms.addMenu.buttons.helpInstruction'
      },
      addForm: {
        header: 'Add discipline',
        buttonText: '@:add'
      },
      filesForm: {
        header: 'Add work programs of disciplines',
        buttonText: '@:add',
        archive: '@:archive'
      },
      methodologicalSupportForm: {
        header: 'Add methodological support of disciplines',
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
      eduProgramId: 'Educational program',
      viewId: '@:eduPrograms.disciplines.tableHeaders.view',
      parentId: 'Parent discipline',
      annotation: '@:eduPrograms.disciplines.tableHeaders.annotation',
      workProgram: '@:eduPrograms.disciplines.tableHeaders.workProgram',
      userIds: '@:eduPrograms.disciplines.tableHeaders.users',
      methodologicalSupport: 'Methodological support'
    },
    menu: {
      methodologicalSupport: 'Methodological support',
      competences: 'Competences',
      eduHours: 'Types of works',
      settings: '@:settings',
      description: 'Description'
    },
    description: {
      name: 'Description',
      updatedAt: '@:updatedAt',
      form: {
        code: '@:eduPrograms.disciplines.tableHeaders.code',
        name: '@:eduPrograms.disciplines.tableHeaders.name',
        view: '@:eduPrograms.disciplines.tableHeaders.view',
        parent: 'Parent discipline',
        users: '@:eduPrograms.disciplines.tableHeaders.users',
        annotation: '@:eduPrograms.disciplines.tableHeaders.annotation',
        workProgram: '@:eduPrograms.disciplines.tableHeaders.workProgram'
      }
    },
    methodologicalSupport: {
      name: 'Methodological support',
      buttons: {
        add: '@:add'
      },
      search: '@:search',
      shownOf: '@:shownOf',
      addMenu: {
        buttons: {
          fillForm: '@:fillForm',
          addFromArchive: 'Add from archive',
          helpInstruction: '@:eduPrograms.addMenu.buttons.helpInstruction'
        }
      },
      tableHeaders: {
        name: 'File',
        updatedAt: 'Updated',
        actions: 'Actions'
      },
      addForm: {
        header: 'Add methodological support',
        name: '@:name',
        src: 'File',
        buttonText: '@:add'
      },
      addFromArchiveForm: {
        header: 'Add methodological support',
        file: '@:archive',
        buttonText: '@:add'
      },
      helpDialog: {
        helpInstruction: '@:eduPrograms.discipline.methodologicalSupport.addMenu.buttons.helpInstruction'
      },
      changeForm: {
        header: 'Edit methodological support',
        name: '@:name',
        buttonText: '@:change'
      },
      tooltips: {
        open: '@:open',
        change: '@:change',
        delete: '@:delete'
      },
      deleteItemName: 'methodological support'
    },
    competences: {
      name: 'Competences',
      search: '@:search',
      shownOf: '@:shownOf',
      buttons: {
        add: '@:add',
        fillForm: '@:fillForm'
      },
      tableHeaders: {
        name: '@:name',
        code: 'Code',
        category: 'Category',
        actions: 'Actions'
      },
      addForm: {
        header: 'Add competences',
        name: '@:name',
        buttonText: '@:add'
      },
      tooltips: {
        delete: '@:delete'
      },
      deleteItemName: 'competence'
    },
    eduHours: {
      name: 'Types of works',
      search: '@:search',
      shownOf: '@:shownOf',
      buttons: {
        add: '@:add',
        fillForm: '@:fillForm'
      },
      tableHeaders: {
        courseNumber: 'Course',
        semesterNumber: 'Semester',
        value: 'Number of hours',
        workKind: {
          name: 'Type of work'
        },
        hoursKind: {
          name: 'Type of hours'
        },
        actions: 'Actions'
      },
      addForm: {
        header: 'Add types of works',
        workKind: 'Type of work',
        courseNumber: 'Course',
        semesterNumber: 'Semester',
        value: 'Number of hours',
        hoursKind: 'Type of hours',
        buttonText: '@:add'
      },
      tooltips: {
        delete: '@:delete'
      },
      deleteItemName: 'type of work'
    },
    settings: {
      header: '@:settings',
      subheader: '@:updatedAt',
      buttonText: '@:save',
      deleteButtonText: '@:delete',
      deleteItemName: 'discipline'
    }
  },
  description: {
    name: 'Description',
    updatedAt: '@:updatedAt',
    yes: '@:yes',
    no: '@:no',
    change: '@:change',
    delete: '@:delete',
    open: '@:open',
    form: {
      name: 'Training profile',
      adaptive: 'Program adaptivity',
      expedited: 'Accelerated program',
      admission: 'Admission year',
      eduForm: 'Form of study',
      direction: 'Field of study',
      description: 'Description',
      syllabus: 'Syllabus',
      calendar: 'Academic calendar'
    }
  },
  unload: {
    html: 'Unload to html',
    excel: 'Unload to xlsx'
  }
}
