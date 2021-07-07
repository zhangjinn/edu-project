const state = {
  customerState: 'IN',
  filter: null,

  basic: false,
  status: false
}

const mutations = {
  SET_CUSTOMERSTATE: (state, customerState) => {
    state.customerState = customerState
  },
  SET_FILTER: (state, filter) => {
    state.filter = filter
  },
  SET_BASIC: (state, ready) => {
    state.basic = ready
  },
  SET_STATUS: (state, ready) => {
    state.status = ready
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
