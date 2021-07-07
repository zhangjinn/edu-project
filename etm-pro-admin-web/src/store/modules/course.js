export default {
  namespaced: true,
  state: {
    courseId: ''
  },
  mutations: {
    SET_COURSE_ID(state, data) {
      state.courseId = data
    }
  },
  actions: {
    set_course_id({ commit }, data) {
      commit('SET_COURSE_ID', data)
    }
  }
}
