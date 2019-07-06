export default function makeConfigServices(axios) {
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
      const payload = { value }
      return axios.put(`${url}/facultyDirectorName`, payload)
    },
    updateDeanName(value) {
      const payload = { value }
      return axios.put(`${url}/deanName`, payload)
    },
    updateDepartamentDirector(value) {
      const payload = { value }
      return axios.put(`${url}/departamentDirector`, payload)
    }
  }
}
