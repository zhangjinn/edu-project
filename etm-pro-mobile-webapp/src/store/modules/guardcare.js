const state = {
  tabActiveType: null,
  childIdList: [],
  weekIdList: [],
  dm_child: []
}

const mutations = {
  SET_ACTIVE: (state, status) => {
    state.tabActiveType = status
  },
  SET_CHILDIDLIST: (state, ids) => {
    state.childIdList = ids
  },
  SET_WEEKIDLIST: (state, ids) => {
    state.weekIdList = ids
  },
  SET_DMCHILD: (state, list) => {
    state.dm_child = list
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
