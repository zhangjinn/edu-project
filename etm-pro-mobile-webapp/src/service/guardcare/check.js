import request from '../http.js'

/**
 * 查询检查类型列表
 */
export function getCheckSubject() {
  return request({
    url: `/guardcare/check_subject`,
    method: 'get'
  })
}

/**
 * 查询用户某天三检记录
 */
export function getCheckRecord(data) {
  return request({
    url: `/guardcare/check_record/child`,
    method: 'get',
    params: data
  })
}

/**
 * 新增检查记录
 */
export function postCheck(data) {
  return request({
    url: `/guardcare/check_record`,
    method: 'post',
    data
  })
}

/**
 * 获取日期状态
 */
export function getDayState(data) {
  return request({
    url: `/guardcare/check_record/dayState`,
    method: 'get',
    params: data
  })
}

/**
 * 获取会员三检状态人数
 */
export function getCheckState(data) {
  return request({
    url: `/guardcare/check_record/childState`,
    method: 'get',
    params: data
  })
}

/**
 * 查询健康检查会员列表
 */
export function getCheckCustomerList(data) {
  return request({
    url: `/guardcare/check_record/list/child`,
    method: 'get',
    params: data
  })
}

/**
 * 查询检查项目列表
 */
export function getCheckProject() {
  return request({
    url: `/guardcare/check_project`,
    method: 'get'
  })
}
