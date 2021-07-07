const state = {
  router: null
}

const mutations = {
  SET_ROUTER: (state, status) => {
    state.router = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
