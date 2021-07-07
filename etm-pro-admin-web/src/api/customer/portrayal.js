import request from '@/utils/request'
// import request2 from '@/api/daycare/mockRequest'
import { downloadFile, uploadFileForUrlAndFile } from '@/api/base/base'

/**
 * 查询批次列表
 * @param minCreateDate 最早的录入日期
 * @param maxCreateDate 最晚的录入日期
 * @param operatorName 录入人员名称
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
export function queryBatchLists({ minCreateDate, maxCreateDate, operatorName, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/customer/customer_portrait_batch`,
    method: 'get',
    params: { minCreateDate, maxCreateDate, operatorName, pageNum, pageSize, paged, sort }
  })
}

/**
 * 删除批次
 * @param batchId 批次ID
 * @returns {AxiosPromise}
 */
export function removeBatch(batchId) {
  return request({
    url: `/customer/customer_portrait_batch/${batchId}`,
    method: 'delete'

  })
}

/**
 * 查询客户画像列表
 * @param batchId 批次ID
 * @param operatorName 录入人员名称
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
export function queryCustomer({ status, batchId, operatorName, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/customer/customer_portrait`,
    method: 'get',
    params: { batchId, operatorName, pageNum, pageSize, paged, sort, status }
  })
}

/**
 * 批量删除客户画像客户画像
 * @param idList 客户画像ID列表
 * @returns {AxiosPromise}
 */
export function removeCustomer(idList) {
  return request({
    url: `/customer/customer_portrait`,
    method: 'delete',
    data: { idList }
  })
}

export function customerBatchImport(file, options) {
  const url = '/customer/customer_portrait/excel'
  return uploadFileForUrlAndFile({ url, file, options })
}

/**
 * 查询批次号列表
 * @returns {AxiosPromise}
 */
export function queryBatchDroDown() {
  return request({
    url: `/customer/customer_portrait_batch/no`,
    method: 'get'

  })
}

/**
 * 查询客户画像历史批次列表
 * @param minCreateDate 最早的录入日期
 * @param maxCreateDate 最晚的录入日期
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
export function queryHistoryBatch({ minCreateDate, maxCreateDate, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/customer/customer_portrait_batch/history`,
    method: 'get',
    params: { minCreateDate, maxCreateDate, pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询客户画像历史列表
 * @param batchId
 * @param status CONVERTED
 NOT_CONVERTED
 * @param gender MALE :男性
 FEMALE :女性
 * @param portraitLevel HIGH
 MIDDLE
 LOW
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
export function queryHistory({ batchId, status, gender, portraitLevel, pageNum, pageSize, paged, sort }) {
  return request({
    url: `/customer/customer_portrait/history`,
    method: 'get',
    params: { batchId, status, gender, portraitLevel, pageNum, pageSize, paged, sort }
  })
}

/**
 * 获取全部客户画像历史批次列表
 * @returns {AxiosPromise}
 */
export function queryHistorySearch() {
  return request({
    url: `/customer/customer_portrait_batch/history/all`,
    method: 'get'

  })
}

/**
 * 客户画像转换成客户
 * @param ids id集合
 * @returns {AxiosPromise}
 */
export function createTransformCustomer(ids) {
  return request({
    url: `/customer/customer_portrait/history/to_customer`,
    method: 'post',
    data: { ids }
  })
}

/**
 * 下载模板文件
 * @param template 模板枚举  UN_PORTRAYED_CUSTOMER :待画像客户导入模版
 NOT_DEAL_CUSTOMER :未签单客户导入模板
 * @returns {AxiosPromise}
 */
// export function queryDownloadFile(template) {
//   return request({
//     url: `/customer/template/${template}`,
//     method: 'get',
//
//   })
// }

export function queryDownloadFile(template) {
  const url = `/customer/template/${template}`
  return downloadFile({ method: 'get', url, params: {}})
}

/**
 * 获取客户画像历史批次统计
 * @returns {AxiosPromise}
 */
export function queryCustomerStatistics() {
  return request({
    url: `/customer/customer_portrait_batch/history/statistics`,
    method: 'get'

  })
}

/**
 * 导出客户画像详情
 * @param paged 是否分页
 默认为true
 * @param gender undefined
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param portraitLevel undefined
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @param batchId undefined
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param status undefined
 * @returns {AxiosPromise}
 */
export function createCustomerExcel({ paged, gender, pageSize, portraitLevel, sort, batchId, pageNum, status }) {
  // return request({
  //   url: `/customer/customer_portrait/history/export`,
  //   method: 'post',
  //   data: { paged, gender, pageSize, portraitLevel, sort, batchId, pageNum, status },
  // })

  const url = `/customer/customer_portrait/history/export`
  return downloadFile({ method: 'get', url, params: { paged, gender, pageSize, portraitLevel, sort, batchId, pageNum, status }})
}

/**
 * 删除客户画像历史
 * @param id 批次id
 * @returns {AxiosPromise}
 */
export function removeHistoryPortrait(id) {
  return request({
    url: `/customer/customer_portrait/history/${id}`,
    method: 'delete'

  })
}
