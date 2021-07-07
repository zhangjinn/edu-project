import request from '../http.js'

/**
 * 查询每周计划
 * @param courseTermId 学期
 * @param clazzId 班级
 * @param courseTermWeekId 周次
 * @returns {AxiosPromise}
 */
export function queryWeekPlan({ courseTermId, clazzId, courseTermWeekId }) {
  return request({
    url: `/guardcare/educational/course/schedule/term/week`,
    method: 'get',
    params: { courseTermId, clazzId, courseTermWeekId }
  })
}
