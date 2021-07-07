import request from '@/utils/request'

// 查询退费列表并分页
export function getRefundList(data) {
  return request({
    url: `/guardcare/refund/page`,
    method: 'get',
    params: data
  })
}

// 查询退费
export function getRefund(refundId) {
  return request({
    url: `/guardcare/refund/${refundId}`,
    method: 'get'
  })
}

// 发起审核
export function createAudit(data) {
  return request({
    url: `/guardcare/refund/create_audit`,
    method: 'put',
    data
  })
}

// 退费审核
export function confirmAudit(data) {
  return request({
    url: `/guardcare/refund/audit`,
    method: 'put',
    data
  })
}

// 检查是否允许退费
export function checkRefundStatus(data) {
  return request({
    url: `/guardcare/refund/check`,
    method: 'get',
    params: data
  })
}
