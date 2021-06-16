// import request from '@/api/newdaycare/mockRequest'

import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 获取早教考勤报表
 * @param childName 学员id
 * @param startDate 月份开始日期
 * @param endDate 月份结束日期
 * @returns {AxiosPromise}
 */
export function queryStatisticsAttendanceReport ({ childName, startDate, endDate }) {
  return request({
    url: '/newdaycare/statistics/attendance_report',
    method: 'get',
    params: { childName, startDate, endDate }
  })
}

/**
 * 获取托育考勤报表
 * @param childName 学员id
 * @param startDate 月份开始日期
 * @param endDate 月份结束日期
 * @returns {AxiosPromise}
 */
export function queryCareAttendanceReport ({ childName, startDate, endDate }) {
  return request({
    url: '/newdaycare/statistics/cae_attendance_report',
    method: 'get',
    params: { childName, startDate, endDate }
  })
}

/**
 * 不传企业id 查询 -》现金流量表  传企业id 查询-》 园所流量表
 * @param year 年份
 * @param currentEnterpriseId 企业id, 不传默认查询当前企业
 * @returns {AxiosPromise}
 */
export function queryStatisticsCashFlow ({ year, currentEnterpriseId }) {
  return request({
    url: '/newdaycare/statistics/cash_flow',
    method: 'get',
    params: { year, currentEnterpriseId }
  })
}

/**
 * 查询跟进人员业绩分析
 * @param name
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryStatisticsFollow ({ name, startTime, endTime }) {
  return request({
    url: '/newdaycare/statistics/follow',
    method: 'get',
    params: { name, startTime, endTime }
  })
}

/**
 * 查询学员来源分析
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryStatisticsChildSource ({ startTime, endTime }) {
  return request({
    url: '/newdaycare/statistics/child_source',
    method: 'get',
    params: { startTime, endTime }
  })
}

/**
 * 课程消课统计
 * @param startDate
 * @param endDate
 * @param type
 * @returns {AxiosPromise}
 */
export function queryConsumeCourseReport ({ startDate, endDate, type }) {
  return request({
    url: '/newdaycare/statistics/consume_course_report',
    method: 'get',
    params: { startDate, endDate, type }
  })
}

/**
 * 老师人效
 * @param startDate
 * @param endDate
 * @param type
 * @param teacherName
 * @returns {AxiosPromise}
 */
export function queryTeacherEffectReport ({ startDate, endDate, type, teacherName }) {
  return request({
    url: '/newdaycare/statistics/teacher_effect_report',
    method: 'get',
    params: { startDate, endDate, type, teacherName }
  })
}

/**
 * 老师消课统计
 * @param startDate
 * @param endDate
 * @param teacherType
 * @param teacherName
 * @returns {AxiosPromise}
 */
export function queryTeacherConsumeCourseReport ({ startDate, endDate, teacherType, teacherName }) {
  return request({
    url: '/newdaycare/statistics/teacher_consume_course_report',
    method: 'get',
    params: { startDate, endDate, teacherType, teacherName }
  })
}

/**
 * 市场人员分析
 * @param entryStartDate 录入开始日期
 * @param entryEndDate 录入结束日期
 * @param statisticsStartDate 统计开始日期
 * @param tatisticsEndDate 统计结束日期
 * @param sourceId 学员来源id
 * @returns {AxiosPromise}
 */
export function queryMarketer ({ entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }) {
  return request({
    url: '/newdaycare/statistics/marketer_analysis',
    method: 'get',
    params: { entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }
  })
}

/**
 * 销售效率评估
 * @param entryStartDate 录入开始日期
 * @param entryEndDate 录入结束日期
 * @param statisticsStartDate 统计开始日期
 * @param tatisticsEndDate 统计结束日期
 * @param sourceId 学员来源id
 * @returns {AxiosPromise}
 */
export function querySales ({ entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }) {
  return request({
    url: '/newdaycare/statistics/sales_efficiency_evaluation',
    method: 'get',
    params: { entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }
  })
}

/**
 * 查询学员来源列表
 * @returns {AxiosPromise}
 */
export function querySource () {
  return request({
    url: '/newdaycare/child_source',
    method: 'get'
  })
}

/* --------------幼儿园部分-------------- */

/**
 * 查询班级考勤统计列表
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param date 日期
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryClazzAttendanceStatisticsList ({ gradeId, clazzId, date, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/guard/attendance/statistics/clazz',
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
export function exportClazzAttendanceStatisticsToExcel (data) {
  const url = '/newdaycare/guard/attendance/statistics/clazz/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询幼儿考勤统计列表
 * @param childName 幼儿姓名
 * @param date 日期
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryChildAttendanceStatisticsList ({ childName, date, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/guard/attendance/statistics/child',
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
export function exportChildAttendanceStatisticsToExcel (data) {
  const url = '/newdaycare/guard/attendance/statistics/child/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @returns {AxiosPromise}
 */
export function queryClazzList (gradeId = '') {
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
export function queryGradeList () {
  return request({
    url: '/newdaycare/guard/educational/grade',
    method: 'get',
    params: {
      paged: false
    }
  })
}
