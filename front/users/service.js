import selector from '@/front/selector'

export default function makeUsersServices(axios) {
  return {
    fetch(userId) {
      return axios.get(`/api/users/${userId}`)
    },

    fetchPage(params) {
      const paramList = ['username', 'email', 'role', 'password', 'page']
      const options = selector(params, paramList)
      return axios.get(`/api/users/`, {
        params: {
          ...options
        }
      })
    },
    login(username, password) {
      return axios.$post('/api/auth', { username, password })
    },

    create(params) {
      const paramList = ['username', 'email', 'role', 'password', 'fullName']
      const payload = selector(params, paramList)
      return axios.post('/api/users', payload)
    },
    update(params, id) {
      const paramList = ['username', 'email', 'role', 'password', 'fullName']
      const payload = selector(params, paramList)
      return axios.put(`/api/users/${id}`, payload)
    }
  }
}
