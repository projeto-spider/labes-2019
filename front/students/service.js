import select from '../selector'

export default function makeStudentServices(axios) {
  return {
    fetch(id) {
      return axios.get(`/api/students/${id}`)
    },

    fetchPage(
      {
        name,
        course,
        email,
        registrationNumber,
        isActive,
        isGraduating,
        isConcluding,
        order,
        page,
        isForming,
        isFit,
        isAcademicHighlight,
        prescribed,
        cancelled,
        mailingList,
        noCrg,
        sort
      },
      paramList
    ) {
      const payload = select(arguments[0], paramList, {
        page: 1,
        order: 'asc'
      })
      return axios.get('/api/students', payload)
    },

    update(studentId, payload) {
      return axios.put(`/api/students/${studentId}`, payload)
    },

    importFromCsv(body) {
      return axios.post('/api/students/from-csv', body)
    }
  }
}
