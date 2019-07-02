import selector from '../selector'

export default function makeStudentServices(axios) {
  return {
    fetch(id) {
      return axios.get(`/api/students/${id}`)
    },

    fetchPage(params) {
      const paramList = [
        'name',
        'course',
        'email',
        'registrationNumber',
        'isActive',
        'isGraduating',
        'isConcluding',
        'order',
        'page',
        'isForming',
        'isFit',
        'isAcademicHighlight',
        'prescribed',
        'cancelled',
        'mailingList',
        'noCrg',
        'sort'
      ]
      const payload = selector(params, paramList, {
        page: 1,
        order: 'asc'
      })
      return axios.get('/api/students', payload)
    },

    fetchEmailChanges(mailingList) {
      return axios.get('/api/students/email-changes', {
        params: {
          mailingList
        }
      })
    },

    update(studentId, params) {
      const paramList = [
        'name',
        'course',
        'email',
        'registrationNumber',
        'isActive',
        'isGraduating',
        'isConcluding',
        'isForming',
        'isFit',
        'isAcademicHighlight',
        'prescribed',
        'cancelled',
        'mailingList',
        'mailingListToRemove',
        'mailingListToAdd',
        'crg'
      ]
      const payload = selector(params, paramList)
      return axios.put(`/api/students/${studentId}`, payload)
    },

    updateEmailChanges(mailingList) {
      return axios.post('/api/students/update-mailing-list', {
        params: {
          mailingList
        }
      })
    },

    importFromCsv(payload) {
      return axios.post('/api/students/from-csv', payload)
    }
  }
}
