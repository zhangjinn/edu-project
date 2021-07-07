import request from '../http'

// 工作台统计数据
export function getWorkBenchData() {
  return request({
    url: `/guardcare/workbench`,
    method: 'get'
  })
}

// 收入支出柱状统计图数据
export function getWorkbenchCash(data) {
  return request({
    url: `/guardcare/workbench/cash`,
    method: 'get',
    params: data
  })
}

// 净现金流折线统计图数据
export function getWorkbenchFlow(data) {
  return request({
    url: `/guardcare/workbench/flow`,
    method: 'get',
    params: data
  })
}

// 健康检查柱状统计图数据
export function getWorkbenchCheck(data) {
  return request({
    url: `/guardcare/workbench/checkRecord`,
    method: 'get',
    params: data
  })
}

// 健康检查柱状统计图数据
export function getWorkbenchAttendance(data) {
  return request({
    url: `/guardcare/workbench/attendance`,
    method: 'get',
    params: data
  })
}
