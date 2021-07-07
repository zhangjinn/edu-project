import request from '@/utils/request'

const prefix = process.env.VUE_APP_BASE_API

/**
* 添加客户
* */
export function addCustomer(data) {
  return request({
    url: '/customer/customer',
    method: 'post',
    data
  })
}

/**
* 修改客户
* */
export function editCustomer(data, id) {
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
* 批量删除客户
* */
export function delCustomerList(data) {
  return request({
    url: '/customer/customer',
    method: 'delete',
    data
  })
}

/**
 * 查询属性
 * 属性类别：1-来源，2-称呼，3-销售阶段，4-重要程度
 * */
export function getAttribute(data) {
  return request({
    url: '/customer/attribute',
    method: 'get',
    params: data
  })
}

/**
 * 查询来源（包括二级来源）
 * 属性类别：fkOrganizationId, attributeType
 * */
export function getAttributeLevel(data) {
  return request({
    url: '/customer/attribute/level',
    method: 'get',
    params: data
  })
}

/**
* 查询客户详细信息
* 属性类别：客户id
* */
export function getCustomerDetails(id) {
  return request({
    url: '/customer/customer/' + id,
    method: 'get'
  })
}
/**
 * 查询作为筛选条件的字段
 * */
export function getScreenDictType(id) {
  return request({
    url: '/customer/customer/list/dict_type',
    method: 'get'
  })
}
/**
 * 查询添加客户页的所有字段
 * 属性类别：客户id
 * */
export function getDictType(id) {
  return request({
    url: '/customer/customer/' + id + '/dict_type',
    method: 'get'
  })
}

/**
 * 获取显示设置
 * */
export function getEmployeeHeader() {
  return request({
    url: '/customer/customer/employee_header',
    method: 'get'
  })
}
/**
 * 保存/修改显示设置
 * */
export function putEmployeeHeader(data) {
  return request({
    url: '/customer/customer/employee_header',
    method: 'put',
    data
  })
}
/**
* 根据客户id分页查询客户的跟进列表
* 属性类别：客户id ，页码 ，每页条数
* */
export function getFollowList(id) {
  return request({
    url: `/customer/new_follow/customer/${id}`,
    method: 'get'
  })
}

/**
* 新增跟进记录
* */
export function addFollow(data) {
  return request({
    url: '/customer/new_follow',
    method: 'post',
    data
  })
}
/**
 * 1查询跟进详情
 * */
export function getFollowDetail(id) {
  return request({
    url: `/customer/new_follow/${id}`,
    method: 'get'
  })
}
/**
* 查询客户列表
* */
export function checkCustomerList(data) {
  return request({
    url: '/customer/customer/list',
    method: 'post',
    data
  })
}
/**
 * 查询客户的联系人回填信息
 * */
export function getContact(id) {
  return request({
    url: '/customer/customer/' + id + '/contact',
    method: 'get'
  })
}
/**
* 分配客户
* */
export function assignCustomer(data) {
  return request({
    url: '/customer/customer/assign',
    method: 'post',
    data
  })
}

/**
* 查询客户自定义字段列表
* 属性类别：组织id
* */
export function checkCustomerFields(data) {
  return request({
    url: '/customer/eav/attribute',
    method: 'get',
    params: data
  })
}

/**
* 查询跟进自定义字段列表
* 属性类别：组织id
* */
export function getFollowFields() {
  return request({
    url: '/customer/new_follow/add/dict_type',
    method: 'get'
  })
}
/**
* 获取当前企业的所有员工
* */
export function getEmployeeAll() {
  return request({
    url: '/basic/v2/enterprise/employee',
    method: 'get'
  })
}

// 默认显示设置
export function checkSetting(data) {
  return request({
    url: '/customer/display_settings',
    method: 'get',
    params: data
  })
}

export function deleteSetting(data) {
  return request({
    url: '/customer/display_settings',
    method: 'delete',
    params: data
  })
}

/*
* 改变默认显示设置
* */
export function postSetting(data) {
  return request({
    url: '/customer/display_settings',
    method: 'post',
    data
  })
}

/*
* 客户自定义字段
* */
export function getCustom(data) {
  return request({
    url: '/customer/eav/attribute/columnName',
    method: 'get',
    params: data
  })
}

/*
* 查询账户在某个组织的某个平台的某个页面的设置
* */
export function accountSetting(data) {
  return request({
    url: '/basic/account_setting',
    method: 'get',
    params: data
  })
}

/**
* 领取客户
* */
export function getAcquire(data) {
  return request({
    url: '/customer/customer/acquire',
    method: 'post',
    data
  })
}

/**
 * 保存账户在某个组织的某个平台的某个页面的设置
 * */
export function postAccountSetting(data) {
  return request({
    url: '/basic/account_setting',
    method: 'post',
    data
  })
}

/**
 * 切换当前组织ID上下文
 * @param organizationId
 * @returns {AxiosPromise}
 */
export function changeCurrentOrg({ organizationId }) {
  return request({
    url: '/basic/auth/organization',
    method: 'put',
    data: { organizationId }
  })
}

export function getQueryList(params) {
  return request({
    url: '/customer/eav/attribute/query',
    method: 'get',
    params
  })
}

/*
* 查询员工事务
* */
export function transaction(data) {
  return request({
    url: '/basic/transaction',
    method: 'get',
    params: data
  })
}

/**
 * 查询账户在某个组织的某个平台的某个页面的设置
 * */
export function getAccountSetting(data) {
  return request({
    url: '/basic/account_setting',
    method: 'get',
    params: data
  })
}

/**
 *修改员工事务状态
 * */
export function editAction(id, data) {
  return request({
    url: '/basic/transaction/' + id,
    method: 'put',
    params: data
  })
}

/**
 * 保存标签
 * @param data
 */

export function postMark(data) {
  return request({
    url: '/customer/mark',
    method: 'post',
    data
  })
}
export function deleteMark(id) {
  return request({
    url: '/customer/mark/' + id,
    method: 'delete'
  })
}

/**
 * 放弃客户
 * */
export function abandon(data) {
  return request({
    url: '/customer/customer/abandon',
    method: 'post',
    data
  })
}

/**
 * 导入
 * */
export function postImport(data, query) {
  return request({
    url: '/customer/customer/import?batchCode=' + query,
    method: 'post',
    data
  })
}

/**
 * 下载导入模版
 * */
export function postDownTemplate(data) {
  return prefix + '/customer/customer/import/down_template?code=' + data
}

/**
 * 获取下载模版的下载码
 * */
export function postDownTemplateCode(data) {
  return request({
    url: '/customer/customer/import/down_template/code',
    method: 'post',
    data
  })
}

/**
 * 获取导入字段集合
 * @param 组织id
 * */
export function getFields() {
  return request({
    url: '/customer/customer/import/fields',
    method: 'get'
  })
}

/**
 * 获取导出客户下载码
 * */
export function postExportCode(data) {
  return request({
    url: '/customer/customer/export/code',
    method: 'post',
    data
  })
}

/**
 * 导出客户
 * */
export function exportCustomer(data) {
  return prefix + '/customer/customer/export?code=' + data
}

/**
 * 根据组织id分页查询批次记录
 * */
export function checkRecordList(data) {
  return request({
    url: '/customer/batch',
    method: 'get',
    params: data
  })
}

/**
 * 分配批次列表
 * */
export function getAssignBatch(params) {
  return request({
    url: '/customer/customer/assign/batch',
    method: 'get',
    params
  })
}

/**
 * 分配批次详情
 * */
export function getAssignBatchDetail(id) {
  return request({
    url: `/customer/customer/assign/batch/${id}`,
    method: 'get'
  })
}

/**
 * 撤销分配
 * */
export function postRevokeAssignBatch(data) {
  return request({
    url: `/customer/customer/assign/revoke`,
    method: 'post',
    data
  })
}
/**
 * 导入批次列表
 * */
export function getImportBatch(params) {
  return request({
    url: '/customer/customer/import/batch',
    method: 'get',
    params
  })
}

/**
 * 导入批次详情
 * */
export function getImportBatchDetail(batchId) {
  return request({
    url: `/customer/customer/import/batch/${batchId}`,
    method: 'get'
  })
}

/**
 * 撤销导入
 * */
export function postRevokeImportBatch(data) {
  return request({
    url: `/customer/customer/import/revoke`,
    method: 'post',
    data
  })
}

/**
 * 查询呼叫中心的通话记录
 * */
export function getCallRecord(params) {
  return request({
    url: '/basic/communication/call/record',
    method: 'get',
    params
  })
}

/**
 * 查询呼叫中心的呼叫设置
 * */
export function getCallSetting(params) {
  return request({
    url: '/basic/communication/call/setting',
    method: 'get',
    params
  })
}

/**
 * 更新或新增呼叫设置
 * */
export function postCallSetting(data) {
  return request({
    url: '/basic/communication/call/setting',
    method: 'post',
    data
  })
}

/**
 * 查询指定企业的岗位权限名称列表
 * */
export function getPositionName(id) {
  return request({
    url: `/basic/v2/enterprise/${id}/position_name`,
    method: 'get'
  })
}

/**
 * 从原录音地址下载录音
 * */
export function postDownSrcRecord(data) {
  return request({
    url: `/basic/communication/call/down_src_record`,
    method: 'post',
    data
  })
}

/**
 * 获取呼叫中心的企业的账户信息
 * */
export function getAccount(params) {
  return request({
    url: '/basic/communication/organization/account',
    method: 'get',
    params
  })
}

/**
 * 打电话
 * */
export function postDoCall(data) {
  return request({
    url: `/basic/communication/call/do_call`,
    method: 'post',
    data
  })
}

/**
 * 给客户打电话
 * */
export function postCustomerDoCall(data) {
  return request({
    url: `/customer/new_follow/communication/call/do_call`,
    method: 'post',
    data
  })
}

/**
 * 查询客户的通话记录
 * */
export function getRecordByCustomer(params) {
  return request({
    url: '/customer/new_follow/communication/call/record/by_customer',
    method: 'get',
    params
  })
}

/**
 * 发短信
 * */
export function sendSms(data) {
  return request({
    url: '/customer/new_follow/communication/sms/send',
    method: 'post',
    data
  })
}

/**
 * 查询短信模版列表
 * */
export function querySmsTemplate(params) {
  return request({
    url: '/customer/new_follow/communication/sms/template',
    method: 'get',
    params
  })
}

/**
 * 查询客户的短信记录
 * */
export function querySmsRecord({ customerId, minSendTime, maxSendTime, pageNum, pageSize }) {
  return request({
    url: '/customer/new_follow/communication/sms/record/by_customer',
    method: 'get',
    params: { customerId, minSendTime, maxSendTime, pageNum, pageSize }
  })
}

/**
 * 重发短信
 * */
export function sendSmsAgain({ id }) {
  return request({
    url: `/customer/new_follow/communication/sms/send/${id}`,
    method: 'put'
  })
}
