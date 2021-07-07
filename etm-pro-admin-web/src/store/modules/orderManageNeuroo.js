const state = {
  filter: {}
}

const mutations = {
  SET_FILTER: (state, filter) => {
    state.filter = filter
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
