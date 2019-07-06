import selector from '@/front/selector'
export default function makeConfigServices(axios) {
  const paramList = [
    'facultyDirectorName',
    'deanName',
    'departamentDirector',
    'currentTerm'
  ]
  /* model = {
    name: 'Josivaldo',
    title: 'doutor',
    member: 'facomp',
    isTeacher: true
  } */
  const url = '/api/settings'
  return {
    fetch(key) {
      return axios.get(`${url}/${key}`)
    },
    updateTerm(value) {
      const payload = { value }
      return axios.put(`${url}/currentTerm`, payload)
    },
    updateFacultyDirectorName(value) {
      const payload = selector(value, paramList)
      return axios.put(`${url}/facultyDirectorName`, payload)
    },
    updateDeanName(value) {
      const payload = selector(value, paramList)
      return axios.put(`${url}/deanName`, payload)
    },
    updateDepartamentDirector(value) {
      const payload = selector(value, paramList)
      return axios.put(`${url}/departamentDirector`, payload)
    }
  }
}
