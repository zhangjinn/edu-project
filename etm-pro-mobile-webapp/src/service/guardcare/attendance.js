import request from '../http.js'

/**
 * 查询日考勤统计
 */
export function getAttendanceDay(data) {
  return request({
    url: `/guardcare/attendance/statistics/daily`,
    method: 'get',
    params: data
  })
}

/**
 * 查询月考勤统计
 */
export function getAttendanceMonth(data) {
  return request({
    url: `/guardcare/attendance/statistics/monthly`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日统计明细列表
 */
export function getDayStatistics(data) {
  return request({
    url: `/guardcare/attendance/statistics/daily_details`,
    method: 'get',
    params: data
  })
}

/**
 * 查询月统计明细列表
 */
export function getMonthStatistics(data) {
  return request({
    url: `/guardcare/attendance/statistics/monthly_details`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日补签列表
 */
export function getSuppleList(data) {
  return request({
    url: `/guardcare/attendance/daily_supplement_list`,
    method: 'get',
    params: data
  })
}

/**
 * 到园补签
 */
export function postEnterSupple(data) {
  return request({
    url: `/guardcare/attendance/enter_supplement`,
    method: 'put',
    data
  })
}

/**
 * 查询幼儿的接送人列表
 */
export function getParentList(data) {
  return request({
    url: `/guardcare/child/surrogate`,
    method: 'get',
    params: data
  })
}

/**
 * 离园补签
 */
export function postLeaveSupple(data) {
  return request({
    url: `/guardcare/attendance/leave_supplement`,
    method: 'put',
    data
  })
}

/**
 * 查询会员月考勤统计
 */
export function getMonthAttendanceNum(data) {
  return request({
    url: `/guardcare/attendance/statistics/child_monthly`,
    method: 'get',
    params: data
  })
}

/**
 * 查询考勤日历
 */
export function getAttendanceCalendar(data) {
  return request({
    url: `/guardcare/attendance/calendar`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日考勤详情
 */
export function getAttendanceDetail(data) {
  return request({
    url: `/guardcare/attendance/details`,
    method: 'get',
    params: data
  })
}
