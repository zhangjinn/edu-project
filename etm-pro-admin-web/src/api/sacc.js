// import axios from 'axios'
// import { Loading } from 'element-ui-etm'
//
// axios.defaults.baseURL = 'http://192.168.7.54:3000/mock/42/'
// const request = axios
// request.interceptors.request.use(req => {
//   Loading.service({ text: '加载中...', background: 'rgba(255,0,0 .5)' })
//   return req
// })
//
// request.interceptors.response.use(res => {
//   Loading.service().close()
//   return res
// })
import request from '@/utils/request'

/**
 *查询会员列表
 **/
export function getGardenList(data) {
  return request({
    url: '/sacc/customer/list',
    method: 'get',
    params: data
  })
}

/**
 *设置会员入园
 **/
export function putInGarden(data) {
  return request({
    url: '/sacc/customer/admission',
    method: 'put',
    data
  })
}

/**
 *设置会员离园
 **/
export function getOutGarden(data) {
  return request({
    url: '/sacc/customer/departure',
    method: 'put',
    data
  })
}

/**
 *查询会员详情
 **/
export function getGardenXq(id) {
  return request({
    url: '/sacc/customer/' + id,
    method: 'get'
  })
}

/**
 *新增会员基础信息
 **/
export function addBaseInfo(data) {
  return request({
    url: '/sacc/customer',
    method: 'post',
    data
  })
}

/**
 *修改会员基础信息
 **/
export function editBaseInfo(data, id) {
  return request({
    url: '/sacc/customer/' + id,
    method: 'put',
    data
  })
}

/**
 *导出会员列表的excel表格
 **/
export function exportExcel(data) {
  return request({
    url: '/sacc/customer/excel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 *查询会员自定义字段列表
 **/
export function getAttribute() {
  return request({
    url: '/sacc/customer/eav/attribute',
    method: 'get'
  })
}

/**
 *查询会员单据列表
 **/
export function getInvoicesList(data) {
  return request({
    url: '/sacc/invoices/customer',
    method: 'get',
    params: data
  })
}

// /**
//  *查询单据列表
//  **/
// export function getinvoicesList() {
//   return request({
//     url: '/sacc/invoices',
//     method: 'get'
//   })
// }

/**
 *查询会员账户详情
 **/
export function getAccountMsg(data) {
  return request({
    url: '/sacc/account/customer',
    method: 'get',
    params: data
  })
}

/**
 *新增单据
 **/
export function addInvoices(data) {
  return request({
    url: '/sacc/invoices/customer/manager',
    method: 'post',
    data
  })
}

/**
 *新增退费/结算
 **/
export function delInvoices(data) {
  return request({
    url: '/sacc/invoices',
    method: 'post',
    data
  })
}

/**
 *查询收费项目列表
 **/
export function getApplication(data) {
  return request({
    url: '/sacc/application_setting/item',
    method: 'get',
    params: data
  })
}

/**
 *查询默认收费项目列表
 **/
export function getDefaultApplication(data) {
  return request({
    url: '/sacc/application_setting/item/default',
    method: 'get',
    params: data
  })
}

/**
 *查询支付方式列表
 **/
export function getPaymentType() {
  return request({
    url: '/sacc/invoices/payment',
    method: 'get'
  })
}

/**
 *修改用药备注
 **/
export function editMedication(id, data) {
  return request({
    url: '/sacc/customer/' + id + '/medication',
    method: 'put',
    data
  })
}

/**
 *查询单据详情
 **/
export function getBillsList(id) {
  return request({
    url: '/sacc/invoices/' + id,
    method: 'get'
  })
}

/**
 *修改会员扩展信息(携带物品,学籍信息,饮食忌口,用药备注)
 **/
export function getProfile(id, data) {
  return request({
    url: '/sacc/customer/' + id + '/profile',
    method: 'put',
    data
  })
}

/**
 *查询联系人称呼
 **/
export function getContactType(type) {
  return request({
    url: '/sacc/dictionaries/' + type,
    method: 'get'
  })
}

/**
 *修改帐户余额
 **/
export function setWithDrew(data) {
  return request({
    url: '/sacc/account/withdrew',
    method: 'put',
    data
  })
}

/**
 *查询有效期列表
 **/
export function getValidity() {
  return request({
    url: '/sacc/application_setting/validity',
    method: 'get'
  })
}

/**
 * @description 查询在园并且没有分配班级的会员
 * @param clazzId 班级ID
 * @returns {*}
 */
export function queryCustomerAndNoClass({ clazzId }) {
  return request({
    url: '/sacc/customer/unassigned_clazz',
    method: 'get',
    params: { clazzId }
  })
}

/**
 * @description 获取C端的入口地址
 */
export function getNurtureLink() {
  return request({
    url: '/sacc/client_enter_url',
    method: 'get'
  })
}
