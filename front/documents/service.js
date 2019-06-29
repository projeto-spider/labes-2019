export default function makeDocumentsServices(axios) {
  return {
    fetch(studentId, documentId) {
      return axios.get(`/api/students/${studentId}/documents/${documentId}`)
    },

    fetchAll(studentId) {
      return axios.get(`/api/students/${studentId}/documents`)
    },

    update(studentId, documentId, payload) {
      return axios.put(
        `/api/students/${studentId}/documents/${documentId}`,
        payload
      )
    },

    destroy(studentId, documentId) {
      return axios.delete(`/api/students/${studentId}/documents/${documentId}`)
    }
  }
}
