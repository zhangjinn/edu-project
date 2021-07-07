import { setCustomerType, setSelectedCustomerRow } from '@/utils/auth'
const state = {
  customerType: '', // 判断是添加客户还是修改客户 （add为添加客户，edit为修改客户，follow为跟进客户）
  selectedCustomerRow: '' // 选中的当前客户列表数据 // 批量选择时为数组格式，点击表格里的对应操作控件时为一条对象，选择添加或修改时为空
}

const mutations = {
  SET_CUSTOMER_TYPE: (state, type) => {
    state.customerType = type
  },
  SET_SELECTED_CUSTOMER_ROW: (state, row) => {
    state.selectedCustomerRow = row
  }

}

const actions = {
  setCustomerType({ commit }, type) {
    commit('SET_CUSTOMER_TYPE', type)
    setCustomerType(type)
  },
  setSelectedCustomerRow({ commit }, row) {
    commit('SET_SELECTED_CUSTOMER_ROW', row)
    setSelectedCustomerRow(row)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
