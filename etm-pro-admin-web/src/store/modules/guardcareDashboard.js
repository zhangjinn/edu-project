const state = {
  pageEntry: null
}

const mutations = {
  SET_PAGEENTRY: (state, status) => {
    state.pageEntry = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
