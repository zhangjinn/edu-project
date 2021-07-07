import request from '@/utils/request'

/**
 * 查询单据列表
 * */
export function invoiceList(params) {
  return request({
    url: '/sacc/invoices',
    method: 'get',
    params
  })
}

/**
 * 查询会员单据列表（updating）
 * */
export function invoiceCustomerList() {
  return request({
    url: '/sacc/invoices/customer',
    method: 'get'
  })
}

/**
 * 新增单据（客户线索，updating）
 * */
export function addCustomerInvoice(data) {
  return request({
    url: '/sacc/invoices/customer/service',
    method: 'POST',
    data
  })
}

/**
 * 查询单据详情
 * */
export function getInvoice(id) {
  return request({
    url: '/sacc/invoices/' + id,
    method: 'get'
  })
}

/**
 * 设置单据作废
 * */
export function putInvoice(id) {
  return request({
    url: '/sacc/invoices/' + id,
    method: 'put'
  })
}

/**
 * 新增退费/结算
 * */
export function postInvoice(params) {
  return request({
    url: '/sacc/invoices',
    method: 'post',
    data: params
  })
}

/**
 * 导出单据列表表格
 * */
export function exportInvoice(params) {
  return request({
    url: '/sacc/invoices/export',
    method: 'post',
    params
  })
}

/**
 * 查询会员退费（updating）
 * */
export function refundInvoice(data) {
  return request({
    url: '/sacc/invoices/refund',
    method: 'get',
    data
  })
}

/**
 * 查询支付方式（updating）
 * */
export function getPayment() {
  return request({
    url: '/sacc/invoices/payment',
    method: 'get'
  })
}

/**
 * 预警收费
 */

/**
 * 查看预警收费列表
 * */
export function getWarmList(params) {
  return request({
    url: '/sacc/warning/warning_charge_list/',
    method: 'get',
    params
  })
}

/**
 * 设置预警收费处理状态
 * */
export function processWarm(params) {
  return request({
    url: '/sacc/warning/process',
    method: 'post',
    params
  })
}

/**
 * 导出预警收费列表
 * */
export function exportWarm(params) {
  return request({
    url: '/sacc/warning/export',
    method: 'post',
    params
  })
}

/**
 * 结算统计
 */

/**
 * 查询结算统计列表
 * */
export function getSettleList(params) {
  return request({
    url: '/sacc/settlement_statistics',
    method: 'get',
    params
  })
}

/**
 * 查询结算统计列表统计金额
 * */
export function statisticsSettle(data) {
  return request({
    url: '/sacc/settlement_statistics/statistics',
    method: 'get',
    data
  })
}

/**
 * 导出结算统计列表表格
 * */
export function exportSettle(params) {
  return request({
    url: '/sacc/settlement_statistics/export',
    method: 'post',
    params
  })
}
