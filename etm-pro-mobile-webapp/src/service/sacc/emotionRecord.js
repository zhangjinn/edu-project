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

// 查询情绪记录列表
export function getEmotionRecordList({ clazzId, mood }) {
  return request({
    url: '/sacc/mood_record/list',
    method: 'get',
    params: { clazzId, mood }
  })
}

// 新增情绪记录
export function addEmotionRecord(data) {
  return request({
    url: '/sacc/mood_record',
    method: 'post',
    data
  })
}

// 获取情绪记录详情
export function getEmotionRecordDetail(customerId) {
  return request({
    url: `/sacc/mood_record/${customerId}`,
    method: 'get'
  })
}
