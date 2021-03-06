import { recovery, persist } from '@/front/persistence'

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
    return this.$services.users
      .login(username, password)
      .then(({ token, user }) => {
        this.$axios.setToken(token, 'Bearer')
        commit('setToken', token)
        return commit('setUser', user)
      })
  },

  register(
    { commit, dispatch },
    { email, username, password, role, fullName }
  ) {
    return this.$services.users.create({
      email,
      username,
      password,
      role,
      fullName
    })
  },
  update({ commit }, { id, username, password, fullName }) {
    return this.$services.users
      .update({ username, password, fullName }, id)
      .then(res => {
        if ((id === state.user, id)) {
          commit('setUser', res.data)
        }
      })
  },

  logout({ commit }) {
    commit('setToken', false)
    commit('setUser', false)
  }
}
