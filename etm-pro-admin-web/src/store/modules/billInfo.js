
const state = {
  searchObj: {},
  inState: '',
  billDetailId: ''
}

const mutations = {

  SET_SEARCH_OBJ: (state, row) => {
    state.searchObj = row
  },
  SET_IN_STATE: (state, row) => {
    state.inState = row
  },
  SET_BILL_ID: (state, row) => {
    state.billDetailId = row
  },
  SET_MEMBER_ID: (state, row) => {
    state.memberId = row
  }
}

const actions = {

  searchObj({ commit }, row) {
    commit('SET_SEARCH_OBJ', row)
  },
  inState({ commit }, row) {
    commit('SET_IN_STATE', row)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
