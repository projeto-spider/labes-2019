import studentServices from './students/service'
import documentsServices from './documents/service'

export default function makeServices(axios) {
  return {
    students: studentServices(axios),
    documents: documentsServices(axios),
    subjects: null,
    pendencies: null
  }
}
