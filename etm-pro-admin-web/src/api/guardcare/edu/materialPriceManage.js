import request from '@/utils/request'

/**
 * 查询物品列表
 * */
export function getMaterial(params) {
  return request({
    url: '/guardcare/material',
    method: 'get',
    params
  })
}

/**
 * 新增物品
 * */
export function postMaterial(data) {
  return request({
    url: '/guardcare/material',
    method: 'post',
    data
  })
}

/**
 * 更新物品
 * */
export function putMaterial(data, materialId) {
  return request({
    url: `/guardcare/material/${materialId}`,
    method: 'put',
    data
  })
}

/**
 * 获取物品
 * */
export function getMaterialItem(materialId) {
  return request({
    url: `/guardcare/material/${materialId}`,
    method: 'get'
  })
}

/**
 * 删除物品
 * 属性类别：物品id
 * */
export function delMaterial(materialId) {
  return request({
    url: `/guardcare/material/${materialId}`,
    method: 'delete'
  })
}

/**
 * 查询物品费用列表
 * */
export function getMaterialPrice(params) {
  return request({
    url: '/guardcare/material_price',
    method: 'get',
    params
  })
}

/**
 * 新增物品费用
 * */
export function postMaterialPrice(data) {
  return request({
    url: '/guardcare/material_price',
    method: 'post',
    data
  })
}

/**
 * 获取物品费用
 * */
export function getMaterialPriceItem(materialPriceId) {
  return request({
    url: `/guardcare/material_price/${materialPriceId}`,
    method: 'get'
  })
}

/**
 * 更新物品费用
 * */
export function putMaterialPrice(data, materialPriceId) {
  return request({
    url: `/guardcare/material_price/${materialPriceId}`,
    method: 'put',
    data
  })
}

/**
 * 删除物品费用
 * 属性类别：物品费用id
 * */
export function delMaterialPrice(materialPriceId) {
  return request({
    url: `/guardcare/material_price/${materialPriceId}`,
    method: 'delete'
  })
}

/**
 * 查询物品费用类型列表
 * */
export function getMaterialType(params) {
  return request({
    url: `/guardcare/material_type`,
    method: 'get',
    params
  })
}

/**
 * 新增物品费用类型
 * */
export function postMaterialType(data) {
  return request({
    url: '/guardcare/material_type',
    method: 'post',
    data
  })
}

/**
 * 更新物品费用类型
 * */
export function putMaterialType(data, materialTypeId) {
  return request({
    url: `/guardcare/material_type/${materialTypeId}`,
    method: 'put',
    data
  })
}

/**
 * 删除物品费用类型
 * */
export function delMaterialType(materialTypeId) {
  return request({
    url: `/guardcare/material_type/${materialTypeId}`,
    method: 'delete'
  })
}

/**
 * 修改物品费用类型排序
 * */
export function putMaterialTypeSort(data) {
  return request({
    url: `/guardcare/material_type/sort`,
    method: 'put',
    data
  })
}
