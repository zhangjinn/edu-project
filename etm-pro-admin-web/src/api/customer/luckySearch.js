import request from '@/utils/request'

/**
 * 发短信
 * @param resultCustomerAddressIdList id
 * @param content 短信内容
 * @param type 获客类型
 * @returns {AxiosPromise}
 */
export function createSendMessage({ resultCustomerAddressIdList, content, type }) {
  return request({
    url: `/customer/customer_contact/do_send`,
    method: 'post',
    data: { resultCustomerAddressIdList, content, type }
  })
}

/**
 * 查询短信模版列表
 * @param keyword 关键字查询
 支持名称和内容的模糊匹配
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySmsTemplate({ keyword, pageNum, pageSize, paged }) {
  return request({
    url: `/customer/new_follow/communication/sms/template`,
    method: 'get',
    params: { keyword, pageNum, pageSize, paged }
  })
}

/**
 * 查询短信模版详情
 * @param id
 * @returns {AxiosPromise}
 */
export function querySmsTemplateDetail({ id }) {
  return request({
    url: `/customer/new_follow/communication/sms/template/${id}`,
    method: 'get',
    params: {}
  })
}

/**
 * 打电话
 * @param resultCustomerAddressId 会员id
 * @param type 获客类型
 * @returns {AxiosPromise}
 */
export function callUp({ resultCustomerAddressId, type }) {
  return request({
    url: `/customer/customer_contact/do_call`,
    method: 'post',
    data: { resultCustomerAddressId, type }
  })
}

/**
 * 查询天外来客
 * @returns {AxiosPromise}
 */
export function queryOuterCustomer() {
  return request({
    url: `/customer/customer_contact/outer_customer`,
    method: 'get',
    params: {}
  })
}

/**
 * 查询已添加的天外来客列表
 * @returns {AxiosPromise}
 */
export function queryOuterCustomerList() {
  return request({
    url: `/customer/customer_contact/outer_list`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增天外来客
 * @param resultCustomerAddressId 会员数据id
 * @param tagList 三个标签
 * @returns {AxiosPromise}
 */
export function createOuterCustomer({ resultCustomerAddressId, tagList }) {
  return request({
    url: `/customer/customer_contact/add_outer`,
    method: 'post',
    data: { resultCustomerAddressId, tagList }
  })
}

/**
 * 获取已探索统计
 * @param type 获客类型
 OUTER :天外来客
 AI :AI获客
 * @returns {AxiosPromise}
 */
export function queryStatistical({ type }) {
  return request({
    url: `/customer/customer_contact/statistical`,
    method: 'get',
    params: { type }
  })
}

/**
 * 保存客户
 * @param birthday 生日
 * @param qq QQ
 * @param address 详细地址
 * @param gender 性别
 * @param city 市地区编码
 * @param customFields 自定义字段
 * @param wechat 微信号
 * @param importantLevel 重要程度
 * @param telephone 客户手机号码
 * @param remark 备注
 * @param avatar 头像
 * @param source 来源
 * @param currentOrganizationId 用于导入 传入当前企业id
 * @param marketer 市场人员
 * @param counselor 跟进人员
 * @param currentEmployeeId 用于导入 传入当前员工id
 * @param province 省地区编码
 * @param name 客户名称
 * @param state 客户状态
 * @param region 区地区编码
 * @param contacts 联系人
 * @param mark 标签
 * @returns {AxiosPromise}
 */
export function createSaveCustomer({ birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, remark, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }) {
  return request({
    url: `/customer/customer/v2`,
    method: 'post',
    data: { birthday, qq, address, gender, city, customFields, wechat, importantLevel, telephone, remark, avatar, source, currentOrganizationId, marketer, counselor, currentEmployeeId, province, name, state, region, contacts, mark }
  })
}

/**
 * 获取应用设置系统字段选项
 * @param settingType 系统字段应用设置类型  MARK :客户标签
 NOT_DEAL_STATE :未成交客户状态
 DEAL_STATE :已成交客户状态
 RELATIONSHIP :联系人称呼
 SOURCE :来源
 IMPORTANT_LEVEL :重要程度
 SALES_STAGE :销售阶段
 FOLLOW_WAY :跟进方式
 * @returns {AxiosPromise}
 */
export function queryCustomerTagOptions({ settingType }) {
  return request({
    url: `/customer/customer/v2/setting`,
    method: 'get',
    params: { settingType }
  })
}
