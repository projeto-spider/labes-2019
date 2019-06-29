export default function makeSubjectsServices(axios) {
  return {
    fetch(subjectId) {
      return axios.get(`/api/subjects/${subjectId}`)
    },

    fetchAll() {
      return axios.get('/api/subjects')
    },

    create(payload) {
      return axios.post('/api/subjects', payload)
    },

    update(subjectId, payload) {
      return axios.put(`/api/subjects/${subjectId}`, payload)
    },

    destroy(subjectId) {
      return axios.delete(`/api/subjects/${subjectId}`)
    }
  }
}
