import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询批次列表
 * @param childName 幼儿姓名
 * @param createStartDate 制单日期开始
 * @param createEndDate 制单日期结束
 * @param orderBunchStatus 批次状态
 INVALID :无效,仅后端使用
 UN_AUDIT :待审核
 REJECT :不通过
 UN_FULL :未收全
 FULL :已收全
 * @param orderBunchName 批次名称
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryOrderBunchList ({ childName, createStartDate, createEndDate, orderBunchStatus, orderBunchName, gradeId, clazzId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/order/bunch',
    method: 'get',
    params: {
      childName,
      createStartDate,
      createEndDate,
      orderBunchStatus,
      orderBunchName,
      gradeId,
      clazzId,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 导出批次excel
 * @param childName 幼儿姓名
 * @param createStartDate 制单日期开始
 * @param createEndDate 制单日期结束
 * @param orderBunchStatus 批次状态
 INVALID :无效,仅后端使用
 UN_AUDIT :待审核
 REJECT :不通过
 UN_FULL :未收全
 FULL :已收全
 * @param orderBunchName 批次名称
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryOrderBunchExport ({ childName, createStartDate, createEndDate, orderBunchStatus, orderBunchName, gradeId, clazzId, pageNum, pageSize, paged }) {
  const url = '/newdaycare/guard/order/bunch/export'
  return downloadFile({
    method: 'get',
    url,
    params: {
      childName,
      createStartDate,
      createEndDate,
      orderBunchStatus,
      orderBunchName,
      gradeId,
      clazzId,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 发起收费: 下一步
 * @param orderBunchName 批次名称
 * @param type 发送类型
 * @param sendTargets 收费对象, 如果是班级, 则是班级id列表, 如果是幼儿, 则是幼儿id列表
 * @param sendTargetList 收费对象, 如果是班级, 则是班级名称列表, 如果是幼儿, 则是幼儿名称列表
 * @param chargeType 收费方式
 * @param chargeRangeStart 收费时段开始
 * @param chargeRangeEnd 收费时段结束
 * @param termId 学期id
 * @param noticeParent 是否通知家长
 * @param usingDeposit 是否使用订金
 * @param endTime 截止时间
 * @param orderBunchItemList 批次收费项目
 * @returns {AxiosPromise}
 */
export function createOrderBunchNext ({ orderBunchName, type, sendTargets, sendTargetList, chargeType, chargeRangeStart, chargeRangeEnd, termId, noticeParent, usingDeposit, endTime, orderBunchItemList }) {
  return request({
    url: '/newdaycare/guard/order/bunch/next',
    method: 'post',
    data: { orderBunchName, type, sendTargets, sendTargetList, chargeType, chargeRangeStart, chargeRangeEnd, termId, noticeParent, usingDeposit, endTime, orderBunchItemList }
  })
}

/**
 * 发起收费: 提交审核
 * @param orderBunchId 批次id
 * @param orderList 批次收费项目
 * @returns {AxiosPromise}
 */
export function createOrderBunchConfirm ({ orderBunchId, orderList }) {
  return request({
    url: '/newdaycare/guard/order/bunch/confirm',
    method: 'post',
    data: { orderBunchId, orderList }
  })
}

/**
 * 编辑批次
 * @param orderBunchId
 * @param orderList 批次收费项目
 * @param totalAmount 应收总金额
 * @param actualAmount 实收总金额
 * @returns {AxiosPromise}
 */
export function updateOrderBunch ({ orderBunchId, orderList, totalAmount, actualAmount }) {
  return request({
    url: `/newdaycare/guard/order/bunch/${orderBunchId}`,
    method: 'put',
    data: { orderList, totalAmount, actualAmount }
  })
}

/**
 * 获取批次
 * @param orderBunchId 批次 ID
 * @returns {AxiosPromise}
 */
export function queryOrderBunchById ({ orderBunchId }) {
  return request({
    url: `/newdaycare/guard/order/bunch/${orderBunchId}`,
    method: 'get'

  })
}

/**
 * 批次审核
 * @param orderBunchId 批次id
 * @param pass 是否通过, true:通过, false:审核不通过
 * @param rejectMessage 审核不通过原因
 * @returns {AxiosPromise}
 */
export function updateOrderBunchAudit ({ orderBunchId, pass, rejectMessage }) {
  return request({
    url: '/newdaycare/guard/order/bunch/audit',
    method: 'put',
    data: { orderBunchId, pass, rejectMessage }
  })
}

/**
 * 删除批次(未审核)
 * @param orderBunchId 批次 ID
 * @returns {AxiosPromise}
 */
export function removeOrderBunch ({ orderBunchId }) {
  return request({
    url: `/newdaycare/guard/order/bunch/${orderBunchId}`,
    method: 'delete'

  })
}

/**
 * 批次催缴
 * @param orderBunchIdList 批次id列表
 * @returns {AxiosPromise}
 */
export function updateOrderBunchCall ({ orderBunchIdList }) {
  return request({
    url: '/newdaycare/guard/order/bunch/call',
    method: 'put',
    data: { orderBunchIdList }
  })
}

/**
 * 查询特色课程列表
 * @param name 课程名称
 * @param enable 是否启用
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySpecialCourseList ({ name, enable, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/course/special',
    method: 'get',
    params: { name, enable, pageNum, pageSize, paged }
  })
}

/**
 * 获取班级详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryClazzById ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/clazz/${id}`,
    method: 'get'

  })
}

/**
 * 查询物品列表
 * @param materialTypeId 物品类型id
 * @param name 物品名称
 * @returns {AxiosPromise}
 */
export function queryMaterialList ({ materialTypeId, name }) {
  return request({
    url: '/newdaycare/material',
    method: 'get',
    params: { materialTypeId, name }
  })
}

/**
 * 查询账单列表
 * @param name 幼儿姓名
 * @param paymentStartDate 缴费日期开始
 * @param paymentEndDate 缴费日期结束
 * @param status 账单状态
 UN_PAY :未支付
 PAYED :已支付
 REFUND :已退费
 * @param code 账单编号
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryOrderList ({ name, paymentStartDate, paymentEndDate, status, code, gradeId, clazzId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/order',
    method: 'get',
    params: { name, paymentStartDate, paymentEndDate, status, code, gradeId, clazzId, pageNum, pageSize, paged }
  })
}

/**
 * 导出账单excel
 * @param name 幼儿姓名
 * @param paymentStartDate 缴费日期开始
 * @param paymentEndDate 缴费日期结束
 * @param status 账单状态
 UN_PAY :未支付
 PAYED :已支付
 REFUND :已退费
 * @param code 账单编号
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryOrderExport ({ name, paymentStartDate, paymentEndDate, status, code, gradeId, clazzId, pageNum, pageSize, paged }) {
  const url = '/newdaycare/guard/order/export'
  return downloadFile({
    method: 'get',
    url,
    params: { name, paymentStartDate, paymentEndDate, status, code, gradeId, clazzId, pageNum, pageSize, paged }
  })
}

/**
 * 获取账单
 * @param orderId 账单 ID
 * @returns {AxiosPromise}
 */
export function queryOrderById ({ orderId }) {
  return request({
    url: `/newdaycare/guard/order/${orderId}`,
    method: 'get'

  })
}

/**
 * 根据账单号获取账单
 * @param code 账单编号
 * @returns {AxiosPromise}
 */
export function queryOrderByCode ({ code }) {
  return request({
    url: `/newdaycare/guard/order/code/${code}`,
    method: 'get'

  })
}

/**
 * 确认收费接口
 * @param orderIdList 订单id列表
 * @param paymentDate 缴费日期列表
 * @param paymentTypeEnum 支付方式
 * @returns {AxiosPromise}
 */
export function updateOrderConfirm ({ orderIdList, paymentDate, paymentTypeEnum }) {
  return request({
    url: '/newdaycare/guard/order/confirm',
    method: 'put',
    data: { orderIdList, paymentDate, paymentTypeEnum }
  })
}

/**
 * 账单催缴
 * @param orderIdList 订单id列表
 * @returns {AxiosPromise}
 */
export function updateOrderCall ({ orderIdList }) {
  return request({
    url: '/newdaycare/guard/order/call',
    method: 'put',
    data: { orderIdList }
  })
}

/**
 * 账单退费
 * @param orderIdList 订单id列表
 * @returns {AxiosPromise}
 */
export function updateOrderRefund ({ orderIdList }) {
  return request({
    url: '/newdaycare/guard/order/refund',
    method: 'put',
    data: { orderIdList }
  })
}
