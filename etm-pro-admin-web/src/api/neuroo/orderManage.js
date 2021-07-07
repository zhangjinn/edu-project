import request from '@/utils/request'

// 查询订单列表
export function getOrderList({
  orderNo,
  telephone,
  startOrderTime,
  endOrderTime,
  schoolId,
  orderState,
  arrangeState,
  pageNum,
  pageSize
}) {
  return request({
    url: '/neuroo/order',
    method: 'get',
    params: {
      orderNo,
      telephone,
      startOrderTime,
      endOrderTime,
      schoolId,
      orderState,
      arrangeState,
      pageNum,
      pageSize
    }
  })
}

// 获取订单修改回填信息
export function getOrderDetail(id) {
  return request({
    url: `/neuroo/order/${id}/update_data`,
    method: 'get'
  })
}

// 更新订单
export function modifyOrder({ id, data }) {
  return request({
    url: `/neuroo/order/${id}`,
    method: 'put',
    data
  })
}

// 查询订单详情
export function getOrderDetailList(id) {
  return request({
    url: `/neuroo/order/${id}`,
    method: 'get'
  })
}

// 查询会员详情
export function getMemberDetail(id) {
  return request({
    url: `/neuroo/customer/${id}`,
    method: 'get'
  })
}

// 查询班级列表
export function getClazzList(schoolId) {
  return request({
    url: `/neuroo/clazz/class_list/${schoolId}`,
    method: 'get'
  })
}

// 查询会员是否有排课(会员一键排课前置条件)
export function checkArrangeState({ customerId, lastLesson, startDate }) {
  return request({
    url: '/neuroo/position/find_customer_schedule',
    method: 'post',
    data: { customerId, lastLesson, startDate }
  })
}

// 给会员一键排课
export function arrangeClass({ customerId, lastLesson, clazzId, startDate, orderId }) {
  return request({
    url: '/neuroo/position/customer_auto_schedule',
    method: 'post',
    data: { customerId, lastLesson, clazzId, startDate, orderId }
  })
}

// 获取当前账号能看到的园区
export function getSchoolList() {
  return request({
    url: '/neuroo/organization',
    method: 'get'
  })
}

// 订单退费
export function refund({ orderId, refundAmount }) {
  return request({
    url: '/neuroo/order/refund',
    method: 'post',
    data: { orderId, refundAmount }
  })
}

// 获取订单签到天数
export function getSignInDays(id) {
  return request({
    url: `/neuroo/order/${id}/sign_day`,
    method: 'get'
  })
}
