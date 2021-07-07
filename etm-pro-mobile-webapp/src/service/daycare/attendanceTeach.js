import request from '../http.js'

// import request from './mockRequest'

/**
 * 查询某天所有有早教排课的课程
 * @param date
 */
export function queryCourseSummary({ date, type }) {
  return request({
    url: `daycare/course_management/course_summary`,
    method: 'get',
    params: { date, type }
  })
}

/**
 * 查询日统计-早勤
 * @param 日期
 * @param courseManagementId 早教课程id(有则查这个课的,无则全部)
 */
export function queryDayCount({ date, courseManagementId }) {
  return request({
    url: `daycare/taattendance/day_count`,
    method: 'get',
    params: { date, courseManagementId }
  })
}

/**
 * 查询日统计明细-早勤
 * @param date 日期
 * @param type 已考勤/未考勤/已请假
 ATTENDANCE :已考勤
 NOT_ATTENDANCE :未考勤
 ASK_FOR_LEAVE :已请假
 * @param courseManagementId 早教课程id(有则查这个课的,无则全部)
 */
export function queryDayCountDetail({ date, type, courseManagementId }) {
  return request({
    url: `daycare/taattendance/day_count_detail`,
    method: 'get',
    params: { date, type, courseManagementId }
  })
}

/**
 * 查询月统计明细-早勤
 * @param date 日期
 * @param type 已考勤/未考勤/已请假
 ATTENDANCE :已考勤
 NOT_ATTENDANCE :未考勤
 ASK_FOR_LEAVE :已请假
 * @param courseId 早教课程id(有则查这个课的,无则全部)
 */
export function queryMonthCountDetail({ startDate, endDate, courseId }) {
  return request({
    url: `daycare/taattendance/month_count_detail`,
    method: 'get',
    params: { startDate, endDate, courseId }
  })
}

/**
 * 查询月统计-早勤
 * @param startDate 月份开始日期
 * @param endDate 月份结束日期
 * @param courseId 课程id
 */
export function queryMonthCount({ startDate, endDate, courseId }) {
  return request({
    url: `daycare/taattendance/month_count`,
    method: 'get',
    params: { startDate, endDate, courseId }
  })
}

/**
 * 查询月统计-早勤
 * @param startDate 月份开始日期
 * @param endDate 月份结束日期
 * @param childId 学员id
 */
export function queryChildTaattendance({ startDate, endDate, childId }) {
  return request({
    url: `daycare/taattendance/child_taattendance`,
    method: 'get',
    params: { startDate, endDate, childId }
  })
}

/**
 * 更新早教考勤
 * @param caAattendanceIdList integer [] 考勤id
 * @param status 考勤状态
 * @param reason 请假原因
 */
export function updateDaycareAattendance({ caAattendanceIdList, status, reason = '' }) {
  return request({
    url: '/daycare/taattendance',
    method: 'put',
    data: { caAattendanceIdList, status, reason }
  })
}

/**
 * 新增早教考勤
 * @param addDaycareAattendance integer [] 考勤id
 * @param status 考勤状态
 * @param reason 请假原因
 */
export function addDaycareAattendance({ childCourseIdList, status, reason = '' }) {
  return request({
    url: '/daycare/taattendance',
    method: 'post',
    data: { childCourseIdList, status, reason }
  })
}
