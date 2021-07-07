import request from '../http.js'

/**
 * 查询年级列表
 */
export function getGradeList(data) {
  return request({
    url: `/guardcare/educational/grade`,
    method: 'get',
    params: data
  })
}

/**
 * 查询班级列表
 */
export function getClazzList(data) {
  return request({
    url: `/guardcare/educational/clazz`,
    method: 'get',
    params: data
  })
}

/**
 * 查询幼儿详情
 */
export function getChildDetail(childId) {
  return request({
    url: `/guardcare/child/${childId}`,
    method: 'get'
  })
}
