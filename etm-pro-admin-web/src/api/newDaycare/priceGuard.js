import request from '@/utils/request'

/**
 * 查询物品费用列表
 * @param name 费用名称
 * @param enable 启用状态
 * @param property 费用性质
 once :一次性
 cycle :周期性
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryGuardPriceList({ name, enable, property, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/guard/material_price`,
    method: 'get',
    params: { name, enable, property, pageNum, pageSize, paged }
  })
}

/**
 * 新增物品费用
 * @param materialPriceName 费用名称
 * @param sellPrice 售卖单价
 * @param property 费用性质
 * @param enable 是否启用
 * @param organizationId 组织id
 * @returns {AxiosPromise}
 */
export function createGuardPrice({ materialPriceName, sellPrice, property, enable, organizationId }) {
  return request({
    url: `/newdaycare/guard/material_price`,
    method: 'post',
    data: { materialPriceName, sellPrice, property, enable, organizationId }
  })
}

/**
 * 更新物品费用
 * @param materialPriceId
 * @param materialPriceName 费用名称
 * @param sellPrice 售卖单价
 * @param property 费用性质
 * @param enable 是否启用
 * @param organizationId 组织id
 * @returns {AxiosPromise}
 */
export function updateGuardPrice({ materialPriceId, materialPriceName, sellPrice, property, enable, organizationId }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}`,
    method: 'put',
    data: { materialPriceName, sellPrice, property, enable, organizationId }
  })
}

/**
 * 获取物品费用
 * @param materialPriceId 物品费用 ID
 * @returns {AxiosPromise}
 */
export function queryGuardPriceById({ materialPriceId }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}`,
    method: 'get'

  })
}

/**
 * 删除物品费用
 * @param materialPriceId 物品费用 ID
 * @returns {AxiosPromise}
 */
export function removeGuardPrice({ materialPriceId }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}`,
    method: 'delete'

  })
}
