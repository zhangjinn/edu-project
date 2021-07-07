import request from '@/utils/request'

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

// 考勤柱状统计图数据
export function getWorkbenchAttendance(data) {
  return request({
    url: `/guardcare/workbench/attendance`,
    method: 'get',
    params: data
  })
}

// 获取工作台所有部件
export function getWorkbenchPart() {
  return request({
    url: `/guardcare/workbench/part`,
    method: 'get'
  })
}

// 获取我的工作台设置
export function getWorkbenchSetting() {
  return request({
    url: `/guardcare/workbench/my/setting`,
    method: 'get'
  })
}

// 更新我的工作台设置
export function renewWorkbenchSetting(data) {
  return request({
    url: `/guardcare/workbench/my/setting`,
    method: 'put',
    data
  })
}
