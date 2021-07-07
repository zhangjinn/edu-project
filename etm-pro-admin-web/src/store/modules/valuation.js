import { setSelectedValuationRow } from '@/utils/auth'

const state = {
  selectedValuationRow: '', // 报告管理里列表选中的当前行
  evaluationId: '', // 观测ID
  evalReportTableData: [], // 报告管理--样本详情里的孩子观测列表
  evaluationIndex: 0, // 报告管理--样本详情里的查看报告时观测列表的坐标
  payRecordSelectRow: '', // 付费记录管理列表选中的当前行
  reservationSelectRow: '', // 预约管理的订单列表选中的当前行
  reportConsumptionPlanSelectRow: '' // 报告管理（消耗方案）列表选中的当前行
}

const mutations = {
  SET_SELECTED_VALUATION_ROW: (state, row) => {
    state.selectedValuationRow = row
  },
  SET_EVALUATION_ID: (state, id) => {
    state.evaluationId = id
  },
  SET_EVALUATION_INDEX: (state, index) => {
    state.evaluationIndex = index
  },
  SET_EVAL_REPORT_TABLE_DATA: (state, data) => {
    state.evalReportTableData = data
  },
  SET_PAY_RECORD_SELECT_ROW: (state, data) => {
    state.payRecordSelectRow = data
  },
  SET_RESERVATION_SELECT_ROW: (state, data) => {
    state.reservationSelectRow = data
  },
  SET_REPORT_CONSUMPTION_PLAN_SELECT_ROW: (state, data) => {
    state.reportConsumptionPlanSelectRow = data
  }
}

const actions = {
  setSelectedValuationRow({ commit }, row) {
    commit('SET_SELECTED_VALUATION_ROW', row)
    setSelectedValuationRow(row)
  },
  setEvaluationId({ commit }, id) {
    commit('SET_EVALUATION_ID', id)
  },
  setEvaluationIndex({ commit }, index) {
    commit('SET_EVALUATION_INDEX', index)
  },
  setEvalReportTableData({ commit }, data) {
    commit('SET_EVAL_REPORT_TABLE_DATA', data)
  },
  setPayRecordSelectRow({ commit }, data) {
    commit('SET_PAY_RECORD_SELECT_ROW', data)
  },
  setReservationSelectRow({ commit }, data) {
    commit('SET_RESERVATION_SELECT_ROW', data)
  },
  setReportConsumptionPlanSelectRow({ commit }, data) {
    commit('SET_REPORT_CONSUMPTION_PLAN_SELECT_ROW', data)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
