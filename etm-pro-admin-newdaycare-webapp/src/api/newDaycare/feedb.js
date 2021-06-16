import request from '@/utils/request'

/**
 * 查询意见反馈表列表
 * @param feedbackType 查询类型
 * @param enterpriseIdList 园所ids -- 总部查询条件
 * @param feedbackStatus 状态
 * @param startDate 反馈开始日期
 * @param endDate 反馈结束日期
 * @param confirmStartDate 处理开始日期
 * @param confirmEndDate 处理结束日期
 * @param employeeName 反馈人姓名 --员工反馈
 * @param childName 反馈人姓名 --家长反馈
 * @param areaObject 前端不用传
 * @param employeeId 前端不用传
 * @param type 前端不用传
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @param sort 排序信息
      格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
      direction不指定时，默认为asc
      排序字段会按如下优先级去匹配：
      1. 查询的Sifter/ResultType类中定义的字段。
      {@link JpaSifterExecutor#findList(Sifter, Class)}
      {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
   2. entity中的字段。
   3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
* @returns {AxiosPromise}
*/
export function queryFeedbackList ({ feedbackType, enterpriseIdList, feedbackStatus, startDate, endDate, confirmStartDate, confirmEndDate, employeeName, childName, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/feedback/find_all',
    method: 'post',
    data: { feedbackType, enterpriseIdList, feedbackStatus, startDate, endDate, confirmStartDate, confirmEndDate, employeeName, childName, pageNum, pageSize }
  })
}

/**
 * 批处理意见反馈
 * @param feedbackIdList 反馈ids
 * @param handlingOpinions 处理意见
 * @returns {AxiosPromise}
 */
export function handleFeedback ({ feedbackIdList, handlingOpinions }) {
  return request({
    url: '/newdaycare/feedback/batch_processing',
    method: 'put',
    data: { feedbackIdList, handlingOpinions }
  })
}

/**
 * 撤销反馈
 * @param feedbackId
 * @returns {AxiosPromise}
 */
export function cancelFeedback ({ feedbackId }) {
  return request({
    url: `/newdaycare/feedback/revoke/${feedbackId}`,
    method: 'put'
  })
}

/**
 * 新增意见反馈表
 * @param opinion 反馈意见
 * @param imageList 图片
 * @param areaObject 发送对象（园所/区域/总部）
 * @returns {AxiosPromise}
 */
export function createFeedback ({ opinion, imageList, areaObject }) {
  return request({
    url: '/newdaycare/feedback',
    method: 'post',
    data: { opinion, imageList, areaObject }
  })
}

/**
 * 获取意见反馈详情（用于编辑）
 * @param feedbackId 意见反馈表 ID
 * @returns {AxiosPromise}
 */
export function queryFeedbackDetail ({ feedbackId }) {
  return request({
    url: `/newdaycare/feedback/${feedbackId}`,
    method: 'get'
  })
}

/**
 * 更新意见反馈表
 * @param feedbackId
 * @param opinion 反馈意见
 * @param imageList 图片
 * @param areaObject 发送对象（园所/区域/总部）
 * @returns {AxiosPromise}
 */
export function updateFeedback ({ feedbackId, opinion, imageList, areaObject }) {
  return request({
    url: `/newdaycare/feedback/${feedbackId}`,
    method: 'put',
    data: { opinion, imageList, areaObject }
  })
}

/**
 * 查询企业类型
 * @returns {AxiosPromise}
 */
export function queryEnterpriseType () {
  return request({
    url: '/newdaycare/feedback/find_enterprise_type',
    method: 'get'
  })
}

/**
 * 意见反馈处理结果查询
 * @param feedbackId
 * @returns {AxiosPromise}
 */
export function queryFeedbackResultDetail ({ feedbackId }) {
  return request({
    url: `/newdaycare/feedback/process_result/${feedbackId}`,
    method: 'get'
  })
}

/**
 * 查询区域下拉列表
 * @returns {AxiosPromise}
 */
export function queryOrganization () {
  return request({
    url: '/newdaycare/organization/area_down_list',
    method: 'get'
  })
}
