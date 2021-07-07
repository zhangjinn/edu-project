const state = {
  searchValue: null
}

const mutations = {
  SET_VALUE: (state, status) => {
    state.searchValue = status
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
