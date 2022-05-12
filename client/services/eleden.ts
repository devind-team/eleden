import VueI18n from 'vue-i18n'
import { EduProgramType, DisciplineType, JobPostStatusType } from '~/types/graphql'

export const getInputDiscipline = (discipline?: DisciplineType) => ({
  id: discipline?.id ? discipline?.id : '',
  code: discipline?.code ? discipline?.code : '',
  name: discipline?.name ? discipline?.name : '',
  annotation: null,
  workProgram: null,
  existingAnnotation: discipline?.annotation ? { src: discipline?.annotation } : undefined,
  existingWorkProgram: discipline?.workProgram ? { src: discipline?.workProgram } : undefined,
  view: discipline?.view ? discipline?.view : null,
  parent: discipline?.parent ? discipline?.parent : null,
  users: discipline?.users ? discipline?.users : [],
  methodologicalSupport: discipline?.methodologicalSupport ? discipline?.methodologicalSupport : []
})

export const getInputEduProgram = (eduProgram?: EduProgramType) => ({
  id: eduProgram?.id ? eduProgram?.id : '',
  name: eduProgram?.name ? eduProgram?.name : '',
  adaptive: eduProgram?.adaptive ? eduProgram?.adaptive : false,
  admission: eduProgram?.admission ? eduProgram?.admission : new Date().getFullYear(),
  expedited: eduProgram?.expedited ? eduProgram?.expedited : false,
  eduForm: eduProgram?.eduForm ? eduProgram?.eduForm : null,
  direction: eduProgram?.direction ? eduProgram?.direction : null,
  description: null,
  existingDescription: eduProgram?.description ? { src: eduProgram?.description } : undefined,
  syllabus: null,
  existingSyllabus: eduProgram?.syllabus ? { src: eduProgram?.syllabus } : undefined,
  calendar: null,
  existingCalendar: eduProgram?.calendar ? { src: eduProgram?.calendar } : undefined,
  donor: null
})

export const getStatusText = (t: (key: VueI18n.Path, values?: VueI18n.Values) => VueI18n.TranslateResult, status: JobPostStatusType): string => {
  const statusText: string = String(t(status.active ? 'active' : 'notActive'))
  return `${status.name} (${statusText})`
}
