import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'
/**
 * 园所收费汇总
 * @param chargeDateStart 收费日期开始
 * @param chargeDateEnd 收费日期结束
 * @param subjectName 收费科目
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @returns {AxiosPromise}
 */
export function queryOrderSummaryHeadList({ chargeDateStart, chargeDateEnd, subjectName, areaName, organizationId }) {
  return request({
    url: `/newdaycare/guardChargeCount`,
    method: 'get',
    params: { chargeDateStart, chargeDateEnd, subjectName, areaName, organizationId }
  })
}

/**
 * 园所退费汇总
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @returns {AxiosPromise}
 */
export function queryRefundSummaryHead({ startDate, endDate, areaName, organizationId }) {
  return request({
    url: `/newdaycare/guardRefundCount`,
    method: 'get',
    params: { startDate, endDate, areaName, organizationId }
  })
}

/**
 * 导出园所退费汇总Excel
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param areaName 区域名称
 * @param organizationId 园所id
 * @returns {AxiosPromise}
 */
export function downRefundSummaryExcel({ startDate, endDate, areaName, organizationId }) {
  return downloadFile({
    url: `/newdaycare/guardRefundCount/excel`,
    method: 'get',
    params: { startDate, endDate, areaName, organizationId }
  })
}
