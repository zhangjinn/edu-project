import request from '../http.js'

/**
 * 查询日考勤统计
 */
export function getAttendanceDay(data) {
  return request({
    url: `/neuroo/attendance/daily_attendance_statistics`,
    method: 'get',
    params: data
  })
}

/**
 * 查询月考勤统计
 */
export function getAttendanceMonth(data) {
  return request({
    url: `/neuroo/attendance/monthly_attendance_statistics`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日统计明细列表
 */
export function getDayStatistics(data) {
  return request({
    url: `/neuroo/attendance/daily_attendance_statistics_details`,
    method: 'get',
    params: data
  })
}

/**
 * 查询月统计明细列表
 */
export function getMonthStatistics(data) {
  return request({
    url: `/neuroo/attendance/monthly_statistical_details_list`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日补签列表
 */
export function getSuppleList(data) {
  return request({
    url: `/neuroo/attendance/daily_supplement_list`,
    method: 'get',
    params: data
  })
}

/**
 * 新增到园补签
 */
export function postEnterSupple(data) {
  return request({
    url: `/neuroo/attendance/enter_supplement`,
    method: 'post',
    data
  })
}

/**
 * 新增离园补签
 */
export function postLeaveSupple(data) {
  return request({
    url: `/neuroo/attendance/leave_supplement`,
    method: 'post',
    data
  })
}

/**
 * 查询会员月考勤统计
 */
export function getMonthAttendanceNum(data) {
  return request({
    url: `/neuroo/attendance/customer_monthly_attendance_statistics`,
    method: 'get',
    params: data
  })
}

/**
 * 查询会员月考勤统计
 */
export function getAttendanceCalendar(data) {
  return request({
    url: `/neuroo/attendance/attendance_calendar`,
    method: 'get',
    params: data
  })
}

/**
 * 查询日考勤详情
 */
export function getAttendanceDetail(data) {
  return request({
    url: `/neuroo/attendance/details`,
    method: 'get',
    params: data
  })
}
