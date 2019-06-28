import studentServices from './students/service'

export default function makeServices(axios) {
  return {
    students: studentServices(axios),
    documents: null,
    subjects: null,
    pendencies: null
  }
}
