const state = {
  disposeType: 'PC'
}

const mutations = {
  SET_DISPOSE_TYPE: (state, row) => {
    state.disposeType = row
  }

}

const actions = {
  setDisposeType({ commit }, row) {
    commit('SET_DISPOSE_TYPE', row)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

