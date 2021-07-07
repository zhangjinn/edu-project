import request from '../http.js'

/**
 *查询企业考勤统计
 * */
export function getStatistics(data) {
  return request({
    url: '/sacc/customer_attendance/enterprise/statistics',
    method: 'get',
    params: data
  })
}

/**
 *查询班级列表
 * */
export function getChildClass() {
  return request({
    url: '/sacc/clazz/classList',
    method: 'get'
  })
}

/**
 *查询班级会员送园列表
 * */
export function getEnterList(data) {
  return request({
    url: '/sacc/customer_attendance/enter/list',
    method: 'get',
    params: data
  })
}

/**
 *查询班级会员离园列表
 * */
export function getLeaveList(data) {
  return request({
    url: '/sacc/customer_attendance/leave/list',
    method: 'get',
    params: data
  })
}

/**
 *新增或更新会员送园信息
 * */
export function addOrUpdateEnter(data) {
  return request({
    url: '/sacc/customer_attendance/enter',
    method: 'put',
    data
  })
}

/**
 *新增或更新会员离园信息
 * */
export function addOrUpdateLeave(data) {
  return request({
    url: '/sacc/customer_attendance/leave',
    method: 'put',
    data
  })
}

/**
 *查询会员的接送人列表
 * */
export function getSurrogate(data) {
  return request({
    url: '/sacc/customer/surrogate',
    method: 'get',
    params: data
  })
}

/**
 *获取晨午检状态
 * */
export function getCheckStatistic(data) {
  return request({
    url: '/sacc/check_statistic',
    method: 'get',
    params: data
  })
}

/**
 *查询身体检查设置
 * */
export function getCheckSetting() {
  return request({
    url: '/sacc/check_setting',
    method: 'get'
  })
}

/**
 *查询指定日期未检查的会员列表
 * */
export function getUncheckList(data) {
  return request({
    url: '/sacc/customer_check/unchecked_customer_list',
    method: 'get',
    params: data
  })
}

/**
 *查询指定日期已检查的会员列表
 * */
export function getCheckList(data) {
  return request({
    url: '/sacc/customer_check/checked_customer_list',
    method: 'get',
    params: data
  })
}

/**
 *查询检查项目列表
 * */
export function getCheckItem(data) {
  return request({
    url: '/sacc/check_project',
    method: 'get',
    params: data
  })
}

/**
 *新增或更新会员的身体检查信息
 * */
export function addOrUpdateCheck(data) {
  return request({
    url: '/sacc/customer_check',
    method: 'put',
    data
  })
}

/**
 *查询指定日期的会员身体检查详情
 * */
export function getCheckDetail(data) {
  return request({
    url: '/sacc/customer_check/mobile/detail',
    method: 'get',
    params: data
  })
}
