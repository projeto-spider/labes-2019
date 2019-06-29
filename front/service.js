import makeStudentServices from './students/service'
import makeDocumentsServices from './documents/service'
import makeSubjectsServices from './subjects/service'

export default function makeServices(axios) {
  return {
    students: makeStudentServices(axios),
    documents: makeDocumentsServices(axios),
    subjects: makeSubjectsServices(axios),
    pendencies: null
  }
}
