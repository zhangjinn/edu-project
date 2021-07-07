export default {
  namespaced: true,
  store: {
    clazzId: ''
  },
  mutations: {
    set_clazz_id(state, data) {
      state.clazzId = data
    }
  }
}
