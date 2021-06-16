import request from '@/utils/request'

/**
 * 查询充值中心的企业充值订单
 * */
export function getRechargeOrder (params) {
  return request({
    url: '/basic/communication/organization/recharge/order',
    method: 'get',
    params
  })
}

/**
 * 查询充值中心的企业充值订单详情
 * */
export function getRechargeOrderDetails (id) {
  return request({
    url: `/basic/communication/organization/recharge/order/${id}`,
    method: 'get'
  })
}

/**
 * 查询充值套餐
 * */
export function getRechargePackage ({ type }) {
  return request({
    url: '/basic/communication/organization/recharge/package',
    method: 'get',
    params: { type }
  })
}

/**
 * 购买充值套餐
 * */
export function postRechargePay (data) {
  return request({
    url: '/basic/communication/organization/recharge/pay',
    method: 'post',
    data
  })
}

/**
 * 查询订单是否支付成功，用于关闭支付窗口
 * @param rechargeOrderId
 * @returns {AxiosPromise}
 */
export function queryVerifyPay (rechargeOrderId) {
  return request({
    url: `/basic/communication/organization/recharge/pay_or_not/${rechargeOrderId}`,
    method: 'get',
    params: {
      noLoadding: true
    }
  })
}

/**
 * 查询充值碰客套餐列表
 * @param name 套餐名称
 * @param remark 套餐内容
 * @param enable 是否启用
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function createPortrayalSetMeal ({ name, remark, enable, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/customer/recharge_package',
    method: 'get',
    params: { name, remark, enable, pageNum, pageSize, paged, sort }
  })
}

/**
 * 新增碰客充值订单
 * @param packageId 套餐id
 * @returns {AxiosPromise}
 */
export function createPortrayalPay (packageId) {
  return request({
    url: '/customer/recharge_order/pay',
    method: 'post',
    data: { packageId }
  })
}

/**
 * 查询订单是否支付成功，用于关闭支付窗口
 * @param rechargeOrderId
 * @returns {AxiosPromise}
 */
export function queryVerifyPortrayalPay (rechargeOrderId) {
  return request({
    url: `/customer/recharge_order/pay_or_not/${rechargeOrderId}`,
    method: 'get',
    params: {
      noLoadding: true
    }
  })
}
