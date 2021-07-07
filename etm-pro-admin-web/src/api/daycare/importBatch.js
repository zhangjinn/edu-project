// import request from '@/api/daycare/mockRequest'
import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询导入批次列表
 * @param pageSize
 * @param pageNum
 * @param batchNo 批次号
 * @param status 批次状态
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryImportBatchList({ pageSize, pageNum, batchNo, status, startTime, endTime }) {
  return request({
    url: `/daycare/import_batch`,
    method: 'get',
    params: { pageSize, pageNum, batchNo, status, startTime, endTime }
  })
}

/**
 * 撤销分配
 * @param id {string} 导入批次id
 * @returns {AxiosPromise}
 */
export function updateBatchStatusById({ id }) {
  return request({
    url: `/daycare/import_batch/${id}`,
    method: 'put',
    data: { id }
  })
}

/**
 * 查询导入批次详情
 * @param importBatchId 批次id
 * @param status 批次状态SUCCESS :成功 FAILED :失败
 * @returns {AxiosPromise}
 */
export function queryImportBatchDetail({ pageSize, pageNum, importBatchId, status }) {
  return request({
    url: `/daycare/import_batch/${importBatchId}/item`,
    method: 'get',
    params: { pageSize, pageNum, importBatchId, status }
  })
}

/**
 * 下载模板
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export function downloadTemplate({ params }) {
  const url = '/daycare/template/download_excel'
  return downloadFile({ method: 'get', url, params })
}

