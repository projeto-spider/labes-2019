import selector from '../selector'

export default function makeSubjectsServices(axios) {
  return {
    fetch(subjectId) {
      return axios.get(`/api/subjects/${subjectId}`)
    },

    fetchPage(page) {
      return axios.get(`/api/subjects/?page=${page}`)
    },

    fetchAll() {
      return axios.get('/api/subjects/?paginate=0')
    },

    create(params) {
      const payload = selector(params, ['name'])
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
