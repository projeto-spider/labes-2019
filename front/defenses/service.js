import selector from '@/front/selector'

export default function makeDefensesServices(axios) {
  return {
    fetchPage(params) {
      const paramList = ['page', 'query', 'course', 'status']
      const payload = { params: selector(params, paramList, { page: 1 }) }
      return axios.get('/api/defenses', payload)
    },

    fetchAll() {
      return axios.get('/api/defenses', {
        params: {
          paginate: false
        }
      })
    },

    create(params) {
      const payload = selector(params, ['name'])
      return axios.post('/api/subjects', payload)
    },

    update(defenseId, params) {
      const paramList = ['page', 'query', 'course', 'status']
      const payload = selector(params, paramList)
      return axios.put(`/api/defense/${defenseId}`, payload)
    },

    destroy(subjectId) {
      return axios.delete(`/api/subjects/${subjectId}`)
    }
  }
}
