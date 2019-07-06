import selector from '@/front/selector'

export default function makeDefensesServices(axios) {
  return {
    fetch(defenseId) {
      return axios.get(`/api/defenses/${defenseId}`)
    },

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
        'registrationNumbers',
        'course',
        'local',
        'title',
        'keywords',
        'summary',
        'date',
        'time',
        'advisorName',
        'advisorTitle',
        'advisorType',
        'advisorIsTeacher',
        'coAdvisorName',
        'coAdvisorTitle',
        'coAdvisorType',
        'coAdvisorIsTeacher',
        'evaluator1Name',
        'evaluator1Title',
        'evaluator1Type',
        'evaluator1IsTeacher',
        'evaluator2Name',
        'evaluator2Title',
        'evaluator2Type',
        'evaluator2IsTeacher',
        'evaluator3Name',
        'evaluator3Title',
        'evaluator3Type',
        'evaluator3IsTeacher',
        'status'
      ]
      const payload = selector(params, paramList)
      return axios.post('/api/defenses', payload)
    },

    update(defenseId, params) {
      const paramList = [
        'status',
        'students',
        'registrationNumbers',
        'course',
        'local',
        'title',
        'keywords',
        'summary',
        'date',
        'time',
        'advisorName',
        'advisorTitle',
        'advisorType',
        'advisorIsTeacher',
        'coAdvisorName',
        'coAdvisorTitle',
        'coAdvisorType',
        'coAdvisorIsTeacher',
        'evaluator1Name',
        'evaluator1Title',
        'evaluator1Type',
        'evaluator1IsTeacher',
        'evaluator2Name',
        'evaluator2Title',
        'evaluator2Type',
        'evaluator2IsTeacher',
        'evaluator3Name',
        'evaluator3Title',
        'evaluator3Type',
        'evaluator3IsTeacher',
        'grade'
      ]
      const payload = selector(params, paramList)
      return axios.put(`/api/defenses/${defenseId}`, payload)
    },

    destroy(defenseId) {
      return axios.delete(`/api/defenses/${defenseId}`)
    }
  }
}
