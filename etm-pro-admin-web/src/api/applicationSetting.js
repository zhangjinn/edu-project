import request from '@/utils/request'

// TODO: 应用设置

/**
 * 新增收费项目
 * @param data
 */
export function postChargeItem({ data }) {
  return request({
    url: '/sacc/application_setting/item',
    method: 'post',
    data: data
  })
}

// TODO 没有数据结构
/**
 * 查询收费项目详情
 * @param id
 */
export function getChargeItemById({ id }) {
  return request({
    url: '/sacc/application_setting/item/' + id,
    method: 'get'
  })
}

// TODO 没有分页?
/**
 * 查询收费项目列表
 */
export function getChargeItemList() {
  return request({
    url: '/sacc/application_setting/item',
    method: 'get'
  })
}

// TODO 没有分页?
/**
 * 查询默认收费项目列表
 */
export function getChargeItemListDefault() {
  return request({
    url: '/application_setting/item/default',
    method: 'get'
  })
}

/**
 * 修改收费项目
 * @param data
 */
export function updateChargeItem({ data }) {
  return request({
    url: '/sacc/application_setting/item',
    method: 'put',
    data: data
  })
}

/**
 * 删除收费项目
 * @param id
 */
export function deleteChargeById({ id }) {
  return request({
    url: '/sacc/application_setting/item/' + id,
    method: 'delete'
  })
}

// TODO 预警
// 新建预警天数
export function postWarningDay({ data }) {
  return request({
    url: '/sacc/application_setting/warning',
    method: 'post',
    data: data
  })
}

/**
 * 查询预警天数详情
 * @param id
 */
export function getWarningDayDetailById({ id }) {
  return request({
    url: '/sacc/application_setting/warning/' + id,
    method: 'get'
  })
}

// TODO 没有分页?
/**
 * 查询预警天数列表
 */
export function getWarningDaysList() {
  return request({
    url: '/sacc/application_setting/warning',
    method: 'get'
  })
}

/**
 * 修改预警天数
 * @param data
 */
export function updateWarning({ data }) {
  return request({
    url: '/sacc/application_setting/warning',
    method: 'put',
    data: data
  })
}

/**
 * 删除预警天数
 * @param id
 */
export function deleteWarningById({ id }) {
  return request({
    url: '/sacc/application_setting/warning/' + id,
    method: 'delete'
  })
}

/**
 * 新建有效期
 * @param data
 */
export function postValidity({ data }) {
  return request({
    url: '/sacc/application_setting/validity',
    method: 'post',
    data: data
  })
}

/**
 * 查询有效期详情
 * @param id
 */
export function getValidityById({ id }) {
  return request({
    url: '/sacc/application_setting/validity/' + id,
    method: 'get'
  })
}

/**
 * 查询有效期列表
 */
export function getValidityList() {
  return request({
    url: '/sacc/application_setting/validity',
    method: 'get'
  })
}

/**
 * 修改有效期
 * @param data
 */
export function updateValidity({ data }) {
  return request({
    url: '/sacc/application_setting/validity',
    method: 'put',
    data: data
  })
}

/**
 * 删除有效期
 * @param id
 */
export function deleteValidityById({ id }) {
  return request({
    url: '/sacc/application_setting/validity/' + id,
    method: 'delete'
  })
}
