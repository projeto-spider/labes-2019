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
  configTerm({ commit }) {
    this.$services.config.fetch('currentTerm').then(res => {
      // eslint-disable-next-line no-console
      console.log(res.data)
      commit('setTerm', res.data.currentTerm)
    })
  },
  configFacultyDirector({ commit }) {
    this.$services.config.fetch('facultyDirectorName').then(res => {
      commit('setTerm', res.data.term)
    })
  },
  configDepartamentDirector({ commit }) {
    this.$services.config.fetch('departamentDirector').then(res => {
      commit('setTerm', res.data.term)
    })
  },
  configDeanName({ commit }) {
    this.$services.config.fetch('deanName').then(res => {
      commit('setTerm', res.data.term)
    })
  },
  updateConfigTerm({ dispatch }, params) {
    this.$services.config.updateTerm(params).then(dispatch('configTerm'))
  },
  updateConfigFacultyDirectorName({ dispatch }, params) {
    this.$services.config
      .updateFacultyDirectorName(params)
      .then(dispatch('configFacultyDirector'))
  },
  updateDeanName({ dispatch }, params) {
    this.$services.config
      .updateDeanName(params)
      .then(dispatch('configDepartamentDirector'))
  },
  updateDepartamentDirector({ dispatch }, params) {
    this.$services.config
      .updateDepartamentDirector(params)
      .then(dispatch('configDeanName'))
  }
}
