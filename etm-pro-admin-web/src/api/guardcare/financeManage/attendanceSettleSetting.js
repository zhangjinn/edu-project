import request from '@/utils/request'

// 查询考勤结算规则列表
export function getRuleList() {
  return request({
    url: `/guardcare/attendance_settlement_rule/list`,
    method: 'get'
  })
}

// 修改考勤结算规则状态
export function renewRuleStatus(data) {
  return request({
    url: `/guardcare/attendance_settlement_rule/status`,
    method: 'put',
    data
  })
}

// 查询物品费用列表
export function getMaterialPriceList(data) {
  return request({
    url: `/guardcare/material_price`,
    method: 'get',
    params: data
  })
}

// 新增考勤结算规则
export function addRule(data) {
  return request({
    url: `/guardcare/attendance_settlement_rule`,
    method: 'post',
    data
  })
}

// 删除考勤结算规则
export function deleteRule(ruleId) {
  return request({
    url: `/guardcare/attendance_settlement_rule/${ruleId}`,
    method: 'delete'
  })
}

// 查询考勤结算规则
export function getRule(ruleId) {
  return request({
    url: `/guardcare/attendance_settlement_rule/${ruleId}`,
    method: 'get'
  })
}

// 新增考勤结算规则
export function renewRule(ruleId, data) {
  return request({
    url: `/guardcare/attendance_settlement_rule/${ruleId}`,
    method: 'put',
    data
  })
}

// 查询日历列表
export function getAttendanceCalendar(data) {
  return request({
    url: `/guardcare/calendar/list`,
    method: 'get',
    params: data
  })
}

// 更新日历
export function renewAttendanceCalendar(data) {
  return request({
    url: `/guardcare/calendar`,
    method: 'put',
    data
  })
}
