import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询班级考勤统计列表
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param date 日期
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @returns {AxiosPromise}
 */
export function queryClazzAttendanceStatisticsList({ gradeId, clazzId, date, pageNum, pageSize }) {
  return request({
    url: '/guardcare/attendance/statistics/clazz',
    method: 'get',
    params: { gradeId, clazzId, date, pageNum, pageSize }
  })
}

/**
 * 导出班级考勤统计
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param date 日期
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @returns {AxiosPromise}
 */
// 导出班级考勤统计
export function exportClazzAttendanceStatisticsToExcel(data) {
  const url = '/guardcare/attendance/statistics/clazz/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询幼儿考勤统计列表
 * @param childName 幼儿姓名
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceStatisticsList({ childName, date, pageNum, pageSize }) {
  return request({
    url: '/guardcare/attendance/statistics/child',
    method: 'get',
    params: { childName, date, pageNum, pageSize }
  })
}

/**
 * 导出幼儿考勤统计
 * @param childName 幼儿姓名
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @returns {AxiosPromise}
 */
// 导出幼儿考勤统计
export function exportChildAttendanceStatisticsToExcel(data) {
  const url = '/guardcare/attendance/statistics/child/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @returns {AxiosPromise}
 */
export function queryClazzList(gradeId = '') {
  return request({
    url: '/guardcare/educational/clazz',
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
    url: '/guardcare/educational/grade',
    method: 'get',
    params: {
      paged: false
    }
  })
}
