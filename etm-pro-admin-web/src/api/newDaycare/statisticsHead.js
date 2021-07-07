import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询学期列表
 * @returns {AxiosPromise}
 */
export function queryCourseTermList() {
  return request({
    url: `/newdaycare/guard/educational/course/term`,
    method: 'get'

  })
}

/**
 * 查询区域下拉列表
 * @returns {AxiosPromise}
 */
export function queryAreaOrganizationList() {
  return request({
    url: `/newdaycare/organization/area_down_list`,
    method: 'get'

  })
}

/**
 * 获取特色课情况统计
 * @param organizationId 企业id
 * @param courseTermId 学期id
 * @param specialCourseName 课程名称
 * @returns {AxiosPromise}
 */
export function querySpecialCourseStatistics({ organizationId, courseTermId, specialCourseName }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/statistics`,
    method: 'get',
    params: { organizationId, courseTermId, specialCourseName }
  })
}

/**
 * 园所现金流量汇总
 * @param year 年份
 * @param currentEnterpriseId 企业ids
 * @returns {AxiosPromise}
 */
export function queryCashFlowStatistics({ year, currentEnterpriseId }) {
  return request({
    url: `/newdaycare/statistics/find_all/cash_flow`,
    method: 'get',
    params: {
      year,
      currentEnterpriseId
    }
  })
}

/**
 * 幼儿结算明细
 * @param childName 幼儿名称
 * @param status 状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :离园
 DELETED :已删除
 * @param date 月份所在的日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function querySettlementStatistics({ childName, status, date, areaName, enterpriseId }) {
  return request({
    url: `/newdaycare/guard/settlement_records/statistics/child`,
    method: 'get',
    params: { childName, status, date, areaName, enterpriseId }
  })
}

/**
 * 导出幼儿结算明细
 * @param childName 幼儿名称
 * @param status 状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :离园
 DELETED :已删除
 * @param date 月份所在的日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function querySettlementStatisticsExport({ childName, status, date, areaName, enterpriseId }) {
  const url = '/newdaycare/guard/settlement_records/statistics/child/export'
  return downloadFile({
    method: 'get',
    url,
    params: { childName, status, date, areaName, enterpriseId }
  })
}

/**
 * 园所结算统计
 * @param settlementItem 结算科目
 * @param date 月份所在的日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function querySettlementSummary({ settlementItem, date, areaName, enterpriseId }) {
  return request({
    url: `/newdaycare/guard/settlement_records/statistics/kindergartens`,
    method: 'get',
    params: { settlementItem, date, areaName, enterpriseId }
  })
}

/**
 * 导出园所结算统计
 * @param settlementItem 结算科目
 * @param date 月份所在的日期
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @returns {AxiosPromise}
 */
export function querySettlementSummaryExport({ settlementItem, date, areaName, enterpriseId }) {
  const url = '/newdaycare/guard/settlement_records/statistics/kindergartens/export'
  return downloadFile({
    method: 'get',
    url,
    params: { settlementItem, date, areaName, enterpriseId }
  })
}

/**
 * 幼儿退费明细
 * @param chargeDateStart 退费日期开始
 * @param chargeDateEnd 退费日期结束
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @param childName 幼儿姓名
 * @returns {AxiosPromise}
 */
export function queryRefundStatisticsHeadList({ chargeDateStart, chargeDateEnd, areaName, organizationId, childName }) {
  return request({
    url: `/newdaycare/guardRefundDetail`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, areaName, organizationId, childName }
  })
}

/**
 * 幼儿收费明细
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param name 幼儿姓名
 * @param areaName 区域名称
 * @param clazzId 班级id
 * @param organizationId 园所id
 * @param isGlobal 是否为总部查询, 默认为true, 设置为false只能查看当前账号所属园区的报表
 * @returns {AxiosPromise}
 */
export function queryOrderStatisticsHeadList({ chargeDateStart, chargeDateEnd, name, areaName, clazzId, organizationId, isGlobal, childStatus }) {
  return request({
    url: `/newdaycare/childChargeDetail`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, name, areaName, clazzId, organizationId, isGlobal, childStatus }
  })
}

/**
 * 幼儿账单统计
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param name 幼儿姓名
 * @param childStatus 幼儿状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :离园
 DELETED :已删除
 * @param areaName 区域名称
 * @param clazzId 班级id
 * @param organizationId 园所id
 * @param isGlobal 是否为总部查询, 默认为true, 设置为false只能查看当前账号所属园区的报表
 * @returns {AxiosPromise}
 */
export function queryAccountStatisticsHead({ chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal, termId }) {
  return request({
    url: `/newdaycare/childChargeCount`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal, termId }
  })
}

/**
 * 导出幼儿退费明细Excel
 * @param chargeDateStart 退费日期开始
 * @param chargeDateEnd 退费日期结束
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @param childName 幼儿姓名
 * @returns {AxiosPromise}
 */
export function downExcelRefundStatistics({ chargeDateStart, chargeDateEnd, areaName, organizationId, childName }) {
  return downloadFile({
    url: `/newdaycare/guardRefundDetail/excel`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, areaName, organizationId, childName }
  })
}

/**
 * 导出幼儿收费明细Excel
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param name 幼儿姓名
 * @param childStatus 幼儿状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :离园
 DELETED :已删除
 * @param areaName 区域名称
 * @param clazzId 班级id
 * @param organizationId 园所id
 * @param isGlobal 是否为总部查询, 默认为true, 设置为false只能查看当前账号所属园区的报表
 * @returns {AxiosPromise}
 */
export function downExcelOrderStatistics({ chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal }) {
  return downloadFile({
    url: `/newdaycare/childChargeDetail/excel`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal }
  })
}

/**
 * 导出幼儿账单统计Excel
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param name 幼儿姓名
 * @param childStatus 幼儿状态
 PENDING_REVIEW :待入园
 IN :在园
 OUT :离园
 DELETED :已删除
 * @param areaName 区域名称
 * @param clazzId 班级id
 * @param organizationId 园所id
 * @param isGlobal 是否为总部查询, 默认为true, 设置为false只能查看当前账号所属园区的报表
 * @returns {AxiosPromise}
 */
export function downExcelAccountStatistics({ chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal }) {
  return downloadFile({
    url: `/newdaycare/childChargeCount/excel`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, name, childStatus, areaName, clazzId, organizationId, isGlobal }
  })
}

/**
 * 导出园所收费汇总Excel
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param subjectName 收费科目
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @returns {AxiosPromise}
 */
export function downExcelOrderSummaryHead({ chargeDateStart, chargeDateEnd, subjectName, areaName, organizationId }) {
  return downloadFile({
    url: `/newdaycare/guardChargeCount/excel`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, subjectName, areaName, organizationId }
  })
}

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param clazzName 班级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryClassList() {
  return request({
    url: `/newdaycare/guard/educational/clazz`,
    method: 'get'
  })
}

/**
 * 查询学期列表
 * @returns {AxiosPromise}
 */
export function queryTermList() {
  return request({
    url: `/newdaycare/guard/educational/course/term`,
    method: 'get'

  })
}
