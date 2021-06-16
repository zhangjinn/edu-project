import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询线上收款记录列表
 * @param orderNumber 关联订单号
 * @param businessOrderNumber 商家订单号
 * @param startDate 支付开始日期
 * @param endDate 支付结束日期
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
export function queryRecord ({ orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/newdaycare/collection_record',
    method: 'get',
    params: { orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort }
  })
}

/**
 * 关联/取消关联
 * @param collectionRecordId
 * @param id 线上收款记录id
 * @param orderId 订单id
 * @param orderNumber 订单编码
 * @param payOrderType 合同类型
 * @returns {AxiosPromise}
 */
export function updateRecord ({ collectionRecordId, id, orderId, orderNumber, payOrderType }) {
  return request({
    url: `/newdaycare/collection_record/${collectionRecordId}`,
    method: 'put',
    data: { id, orderId, orderNumber, payOrderType }
  })
}

/**
 * 查询订金关联例表
 * @param childName 学员姓名
 * @param orderNumber 订单号
 * @param phone 联系人手机号码
 * @returns {AxiosPromise}
 */
export function createEarnest ({ childName, orderNumber, phone }) {
  return request({
    url: '/newdaycare/earnest_money/collection/relevance',
    method: 'post',
    data: { childName, orderNumber, phone }
  })
}

/**
 * 查询早教关联例表
 * @param childName 学员姓名
 * @param orderNumber 订单号
 * @param phone 联系人手机号码
 * @returns {AxiosPromise}
 */
export function createContract ({ childName, orderNumber, phone }) {
  return request({
    url: '/newdaycare/tc_contract/collection/relevance',
    method: 'post',
    data: { childName, orderNumber, phone }
  })
}

/**
 * 查询托育关联例表
 * @param childName 学员姓名
 * @param orderNumber 订单号
 * @param phone 联系人手机号码
 * @returns {AxiosPromise}
 */
export function createCacContract ({ childName, orderNumber, phone }) {
  return request({
    url: '/newdaycare/cac_contract/collection/relevance',
    method: 'post',
    data: { childName, orderNumber, phone }
  })
}

/**
 * 导出/导出线上支付流水列表
 * @param orderNumber 关联订单号
 * @param businessOrderNumber 商家订单号
 * @param startDate 支付开始日期
 * @param endDate 支付结束日期
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
// export function queryStream ({ orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort }) {
//   return request({
//     url: '/newdaycare/collection_record/excel_revenue_stream',
//     method: 'get',
//     params: { orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort }
//   })
// }
export function queryStream ({ orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort }) {
  const url = '/newdaycare/collection_record/excel_revenue_stream'
  return downloadFile({
    method: 'get',
    url,
    params: {
      orderNumber, businessOrderNumber, startDate, endDate, pageNum, pageSize, paged, sort
    }
  })
}
