import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// 查询收入流水列表
export function getIncomeList(data) {
  return request({
    url: `/guardcare/income_statement`,
    method: 'get',
    params: data
  })
}

// 新增收入流水
export function addIncome(data) {
  return request({
    url: `/guardcare/income_statement`,
    method: 'post',
    data
  })
}

// 删除收入流水
export function deleteIncome(incomeStatementId) {
  return request({
    url: `/guardcare/income_statement/${incomeStatementId}`,
    method: 'delete'
  })
}

// 获取收入流水
export function getIncome(incomeStatementId) {
  return request({
    url: `/guardcare/income_statement/${incomeStatementId}`,
    method: 'get'
  })
}

// 更新收入流水
export function renewIncome(incomeStatementId, data) {
  return request({
    url: `/guardcare/income_statement/${incomeStatementId}`,
    method: 'put',
    data
  })
}

// 对账收入流水对账
export function confirmIncome(data) {
  return request({
    url: `/guardcare/income_statement/confirm`,
    method: 'put',
    data
  })
}

// 撤销收入流水对账
export function revokeIncome(data) {
  return request({
    url: `/guardcare/income_statement/cancel`,
    method: 'put',
    data
  })
}

// 导出收入流水excel
export function exportIncomeExcel(data) {
  const url = '/guardcare/income_statement/export'
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

// 根据云视频订单号获取订单
export function getDeviceOrderByCode(code) {
  return request({
    url: `/guardcare/device_order/code/${code}`,
    method: 'get'
  })
}
