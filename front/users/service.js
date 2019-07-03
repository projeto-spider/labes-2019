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
    login(username, password) {
      return axios.$post('/api/auth', { username, password })
    },

    create(params) {
      const paramList = ['username', 'email', 'role', 'password']
      const payload = selector(params, paramList)
      return axios.post('/api/users', payload)
    }
  }
}
