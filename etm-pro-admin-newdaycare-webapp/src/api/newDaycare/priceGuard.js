import request from '@/utils/request'

/**
 * 查询费用标准列表
 * @param enable 启用
 * @param name 费用
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryPriceStandardList ({ enable, name, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/material_price_standard',
    method: 'get',
    params: { enable, name, pageNum, pageSize, paged }
  })
}

/**
 * 新增费用标准
 * @param materialPriceId 关联物品费用id
 * @param name 名称
 * @param price 单价
 * @param enable 启用（默认true）
 * @returns {AxiosPromise}
 */
export function createPriceStandard ({ materialPriceId, name, price, enable }) {
  return request({
    url: '/newdaycare/material_price_standard',
    method: 'post',
    data: { materialPriceId, name, price, enable }
  })
}

/**
 * 更新费用标准
 * @param materialPriceStandardId
 * @param materialPriceId 关联物品费用id
 * @param name 名称
 * @param price 单价
 * @param enable 启用（默认true）
 * @returns {AxiosPromise}
 */
export function updatePriceStandard ({ materialPriceStandardId, materialPriceId, name, price, enable }) {
  return request({
    url: `/newdaycare/material_price_standard/${materialPriceStandardId}`,
    method: 'put',
    data: { materialPriceId, name, price, enable }
  })
}

/**
 * 获取费用标准
 * @param materialPriceStandardId 费用标准 ID
 * @returns {AxiosPromise}
 */
export function queryPriceStandardById ({ materialPriceStandardId }) {
  return request({
    url: `/newdaycare/material_price_standard/${materialPriceStandardId}`,
    method: 'get'

  })
}

/**
 * 删除费用标准
 * @param materialPriceStandardId 费用标准 ID
 * @returns {AxiosPromise}
 */
export function removePriceStandard ({ materialPriceStandardId }) {
  return request({
    url: `/newdaycare/material_price_standard/${materialPriceStandardId}`,
    method: 'delete'

  })
}

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
export function queryGuardPriceList ({ name, enable, property, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/material_price',
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
 * @param attendanceSettlementRule 规则信息
 * @returns {AxiosPromise}
 */
export function createGuardPrice ({ materialPriceName, sellPrice, property, enable, organizationId, attendanceSettlementRule }) {
  return request({
    url: '/newdaycare/guard/material_price',
    method: 'post',
    data: { materialPriceName, sellPrice, property, enable, organizationId, attendanceSettlementRule }
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
 * @param attendanceSettlementRule 规则信息
 * @returns {AxiosPromise}
 */
export function updateGuardPrice ({ materialPriceId, materialPriceName, sellPrice, property, enable, organizationId, attendanceSettlementRule }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}`,
    method: 'put',
    data: { materialPriceName, sellPrice, property, enable, organizationId, attendanceSettlementRule }
  })
}

/**
 * 修改物品费用得状态
 * @param materialPriceId
 * @param enable 启用或者禁用
 * @returns {AxiosPromise}
 */
export function updateGuardPriceEnable ({ materialPriceId, enable }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}/enable`,
    method: 'put',
    data: { enable }
  })
}

/**
 * 获取物品费用
 * @param materialPriceId 物品费用 ID
 * @returns {AxiosPromise}
 */
export function queryGuardPriceById ({ materialPriceId }) {
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
export function removeGuardPrice ({ materialPriceId }) {
  return request({
    url: `/newdaycare/guard/material_price/${materialPriceId}`,
    method: 'delete'

  })
}
