import request from '../http.js'

/**
 * 查询添加客户页的所有字段
 */
export function getCustomerDictType(id) {
  return request({
    url: `/customer/customer/${id}/dict_type`,
    method: 'get'
  })
}

/**
 * 添加客户
 * */
export function postCustomer(data) {
  return request({
    url: '/customer/customer',
    method: 'post',
    data
  })
}

/**
 * 修改客户
 * */
export function putCustomer(id, data) {
  return request({
    url: '/customer/customer/' + id,
    method: 'put',
    data
  })
}

/**
 * 删除客户
 * 属性类别：客户id
 * */
export function delCustomer(id) {
  return request({
    url: '/customer/customer/' + id,
    method: 'delete'
  })
}

/**
 * 放弃客户
 * @param data
 * @returns {AxiosPromise}
 */
export function abandonCustomer(data) {
  return request({
    url: '/customer/customer/abandon',
    method: 'post',
    data
  })
}

/**
 * 领取客户
 * @param data
 * @returns {AxiosPromise}
 */
export function acquireCustomer(data) {
  return request({
    url: '/customer/customer/acquire',
    method: 'post',
    data
  })
}

/**
 * 查询客户列表
 * */
export function postCustomerList(data) {
  return request({
    url: '/customer/customer/mobile/list',
    method: 'post',
    data
  })
}

/**
 * 查询作为筛选条件的字段
 * */
export function getAttribute() {
  return request({
    url: '/customer/customer/list/dict_type',
    method: 'get'
  })
}

/**
 * 查看客户详细
 * 属性类别：客户id
 * */
export function getCustomerDetail(id) {
  return request({
    url: '/customer/customer/' + id,
    method: 'get'
  })
}

/**
 * 查询客户的联系人回填信息
 * 属性类别：客户id
 * */
export function getCustomerContact(id) {
  return request({
    url: '/customer/customer/' + id + '/contact',
    method: 'get'
  })
}

/**
 * 查询跟进自定义字段列表
 * */
export function getFollowFields() {
  return request({
    url: '/customer/new_follow/add/dict_type',
    method: 'get'
  })
}

/**
 * 新增跟进记录
 * */
export function postFollow(data) {
  return request({
    url: '/customer/new_follow',
    method: 'post',
    data
  })
}

/**
 * 查询客户的跟进列表
 * 属性类别：客户id
 * */
export function getFollowList(id) {
  return request({
    url: '/customer/new_follow/customer/' + id,
    method: 'get'
  })
}

/**
 * 查询跟进详情
 */
export function getFollowDetail(id) {
  return request({
    url: '/customer/new_follow/' + id,
    method: 'get'
  })
}

/**
 * 选中分配
 * */
export function postAssignCustomer(data) {
  return request({
    url: '/customer/customer/assign',
    method: 'post',
    data
  })
}

/**
 * 分配批次列表
 */
export function getBatchList(data) {
  return request({
    url: '/customer/customer/assign/batch',
    method: 'get',
    params: data
  })
}

/**
 * 撤销批次
 * @param data
 */
export function revokeBatch(data) {
  return request({
    url: '/customer/customer/assign/revoke',
    method: 'post',
    data
  })
}

/**
 * 批次详情
 */
export function getBatchInfo(id) {
  return request({
    url: '/customer/customer/assign/batch/' + id,
    method: 'get'
  })
}

/**
 * 查询移动端客户详情的客户分配次数与跟进次数
 * @param data
 */
export function getAssignCount(id) {
  return request({
    url: '/customer/customer/' + id + '/mobile/assign_follow_count',
    method: 'get'
  })
}
