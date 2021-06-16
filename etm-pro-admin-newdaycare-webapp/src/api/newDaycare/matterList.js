import request from '@/utils/request'

/**
 * 确认
 * @param tellMattersId
 * @param tellState 交代状态
 * @returns {AxiosPromise}
 */
export function updateMatterListStatus ({ tellMattersId, tellState }) {
  return request({
    url: `/newdaycare/tell_matters/revoke/${tellMattersId}`,
    method: 'put',
    data: { tellState }
  })
}

/**
 * 查询交代事宜列表
 * @param tellState 交代状态
 * @param childName 学员名称
 * @param clazzName 班级名称
 * @param explainBeginTime 交代开始时间
 * @param defineBeginTime 确定开始时间
 * @param explainEndTime 交代结束时间
 * @param defineEndTime 确结束时间
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryMatterList ({ tellState, childName, clazzName, explainBeginTime, defineBeginTime, explainEndTime, defineEndTime, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/tell_matters/findTellMatters',
    method: 'post',
    data: { tellState, childName, clazzName, explainBeginTime, defineBeginTime, explainEndTime, defineEndTime, pageNum, pageSize, paged }
  })
}
