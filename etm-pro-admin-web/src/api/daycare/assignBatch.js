// import request from '@/api/daycare/mockRequest'
import request from '@/utils/request'

/**
 * 查询分配批次分页列表
 * @param pageSize
 * @param pageNum
 * @param batchNo 批次号
 * @param status 批次状态
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryAssignBatchList({ pageSize, pageNum, batchNo, status, startTime, endTime }) {
  return request({
    url: `/daycare/assign_batch`,
    method: 'get',
    params: { pageSize, pageNum, batchNo, status, startTime, endTime }
  })
}
/**
 * 撤销分配
 * @param assignBatchId {string} 分配批次ID
 * @returns {AxiosPromise}
 */
export function updateBatchStatusById({ assignBatchId }) {
  return request({
    url: `/daycare/assign_batch/item/${assignBatchId}`,
    method: 'put',
    data: { assignBatchId }
  })
}
/**
 * 查询分配批次详情
 * @param assignBatchId  分配批次ID
 * @returns {AxiosPromise}
 */
export function queryAssignBatchDetailList({ assignBatchId }) {
  return request({
    url: `/daycare/assign_batch/item/${assignBatchId}`,
    method: 'get'
  })
}
