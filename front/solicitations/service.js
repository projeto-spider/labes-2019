import selector from '@/front/selector'

export default function makeSolicitationsServices(axios) {
  return {
    create(params) {
      const paramList = [
        'name',
        'email',
        'registrationNumber',
        'type',
        'course',
        'admissionType'
      ]
      const payload = selector(params, paramList)
      return axios.post('/api/solicitations', payload)
    }
  }
}
