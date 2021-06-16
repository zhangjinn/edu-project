// import request from '@/api/newdaycare/mockRequest'

import request from '@/utils/request'

/**
 * 查询物品列表分页
 * @param pageSize
 * @param pageNum
 * @param name 物品名称
 * @param materialTypeId 物品类型id
 * @returns {AxiosPromise}
 */
export function queryItemList ({ pageSize, pageNum, name, materialTypeId }) {
  return request({
    url: '/newdaycare/material/page_list',
    method: 'post',
    data: { pageSize, pageNum, name, materialTypeId }
  })
}

/**
 * 查询物品类型列表
 * @returns {AxiosPromise}
 */
export function queryMaterialType () {
  return request({
    url: '/newdaycare/material_type',
    method: 'get'
  })
}

/**
 * 新增物品
 * @param materialName 物品名称
 * @param imageList 图片列表
 * @param enable 是否开启
 * @param materialTypeId 物品类型id
 * @param price 单价
 * @param company 单位
 * @param purchasePrice 采购价
 * @param details 物品详情
 * @returns {AxiosPromise}
 */
export function createArticle ({ materialName, imageList, enable, materialTypeId, price, company, purchasePrice, details }) {
  return request({
    url: '/newdaycare/material/save',
    method: 'post',
    data: { materialName, imageList, enable, materialTypeId, price, company, purchasePrice, details }
  })
}

/**
 * 更新物品
 * @param materialId  物品id
 * @param materialName 物品名称
 * @param imageList 图片列表
 * @param enable 是否开启
 * @param materialTypeId 物品类型id
 * @param price 单价
 * @param company 单位
 * @param purchasePrice 采购价
 * @param details 物品详情
 * @returns {AxiosPromise}
 */
export function updateArticle ({ materialId, materialName, imageList, enable, materialTypeId, price, company, purchasePrice, details }) {
  return request({
    url: `/newdaycare/material/${materialId}`,
    method: 'put',
    data: { materialName, imageList, enable, materialTypeId, price, company, purchasePrice, details }
  })
}

/**
 *获取物品详情
 * @param materialId 物品 ID
 * @returns {AxiosPromise}
 */
export function queryArticleDetail ({ materialId }) {
  return request({
    url: `/newdaycare/material/${materialId}`,
    method: 'get'
  })
}

/**
 * 删除物品
 * @param materialId 物品 ID
 * @returns {AxiosPromise}
 */
export function removeArticle ({ materialId }) {
  return request({
    url: `/newdaycare/material/${materialId}`,
    method: 'delete'
  })
}

/**
 * 新增/修改物品类型
 * @param data 修改的参数
 * @returns {AxiosPromise}
 */
export function updateMaterialType (data) {
  return request({
    url: '/newdaycare/material_type',
    method: 'put',
    data
  })
}

/**
 * 删除物品类型
 * @param materialTypeId 物品类型 ID
 * @returns {AxiosPromise}
 */
export function removeMaterialType (materialTypeId) {
  return request({
    url: `/newdaycare/material_type/${materialTypeId}`,
    method: 'delete'
  })
}

/**
 *物品类型排序
 * @param ids 排序数据id集合
 * @returns {AxiosPromise}
 */
export function updateMaterialTypeSort ({ ids }) {
  return request({
    url: '/newdaycare/material_type/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 查询费用列表
 * @param priceName 费用名称
 * @returns {*}
 */
export function queryCostList ({ priceName }) {
  return request({
    url: '/newdaycare/price',
    method: 'get',
    params: { priceName }
  })
}

/**
 *获取费用详情
 * @param priceId 费用 ID
 * @returns {AxiosPromise}
 */
export function queryCostDetail ({ priceId }) {
  return request({
    url: `/newdaycare/price/${priceId}`,
    method: 'get'
  })
}

/**
 * 增加费用
 * @param priceName 费用名称
 * @param image 费用图片
 * @param enable 是否开启,  true开启 false关闭
 * @param price 单价
 * @param details 费用详情
 * @returns {AxiosPromise}
 */
export function createCost ({ priceName, image, enable, price, details }) {
  return request({
    url: '/newdaycare/price',
    method: 'post',
    data: { priceName, image, enable, price, details }
  })
}

/**
 * 更新费用
 * @param priceId 费用id
 * @param priceName 费用名称
 * @param image 费用图片
 * @param enable enable 是否开启,  true开启 false关闭
 * @param price 单价
 * @param details 费用详情
 * @returns {AxiosPromise}
 */
export function updateCost ({ priceId, priceName, image, enable, price, details }) {
  return request({
    url: `/newdaycare/price/${priceId}`,
    method: 'put',
    data: { priceName, image, enable, price, details }
  })
}

/**
 * 删除费用
 * @param priceId 费用 ID
 * @returns {AxiosPromise}
 */
export function removeCost ({ priceId }) {
  return request({
    url: `/newdaycare/price/${priceId}`,
    method: 'delete',
    data: { priceId }
  })
}
