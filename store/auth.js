export const state = () => ({
  token: false,
  user: false
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },

  setToken(state, token) {
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
  login({ commit }, { email, password }) {
    commit('setToken', 'validToken')
    if (email === 'test@facomp.br' && password === '123') {
      return commit('setUser', {
        user: {
          email: email,
          password: password
        }
      })
    }
    throw new Error('Usuario Nao Encontrado')
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
