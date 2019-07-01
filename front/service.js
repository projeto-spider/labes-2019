import makeStudentServices from './students/service'
import makeDocumentsServices from './documents/service'
import makeSubjectsServices from './subjects/service'
import makePendenciesServices from './pendencies/service'
import makeDefensesServices from './defenses/service'
import makeSolicitationsServices from './solicitations/service'
import makeUsersServices from './users/service'

export default function makeServices(axios) {
  return {
    students: makeStudentServices(axios),
    documents: makeDocumentsServices(axios),
    subjects: makeSubjectsServices(axios),
    pendencies: makePendenciesServices(axios),
    defenses: makeDefensesServices(axios),
    solicitations: makeSolicitationsServices(axios),
    users: makeUsersServices(axios)
  }
}
