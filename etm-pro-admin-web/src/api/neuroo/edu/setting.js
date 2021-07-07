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
 * 获取节假日设置选项
 * @returns {AxiosPromise}
 */
export function queryCalendarHolidayOption() {
  return request({
    url: `/neuroo/educational_setting`,
    method: 'get'
  })
}

/**
 * 更新节假日设置
 * @param educationalSettingId
 * @param holidaySetting
 * @returns {AxiosPromise}
 */
export function updateCalendarHoliday({ educationalSettingId, holidaySetting }) {
  return request({
    url: `/neuroo/educational_setting/${educationalSettingId}`,
    method: 'put',
    data: { educationalSettingId, holidaySetting }
  })
}

/**
 * 获取范围内的日历信息
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export function queryCalendar({ startDate, endDate }) {
  return request({
    url: '/neuroo/calendar',
    method: 'get',
    params: { startDate, endDate }
  })
}

/**
 * 新增课程
 * @param courseName
 * @param startTime
 * @param endTime
 * @param enable
 * @param lesson
 * @returns {AxiosPromise}
 */
export function postLesson({ courseName, startTime, endTime, enable, lesson }) {
  return request({
    url: `/neuroo/course`,
    method: 'post',
    data: { courseName, startTime, endTime, enable, lesson }
  })
}

/**
 * 更新课程
 * @param courseId
 * @param courseName
 * @param startTime
 * @param endTime
 * @param enable
 * @param lesson
 * @returns {AxiosPromise}
 */
export function updateLesson({ courseId, courseName, startTime, endTime, enable, lesson }) {
  return request({
    url: `/neuroo/course/${courseId}`,
    method: 'put',
    data: { courseName, startTime, endTime, enable, lesson }
  })
}

/**
 * 删除课程
 * @param courseId
 * @returns {AxiosPromise}
 */
export function delLesson(courseId) {
  return request({
    url: `/neuroo/course/${courseId}`,
    method: 'delete'
  })
}

/**
 * 更新课程
 * @param courseId
 * @param courseName
 * @param startTime
 * @param endTime
 * @param enable
 * @param lesson
 * @returns {AxiosPromise}
 */
export function editLesson({ courseId, courseName, startTime, endTime, enable, lesson }) {
  return request({
    url: `/neuroo/course/${courseId}`,
    method: 'put',
    data: { courseId, courseName, startTime, endTime, enable, lesson }
  })
}

/**
 * 通过courseId获取详情
 * @param courseId
 * @returns {AxiosPromise}
 */
export function queryLessonByCourseId(courseId) {
  return request({
    url: `/neuroo/course/${courseId}`,
    method: 'get'
  })
}

/**
 * 查询课程列表
 * @returns {AxiosPromise}
 */
export function queryLessonList() {
  return request({
    url: `/neuroo/course`,
    method: 'get'
  })
}

/**
 * 查询当前课程能否删除
 * @param courseId
 * @returns {AxiosPromise}
 */
export function queryCanDeleteCourseByCourseId({ courseId }) {
  return request({
    url: `/neuroo/course/find_schedule_course/${courseId}`,
    method: 'get',
    params: { courseId }
  })
}
/**
 * 删除课程
 * @param courseId
 * @returns {AxiosPromise}
 */
export function delLessonCourse({ courseId }) {
  return request({
    url: `/neuroo/course/${courseId}`,
    method: 'delete'
  })
}

/**
 * 获取请假阈值
 * @returns {AxiosPromise}
 */
export function queryLeaveThreshold() {
  return request({
    url: '/neuroo/leave_threshold',
    method: 'get',
    params: {}
  })
}

/**
 * 更新请假阈值
 * @param thresholdType {string} NOT_MAKE_UP_LESSON :请假不补课时 NOT_THRESHOLD :不设阈值 GREATER_THAN_OR_EQUAL_TO_ONE_DAY :大于等于一天 GREATER_THAN_OR_EQUAL_TO_TWO_DAY :大于等于两天 GREATER_THAN_OR_EQUAL_TO_THREE_DAY :大于等于三天 GREATER_THAN_OR_EQUAL_TO_FOUR_DAY :大于等于四天 GREATER_THAN_OR_EQUAL_TO_FIVE_DAY :大于等于五天 GREATER_THAN_OR_EQUAL_TO_SIX_DAY :大于等于六天 GREATER_THAN_OR_EQUAL_TO_SEVEN_DAY :大于等于七天
 * @returns {AxiosPromise}
 */
export function updateLeaveThreshold({ thresholdType }) {
  return request({
    url: '/neuroo/leave_threshold',
    method: 'put',
    data: { thresholdType }
  })
}
