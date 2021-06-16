import request from '@/utils/request'

/**
 * 查询AI雷达获客列表
 * */
export function queryCustomerContact ({ address, distance, province, city, childAge, parentsAge, childGender, parentsEducation, appType, consumption, flightTag, noLoadding }) {
  return request({
    url: '/customer/customer_contact',
    method: 'get',
    timeout: 30000,
    params: { address, distance, province, city, childAge, parentsAge, childGender, parentsEducation, appType, consumption, flightTag, noLoadding }
  })
}

/**
 * 获取已探索统计
 * */
export function queryStatistical ({ type, noLoadding }) {
  return request({
    url: '/customer/customer_contact/statistical',
    method: 'get',
    params: { type, noLoadding }
  })
}

/**
 * 获取批次AI探客已推广总数
 * */
export function queryCommunicatedTotalByBatch ({ batchId }) {
  return request({
    url: `/customer/explore_customer/communicated_total/by_batch/${batchId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 保存AI探客批次
 * */
export function saveExploreCustomerBatch (data) {
  return request({
    url: '/customer/explore_customer/batch',
    method: 'post',
    data: data
  })
}

/**
 * 获取AI探客批次列表
 * */
export function queryExploreCustomerBatch () {
  return request({
    url: '/customer/explore_customer/batch',
    method: 'get',
    params: { }
  })
}

/**
 * 根据批次获取AI探客数据
 * */
export function queryDataByBatch ({ batchId, communicateStatus, pageNum, pageSize, noLoadding }) {
  return request({
    url: '/customer/explore_customer/data/by_batch',
    method: 'get',
    params: { batchId, communicateStatus, pageNum, pageSize, noLoadding }
  })
}

/**
 * 获取AI探客专家模式预设条件列表
 * */
export function queryQueryCondition () {
  return request({
    url: '/customer/explore_customer/query_condition',
    method: 'get',
    params: { }
  })
}

/**
 * 保存AI探客专家模式预设条件
 * */
export function saveQueryCondition ({ name, queryCondition }) {
  return request({
    url: '/customer/explore_customer/query_condition',
    method: 'post',
    data: { name, queryCondition }
  })
}

/**
 * 更新AI探客专家模式预设条件
 * */
export function updateQueryCondition ({ id, name, queryCondition }) {
  return request({
    url: `/customer/explore_customer/query_condition/${id}`,
    method: 'put',
    data: { name, queryCondition }
  })
}

/**
 * 删除AI探客专家模式预设条件
 * */
export function removeQueryCondition ({ id }) {
  return request({
    url: `/customer/explore_customer/query_condition/${id}`,
    method: 'delete'
  })
}

/**
 * 发送短信
 * @param exploreCustomerList 发送人集合
 * @param batchId 探客批次id
 * @param content 短信内容不能为空
 * @returns {AxiosPromise}
 */
export function sendMessage ({ exploreCustomerList, batchId, content }) {
  return request({
    url: '/customer/explore_customer/send_sms',
    method: 'post',
    data: { exploreCustomerList, batchId, content }
  })
}

/**
 * 打电话
 * @param telephone 电话
 * @param resultExploreCustomerId 会员id
 * @param batchId 探客批次id
 * @param demo 是否demo数据
 * @returns {AxiosPromise}
 */
export function callUp ({ telephone, resultExploreCustomerId, batchId, demo }) {
  return request({
    url: '/customer/explore_customer/call',
    method: 'post',
    data: { telephone, resultExploreCustomerId, batchId, demo }
  })
}
