export const state = () => ({
  directorName: '',
  departamentDirectorName: '',
  deanName: '',
  term: ''
})

export const mutations = {
  setDirectorName(state, directorName) {
    state.directorName = directorName
  },
  setDepartamentDirectorName(state, departamentDirectorName) {
    state.departamentDirectorName = departamentDirectorName
  },
  setDeanName(state, deanName) {
    state.deanName = deanName
  },
  setTerm(state, term) {
    state.term = term
  }
}

export const getters = {
  getDirectorName({ directorName }) {
    return directorName
  },
  getDepartamenteDirectorName({ departamentDirectorName }) {
    return departamentDirectorName
  },
  getDeanName({ deanName }) {
    return deanName
  },
  getTerm({ term }) {
    return term
  }
}

export const actions = {
  config({ commit }) {
    this.$services.config.fetch().then(res => {
      commit('setDirectorName', res.data.directorName)
      commit('setDepartamentDirectorName', res.data.departamentDirectorName)
      commit('setDeanName', res.data.deanName)
      commit('setTerm', res.data.term)
    })
  },
  updateConfig({ dispatch }, params) {
    this.$services.config.updateConfig(params).then(dispatch('config'))
  }
}
