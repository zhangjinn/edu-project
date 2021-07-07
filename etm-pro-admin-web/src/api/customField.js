import request from '@/utils/request'

// TODO: 自定义会员字段

/**
 * 新增字段
 */
export function postCustomField({ data }) {
  return request({
    url: '/sacc/customer/eav/attribute',
    method: 'post',
    data: data
  })
}

/**
 * 删除字段
 */
export function deleteCustomField({ data }) {
  return request({
    url: '/sacc/customer/eav/attribute',
    method: 'delete',
    data: data
  })
}

/**
 * 更新字段
 * @param id 自定义字段的id
 * @param data
 */
export function updateCustomField({ id, data }) {
  return request({
    url: `/sacc/customer/eav/attribute/${id}`,
    method: 'put',
    data: data
  })
}

/**
 * 更新字段排序
 * @param data
 */
export function updateCustomFieldSort({ data }) {
  return request({
    url: '/sacc/customer/eav/attribute/sort',
    method: 'put',
    data: data
  })
}

/**
 * 获取字段
 */
export function getCustomField() {
  return request({
    url: '/sacc/customer/eav/attribute',
    method: 'get',
    params: {}
  })
}

/**
 * 查询字段详情
 */
export function getCustomFieldById({ id, type }) {
  return request({
    url: `/sacc/customer/eav/attribute/${id}/${type}`,
    method: 'get'
  })
}
