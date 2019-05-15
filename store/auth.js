export const state = () => ({
  token: recovery('token'),
  user: recovery('user')
})

export const mutations = {
  setUser(state, user) {
    persist('user', user)
    state.user = user
  },

  setToken(state, token) {
    persist('token', token)
    state.token = token
  }
}

export const getters = {
  isLoggedIn({ token }) {
    return !!token
  },

  currentUser({ user }) {
    return user
  }
}

export const actions = {
  login({ commit }, { username, password }) {
    return this.$axios
      .$post('/api/auth', { username, password })
      .then(({ token, user }) => {
        this.$axios.setToken(token, 'Bearer')
        commit('setToken', token)
        return commit('setUser', user)
      })
  },

  register({ commit, dispatch }, { email, name, password }) {
    return this.$axios
      .$post('/api/users', { email, name, password })
      .then(user => {
        return dispatch('login', { email, password })
      })
  },

  logout({ commit }) {
    commit('setToken', false)
    commit('setUser', false)
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function recovery(key) {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : false
}
