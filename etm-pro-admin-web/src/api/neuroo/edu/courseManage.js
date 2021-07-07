// import Axios from 'axios'
import request from '@/utils/request'
// const request = Axios.create({
//   baseURL: 'http://192.168.7.54:3000/mock/112/',
//   timeout: 300000
//
// })
//
// request.interceptors.request.use(request => {
//   return request
// })
//
// request.interceptors.response.use(response => {
//   return response.data.data
// })

/**
 * 查询学位表
 * @param clazzId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryLearnCalendar({ clazzId, startDate, endDate }) {
  return request({
    url: '/neuroo/position',
    method: 'get',
    params: { clazzId, startDate, endDate }
  })
}

/**
 * 获取排课详情
 * @param scheduleId 学位 ID
 * @returns {AxiosPromise}
 */
export function queryLearnCalendarDetailByScheduleId(scheduleId) {
  return request({
    url: `/neuroo/position/${scheduleId}`,
    method: 'get'
  })
}

/**
 * 更新节日休息
 * @param holiday
 * @param date
 * @param remarks
 * @returns {AxiosPromise}
 */
export function updateLearnCalendar({ holiday, date, remarks }) {
  return request({
    url: '/neuroo/calendar',
    method: 'put',
    data: { holiday, date, remarks }
  })
}

/**
 * 通过班级id获取排课表
 * @param clazzId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryScheduleCalendar({ clazzId, startDate, endDate }) {
  return request({
    url: '/neuroo/schedule',
    method: 'get',
    params: { clazzId, startDate, endDate }
  })
}

/**
 * 查询启用的课程列表(下拉用)
 * @returns {AxiosPromise}
 */
export function queryCourseByOption() {
  return request({
    url: '/neuroo/course/enable',
    method: 'get'
  })
}

/**
 * 通过scheduleID删除课程
 * @param scheduleId
 * @returns {AxiosPromise}
 */
export function delScheduleCalendarById({ scheduleId }) {
  return request({
    url: `/neuroo/schedule/${scheduleId}`,
    method: 'delete'
  })
}

/**
 * 新增排课
 * @param courseId
 * @param clazzId
 * @param date
 * @returns {AxiosPromise}
 */
export function postCourseSchedule({ courseId, clazzId, date }) {
  return request({
    url: '/neuroo/schedule',
    method: 'post',
    data: { courseId, clazzId, date }
  })
}

/**
 * 一键排课程表(给班级排)
 * @param courseId
 * @param clazzId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function createAutoCourseForClazzByDate({ courseId, clazzId, startDate, endDate }) {
  return request({
    url: `/neuroo/schedule/auto_schedule`,
    method: 'post',
    data: { courseId, clazzId, startDate, endDate }
  })
}

/**
 * 通过学位ID删除课程会员学位
 * @param positionId
 * @returns {AxiosPromise}
 */
export function delStudentByPositionId(positionId) {
  return request({
    url: `/neuroo/position/${positionId}`,
    method: 'delete'
  })
}

/**
 * 获取有课时的会员
 * @param schoolId
 * @returns {AxiosPromise}
 */
export function queryHasMemberOfCourseTime({ schoolId }) {
  return request({
    url: '/neuroo/customer/list/have_hour',
    method: 'get',
    params: { schoolId }
  })
}

/**
 * 添加会员新增排课
 * @param customerId
 * @param scheduleId
 * @returns {AxiosPromise}
 */
export function postStudentToPosition({ customerId, scheduleId }) {
  return request({
    url: '/neuroo/position',
    method: 'post',
    data: { customerId, scheduleId }
  })
}

/**
 * 查询学位统计
 * @param schoolId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryStudentTotal({ schoolId, startDate, endDate }) {
  return request({
    url: '/neuroo/position/position_count',
    method: 'get',
    params: { schoolId, startDate, endDate }
  })
}

/**
 * 通过园区和日期查询详情
 * @param schoolId
 * @param schoolName
 * @param date
 * @returns {AxiosPromise}
 */
export function queryStudentTotalDetail({ schoolId, schoolName, date }) {
  return request({
    url: '/neuroo/position/position_detail',
    method: 'get',
    params: { schoolId, schoolName, date }
  })
}

/**
 * 查询班级某段时间内是否有排课
 * @param clazzId
 * @param courseId
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryCanAutoCourseByDate({ clazzId, courseId, startDate, endDate }) {
  return request({
    url: `/neuroo/schedule/find_is_schedule`,
    method: 'get',
    params: { clazzId, courseId, startDate, endDate }
  })
}
