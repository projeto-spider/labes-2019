import selector from '@/front/selector'

export default function makeUsersServices(axios) {
  return {
    fetch(userId) {
      return axios.get(`/api/users/${userId}`)
    },

    fetchPage(page) {
      return axios.get(`/api/users/`, {
        params: {
          page
        }
      })
    },

    create(params) {
      const paramList = ['username', 'email', 'role']
      const payload = selector(params, paramList)
      return axios.post('/api/users', payload)
    }
  }
}
