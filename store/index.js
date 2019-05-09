export const state = () => ({
  courseTag: false
})

export const mutations = {
  setCourseTag(state, courseTag) {
    state.courseTag = courseTag
  }
}

export const getters = {
  getCourseTag({ courseTag }) {
    return courseTag
  }
}

export const actions = {
  courseTag({ commit }, { tag }) {
    commit('setCourseTag', tag)
  }
}
