import request from '@/utils/request'

/**
 * 查询结算列表并分页
 * @param childName 幼儿名称
 * @param status 状态
 UNSETTLED :未结算
 SETTLED :已结算
 * @param date 月份所在的日期
 * @param clazzId 班级ID
 * @param gradeId 年级ID
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySettlementList ({ childName, status, date, clazzId, gradeId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/settlement_records/page',
    method: 'get',
    params: { childName, status, date, clazzId, gradeId, pageNum, pageSize, paged }
  })
}

/**
 * 确认结算
 * @param recordIdList 记录ID的集合
 * @returns {AxiosPromise}
 */
export function updateSettlement ({ recordIdList }) {
  return request({
    url: '/newdaycare/guard/settlement_records/settlement',
    method: 'put',
    data: { recordIdList }
  })
}

/**
 * 修改金额
 * @param recordId 结算记录ID
 * @param amount 实结算金额
 * @returns {AxiosPromise}
 */
export function updateSettlementAmount ({ recordId, amount }) {
  return request({
    url: '/newdaycare/guard/settlement_records/amount',
    method: 'put',
    data: { recordId, amount }
  })
}

/**
 * 检查是否允许结算
 * @param recordId 结算记录ID
 * @returns {AxiosPromise}
 */
export function querySettlementStatus ({ recordId }) {
  return request({
    url: '/newdaycare/guard/settlement_records/check',
    method: 'get',
    params: { recordId }
  })
}

/**
 * 查询考勤结算规则列表
 * @returns {AxiosPromise}
 */
export function querySettlementRuleList () {
  return request({
    url: '/newdaycare/guard/attendance_settlement_rule/list',
    method: 'get'

  })
}

/**
 * 修改考勤结算规则状态
 * @param ruleId 规则ID
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function updateSettlementRuleEnable ({ ruleId, enable }) {
  return request({
    url: '/newdaycare/guard/attendance_settlement_rule/status',
    method: 'put',
    data: { ruleId, enable }
  })
}

/**
 * 新增考勤结算规则
 * @param ruleName 规则名称
 * @param materialPriceId 物品费用ID
 * @param type 类型
 * @param absenceRuleList 按缺勤天数的规则的列表
 * @param attendanceRuleList 按出勤天数的规则的列表
 * @returns {AxiosPromise}
 */
export function createSettlementRule ({ ruleName, materialPriceId, type, absenceRuleList, attendanceRuleList }) {
  return request({
    url: '/newdaycare/guard/attendance_settlement_rule',
    method: 'post',
    data: { ruleName, materialPriceId, type, absenceRuleList, attendanceRuleList }
  })
}

/**
 * 更新考勤结算规则
 * @param ruleId
 * @param ruleName 规则名称
 * @param materialPriceId 物品费用ID
 * @param type 类型
 * @param absenceRuleList 按缺勤天数的规则的列表
 * @param attendanceRuleList 按出勤天数的规则的列表
 * @returns {AxiosPromise}
 */
export function updateSettlementRule ({ ruleId, ruleName, materialPriceId, type, absenceRuleList, attendanceRuleList }) {
  return request({
    url: `/newdaycare/guard/attendance_settlement_rule/${ruleId}`,
    method: 'put',
    data: { ruleName, materialPriceId, type, absenceRuleList, attendanceRuleList }
  })
}

/**
 * 删除考勤结算规则
 * @param ruleId
 * @returns {AxiosPromise}
 */
export function removeSettlementRule ({ ruleId }) {
  return request({
    url: `/newdaycare/guard/attendance_settlement_rule/${ruleId}`,
    method: 'delete'

  })
}

/**
 * 查询考勤结算规则
 * @param ruleId
 * @returns {AxiosPromise}
 */
export function querySettlementRuleById ({ ruleId }) {
  return request({
    url: `/newdaycare/guard/attendance_settlement_rule/${ruleId}`,
    method: 'get'

  })
}

/**
 * 查询日历列表
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryCalendarList ({ startDate, endDate }) {
  return request({
    url: '/newdaycare/guard/calendar/list',
    method: 'get',
    params: { startDate, endDate }
  })
}

/**
 * 更新日历
 * @param isHoliday 是否休息
 * @param date 日期
 * @param remarks 备注
 * @returns {AxiosPromise}
 */
export function updateCalendar ({ isHoliday, date, remarks }) {
  return request({
    url: '/newdaycare/guard/calendar',
    method: 'put',
    data: { isHoliday, date, remarks }
  })
}
