// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 查询周食谱列表
 * @param weekName {string}
 * @param pageNum {number}
 * @param pageSize {number}
 * @param paged {number}
 * @returns {AxiosPromise}
 */
export function queryDaycareWeekRecipeList({ weekName = null, generationId = null, pageNum = 1, pageSize = 10 }) {
  return request({
    url: `/daycare/week_recipe`,
    method: 'get',
    params: { weekName, generationId, pageNum, pageSize }
  })
}

/**
 * 获取周食谱
 * @param weekRecipeId {string}
 * @returns {AxiosPromise}
 */
export function queryDaycareWeekRecipe(weekRecipeId) {
  return request({
    url: `/daycare/week_recipe/${weekRecipeId}`,
    method: 'get'
  })
}

/**
 * 新增周食谱
 * @param weekName {string}
 * @param startDate {string}
 * @param endDate {string}
 * @param remarks {string}
 * @param generationId {string}
 * @param timeQuantumIdList {number[]|string[]}
 * @returns {AxiosPromise}
 */
export function createDaycareWeekRecipe({ weekName, startDate, endDate, generationId, timeQuantumIdList, remarks }) {
  return request({
    url: `/daycare/week_recipe`,
    method: 'post',
    data: { weekName, startDate, endDate, generationId, timeQuantumIdList, remarks }
  })
}

/**
 * 更新周食谱
 * @param weekRecipeId
 * @param weekName
 * @param startDate
 * @param endDate
 * @param startAge
 * @param endAge
 * @param remarks
 * @returns {AxiosPromise}
 */
export function updateDaycareWeekRecipe({ weekRecipeId, weekName, startDate, endDate, generationId, remarks }) {
  return request({
    url: `/daycare/week_recipe/${weekRecipeId}`,
    method: 'put',
    data: { weekName, startDate, endDate, generationId, remarks }
  })
}

/**
 * 删除周食谱
 * @param weekRecipeId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareWeekRecipe(weekRecipeId) {
  return request({
    url: `/daycare/week_recipe/${weekRecipeId}`,
    method: 'delete'
  })
}

/**
 * 查询是否已存在食谱
 * @param weekRecipeId {number}
 * @param weekName {string}
 * @param startDate {string}
 * @param endDate {string}
 * @param remarks {string}
 * @returns {AxiosPromise}
 */
export function checkDaycareWeekRecipe({ weekRecipeId, weekName, startDate, endDate, generationId, remarks }) {
  return request({
    url: `/daycare/week_recipe/check_duplicate`,
    method: 'get',
    params: { weekRecipeId, weekName, startDate, endDate, generationId, remarks }
  })
}

/**
 * 复制周食谱
 * @param weekRecipeId {number}
 * @param weekName {string}
 * @param startDate {string}
 * @param endDate {string}
 * @param remarks {string}
 * @returns {AxiosPromise}
 */
export function copyDaycareWeekRecipe({ weekRecipeId, weekName, startDate, endDate, generationId, remarks }) {
  return request({
    url: `/daycare/week_recipe/copy_recipe`,
    method: 'post',
    data: { weekRecipeId, weekName, startDate, endDate, generationId, remarks }
  })
}

/**
 * 删除食谱项
 * @param recipeItemFoodId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareRecipeItem(recipeItemFoodId) {
  return request({
    url: `/daycare/recipe_item/${recipeItemFoodId}`,
    method: 'delete'
  })
}

/**
 * 更新食谱项的菜肴
 * @param weekRecipeId {number}
 * @param date {string}
 * @param label {string}
 * @param foodId {number}
 * @returns {AxiosPromise}
 */
export function createDaycareRecipeItem({ weekRecipeId, date, label, foodIdList }) {
  return request({
    url: `/daycare/recipe_item`,
    method: 'post',
    data: { weekRecipeId, date, label, foodIdList }
  })
}

/**
 * 校验推荐食谱
 * @param recommendedRecipesId {number} 推荐食谱id
 * @param weekRecipesId {number} 周食谱id
 * @returns {AxiosPromise}
 */
export function checkRecommendedRecipes({ recommendedRecipesId, weekRecipesId }) {
  return request({
    url: `/daycare/week_recipe/check_recommended_recipes`,
    method: 'get',
    params: { recommendedRecipesId, weekRecipesId }
  })
}

/**
 * 使用推荐食谱
 * @param recommendedRecipesId {number} 推荐食谱id
 * @param weekRecipesId {number} 周食谱id
 * @returns {AxiosPromise}
 */
export function putRecommendedRecipes({ recommendedRecipesId, weekRecipesId }) {
  return request({
    url: `/daycare/week_recipe/use_recommended_recipes`,
    method: 'put',
    data: { recommendedRecipesId, weekRecipesId }
  })
}

// 菜肴
/**
 * 查询菜肴列表
 * @param foodName {string}
 * @param pageNum {number}
 * @param pageSize {number}
 * @param typeId {number}
 * @param paged {boolean}
 * @returns {AxiosPromise}
 */
export function queryDaycareDishesList({ foodName = null, typeId = null, pageNum = 1, pageSize = 10, paged = true }) {
  return request({
    url: `/daycare/food`,
    method: 'get',
    params: { foodName, typeId, pageNum, pageSize, paged }
  })
}

/**
 * 新增菜肴
 * @param enterpriseId {number}
 * @param foodName {string}
 * @param typeId {number}
 * @param description {string}
 * @param enable {boolean}
 * @param image {string[]|number[]}
 * @returns {AxiosPromise}
 */
export function createDaycareDishes({ foodName, typeId, description, enable, image }) {
  return request({
    url: `/daycare/food`,
    method: 'post',
    data: { foodName, typeId, description, enable, image }
  })
}

/**
 * 更新菜肴
 * @param foodId {number}
 * @param enterpriseId {number}
 * @param foodName {string}
 * @param typeId {number}
 * @param description
 * @param enable {boolean}
 * @param image {string[]|number[]}
 * @returns {AxiosPromise}
 */
export function updateDaycareDishes({ foodId, foodName, typeId, description, enable, image }) {
  return request({
    url: `/daycare/food/${foodId}`,
    method: 'put',
    data: { foodName, typeId, description, enable, image }
  })
}

/**
 * 获取菜肴
 * @param foodId {number}
 * @returns {AxiosPromise}
 */
export function queryDaycareDishes(foodId) {
  return request({
    url: `/daycare/food/${foodId}`,
    method: 'get'
  })
}

/**
 * 删除菜肴
 * @param foodId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareDishes(foodId) {
  return request({
    url: `/daycare/food/${foodId}`,
    method: 'delete'
  })
}

// 应用设置-菜肴类型
/**
 * 查询菜肴类型列表
 * @returns {AxiosPromise}
 */
export function queryDaycareFoodTypeList() {
  return request({
    url: `/daycare/food_type`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增菜肴类型
 * @param color {string}
 * @param foodTypeName {string}
 * @param sort {number}
 * @returns {AxiosPromise}
 */
export function createDaycareFoodType({ color, foodTypeName, sort }) {
  return request({
    url: `/daycare/food_type`,
    method: 'post',
    data: { color, foodTypeName, sort }
  })
}

/**
 *
 * @param foodTypeId {number}
 * @param enterpriseId {number}
 * @param color {string}
 * @param foodTypeName
 * @param sort {number}
 * @returns {AxiosPromise}
 */
export function updateDaycareFoodType({ foodTypeId, color, foodTypeName, sort }) {
  return request({
    url: `/daycare/food_type/${foodTypeId}`,
    method: 'put',
    data: { color, foodTypeName, sort }
  })
}

/**
 * 获取菜肴类型
 * @param foodTypeId {number}
 * @returns {AxiosPromise}
 */
export function queryDaycareFoodType({ foodTypeId }) {
  return request({
    url: `/daycare/food_type/${foodTypeId}`,
    method: 'get'
  })
}

/**
 * 删除
 * @param foodTypeId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareFoodType(foodTypeId) {
  return request({
    url: `/daycare/food_type/${foodTypeId}`,
    method: 'delete'
  })
}

/**
 * 排序
 * @param ids {number[]}
 * @returns {AxiosPromise}
 */
export function sortDaycareFoodType(ids) {
  return request({
    url: `/daycare/food_type/sort`,
    method: 'post',
    data: { ids }
  })
}

/**
 * 查询菜肴类型和菜肴列表
 * @param foodName {string}
 * @returns {AxiosPromise}
 */
export function queryDaycareFoodTypeAndFood(foodName = null) {
  return request({
    url: `/daycare/food_type/foodTypeAndFood`,
    method: 'get',
    params: { foodName }
  })
}

// 应用设置-食谱适用年龄段
/**
 * 查询食谱适用年龄段列表
 * @returns {AxiosPromise}
 */
export function queryDaycareGenerationList() {
  return request({
    url: `/daycare/generation`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增食谱适用年龄段
 * @param generationName {string}
 * @param sort {boolean}
 * @returns {AxiosPromise}
 */
export function createDaycareGeneration({ generationName, sort }) {
  return request({
    url: `/daycare/generation`,
    method: 'post',
    data: { generationName, sort }
  })
}

/**
 * 新增食谱适用年龄段
 * @param startAge
 * @param endAge
 * @param sort
 * @returns {AxiosPromise}
 */
export function createDaycareGenerationTwo({ generationName }) {
  return request({
    url: `/daycare/generation`,
    method: 'post',
    data: { generationName }
  })
}

/**
 * 更新食谱适用年龄段
 * @param generationId {number}
 * @param generationName {string}
 * @param sort {number}
 * @returns {AxiosPromise}
 */
export function updateDaycareGeneration({ generationId, generationName, sort }) {
  return request({
    url: `/daycare/generation/${generationId}`,
    method: 'put',
    data: { generationName, sort }
  })
}

/**
 * 更新食谱适用年龄段
 * @param generationId
 * @param startAge
 * @param endAge
 * @param sort
 * @returns {AxiosPromise}
 */
export function updateDaycareGenerationTwo({ generationId, generationName }) {
  return request({
    url: `/daycare/generation/${generationId}`,
    method: 'put',
    data: { generationName }
  })
}

/**
 * 获取食谱适用年龄段
 * @param generationId {number}
 * @returns {AxiosPromise}
 */
export function queryDaycareGeneration(generationId) {
  return request({
    url: `/daycare/generation/${generationId}`,
    method: 'get'
  })
}

/**
 * 删除食谱适用年龄段
 * @param generationId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareGeneration(generationId) {
  return request({
    url: `/daycare/generation/${generationId}`,
    method: 'delete'
  })
}

/**
 * 排序
 * @param ids {number[]}
 * @returns {AxiosPromise}
 */
export function sortDaycareGeneration(ids) {
  return request({
    url: `/daycare/generation/sort`,
    method: 'post',
    data: { ids }
  })
}

// 应用设置-餐次设置
/**
 * 查询餐次列表
 * @param mealsType {string}
 * @returns {AxiosPromise}
 */
export function queryDaycareMealsList(mealsType = null) {
  return request({
    url: `/daycare/time_quantum`,
    method: 'get',
    params: { mealsType }
  })
}

/**
 * 新增餐次
 * @param timeQuantumName {string}
 * @param enable {boolean}
 * @returns {AxiosPromise}
 */
export function createDaycareMeal({ timeQuantumName, mealsType }) {
  return request({
    url: `/daycare/time_quantum`,
    method: 'post',
    data: { timeQuantumName, mealsType }
  })
}

/**
 * 更新餐次
 * @param timeQuantumId {number}
 * @param timeQuantumName {string}
 * @param enable {boolean}
 * @returns {AxiosPromise}
 */
export function updateDaycareMeal({ timeQuantumName, timeQuantumId, mealsType }) {
  return request({
    url: `/daycare/time_quantum/${timeQuantumId}`,
    method: 'put',
    data: { timeQuantumName, mealsType }
  })
}

/**
 * 获取餐次
 * @param timeQuantumId {number}
 * @returns {AxiosPromise}
 */
export function queryDaycareMeal(timeQuantumId) {
  return request({
    url: `/daycare/time_quantum/${timeQuantumId}`,
    method: 'get'
  })
}

/**
 * 删除餐次
 * @param timeQuantumId {number}
 * @returns {AxiosPromise}
 */
export function removeDaycareMeal(timeQuantumId) {
  return request({
    url: `/daycare/time_quantum/${timeQuantumId}`,
    method: 'delete'
  })
}

/**
 * 排序
 * @param ids {number[]} 排序数据id集合
 * @returns {AxiosPromise}
 */
export function sortDaycareMeal({ ids }) {
  return request({
    url: `/daycare/time_quantum/sort`,
    method: 'post',
    data: { ids }
  })
}
