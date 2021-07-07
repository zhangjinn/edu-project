import request from '../http.js'
// import request from '../mock'

/**
 * BM-查询周食谱
 * @param courseTermId 学期ID
 * @param gradeId 年级ID
 * @param weekId 周次ID
 * @returns {AxiosPromise}
 */
export function queryWeekRecipes({ courseTermId, gradeId, weekId }) {
  return request({
    url: `/guardcare/week_recipe`,
    method: 'get',
    params: { courseTermId, gradeId, weekId }
  })
}
