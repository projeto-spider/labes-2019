export default function studentServices(axios) {
  return {
    fetch: id => {
      return axios.get(`/api/students/${id}`)
    },

    fetchPage: ({
      name,
      course,
      email,
      registrationNumber,
      isActive,
      isGraduating,
      isConcluding,
      order = 'asc',
      page = 1,
      isForming,
      isFit,
      isAcademicHighlight,
      prescribed,
      cancelled,
      mailingList,
      noCrg,
      sort
    }) => {
      const payload = {}
      const params = arguments[0]
      Object.keys(params).forEach(key => {
        if (params[key]) {
          payload[key] = params[key]
        }
      })

      return axios.get('/api/students', params)
    },

    update: (studentId, payload) => {
      return axios.put(`/api/students/${studentId}`, payload)
    },

    importFromCsv: body => {
      return axios.post('/api/students/from-csv', body)
    }
  }
}
