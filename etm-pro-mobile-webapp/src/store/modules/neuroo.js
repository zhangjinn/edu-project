const state = {
  tabActiveType: null
}

const mutations = {
  SET_ACTIVE: (state, status) => {
    state.tabActiveType = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
