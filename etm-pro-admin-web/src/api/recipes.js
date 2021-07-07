import request from '@/utils/request'

const prefix = 'http://192.168.3.149:9999'
/**
 * 查询食谱列表并分页
 * */
export function getWeekRecipeList(data) {
  return request({
    url: `/sacc/week_recipe`,
    method: 'get',
    params: data
  })
}

/**
 * 查询冗余的餐段
 * */
export function getWeekRecipeTimeQuantum(weekRecipeId) {
  return request({
    url: `/sacc/week_recipe_time_quantum/${weekRecipeId}`,
    method: 'get'
  })
}

/**
 * 复制食谱
 * */
export function postCopyRecipe(data) {
  return request({
    url: `/sacc/week_recipe/copy_recipe`,
    method: 'post',
    data
  })
}

/**
 * 查询周食谱详情(周食谱的表)
 * */
export function getWeekRecipeDetail(weekRecipeId) {
  return request({
    url: `/sacc/week_recipe/${weekRecipeId}`,
    method: 'get'
  })
}

/**
 * 新增周食谱
 * */
export function postWeekRecipe(data) {
  return request({
    url: `/sacc/week_recipe`,
    method: 'post',
    data
  })
}

/**
 * 查询菜肴列表并分页
 * */
export function getFoodList(data) {
  return request({
    url: `/sacc/food`,
    method: 'get',
    params: data
  })
}

/**
 * 查询菜肴列表(下拉选择菜肴用)
 * */
export function getSelectFoodSeList() {
  return request({
    url: `/sacc/food/foodList`,
    method: 'get'
  })
}

/**
 * 新增食谱项
 * */
export function postDayRecipe(data) {
  return request({
    url: `/sacc/day_recipe`,
    method: 'post',
    data
  })
}

/**
 * 新增菜肴
 * */
export function postFoodList(data) {
  return request({
    url: `/sacc/food`,
    method: 'post',
    data
  })
}

/**
 * 查询菜肴详情
 * */
export function getFoodDetail(data, foodId) {
  return request({
    url: `/sacc/food/${foodId}`,
    method: 'get',
    params: data
  })
}

/**
 * 更新菜肴
 * */
export function putFoodList(data, foodId) {
  return request({
    url: `/sacc/food/${foodId}`,
    method: 'put',
    data
  })
}

/**
 * 删除菜肴
 * */
export function deleteFoodList(foodId) {
  return request({
    url: `/sacc/food/${foodId}`,
    method: 'delete'
  })
}

/**
 * 查询班级列表
 * */
export function getClassList() {
  return request({
    url: `/sacc/clazz/classList`,
    method: 'get'
  })
}

/**
 * 查询当前周是否已存在食谱
 * */
export function getWeekRecipesRepeat(data) {
  return request({
    url: `/sacc/week_recipe/repeat`,
    method: 'post',
    data
  })
}
