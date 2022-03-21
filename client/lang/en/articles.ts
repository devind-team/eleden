export default {
  name: 'Publications',
  total: '@:shownOf',
  filters: {
    yearsFilter: {
      title: 'Filter by year',
      noFiltrationMessage: 'All years',
      multipleMessage: '{name} and {restLength} more years | {name} and {restLength} more years |' +
        ' {name} and {restLength} more years',
      year: '{year} year'
    }
  },
  tableHeaders: {
    id: '@:id',
    name: 'Publication',
    year: 'Publication year',
    users: 'Authors',
    user: 'Uploaded',
    index: 'Review type',
    createdAt: 'Uploaded',
    text: 'Field',
    value: 'Value'
  },
  addMenu: {
    addForm: {
      header: 'Adding a publication',
      buttonText: '@:add',
      hint: 'Add new authors, or choose from existing ones'
    },
    addBibtexForm: {
      header: 'Adding from bibtex file',
      buttonText: '@:add',
      file: 'Publication file .bib',
      index: 'Indexing publication'
    }
  },
  editForm: {
    header: 'Publication editing',
    buttonText: '@:save'
  },
  actions: {
    name: 'Deleting publication',
    delete: 'Delete',
    view: 'View',
    unpin: 'Unpin',
    add: '@:add',
    unload: '@:upload',
    fillForm: '@:fillForm',
    edit: 'Edit',
    addFromBibTex: 'Add from file (BibTex)'
  },
  unload: {
    docx: 'Unload to word',
    xlsx: 'Unload to excel',
    bibtex: 'Unload to BibTeX'
  },
  additionalFields: {
    additional: 'Additional fields',
    title: 'Publication title',
    authors: 'Author(s) of the publication',
    authUsers: 'Registered authors',
    year: 'Publication year',
    file: 'Publication file',
    index: 'Review type',
    fileInput: 'Attach a publication file',
    fileLink: 'Link to the publication file',
    address: 'Publisher\'s address',
    annote: 'Annotation',
    booktitle: 'Title of the book',
    chapter: 'Chapter number',
    crossref: 'Key of the cross-referenced entry',
    edition: 'Edition',
    editor: 'Name(s) of the editor(s)',
    eprint: 'Description of the electronic publication',
    howpublished: 'Publication method',
    institution: 'Institution that was involved in the publishing',
    journal: 'Journal',
    key: 'Key field',
    kind: 'Kind of publication',
    month: 'Month of publication',
    note: 'Notes',
    number: 'Journal number',
    organization: 'Conference sponsor',
    pages: 'Page numbers',
    publisher: 'Publisher\'s name',
    school: 'School where the publication was written',
    series: 'Series of books',
    type: 'Type of publication',
    typeChoice: {
      printed: 'Printed',
      handwritten: 'Handwritten'
    },
    url: 'Link to conference, publication',
    volume: 'Volume of a journal',
    workload: 'Workload'
  }
}
