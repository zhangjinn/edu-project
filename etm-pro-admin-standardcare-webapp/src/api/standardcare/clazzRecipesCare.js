import request from '@/utils/request'

/**
 * 查询托育班级食谱列表
 * */
export function queryWeekRecipesList ({ clazzTypeId, clazzName, startDate, endDate }) {
  return request({
    url: '/standardcare/care_recipes/list',
    method: 'get',
    params: { clazzTypeId, clazzName, startDate, endDate }
  })
}

/**
 * 批量新增托育班级食谱
 * */
export function addWeekRecipes ({ clazzIdList, recipesId, startDate, endDate }) {
  return request({
    url: '/standardcare/care_recipes',
    method: 'post',
    data: { clazzIdList, recipesId, startDate, endDate }
  })
}

/**
 * 更新托育班级食谱
 * */
export function updateWeekRecipes ({ clazzId, recipesId, startDate, endDate }) {
  return request({
    url: '/standardcare/care_recipes',
    method: 'put',
    data: { clazzId, recipesId, startDate, endDate }
  })
}

/**
 * 删除托育班级食谱
 * */
export function removeWeekRecipes ({ id }) {
  return request({
    url: `/standardcare/care_recipes/${id}`,
    method: 'delete'
  })
}

/**
 * 获取托育班级食谱网格
 * */
export function queryWeekRecipesDetail ({ startDate, endDate, clazzId }) {
  return request({
    url: '/standardcare/care_recipes/grid_recipe',
    method: 'get',
    params: { startDate, endDate, clazzId }
  })
}

/**
 * 查询班级类型列表
 * */
export function queryCareClazzType ({ paged }) {
  return request({
    url: '/standardcare/clazz_type',
    method: 'get',
    params: { paged }
  })
}

/**
 * 查询托育班级列表
 * */
export function queryCareClazz ({ pageNum, pageSize }) {
  return request({
    url: '/standardcare/care_clazz',
    method: 'get',
    params: { pageNum, pageSize }
  })
}

/**
 * 查询可配置的托育食谱班级列表
 * */
export function queryCareClazzList () {
  return request({
    url: '/standardcare/care_recipes_setting/clazz',
    method: 'get'
  })
}

/**
 * 设置托育食谱班级
 * */
export function careClazzSetting ({ clazzIdList }) {
  return request({
    url: '/standardcare/care_recipes_setting/clazz',
    method: 'put',
    data: { clazzIdList }
  })
}
