// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 获取早教考勤报表
 * @param childName 学员id
 * @param startDate 月份开始日期
 * @param endDate 月份结束日期
 * @returns {AxiosPromise}
 */
export function queryStatisticsAttendanceReport({ childName, startDate, endDate }) {
  return request({
    url: `/daycare/statistics/attendance_report`,
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
export function queryCareAttendanceReport({ childName, startDate, endDate }) {
  return request({
    url: `/daycare/statistics/cae_attendance_report`,
    method: 'get',
    params: { childName, startDate, endDate }
  })
}

/**
 * 现金流量表
 * @param year
 * @returns {AxiosPromise}
 */
export function queryStatisticsCashFlow({ year }) {
  return request({
    url: `/daycare/statistics/cash_flow`,
    method: 'get',
    params: { year }
  })
}

/**
 * 查询跟进人员业绩分析
 * @param name
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryStatisticsFollow({ name, startTime, endTime }) {
  return request({
    url: `/daycare/statistics/follow`,
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
export function queryStatisticsChildSource({ startTime, endTime }) {
  return request({
    url: `/daycare/statistics/child_source`,
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
export function queryConsumeCourseReport({ startDate, endDate, type }) {
  return request({
    url: `/daycare/statistics/consume_course_report`,
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
export function queryTeacherEffectReport({ startDate, endDate, type, teacherName }) {
  return request({
    url: `/daycare/statistics/teacher_effect_report`,
    method: 'get',
    params: { startDate, endDate, type, teacherName }
  })
}

/**
 * 老师消课统计
 * @param startDate
 * @param endDate
 * @param type
 * @param teacherName
 * @returns {AxiosPromise}
 */
export function queryTeacherConsumeCourseReport({ startDate, endDate, type, teacherName }) {
  return request({
    url: `/daycare/statistics/teacher_consume_course_report`,
    method: 'get',
    params: { startDate, endDate, type, teacherName }
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
export function queryMarketer({ entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }) {
  return request({
    url: `/daycare/statistics/marketer_analysis`,
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
export function querySales({ entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }) {
  return request({
    url: `/daycare/statistics/sales_efficiency_evaluation`,
    method: 'get',
    params: { entryStartDate, entryEndDate, statisticsStartDate, statisticsEndDate, sourceId }
  })
}

/**
 * 查询学员来源列表
 * @returns {AxiosPromise}
 */
export function querySource() {
  return request({
    url: `/daycare/child_source`,
    method: 'get'
  })
}
