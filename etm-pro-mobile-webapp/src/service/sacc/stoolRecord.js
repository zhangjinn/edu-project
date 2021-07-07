import request from '../http'

// 获取所有枚举信息
export function getAllEnum() {
  return request({
    url: '/sacc/enum/all',
    method: 'get'
  })
}

// 根据枚举名称查询选项
export function getEnumByName(name) {
  return request({
    url: '/sacc/enum',
    method: 'get',
    params: { name }
  })
}

// 查询便便记录列表
export function getStoolRecordList({ clazzId, startTime, endTime }) {
  return request({
    url: '/sacc/stool_record/list',
    method: 'get',
    params: { clazzId, startTime, endTime }
  })
}

// 新增便便记录
export function addStoolRecord(data) {
  return request({
    url: '/sacc/stool_record',
    method: 'post',
    data
  })
}

// 获取便便记录详情
export function getStoolRecordDetail(customerId) {
  return request({
    url: `/sacc/stool_record/${customerId}`,
    method: 'get'
  })
}
