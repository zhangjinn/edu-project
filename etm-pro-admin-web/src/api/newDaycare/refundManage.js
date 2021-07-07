import request from '@/utils/request'

/**
 * 检查是否允许退费
 * @param refundId
 * @returns {AxiosPromise}
 */
export function queryRefundCheck({ refundId }) {
  return request({
    url: `/newdaycare/guard/refund/check`,
    method: 'get',
    params: { refundId }
  })
}

/**
 * 查询退费列表并分页
 * @param childName 幼儿姓名
 * @param clazzId 班级id
 * @param status 状态
 TO_BE_REFUNDED :可退费
 IN_PROGRESS :退费中
 REFUND :已退费
 FAILED :不通过
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryRefundList({ childName, clazzId, status, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/guard/refund/page`,
    method: 'get',
    params: { childName, clazzId, status, pageNum, pageSize, paged }
  })
}

/**
 * 查询退费
 * @param refundId
 * @returns {AxiosPromise}
 */
export function queryRefundById({ refundId }) {
  return request({
    url: `/newdaycare/guard/refund/${refundId}`,
    method: 'get'

  })
}

/**
 * 退费审核
 * @param refundId 退费ID
 * @param isPass 是否通过
 * @param refundAmount 退费金额
 * @param paymentType 支付方式
 * @returns {AxiosPromise}
 */
export function updateRefundAudit({ refundId, isPass, refundAmount, paymentType }) {
  return request({
    url: `/newdaycare/guard/refund/audit`,
    method: 'put',
    data: { refundId, isPass, refundAmount, paymentType }
  })
}

/**
 * 发起审核
 * @param refundId 退费ID
 * @param refundAmount 退费金额
 * @param paymentType 支付方式
 * @returns {AxiosPromise}
 */
export function updateRefundAuditCreate({ refundId, refundAmount, paymentType }) {
  return request({
    url: `/newdaycare/guard/refund/create_audit`,
    method: 'put',
    data: { refundId, refundAmount, paymentType }
  })
}
