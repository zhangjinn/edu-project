import request from '../http.js'

/**
 * 查询健康检查会员列表
 */
export function getCheckCustomerList(data) {
  return request({
    url: `/neuroo/check_record/list/customer`,
    method: 'get',
    params: data
  })
}

/**
 * 查询用户某天三检记录
 */
export function getCheckRecord(data) {
  return request({
    url: `/neuroo/check_record`,
    method: 'get',
    params: data
  })
}

/**
 * 新增检查记录
 */
export function postCheck(data) {
  return request({
    url: `/neuroo/check_record`,
    method: 'post',
    data
  })
}

/**
 * 更新三检记录
 */
export function putCheck(data) {
  return request({
    url: `/neuroo/check_record`,
    method: 'put',
    data
  })
}

/**
 * 获取日期状态
 */
export function getDayState(data) {
  return request({
    url: `/neuroo/check_record/dayState`,
    method: 'get',
    params: data
  })
}

/**
 * 获取会员三检状态人数
 */
export function getCheckState(data) {
  return request({
    url: `/neuroo/check_record/customerState`,
    method: 'get',
    params: data
  })
}
