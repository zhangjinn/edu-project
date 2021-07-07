// import request from './mockRequest'
import request from '../http.js'

/**
 * 获取某个排课某天的食谱
 * @param courseId 课程id
 * @param date 吃饭日期
 * @param weekName 周次
 * @param startDate 周开始时间
 * @param endDate 周结束时间
 * @returns {AxiosPromise}
 */
export function queryDayRecipe({ courseId, date, weekName, startDate, endDate }) {
  return request({
    url: `/daycare/week_recipe/day_recipe`,
    method: 'get',
    params: { courseId, date, weekName, startDate, endDate }
  })
}

/**
 * 查询某周某老师所有有托育排课的课程
 * @param date 日期 周查询时请填周一
 * @returns {AxiosPromise}
 */
export function queryWeekCourseSummary({ date }) {
  return request({
    url: `/daycare/ca_scourse_management/week_course_summary_teacher_repeat`,
    method: 'get',
    params: { date }
  })
}

/**
 * @function BM端获取某周是否有食谱标识
 * @param courseId {string|number} 课程id
 * @param date {string} 吃饭日期
 * @param weekName {string} 周次
 * @param startDate {string} 周开始时间
 * @param endDate {string} 周结束时间
 * @returns {AxiosPromise}
 */
export function queryWeekRecipeMark({ courseId, date, weekName, startDate, endDate }) {
  return request({
    url: `/daycare/week_recipe/day_recipe_mark`,
    method: 'get',
    params: { courseId, date, weekName, startDate, endDate }
  })
}
