import request from '@/utils/request'

/**
 * 查询短信记录列表
 * @param telephone 收件人号码
 * @param templateType 短信类型
 CUSTOM :自定义
 SYSTEM :系统
 * @param minSendTime 最早的发送时间
 * @param maxSendTime 最晚的发送时间
 * @param sendResult 发送情况
 对应的枚举名称为：SmsSendResult
 SUCCESS :发送成功
 FAILED :发送失败
 INSUFFICIENT_BALANCE :发送失败，余额不足
 * @param sender 发送人
 * @param senderIds 发送人ID
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySmsList ({ telephone, templateType, minSendTime, maxSendTime, sendResult, sender, senderIds, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/new_follow/communication/sms/record',
    method: 'get',
    params: {
      telephone,
      templateType,
      minSendTime,
      maxSendTime,
      sendResult,
      sender,
      senderIds,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 发短信
 * @param telephoneList undefined
 * @param customerId 客户id
 * @param content undefined
 * @returns {AxiosPromise}
 */
export function createSms ({ telephoneList, customerId, content }) {
  return request({
    url: '/customer/new_follow/communication/sms/send',
    method: 'post',
    data: { telephoneList, customerId, content }
  })
}

/**
 * 更新短信模版
 * @param id
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function updateSms ({ id, name, content }) {
  return request({
    url: `/customer/new_follow/communication/sms/template/${id}`,
    method: 'put',
    data: { name, content }
  })
}

/**
 * 打电话
 * @param phone 拨打的电话
 * @returns {AxiosPromise}
 */
export function createCall ({ phone }) {
  return request({
    url: '/basic/communication/call/do_call',
    method: 'post',
    data: { phone }
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
export function querySmsTemplate ({ keyword, pageNum, pageSize, paged }) {
  return request({
    url: '/customer/new_follow/communication/sms/template',
    method: 'get',
    params: { keyword, pageNum, pageSize, paged }
  })
}

/**
 * 删除短信模版
 * @param id
 * @returns {AxiosPromise}
 */
export function removeTemplate ({ id }) {
  return request({
    url: `/customer/new_follow/communication/sms/template/${id}`,
    method: 'delete'

  })
}

/**
 * 新增短信模版
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function createNewTemplate ({ name, content }) {
  return request({
    url: '/customer/new_follow/communication/sms/template',
    method: 'post',
    data: { name, content }
  })
}

/**
 * 更新短信模版
 * @param id
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function updateTemplate ({ id, name, content }) {
  return request({
    url: `/customer/new_follow/communication/sms/template/${id}`,
    method: 'put',
    data: { name, content }
  })
}

/**
 * 新增短信签名
 * @param businessLicense 营业执照
 * @param frontPicture 门头照
 * @param remark 备注
 * @param smsType 短信类型
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function createSignature ({ businessLicense, frontPicture, remark, smsType, content }) {
  return request({
    url: '/customer/new_follow/communication/sms/signature',
    method: 'post',
    data: { businessLicense, frontPicture, remark, smsType, content }
  })
}

/**
 * 查询短信签名详情
 * @param organizationId 企业id
 * @returns {AxiosPromise}
 */
export function querySignature ({ organizationId }) {
  return request({
    url: '/customer/new_follow/communication/sms/signature',
    method: 'get',
    params: { organizationId }
  })
}

/**
 * 编辑 短信签名
 * @param id
 * @param content 内容
 * @param businessLicense 营业执照
 * @param frontPicture 门头照
 * @param remark 备注
 * @param smsType 短信类型
 * @returns {AxiosPromise}
 */
export function updateSignature ({ id, content, businessLicense, frontPicture, remark, smsType }) {
  return request({
    url: `/customer/new_follow/communication/sms/signature/${id}`,
    method: 'put',
    data: { content, businessLicense, frontPicture, remark, smsType }
  })
}

/**
 * 获取呼叫中心的企业的账户信息
 * */
export function getAccount (params) {
  return request({
    url: '/basic/communication/organization/account',
    method: 'get',
    params
  })
}

/**
 * 通过数据标签查询员工下拉
 * @param tagCode
 * @returns {AxiosPromise}
 */
export function queryEmployeeSelectByTabCode ({ tagCode }) {
  return request({
    url: '/basic/v2/enterprise/employee',
    method: 'get',
    params: { tagCode }
  })
}
