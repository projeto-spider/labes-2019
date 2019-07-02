import selector from '@/components/front/selector'

export default function makePendenciesServices(axios) {
  return {
    fetch(studentId, subjectId) {
      return axios.get(`/api/students/${studentId}/pendencies/${subjectId}`)
    },

    fetchAll(studentId) {
      return axios.get(`/api/students/${studentId}/pendencies`)
    },

    update(studentId, subjectId, params) {
      const payload = selector(params, ['studentId', 'subjectId'])
      return axios.post(
        `/api/students/${studentId}/pendencies/${subjectId}`,
        payload
      )
    }
  }
}
