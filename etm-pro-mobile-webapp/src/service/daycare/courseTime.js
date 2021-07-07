// import request from './mockRequest'

import request from '../http.js'

/**
 * 获取当月是否有内容
 * @returns {AxiosPromise}
 */
export function queryDateList(date) {
  return request({
    url: `/daycare/ca_scourse_management/course_time_manage_overview`,
    method: 'get',
    params: { date }
  })
}

/**
 * BM端课程表某日全部排课
 * @param date
 * @returns {AxiosPromise}
 */
export function queryDayDate(date) {
  return request({
    url: `/daycare/ca_scourse_management/course_time_manage`,
    method: 'get',
    params: { date }
  })
}

/**
 * BM端课程表排课详情
 * @param courseManagementId
 * @param courseManagementType
 * @returns {AxiosPromise}
 */
export function queryCourseDetail({ courseManagementId, courseManagementType }) {
  return request({
    url: `/daycare/ca_scourse_management/course_time_manage_detail`,
    method: 'get',
    params: { courseManagementId, courseManagementType }
  })
}

/**
 * 获取托育班级（下拉）
 * @param clazzName
 * @returns {AxiosPromise}
 */
export function queryCaeClazz(clazzName) {
  return request({
    url: `/daycare/care/cae_clazz`,
    method: 'get',
    params: { clazzName }
  })
}

/**
 * BM端查询月日程概览一周日程
 * @param date
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function queryWeekDate({ date, clazzId }) {
  return request({
    url: `/daycare/ca_sclazz_schedule/overview`,
    method: 'get',
    params: { date, clazzId }
  })
}

/**
 * BM端查询某日日程
 * @param date
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function queryWeekPlan({ date, clazzId }) {
  return request({
    url: `/daycare/ca_sclazz_schedule/clazz_schedule_List`,
    method: 'get',
    params: { date, clazzId }
  })
}
