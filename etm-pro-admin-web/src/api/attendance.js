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
//   return res.data
// })

import request from '@/utils/request'

// TODO 考勤管理api接口文档

/**
 * @description  查询班级考勤统计列表并分页
 * @param attendanceDate 统计时间（年月日）
 * @param pageSize
 * @param pageNum
 */
export function queryAttendanceTotalListPage({ attendanceDate, pageSize, pageNum }) {
  return request({
    url: '/sacc/customer_attendance/clazz/statistics',
    method: 'get',
    params: { attendanceDate, pageSize, pageNum }
  })
}

/**
 * @description 查询会员考勤记录列表并分页
 * @param customerName
 * @param clazzName
 * @param startTime
 * @param endTime
 * @param pageNum
 * @param pageSize
 */
export function queryAttendanceRecordListPage({ customerName, clazzName, startTime, endTime, pageNum, pageSize }) {
  return request({
    url: '/sacc/customer_attendance/customer/statistics',
    method: 'get',
    params: { customerName, clazzName, startTime, endTime, pageNum, pageSize }
  })
}

/**
 * @description 查询会员考勤记录详情列表并分页
 * @param customerName
 * @param clazzName
 * @param startTime
 * @param endTime
 * @param pageNum
 * @param pageSize
 */
export function queryAttendanceRecordDetailListPage({ customerName, clazzName, startTime, endTime, pageNum, pageSize }) {
  return request({
    url: '/sacc/customer_attendance/page',
    method: 'get',
    params: { customerName, clazzName, startTime, endTime, pageNum, pageSize }
  })
}

/**
 * @description 查询会员考勤记录详情byId
 * @param id
 */
export function queryAttendanceCustomDetailById({ id }) {
  return request({
    url: `/sacc/customer_attendance/${id}`,
    method: 'get'
  })
}

/**
 * @description 通过ID获取会员的考勤记录
 * @param customerId
 * @param startTime
 * @param endTime
 */
export function queryAttendanceCalendarById({ customerId, startTime, endTime }) {
  return request({
    url: `/sacc/customer_attendance/${customerId}/calendar`,
    method: 'get',
    params: { startTime, endTime }
  })
}

/**
 * @description 更新会员考勤日的内容
 * @param customerId
 * @param attendanceDate
 * @param enterStatus
 * @param enterStatusDescription
 * @param leaveStatus
 * @param leaveStatusDescription
 * @param enterDate
 * @param leaveDate
 * @param leaveSurrogate
 */
export function updateAttendanceCalendarById({ customerId, attendanceDate, enterStatus, enterStatusDescription, leaveStatus, leaveStatusDescription, enterDate, leaveDate, leaveSurrogate }) {
  return request({
    url: '/sacc/customer_attendance',
    method: 'put',
    data: {
      customerId,
      attendanceDate,
      enterStatus,
      enterStatusDescription,
      leaveStatus,
      leaveStatusDescription,
      enterDate,
      leaveDate,
      leaveSurrogate
    }
  })
}

/**
 * @description 获取考勤设置
 * @returns {*}
 */
export function queryAttendanceSettings() {
  return request({
    url: '/sacc/attendance_settings',
    method: 'get'
  })
}

/**
 * @description 更新考勤设置
 * @param leaveTime
 * @param enterTime
 * @returns {*}
 */
export function updateAttendanceSettings({ leaveTime, enterTime }) {
  return request({
    url: '/sacc/attendance_settings',
    method: 'put',
    data: { leaveTime, enterTime }
  })
}

