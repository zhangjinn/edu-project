import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 园所考勤统计
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function queryGardenAttendanceList({ date, areaName, enterpriseId }) {
  return request({
    url: `/newdaycare/guard/attendance/statistics/kindergartens/statistics`,
    method: 'get',
    params: { date, areaName, enterpriseId }
  })
}

/**
 * 导出园所考勤统计
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function exportGardenAttendanceListToExcel(data) {
  const url = '/newdaycare/guard/attendance/statistics/kindergartens/statistics/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @returns {AxiosPromise}
 */
export function queryClazzList(gradeId = '') {
  return request({
    url: '/newdaycare/guard/educational/clazz',
    method: 'get',
    params: {
      paged: false,
      gradeId
    }
  })
}

/**
 * 查询年级列表
 * @returns {AxiosPromise}
 */
export function queryGradeList() {
  return request({
    url: '/newdaycare/guard/educational/grade',
    method: 'get',
    params: {
      paged: false
    }
  })
}

/**
 * 园所班级考勤
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function queryClazzAttendanceList({ gradeId, clazzId, date, areaName, enterpriseId }) {
  return request({
    url: `/newdaycare/guard/attendance/statistics/clazz/statistics`,
    method: 'get',
    params: { gradeId, clazzId, date, areaName, enterpriseId }
  })
}

/**
 * 导出园所班级考勤
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function exportClazzAttendanceListToExcel(data) {
  const url = '/newdaycare/guard/attendance/statistics/clazz/statistics/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 幼儿考勤统计
 * @param childName 幼儿姓名
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceList({ childName, date, areaName, enterpriseId }) {
  return request({
    url: `/newdaycare/guard/attendance/statistics/child/statistics`,
    method: 'get',
    params: { childName, date, areaName, enterpriseId }
  })
}

/**
 * 导出幼儿考勤统计
 * @param childName 幼儿姓名
 * @param date 日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function exportChildAttendanceListToExcel(data) {
  const url = '/newdaycare/guard/attendance/statistics/child/statistics/export'
  return downloadFile({ method: 'get', url, params: data })
}
