export default function makePendenciesServices(axios) {
  return {
    fetch(studentId, subjectId) {
      return axios.get(`/api/students/${studentId}/pendencies/${subjectId}`)
    },

    fetchAll(studentId) {
      return axios.get(`/api/students/${studentId}/pendencies`)
    },

    update(studentId, studentSubjectPendencies) {
      const payload = studentSubjectPendencies
      return axios.post(`/api/students/${studentId}/pendencies/batch`, payload)
    }
  }
}
