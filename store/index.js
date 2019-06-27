import { recovery, persist } from '@/front/persistence'

export const state = () => ({
  courseTag: recovery('courseTag')
})

export const mutations = {
  setCourseTag(state, courseTag) {
    persist('courseTag', courseTag)
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
