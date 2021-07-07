import request from '@/utils/request'

// import request from '@/api/newdaycare/mockRequest'

/**
 * 发短信
 * @param telephoneList 收件人号码列表
 * @param content 短信内容
 * @param childId
 * @returns {AxiosPromise}
 */
export function createSms({ telephoneList, content, childId }) {
  return request({
    url: `/newdaycare/sms`,
    method: 'post',
    data: { telephoneList, content, childId }
  })
}

/**
 * 查询短信记录列表
 * @param telephone 收件人号码
 * @param templateType 模版类型
 * @param minSendTime 最早的发送时间
 * @param maxSendTime 最晚的发送时间
 * @param sendResult 发送情况
 * @param senderId 发送人ID
 * @returns {AxiosPromise}
 */
export function querySmsList({ telephone, templateType, minSendTime, maxSendTime, sendResult, senderId, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/sms`,
    method: 'get',
    params: { telephone, templateType, minSendTime, maxSendTime, sendResult, senderId, pageNum, pageSize }
  })
}

/**
 * 根据枚举名称查询选项
 * @param data 枚举名称
 * @returns {AxiosPromise}
 */
export function querySearch(data) {
  return request({
    url: `/newdaycare/enum`,
    method: 'get',
    params: data
  })
}

/**
 * 重发短信
 * @param id 短信记录ID
 * @returns {AxiosPromise}
 */
export function updateSms({ id }) {
  return request({
    url: `/newdaycare/sms/${id}`,
    method: 'put'
  })
}

/**
 * 查询短信模板列表
 * @param keyword 关键字查询
 支持名称和内容的模糊匹配
 * @returns {AxiosPromise}
 */
export function querySmsTemplate({ keyword }) {
  return request({
    url: `/newdaycare/sms_template`,
    method: 'get',
    params: { keyword }
  })
}

/**
 * 新增短信模板
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function createNewTemplate({ name, content }) {
  return request({
    url: `/newdaycare/sms_template`,
    method: 'post',
    data: { name, content }
  })
}

/**
 * 更新短信模板
 * @param smsTemplateId 模板id
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function updateTemplate({ smsTemplateId, name, content }) {
  return request({
    url: `/newdaycare/sms_template/${smsTemplateId}`,
    method: 'put',
    data: { name, content }
  })
}

/**
 * 删除短信模板
 * @param smsTemplateId 模板id
 * @returns {AxiosPromise}
 */
export function removeTemplate({ smsTemplateId }) {
  return request({
    url: `/newdaycare/sms_template/${smsTemplateId}`,
    method: 'delete'
  })
}

/**
 * 获取当前企业的短信签名
 * @param smsType 短信类型 NOTICE :通知类短信
 MARKETING :营销类短信
 * @returns {AxiosPromise}
 */
export function querySignature({ smsType }) {
  return request({
    url: `/newdaycare/sms_signature/${smsType}`,
    method: 'get'
  })
}

/**
 * 新增短信签名
 * @param content 内容
 * @param businessLicense 营业执照
 * @param frontPicture 门头照
 * @param remark 备注
 * @param smsType 短信类型
 * @returns {AxiosPromise}
 */
export function createSignature({ content, businessLicense, frontPicture, remark, smsType }) {
  return request({
    url: `/newdaycare/sms_signature`,
    method: 'post',
    data: { content, businessLicense, frontPicture, remark, smsType }
  })
}

