import selector from '../selector'

export default function makeDefensesServices(axios) {
  return {
    fetchPage(params) {
      const paramList = ['page', 'query', 'course', 'status']
      const payload = selector(params, paramList, { page: 1 })
      return axios.get('/api/defenses', payload)
    },

    fetchAll() {
      return axios.get('/api/subjects/', {
        params: {
          paginate: false
        }
      })
    },

    create(params) {
      const payload = selector(params, ['name'])
      return axios.post('/api/subjects', payload)
    },

    update(subjectId, params) {
      const payload = selector(params, ['name'])
      return axios.put(`/api/subjects/${subjectId}`, payload)
    },

    destroy(subjectId) {
      return axios.delete(`/api/subjects/${subjectId}`)
    }
  }
}
