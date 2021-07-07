import request from '@/utils/request'

/**
 * 查询班级列表
 * */
export function getClazz(params) {
  return request({
    url: '/guardcare/educational/clazz',
    method: 'get',
    params
  })
}

/**
 * 批量新增班级
 * */
export function postClazz(data) {
  return request({
    url: '/guardcare/educational/clazz/batch_save',
    method: 'post',
    data
  })
}

/**
 * 更新班级
 * */
export function putClazz(data, id) {
  return request({
    url: `/guardcare/educational/clazz/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除班级
 * */
export function delClazz(id) {
  return request({
    url: `/guardcare/educational/clazz/${id}`,
    method: 'delete'
  })
}

/**
 * 获取班级详情
 * */
export function getClazzItem(id) {
  return request({
    url: `/guardcare/educational/clazz/${id}`,
    method: 'get'
  })
}

