import selector from '@/front/selector'

export default function makeSubjectsServices(axios) {
  return {
    fetch(subjectId) {
      return axios.get(`/api/subjects/${subjectId}`)
    },

    fetchPage(page) {
      return axios.get(`/api/subjects/`, {
        params: {
          page
        }
      })
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
