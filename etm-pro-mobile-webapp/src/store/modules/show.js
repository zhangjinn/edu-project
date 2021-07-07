const state = {
  showBottom: true,
  showTabBar: true
}

const mutations = {
  // 底部按钮显示状态
  SET_SHOW: (state, status) => {
    state.showBottom = status
  },
  // 内容区覆盖整个页面
  SET_TAB_BAR: (state, status) => {
    state.showTabBar = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
