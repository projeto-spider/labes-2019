import makeStudentServices from '@/components/front/students/service'
import makeDocumentsServices from '@/components/front/documents/service'
import makeSubjectsServices from '@/components/front/subjects/service'
import makePendenciesServices from '@/components/front/pendencies/service'
import makeDefensesServices from '@/components/front/defenses/service'
import makeSolicitationsServices from '@/components/front/solicitations/service'
import makeUsersServices from '@/components/front/users/service'

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
