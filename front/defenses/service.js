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

    create(params) {
      const paramList = [
        'students',
        'local',
        'title',
        'keywords',
        'summary',
        'date',
        'time',
        'advisorName',
        'advisorTitle',
        'advisorType',
        'coAdvisorName',
        'coAdvisorTitle',
        'coAdvisorType',
        'evaluator1Name',
        'evaluator1Title',
        'evaluator1Type',
        'evaluator2Name',
        'evaluator2Title',
        'evaluator2Type',
        'evaluator3Name',
        'evaluator3Title',
        'evaluator3Type'
      ]
      const payload = selector(params, paramList)
      return axios.post('/api/defenses', payload)
    },

    update(defenseId, params) {
      const paramList = [
        'students',
        'local',
        'title',
        'keywords',
        'summary',
        'date',
        'time',
        'advisorName',
        'advisorTitle',
        'advisorType',
        'coAdvisorName',
        'coAdvisorTitle',
        'coAdvisorType',
        'evaluator1Name',
        'evaluator1Title',
        'evaluator1Type',
        'evaluator2Name',
        'evaluator2Title',
        'evaluator2Type',
        'evaluator3Name',
        'evaluator3Title',
        'evaluator3Type'
      ]
      const payload = selector(params, paramList)
      return axios.put(`/api/defenses/${defenseId}`, payload)
    },

    destroy(subjectId) {
      return axios.delete(`/api/defenses/${subjectId}`)
    }
  }
}
