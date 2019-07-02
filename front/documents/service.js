export default function makeDocumentsServices(axios) {
  return {
    fetch(studentId, documentId) {
      return axios.get(`/api/students/${studentId}/documents/${documentId}`)
    },

    fetchAll(studentId) {
      return axios.get(`/api/students/${studentId}/documents`)
    },
    create(studentId, params) {
      const { file, type } = params
      const payload = new FormData()
      payload.append('file', file)
      payload.append('documentType', type)
      return axios.post(`/api/students/${studentId}/documents`, payload)
    },
    destroy(studentId, documentId) {
      return axios.delete(`/api/students/${studentId}/documents/${documentId}`)
    }
  }
}
