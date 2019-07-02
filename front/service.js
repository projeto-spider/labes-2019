import makeStudentServices from '@/front/students/service'
import makeDocumentsServices from '@/front/documents/service'
import makeSubjectsServices from '@/front/subjects/service'
import makePendenciesServices from '@/front/pendencies/service'
import makeDefensesServices from '@/front/defenses/service'
import makeSolicitationsServices from '@/front/solicitations/service'
import makeUsersServices from '@/front/users/service'

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
