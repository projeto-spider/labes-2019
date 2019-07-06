import selector from '@/front/selector'
export default function makeConfigServices(axios) {
  const paramList = [
    'facultyDirectorName',
    'deanName',
    'departamentDirector',
    'currentTerm'
  ]
  const url = 'placeholder'
  return {
    fetch() {
      return axios.get()
    },
    updateTerm(params) {
      const payload = selector(params, paramList)
      return axios.put(url, payload)
    },
    updateFacultyDirectorName(params) {
      const payload = selector(params, paramList)
      return axios.put(url, payload)
    },
    updateDeanName(params) {
      const payload = selector(params, paramList)
      return axios.put(url, payload)
    },
    updateDepartamentDirector(params) {
      const payload = selector(params, paramList)
      return axios.put(url, payload)
    }
  }
}
