import request from '../http'

// 获取所有枚举信息
export function getAllEnum() {
  return request({
    url: '/sacc/enum/all',
    method: 'get'
  })
}

// 根据枚举名称查询选项
export function getEnumByName(name) {
  return request({
    url: '/sacc/enum',
    method: 'get',
    params: { name }
  })
}

// 查询膳食记录列表 BM
export function getMealRecordList({ clazzId, startTime, endTime }) {
  return request({
    url: '/sacc/meal_record/list',
    method: 'get',
    params: { clazzId, startTime, endTime }
  })
}

// 查看膳食记录详情
export function getMealRecordDetail(customerId) {
  return request({
    url: `/sacc/meal_record/${customerId}`,
    method: 'get'
  })
}

// 查询这天的餐段
export function getRecipeTimeQuantum({ customerId, date }) {
  return request({
    url: '/sacc/week_recipe/getRecipeTimeQuantum',
    method: 'get',
    params: { customerId, date }
  })
}

// 获取当天该餐段对应菜肴
export function getRecipeItemFood({ recipeTimeQuantumId, date }) {
  return request({
    url: '/sacc/week_recipe/getRecipeItemFood',
    method: 'get',
    params: { recipeTimeQuantumId, date }
  })
}

// 新增膳食记录
export function addDietRecord(data) {
  return request({
    url: '/sacc/meal_record',
    method: 'post',
    data
  })
}
