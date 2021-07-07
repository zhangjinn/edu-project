import request from '@/utils/request'

/**
 * 查询充值中心的企业充值订单
 * */
export function getRechargeOrder(params) {
  return request({
    url: '/basic/communication/organization/recharge/order',
    method: 'get',
    params
  })
}

/**
 * 查询充值中心的企业充值订单详情
 * */
export function getRechargeOrderDetails(id) {
  return request({
    url: `/basic/communication/organization/recharge/order/${id}`,
    method: 'get'
  })
}

/**
 * 查询充值套餐
 * */
export function getRechargePackage({ type }) {
  return request({
    url: '/basic/communication/organization/recharge/package',
    method: 'get',
    params: { type }
  })
}

/**
 * 购买充值套餐
 * */
export function postRechargePay(data) {
  return request({
    url: `/basic/communication/organization/recharge/pay`,
    method: 'post',
    data
  })
}

/**
 * 查询订单是否支付成功，用于关闭支付窗口
 * @param rechargeOrderId
 * @returns {AxiosPromise}
 */
export function queryVerifyPay(rechargeOrderId) {
  return request({
    url: `/basic/communication/organization/recharge/pay_or_not/${rechargeOrderId}`,
    method: 'get',
    params: {
      noLoadding: true
    }
  })
}
