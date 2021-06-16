import request from '@/utils/request'
import { downloadFile, uploadFileForUrlAndFile } from '@/api/base/base'

/**
 * 查询周食谱列表并分页
 * */
export function getWeekRecipe (params) {
  return request({
    url: '/newdaycare/guard/week_recipe/page',
    method: 'get',
    params
  })
}

/**
 * 新增周食谱
 * */
export function postWeekRecipe (data) {
  return request({
    url: '/newdaycare/guard/week_recipe',
    method: 'post',
    data
  })
}

/**
 * 查询周食谱
 * */
export function getWeekRecipeItem (weekRecipeId) {
  return request({
    url: `/newdaycare/guard/week_recipe/${weekRecipeId}`,
    method: 'get'
  })
}

/**
 * 删除周食谱
 * */
export function delWeekRecipe (weekRecipeId) {
  return request({
    url: `/newdaycare/guard/week_recipe/${weekRecipeId}`,
    method: 'delete'
  })
}

/**
 * 追加食谱项菜肴
 * */
export function postRecipeItem (data) {
  return request({
    url: '/newdaycare/guard/recipe_item/append_food',
    method: 'post',
    data
  })
}

/**
 * 移除食谱项菜肴
 * */
export function delRecipeItem (data) {
  return request({
    url: '/newdaycare/guard/recipe_item/remove_food',
    method: 'delete',
    data
  })
}

/**
 * 复制食谱
 * */
export function postWeekRecipeCopy (data) {
  return request({
    url: '/newdaycare/guard/week_recipe/copy',
    method: 'post',
    data
  })
}

/**
 * 查询菜肴列表并分页
 * */
export function getFood (params) {
  return request({
    url: '/newdaycare/guard/food/page',
    method: 'get',
    params
  })
}

/**
 * 新增菜肴
 * */
export function postFood (data) {
  return request({
    url: '/newdaycare/guard/food',
    method: 'post',
    data
  })
}

/**
 * 修改菜肴
 * */
export function putFood (data, foodId) {
  return request({
    url: `/newdaycare/guard/food/${foodId}`,
    method: 'put',
    data
  })
}

/**
 * 删除菜肴
 * */
export function delFood (foodId) {
  return request({
    url: `/newdaycare/guard/food/${foodId}`,
    method: 'delete'
  })
}

/**
 * 查询菜肴详情
 * */
export function getFoodDetail ({ foodId }) {
  return request({
    url: `/newdaycare/guard/food/${foodId}`,
    method: 'get'
  })
}

/**
 * 查询菜肴列表并分类
 * */
export function getFoodClassification (params) {
  return request({
    url: '/newdaycare/guard/food/classification_list',
    method: 'get',
    params
  })
}

/**
 * 获取导入菜肴模板下载地址
 * */
export function getImportTemplate ({ template }) {
  const url = '/newdaycare/template/download_excel'
  return downloadFile({ method: 'get', url, params: { template } })
}

/**
 * 导入菜肴
 * */
export function postImportFood ({ file, options }) {
  const url = '/newdaycare/guard/food/import'
  return uploadFileForUrlAndFile({ url, file, options })
}

/**
 * 查询菜肴类型列表
 * */
export function getFoodType (id) {
  return request({
    url: '/newdaycare/guard/food_type/list',
    method: 'get'
  })
}

/**
 * 添加菜肴类型
 * */
export function postFoodType (data) {
  return request({
    url: '/newdaycare/guard/food_type',
    method: 'post',
    data
  })
}

/**
 * 更新菜肴类型
 * */
export function putFoodType (data, foodTypeId) {
  return request({
    url: `/newdaycare/guard/food_type/${foodTypeId}`,
    method: 'put',
    data
  })
}

/**
 * 删除菜肴类型
 * */
export function delFoodType (foodTypeId) {
  return request({
    url: `/newdaycare/guard/food_type/${foodTypeId}`,
    method: 'delete'
  })
}

/**
 * 修改菜肴类型排序
 * */
export function putFoodTypeSort (data) {
  return request({
    url: '/newdaycare/guard/food_type/sort_index',
    method: 'put',
    data
  })
}

/**
 * 查询餐段列表
 * */
export function getTimeQuantumType (id) {
  return request({
    url: '/newdaycare/guard/time_quantum/list',
    method: 'get'
  })
}

/**
 * 添加餐段
 * */
export function postTimeQuantumType (data) {
  return request({
    url: '/newdaycare/guard/time_quantum',
    method: 'post',
    data
  })
}

/**
 * 更新餐段
 * */
export function putTimeQuantumType (data, timeQuantumId) {
  return request({
    url: `/newdaycare/guard/time_quantum/${timeQuantumId}`,
    method: 'put',
    data
  })
}

/**
 * 删除餐段
 * */
export function delTimeQuantumType (timeQuantumId) {
  return request({
    url: `/newdaycare/guard/time_quantum/${timeQuantumId}`,
    method: 'delete'
  })
}

/**
 * 修改餐段排序
 * */
export function putTimeQuantumTypeSort (data) {
  return request({
    url: '/newdaycare/guard/time_quantum/sort_index',
    method: 'put',
    data
  })
}

/**
 * 校验推荐食谱
 * @param recommendedRecipesId
 * @param weekRecipesId
 */
export function checkRecommendedRecipes (params) {
  return request({
    url: '/newdaycare/guard/week_recipe/check_recommended_recipes',
    method: 'get',
    params
  })
}

/**
 * 使用推荐食谱
 * */
export function putRecommendedRecipes (data) {
  return request({
    url: '/newdaycare/guard/week_recipe/use_recommended_recipes',
    method: 'put',
    data
  })
}

/**
 * -------------------
 * 查询食材列表并分页
 * */
export function queryIngredients ({ typeId, name, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/food_ingredients/page',
    method: 'get',
    params: { typeId, name, pageNum, pageSize, paged }
  })
}

/**
 * 新增食材
 * */
export function addIngredients ({ energy, fat, protein, dietaryFiber, carbohydrate, vitaminA, carotene, vitaminB1, vitaminB2, vitaminB3, vitaminC, vitaminE, calcium, phosphorus, potassium, sodium, magnesium, iron, zinc, selenium, copper, manganese, iodine, name, alias, typeId }) {
  return request({
    url: '/newdaycare/guard/food_ingredients',
    method: 'post',
    data: { energy, fat, protein, dietaryFiber, carbohydrate, vitaminA, carotene, vitaminB1, vitaminB2, vitaminB3, vitaminC, vitaminE, calcium, phosphorus, potassium, sodium, magnesium, iron, zinc, selenium, copper, manganese, iodine, name, alias, typeId }
  })
}
/**
 * 更新食材
 * */
export function updateIngredients ({ foodIngredientsId, energy, fat, protein, dietaryFiber, carbohydrate, vitaminA, carotene, vitaminB1, vitaminB2, vitaminB3, vitaminC, vitaminE, calcium, phosphorus, potassium, sodium, magnesium, iron, zinc, selenium, copper, manganese, iodine, name, alias, typeId }) {
  return request({
    url: `/newdaycare/guard/food_ingredients/${foodIngredientsId}`,
    method: 'put',
    data: { energy, fat, protein, dietaryFiber, carbohydrate, vitaminA, carotene, vitaminB1, vitaminB2, vitaminB3, vitaminC, vitaminE, calcium, phosphorus, potassium, sodium, magnesium, iron, zinc, selenium, copper, manganese, iodine, name, alias, typeId }
  })
}

/**
 * 获取食材详情
 * */
export function queryIngredientsDetail ({ foodIngredientsId }) {
  return request({
    url: `/newdaycare/guard/food_ingredients/${foodIngredientsId}`,
    method: 'get'
  })
}

/**
 * 删除食材
 * */
export function removeIngredients ({ foodIngredientsId }) {
  return request({
    url: `/newdaycare/guard/food_ingredients/${foodIngredientsId}`,
    method: 'delete'
  })
}

/**
 * 查询食材类型列表
 * */
export function queryIngredientsType () {
  return request({
    url: '/newdaycare/guard/food_ingredients_type/list',
    method: 'get'
  })
}

/**
 * 新增食材类型
 * */
export function addIngredientsType ({ name }) {
  return request({
    url: '/newdaycare/guard/food_ingredients_type',
    method: 'post',
    data: { name }
  })
}

/**
 * 更新食材类型
 * */
export function updateIngredientsType ({ foodIngredientsTypeId, name }) {
  return request({
    url: `/newdaycare/guard/food_ingredients_type/${foodIngredientsTypeId}`,
    method: 'put',
    data: { foodIngredientsTypeId, name }
  })
}

/**
 * 删除食材类型
 * */
export function removeIngredientsType ({ foodIngredientsTypeId }) {
  return request({
    url: `/newdaycare/guard/food_ingredients_type/${foodIngredientsTypeId}`,
    method: 'delete'
  })
}

/**
 * 修改食材类型排序
 * */
export function updateIngredientsTypeSort ({ foodTypeSortIndexList }) {
  return request({
    url: '/newdaycare/guard/food_ingredients_type/sort_index',
    method: 'put',
    data: { foodTypeSortIndexList }
  })
}
