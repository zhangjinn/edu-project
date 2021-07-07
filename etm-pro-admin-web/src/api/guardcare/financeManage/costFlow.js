import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// 查询支出流水列表
export function getOutcomeList(data) {
  return request({
    url: `/guardcare/outcome_statement`,
    method: 'get',
    params: data
  })
}

// 新增支出流水
export function addOutcome(data) {
  return request({
    url: `/guardcare/outcome_statement`,
    method: 'post',
    data
  })
}

// 删除支出流水
export function deleteOutcome(outcomeStatementId) {
  return request({
    url: `/guardcare/outcome_statement/${outcomeStatementId}`,
    method: 'delete'
  })
}

// 获取支出流水
export function getOutcome(outcomeStatementId) {
  return request({
    url: `/guardcare/outcome_statement/${outcomeStatementId}`,
    method: 'get'
  })
}

// 更新支出流水
export function renewOutcome(outcomeStatementId, data) {
  return request({
    url: `/guardcare/outcome_statement/${outcomeStatementId}`,
    method: 'put',
    data
  })
}

// 对账支出流水对账
export function confirmOutcome(data) {
  return request({
    url: `/guardcare/outcome_statement/confirm`,
    method: 'put',
    data
  })
}

// 撤销支出流水对账
export function revokeOutcome(data) {
  return request({
    url: `/guardcare/outcome_statement/cancel`,
    method: 'put',
    data
  })
}

// 导出支出流水Excel
export function exportOutcomeExcel(data) {
  const url = '/guardcare/outcome_statement/export'
  return downloadFile({ method: 'get', url, params: data })
}

// 根据账单号获取账单
export function getOrderByCode(code) {
  return request({
    url: `/guardcare/order/code/${code}`,
    method: 'get'
  })
}

// 根据订金号获取账单
export function getDepositByCode(code) {
  return request({
    url: `/guardcare/deposit/code/${code}`,
    method: 'get'
  })
}
