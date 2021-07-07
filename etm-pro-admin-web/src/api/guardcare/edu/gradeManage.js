import request from '@/utils/request'

/**
 * 查询年级列表
 * */
export function getGrade(params) {
  return request({
    url: '/guardcare/educational/grade',
    method: 'get',
    params
  })
}

/**
 * 新增年级
 * */
export function postGrade(data) {
  return request({
    url: '/guardcare/educational/grade',
    method: 'post',
    data
  })
}

/**
 * 修改年级
 * */
export function putGrade(data, id) {
  return request({
    url: `/guardcare/educational/grade/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除年级
 * */
export function delGrade(id) {
  return request({
    url: `/guardcare/educational/grade/${id}`,
    method: 'delete'
  })
}

/**
 * 获取年级详情
 * */
export function getGradeItem(id) {
  return request({
    url: `/guardcare/educational/grade/${id}`,
    method: 'get'
  })
}
