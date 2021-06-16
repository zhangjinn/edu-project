import request from '@/utils/request'

/* 客户字段设置 */

/**
 * 查询客户字段列表
 * @returns {AxiosPromise}
 */
export function queryCustomerFieldList () {
  return request({
    url: '/customer/customer/dict_type',
    method: 'get'
  })
}

/**
 * 更新客户字段
 * @param id 字段id
 * @param name 字段名称
 * @param mandatory 是否必填
 * @param visible 是否显示
 * @param controlType 控件类型
 * @param description 字段说明
 * @param options 字段选项集合
 * @returns {AxiosPromise}
 */
export function updateCustomerFieldItem ({ id, name, mandatory, visible, controlType, description, options }) {
  return request({
    url: `/customer/customer/dict_type/${id}`,
    method: 'put',
    data: { name, mandatory, visible, controlType, description, options }
  })
}

/**
 * 新增客户字段
 * @param name 字段名称
 * @param mandatory 是否必填
 * @param visible 是否显示
 * @param controlType 控件类型
 * @param description 字段说明
 * @param options 字段选项
 * @returns {AxiosPromise}
 */
export function createCustomerFieldItem ({ name, mandatory, visible, controlType, description, options }) {
  return request({
    url: '/customer/customer/dict_type',
    method: 'post',
    data: { name, mandatory, visible, controlType, description, options }
  })
}

/**
 * 查询客户字段
 * @param id 字段id
 * @returns {AxiosPromise}
 */
export function queryCustomerFieldItem ({ id }) {
  return request({
    url: `/customer/customer/dict_type/${id}`,
    method: 'get'
  })
}

/* 跟进设置 */

/**
 * 查询跟进字段列表
 * @returns {AxiosPromise}
 */
export function queryFollowSettingList () {
  return request({
    url: '/customer/new_follow/dict_type',
    method: 'get'
  })
}

/**
 * 保存跟进字段
 * @param name 字段名称
 * @param mandatory 是否必填
 * @param visible 是否显示
 * @param controlType 控件类型
 * @param description 字段说明
 * @param options 字段选项
 * @returns {AxiosPromise}
 */
export function createFollowSettingItem ({ name, mandatory, visible, controlType, description, options }) {
  return request({
    url: '/customer/new_follow/dict_type',
    method: 'post',
    data: { name, mandatory, visible, controlType, description, options }
  })
}

/**
 * 更新跟进字段
 * @param id 字段id
 * @param name 字段名称
 * @param mandatory 是否必填
 * @param visible 是否显示
 * @param controlType 控件类型
 * @param description 字段说明
 * @param options 字段选项
 * @returns {AxiosPromise}
 */
export function updateFollowSettingItem ({ id, name, mandatory, visible, controlType, description, options }) {
  return request({
    url: `/customer/new_follow/dict_type/${id}`,
    method: 'put',
    data: { name, mandatory, visible, controlType, description, options }
  })
}

/**
 * 查询跟进字段信息
 * @param id 字段id
 * @returns {AxiosPromise}
 */
export function queryFollowSettingItem ({ id }) {
  return request({
    url: `/customer/new_follow/dict_type/${id}`,
    method: 'get'
  })
}

/**
 * 保存应用设置系统字段选项
 * @param options 选项
 * @param settingType 应用设置类型
 * @returns {AxiosPromise}
 */
export function alterMultiSetting ({ options, settingType }) {
  return request({
    url: '/customer/customer/v2/setting',
    method: 'post',
    data: { options, settingType }
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
export function queryMultiSettingList ({ settingType }) {
  return request({
    url: '/customer/customer/v2/setting',
    method: 'get',
    params: { settingType }
  })
}

/**
 * 删除应用设置系统字段选项
 * @param id
 * @returns {AxiosPromise}
 */
export function removeMultiSettingItem ({ id }) {
  return request({
    url: `/customer/customer/v2/setting/${id}`,
    method: 'delete'
  })
}

/* 跟进模版内容 */

/**
 * 查询跟进模版列表
 * @param keyWord 查询条件字段
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryFollowTemplateList ({ keyWord, pageNum, pageSize }) {
  return request({
    url: '/customer/follow/v2/setting/content_template',
    method: 'get',
    params: { keyWord, pageNum, pageSize }
  })
}

/**
 * 保存跟进模版
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function createFollowTemplateItem ({ name, content }) {
  return request({
    url: '/customer/follow/v2/setting/content_template',
    method: 'post',
    data: { name, content }
  })
}

/**
 * 修改跟进模版
 * @param id
 * @param name 名称
 * @param content 内容
 * @returns {AxiosPromise}
 */
export function updateFollowTemplateItem ({ id, name, content }) {
  return request({
    url: `/customer/follow/v2/setting/content_template/${id}`,
    method: 'put',
    data: { name, content }
  })
}

/**
 * 获取跟进模版详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryFollowTemplateItem ({ id }) {
  return request({
    url: `/customer/follow/v2/setting/content_template/${id}`,
    method: 'get'
  })
}

/**
 * 删除跟进模版
 * @param id
 * @returns {AxiosPromise}
 */
export function removeFollowTemplateItem ({ id }) {
  return request({
    url: `/customer/follow/v2/setting/content_template/${id}`,
    method: 'delete'
  })
}

/* 信息隐藏设置 */

/**
 * 获取客户加密信息规则列表
 * @returns {AxiosPromise}
 */
export function queryInfoHideSettingList () {
  return request({
    url: '/customer/customer/v2/info_encrypt_rule',
    method: 'get'
  })
}

/**
 * 更新客户加密信息规则
 * @param id
 * @param enable 是否加密
 * @param rule 规则名称
 * @returns {AxiosPromise}
 */
export function updateInfoHideSettingItem ({ id, enable, rule }) {
  return request({
    url: `/customer/customer/v2/info_encrypt_rule/${id}`,
    method: 'put',
    data: { enable, rule }
  })
}

/**
 * 保存客户加密信息规则
 * @param enable 是否加密
 * @param rule 规则名称
 * @returns {AxiosPromise}
 */
export function createInfoHideSettingItem ({ enable, rule }) {
  return request({
    url: '/customer/customer/v2/info_encrypt_rule',
    method: 'post',
    data: { enable, rule }
  })
}

/* 跟进规则 */

/**
 * 获取跟进规则列表
 * @returns {AxiosPromise}
 */
export function queryFollowRules () {
  return request({
    url: '/customer/follow/v2/rule',
    method: 'get'
  })
}

/**
 * 更新跟进规则
 * @param id
 * @param enable 是否启用
 * @param rule 规则名称
 * @param value 规则的值
 * @returns {AxiosPromise}
 */
export function updateFollowRules ({ id, enable, rule, value }) {
  return request({
    url: `/customer/follow/v2/rule/${id}`,
    method: 'put',
    data: { enable, rule, value }
  })
}

/**
 * 保存跟进规则
 * @param enable 是否启用
 * @param rule 规则名称
 * @param value 规则的值
 * @returns {AxiosPromise}
 */
export function createFollowRules ({ enable, rule, value }) {
  return request({
    url: '/customer/follow/v2/rule',
    method: 'post',
    data: { enable, rule, value }
  })
}

/* 自动回收客户规则 */

/**
 * 获取客户回收规则列表
 * @returns {AxiosPromise}
 */
export function queryRecoverRules () {
  return request({
    url: '/customer/customer/v2/recycle_rule',
    method: 'get'
  })
}

/**
 * 更新客户回收规则
 * @param id
 * @param enable 是否启用
 * @param rule 规则名称
 * @param value 规则的值
 * @returns {AxiosPromise}
 */
export function updateRecoverRules ({ id, enable, rule, value }) {
  return request({
    url: `/customer/customer/v2/recycle_rule/${id}`,
    method: 'put',
    data: { enable, rule, value }
  })
}

/**
 * 保存客户回收规则
 * @param enable 是否启用
 * @param rule 规则名称
 * @param value 规则的值
 * @returns {AxiosPromise}
 */
export function createRecoverRules ({ enable, rule, value }) {
  return request({
    url: '/customer/customer/v2/recycle_rule/',
    method: 'post',
    data: { enable, rule, value }
  })
}
