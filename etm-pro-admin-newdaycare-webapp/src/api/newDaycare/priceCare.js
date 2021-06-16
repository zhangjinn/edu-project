import request from '@/utils/request'

/**
 * 查询托育费用列表 (分页)
 * @param name 费用名称
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
export function queryPrice ({ name, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/ca_price',
    method: 'get',
    params: { name, pageNum, pageSize }
  })
}

/**
 * 获取托育费用
 * @param caPriceId 托育费用 ID
 * @returns {AxiosPromise}
 */
export function getPrice ({ caPriceId }) {
  return request({
    url: `/newdaycare/ca_price/${caPriceId}`,
    method: 'get'
  })
}

/**
 * 新增托育费用
 * @param name 费用名称
 * @param chargingMethod 收费方式
 * @param cost 费用
 * @param type 状态
 * @returns {AxiosPromise}
 */
export function createPrice ({ name, chargingMethod, cost, type }) {
  return request({
    url: '/newdaycare/ca_price',
    method: 'post',
    data: { name, chargingMethod, cost, type }
  })
}

/**
 * 更新托育费用
 * @param caPriceId
 * @param name 费用名称
 * @param chargingMethod 收费方式
 * @param cost 费用
 * @param type 状态
 * @returns {AxiosPromise}
 */
export function updatePrice ({ caPriceId, name, chargingMethod, cost, type }) {
  return request({
    url: `/newdaycare/ca_price/${caPriceId}`,
    method: 'put',
    data: { name, chargingMethod, cost, type }
  })
}

/**
 * 删除托育费用
 * @param caPriceId 托育费用 ID
 * @returns {AxiosPromise}
 */
export function removePrice ({ caPriceId }) {
  return request({
    url: `/newdaycare/ca_price/${caPriceId}`,
    method: 'delete'
  })
}
