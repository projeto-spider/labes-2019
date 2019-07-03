import selector from '@/front/selector'

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

      const options = {
        params: selector(params, paramList, {
          page: 1,
          order: 'asc'
        })
      }
      return axios.get('/api/students', options)
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
    updateAcademicHighlight(studentId) {
      return axios.put('/api/students/update-academic-highlight', {
        id: studentId
      })
    },
    updateEmailChanges(mailingList) {
      return axios.post('/api/students/update-mailing-list', {
        params: {
          mailingList
        }
      })
    },

    importFromCsv(studentCsv) {
      const payload = new FormData()
      payload.append('csv', this.studentsCsv)
      return axios.post('/api/students/from-csv', payload)
    }
  }
}
