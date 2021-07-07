const state = {
  settingState: 'time', // 应用设置中菜单栏的选项
  queryClass: undefined, // 查询的班级名
  queryWeek: undefined, // 查询的周数
  handleScheduleId: undefined // 要进行操作的（新增、详情、删除、修改）周程项的id
}

const mutations = {
  SET_SETTINGSTATE: (state, setting) => {
    state.settingState = setting
  },
  SET_QUERY: (state, query) => {
    state.queryClass = query.queryClass
    state.queryWeek = query.queryWeek
  },
  SET_HANDLESCHEDULEID: (state, id) => {
    state.handleScheduleId = id
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

