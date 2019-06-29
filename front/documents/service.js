export default function makeDocumentsServices(axios) {
  return {
    fetch(studentId) {
      return axios.get(`/api/students/${studentId}/documents`)
    },

    update(studentId, payload) {
      return axios.post(`/api/students/${studentId}/documents`, payload)
    },

    destroy(studentId) {
      return axios.delete(`/api/students/${studentId}/documents`)
    }
  }
}
