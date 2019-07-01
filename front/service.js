import makeStudentServices from './students/service'
import makeDocumentsServices from './documents/service'
import makeSubjectsServices from './subjects/service'
import makePendenciesServices from './pendencies/service'
import makeDefensesServices from './pendencies/service'

export default function makeServices(axios) {
  return {
    students: makeStudentServices(axios),
    documents: makeDocumentsServices(axios),
    subjects: makeSubjectsServices(axios),
    pendencies: makePendenciesServices(axios),
    defenses: makeDefensesServices(axios),
    solicitations: null,
    users: null,
    defenses: null
  }
}
