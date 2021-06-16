import request from '@/utils/request'

/**
 * 查询产品类型列表
 * */
export function queryProductTypeList () {
  return request({
    url: '/customer/product_type',
    method: 'get',
    params: { }
  })
}

/**
 * 新增产品类型
 * */
export function addProductType ({ name }) {
  return request({
    url: '/customer/product_type',
    method: 'post',
    data: { name }
  })
}

/**
 * 更新产品类型
 * */
export function updateProductType ({ name, productTypeId }) {
  return request({
    url: `/customer/product_type/${productTypeId}`,
    method: 'put',
    data: { name }
  })
}

/**
 * 删除产品类型
 * */
export function removeProductType ({ productTypeId }) {
  return request({
    url: `/customer/product_type/${productTypeId}`,
    method: 'delete'
  })
}

/**
 * 排序
 * */
export function updateProductTypeSort ({ ids }) {
  return request({
    url: '/customer/product_type/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 查询产品目录列表 分页
 * */
export function queryProductList ({ name, productTypeId, pageNum, pageSize }) {
  return request({
    url: '/customer/product/find_page',
    method: 'get',
    params: { name, productTypeId, pageNum, pageSize }
  })
}

/**
 * 新增产品目录
 * */
export function addProduct ({ cover, name, productTypeId, unitPrice, purchasePrices, unit, details, imageList, status }) {
  return request({
    url: '/customer/product',
    method: 'post',
    data: { cover, name, productTypeId, unitPrice, purchasePrices, unit, details, imageList, status }
  })
}

/**
 * 更新产品目录
 * */
export function updateProduct ({ productId, id, cover, name, productTypeId, unitPrice, purchasePrices, unit, details, imageList, status }) {
  return request({
    url: `/customer/product/${productId}`,
    method: 'put',
    data: { id, cover, name, productTypeId, unitPrice, purchasePrices, unit, details, imageList, status }
  })
}

/**
 * 获取产品目录
 * */
export function queryProductDetail ({ productId }) {
  return request({
    url: `/customer/product/${productId}`,
    method: 'get'
  })
}

/**
 * 删除产品目录
 * */
export function removeProduct ({ productId }) {
  return request({
    url: `/customer/product/${productId}`,
    method: 'delete'
  })
}
