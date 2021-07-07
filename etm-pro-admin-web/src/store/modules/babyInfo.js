
const state = {
  typeBtn: '',
  babyId: '',
  babyObj: {},
  babyCheck: [],
  isBabyTabs: true,
  contactType: [],
  searchObj: {},
  inState: '',
  selectState: 'ALL'
}

const mutations = {
  SET_TYPE_BTN: (state, row) => {
    state.typeBtn = row
  },
  SET_BABY_ID: (state, row) => {
    state.babyId = row
  },
  SET_BABY_OBJ: (state, row) => {
    state.babyObj = row
  },
  SET_BABY_CHECK: (state, row) => {
    state.babyCheck = row
  },
  SET_BABY_TABS: (state, row) => {
    state.isBabyTabs = row
  },
  SET_CONTACT_TYPE: (state, row) => {
    state.contactType = row
  },
  SET_SEARCH_OBJ: (state, row) => {
    state.searchObj = row
  },
  SET_IN_STATE: (state, row) => {
    state.inState = row
  },
  SET_SELECT_STATE: (state, row) => {
    state.selectState = row
  }

}

const actions = {
  typeBtn({ commit }, row) {
    commit('SET_TYPE_BTN', row)
  },
  babyId({ commit }, row) {
    commit('SET_BABY_ID', row)
  },
  babyObj({ commit }, row) {
    commit('SET_BABY_OBJ', row)
  },
  babyCheck({ commit }, row) {
    commit('SET_BABY_CHECK', row)
  },
  isBabyTabs({ commit }, row) {
    commit('SET_BABY_TABS', row)
  },
  contactType({ commit }, row) {
    commit('SET_CONTACT_TYPE', row)
  },
  searchObj({ commit }, row) {
    commit('SET_SEARCH_OBJ', row)
  },
  inState({ commit }, row) {
    commit('SET_IN_STATE', row)
  },
  selectState({ commit }, row) {
    commit('SET_SELECT_STATE', row)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
