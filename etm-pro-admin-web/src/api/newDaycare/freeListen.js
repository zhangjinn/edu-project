import request from '@/utils/request'

/**
 * 查询托育试听列表
 * @param childName 学员姓名
 * @param clazzName 班级名称
 * @param headTeacherName 班主任名称
 * @param followerName 跟进人名称
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param state 状态
TO_BE_VISITED :待到访
VISITED :已到访
CANCELED :取消
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @param sort 排序信息
   2. entity中的字段。
   3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
* @returns {AxiosPromise}
*/
export function queryFreeListenInfoList({ childName, clazzName, headTeacherName, followerName, startDate, endDate, state, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/newdaycare/experience`,
    method: 'get',
    params: { childName, clazzName, headTeacherName, followerName, startDate, endDate, state, pageNum, pageSize, paged, sort }
  })
}

/**
 * 确认到访
 * @param experienceId
 * @returns {AxiosPromise}
 */
export function confirmArrival({ experienceId }) {
  return request({
    url: `/newdaycare/experience/attend/${experienceId}`,
    method: 'put'
  })
}

/**
 * 取消试听
 * @param experienceId
 * @returns {AxiosPromise}
 */
export function cancelOrder({ experienceId }) {
  return request({
    url: `/newdaycare/experience/cancel/${experienceId}`,
    method: 'put'
  })
}

/**
 * 新增托育试听
 * @param childId 学员id
 * @param list undefined
 * @returns {AxiosPromise}
 */
export function createFreeListenInfo({ childId, list }) {
  return request({
    url: `/newdaycare/experience`,
    method: 'post',
    data: { childId, list }
  })
}
