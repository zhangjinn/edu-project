import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// 查询现金流量表
export function getFinanceCash(data) {
  return request({
    url: `/guardcare/finance/cash`,
    method: 'get',
    params: data
  })
}

// 导出现金流量表
export function exportCashExcel(data) {
  const url = '/guardcare/finance/cash/export'
  return downloadFile({ method: 'get', url, params: data })
}
