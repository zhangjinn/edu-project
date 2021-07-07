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

// 查询饮水记录列表
export function getDrinkRecordList({ clazzId, startTime, endTime }) {
  return request({
    url: '/sacc/drinking_record/list',
    method: 'get',
    params: { clazzId, startTime, endTime }
  })
}

// 新增饮水记录
export function addDrinkRecord(data) {
  return request({
    url: '/sacc/drinking_record',
    method: 'post',
    data
  })
}

// 查询饮水记录详情
export function getDrinkRecordDetail(customerId) {
  return request({
    url: '/sacc/drinking_record',
    method: 'get',
    params: { customerId }
  })
}
