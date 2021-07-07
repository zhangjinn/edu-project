import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// 查询批次列表
export function getOrderBunch(data) {
  return request({
    url: `/guardcare/order/bunch`,
    method: 'get',
    params: data
  })
}

// 获取批次
export function getOrderBunchDetail(orderBunchId) {
  return request({
    url: `/guardcare/order/bunch/${orderBunchId}`,
    method: 'get'
  })
}

// 编辑批次
export function renewOrderBunch(orderBunchId, data) {
  return request({
    url: `/guardcare/order/bunch/${orderBunchId}`,
    method: 'put',
    data
  })
}

// 删除批次(未审核)
export function deleteOrderBunch(orderBunchId) {
  return request({
    url: `/guardcare/order/bunch/${orderBunchId}`,
    method: 'delete'
  })
}

// 批次审核
export function auditOrderBunch(data) {
  return request({
    url: `/guardcare/order/bunch/audit`,
    method: 'put',
    data
  })
}

// 批次催缴
export function callOrderBunch(data) {
  return request({
    url: `/guardcare/order/bunch/call`,
    method: 'put',
    data
  })
}

// 查询账单列表
export function getOrderList(data) {
  return request({
    url: `/guardcare/order`,
    method: 'get',
    params: data
  })
}

// 查询在园幼儿列表
export function getChildList(data) {
  return request({
    url: `/guardcare/child/list/in`,
    method: 'get',
    params: data
  })
}

// 查询物品列表
export function getMaterialList(data) {
  return request({
    url: `/guardcare/material`,
    method: 'get',
    params: data
  })
}

// 查询物品费用列表
export function getMaterialPriceList(data) {
  return request({
    url: `/guardcare/material_price`,
    method: 'get',
    params: data
  })
}

// 查询特色课程列表
export function getCourseList(data) {
  return request({
    url: `/guardcare/educational/course/special`,
    method: 'get',
    params: data
  })
}

// 发起收费: 下一步
export function postNewCharge(data) {
  return request({
    url: `/guardcare/order/bunch/next`,
    method: 'post',
    data
  })
}

// 发起收费: 提交审核
export function postNewChargeConfirm(data) {
  return request({
    url: `/guardcare/order/bunch/confirm`,
    method: 'post',
    data
  })
}

// 账单催缴
export function callForPay(data) {
  return request({
    url: `/guardcare/order/call`,
    method: 'put',
    data
  })
}

// 确认收费接口
export function payConfirm(data) {
  return request({
    url: `/guardcare/order/confirm`,
    method: 'put',
    data
  })
}

// 账单退费
export function orderRefund(data) {
  return request({
    url: `/guardcare/order/refund`,
    method: 'put',
    data
  })
}

// 导出账单批次Excel
export function exportOrderBunchExcel(data) {
  const url = '/guardcare/order/bunch/export'
  return downloadFile({ method: 'get', url, params: data })
}

// 导出账单Excel
export function exportOrderExcel(data) {
  const url = '/guardcare/order/export'
  return downloadFile({ method: 'get', url, params: data })
}
