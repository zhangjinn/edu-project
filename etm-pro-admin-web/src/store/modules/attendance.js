export default {
  namespaced: true,
  state: {
    attendanceCustomInfo: {}
  },
  mutations: {
    SET_ATTENDANCE_CUSTOMER_INFO(state, data) {
      state.attendanceCustomInfo = data
    }
  },
  actions: {
    set_attendance_customer_info({ commit }, data) {
      commit('SET_ATTENDANCE_CUSTOMER_INFO', data)
    }
  }
}
