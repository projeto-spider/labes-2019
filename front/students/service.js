import selector from '@/front/selector'

export default function makeStudentServices(axios) {
  const studentParams = [
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
    'academicHighlight',
    'prescribed',
    'cancelled',
    'mailingList',
    'noCrg',
    'sort',
    'cd',
    'crg'
  ]
  return {
    fetch(id) {
      return axios.get(`/api/students/${id}`)
    },

    fetchPage(params) {
      const options = {
        params: selector(params, studentParams, {
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
      const payload = selector(params, studentParams)
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
      payload.append('csv', studentCsv)
      return axios.post('/api/students/from-csv', payload)
    }
  }
}
