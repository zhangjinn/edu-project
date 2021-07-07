export default {
  namespaced: true,
  store: {
    orderId: ''
  },
  mutations: {
    set_order_id(state, data) {
      state.orderId = data
    }
  }
}
