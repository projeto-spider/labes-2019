import selector from '@/front/selector'

export default function makeDefensesServices(axios) {
  return {
    fetchPage(params) {
      const paramList = ['page', 'query', 'course', 'status']
      const options = { params: selector(params, paramList, { page: 1 }) }
      return axios.get('/api/defenses', options)
    },

    fetchAll() {
      return axios.get('/api/defenses', {
        params: {
          paginate: false
        }
      })
    },

    create(payload) {
      return axios.post('/api/defenses', payload)
    },

    update(defenseId, payload) {
      return axios.put(`/api/defenses/${defenseId}`, payload)
    },

    destroy(subjectId) {
      return axios.delete(`/api/defense/${subjectId}`)
    }
  }
}
