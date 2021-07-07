export default {
  namespaced: true,
  store: {
    semesterId: '', // 学期id
    semesterName: '', // 学期名称
    weekId: '', // 周次id
    weekName: '', // 周次名称
    gradeId: '', // 年级id
    gradeName: ''// 年级名称
  },
  mutations: {
    set_semester_id(state, data) {
      state.semesterId = data
    },
    set_semester_name(state, data) {
      state.semesterName = data
    },
    set_week_id(state, data) {
      state.weekId = data
    },
    set_week_name(state, data) {
      state.weekName = data
    },
    set_grade_id(state, data) {
      state.gradeId = data
    },
    set_grade_name(state, data) {
      state.gradeName = data
    }
  }
}
