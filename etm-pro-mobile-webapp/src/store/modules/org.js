const state = {
  orgChange: false
}

const mutations = {
  SET_CHANGE: (state, status) => {
    state.orgChange = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
