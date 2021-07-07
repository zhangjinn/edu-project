import { setSelectedRecipesRow, setRecipesType } from '@/utils/auth'
const state = {
  recipesType: '', // 判断是添加食谱还是修改食谱 （add为添加食谱，edit为修改食谱）
  selectedRecipesRow: '' // 选中的当前食谱列表数据id
}

const mutations = {
  SET_RECIPES_TYPE: (state, type) => {
    state.recipesType = type
  },
  SET_SELECTED_RECIPES_ROW: (state, row) => {
    state.selectedRecipesRow = row
  }

}

const actions = {
  setRecipesType({ commit }, row) {
    commit('SET_RECIPES_TYPE', row)
    setRecipesType(row)
  },
  setSelectedRecipesRow({ commit }, row) {
    commit('SET_SELECTED_RECIPES_ROW', row)
    setSelectedRecipesRow(row)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
