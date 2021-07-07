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

// 查询睡眠记录列表 BM
export function getSleepRecordList({ clazzId, sleepingStateEnum }) {
  return request({
    url: '/sacc/sleeping_record/list',
    params: { clazzId, sleepingStateEnum },
    method: 'get'
  })
}

// 增加开始睡眠记录 BM
export function startSleep({ customerId, startTime }) {
  return request({
    url: '/sacc/sleeping_record',
    method: 'post',
    data: { customerId, startTime }
  })
}

// 更新睡眠记录 BM
export function endSleep({ customerId, endTime, quality }) {
  return request({
    url: '/sacc/sleeping_record/end',
    method: 'post',
    data: { customerId, endTime, quality }
  })
}

// 查询睡眠记录详情 BM
export function getSleepRecordDetail(customerId) {
  return request({
    url: '/sacc/sleeping_record',
    method: 'get',
    params: { customerId }
  })
}
