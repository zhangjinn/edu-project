import request from '@/utils/request'
// 应用设置适用范围
/**
 * 查询适用范围列表
 * */
export function queryScopeList () {
  return request({
    url: '/standardcare/scope',
    method: 'get',
    params: { }
  })
}

/**
 * 新增适用范围
 * */
export function addScopeType ({ scopeName }) {
  return request({
    url: '/standardcare/scope',
    method: 'post',
    data: { scopeName }
  })
}

/**
 * 更新适用范围
 * */
export function updateScopeType ({ id, scopeName }) {
  return request({
    url: `/standardcare/scope/${id}`,
    method: 'put',
    data: { scopeName }
  })
}

/**
 * 删除适用范围
 * */
export function removeScopeType ({ scopeId }) {
  return request({
    url: `/standardcare/scope/${scopeId}`,
    method: 'delete'
  })
}

/**
 * 修改适用范围排序
 * */
export function updateScopeSort ({ scopeSortIndexList }) {
  return request({
    url: '/standardcare/scope/sort_index',
    method: 'put',
    data: { scopeSortIndexList }
  })
}

// 应用设置餐次组
/**
 * 查询餐次组列表
 * */
export function queryTimeQuantumGroupList () {
  return request({
    url: '/standardcare/time_quantum_group',
    method: 'get',
    params: { }
  })
}

/**
 * 新增餐次组
 * */
export function addTimeQuantumGroupType ({ timeQuantumGroupName }) {
  return request({
    url: '/standardcare/time_quantum_group',
    method: 'post',
    data: { timeQuantumGroupName }
  })
}

/**
 * 更新餐次组
 * */
export function updateTimeQuantumGroupType ({ timeQuantumGroupId, timeQuantumGroupName }) {
  return request({
    url: `/standardcare/time_quantum_group/${timeQuantumGroupId}`,
    method: 'put',
    data: { timeQuantumGroupName }
  })
}

/**
 * 删除餐次组
 * */
export function removeTimeQuantumGroupType ({ timeQuantumGroupId }) {
  return request({
    url: `/standardcare/time_quantum_group/${timeQuantumGroupId}`,
    method: 'delete'
  })
}

/**
 * 修改餐次组排序
 * */
export function updateTimeQuantumGroupSort ({ groupSortIndexList }) {
  return request({
    url: '/standardcare/time_quantum_group/sort_index',
    method: 'put',
    data: { groupSortIndexList }
  })
}

// 应用设置餐次
/**
 * 获取餐次
 * */
export function queryTimeQuantumList ({ timeQuantumId }) {
  return request({
    url: `/standardcare/time_quantum/${timeQuantumId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 新增餐次
 * */
export function addTimeQuantumType ({ groupId, timeQuantumName }) {
  return request({
    url: '/standardcare/time_quantum',
    method: 'post',
    data: { groupId, timeQuantumName }
  })
}

/**
 * 更新餐次
 * */
export function updateTimeQuantumType ({ timeQuantumId, timeQuantumName }) {
  return request({
    url: `/standardcare/time_quantum/${timeQuantumId}`,
    method: 'put',
    data: { timeQuantumName }
  })
}

/**
 * 删除餐次
 * */
export function removeTimeQuantumType ({ timeQuantumId }) {
  return request({
    url: `/standardcare/time_quantum/${timeQuantumId}`,
    method: 'delete'
  })
}

/**
 * 修改餐次排序
 * */
export function updateTimeQuantumSort ({ quantumSortIndexList }) {
  return request({
    url: '/standardcare/time_quantum/sort_index',
    method: 'put',
    data: { quantumSortIndexList }
  })
}
// 应用设置标签
/**
 * 查询标签列表
 * */
export function queryLabelList () {
  return request({
    url: '/standardcare/label',
    method: 'get',
    params: { }
  })
}

/**
 * 新增标签
 * */
export function addLabelType ({ labelName }) {
  return request({
    url: '/standardcare/label',
    method: 'post',
    data: { labelName }
  })
}

/**
 * 更新标签
 * */
export function updateLabelType ({ labelId, labelName }) {
  return request({
    url: `/standardcare/label/${labelId}`,
    method: 'put',
    data: { labelName }
  })
}

/**
 * 删除标签
 * */
export function removeLabelType ({ labelId }) {
  return request({
    url: `/standardcare/label/${labelId}`,
    method: 'delete'
  })
}

/**
 * 修改标签排序
 * */
export function updateLabelSort ({ labelSortIndexList }) {
  return request({
    url: '/standardcare/label/sort_index',
    method: 'put',
    data: { labelSortIndexList }
  })
}
// 应用设置菜肴类型
/**
 * 查询菜肴类型列表
 * */
export function queryFoodTypeList () {
  return request({
    url: '/standardcare/food_type',
    method: 'get',
    params: { }
  })
}

/**
 * 新增菜肴类型
 * */
export function addFoodType ({ foodTypeName, color }) {
  return request({
    url: '/standardcare/food_type',
    method: 'post',
    data: { foodTypeName, color }
  })
}

/**
 * 更新菜肴类型
 * */
export function updateFoodType ({ foodTypeId, foodTypeName, color }) {
  return request({
    url: `/standardcare/food_type/${foodTypeId}`,
    method: 'put',
    data: { foodTypeName, color }
  })
}

/**
 * 删除菜肴类型
 * */
export function removeFoodType ({ foodTypeId }) {
  return request({
    url: `/standardcare/food_type/${foodTypeId}`,
    method: 'delete'
  })
}

/**
 * 修改菜肴类型排序
 * */
export function updateFoodSort ({ foodTypeSortIndexList }) {
  return request({
    url: '/standardcare/food_type/sort_index',
    method: 'put',
    data: { foodTypeSortIndexList }
  })
}

// 页面菜肴接口
/**
 * 查询菜肴列表并分页
 * */
export function queryFoodList ({ typeId, foodName, pageNum, pageSize, paged = true }) {
  return request({
    url: '/standardcare/food',
    method: 'get',
    params: { typeId, foodName, pageNum, pageSize, paged }
  })
}

/**
 * 查询菜肴列表并分类
 * */
export function queryFoodClassificationList ({ foodName }) {
  return request({
    url: '/standardcare/food/classification_list',
    method: 'get',
    params: { foodName }
  })
}

/**
 * 获取菜肴
 * */
export function queryFoodDetail ({ foodId }) {
  return request({
    url: `/standardcare/food/${foodId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 新增菜肴
 * */
export function addFood ({ foodName, typeId, description, image }) {
  return request({
    url: '/standardcare/food',
    method: 'post',
    data: { foodName, typeId, description, image }
  })
}

/**
 * 更新菜肴
 * */
export function updateFood ({ foodId, foodName, typeId, description, image }) {
  return request({
    url: `/standardcare/food/${foodId}`,
    method: 'put',
    data: { foodName, typeId, description, image }
  })
}

/**
 * 删除菜肴
 * */
export function removeFood ({ foodId }) {
  return request({
    url: `/standardcare/food/${foodId}`,
    method: 'delete'
  })
}

// 页面食谱接口
/**
 * 查询食谱列表并分页
 * */
export function queryRecipesList ({ name, scopeId, labelIdListStr, pageNum, pageSize, paged = true }) {
  return request({
    url: '/standardcare/recipes',
    method: 'get',
    params: { name, scopeId, labelIdListStr, pageNum, pageSize, paged }
  })
}

/**
 * 获取食谱
 * */
export function queryRecipesDetail ({ recipesId }) {
  return request({
    url: `/standardcare/recipes/${recipesId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 新增食谱
 * */
export function addRecipes ({ cover, recipesName, scopeId, timeQuantumGroupId, labelIdList, remarks, color }) {
  return request({
    url: '/standardcare/recipes',
    method: 'post',
    data: { cover, recipesName, scopeId, timeQuantumGroupId, labelIdList, remarks, color }
  })
}

/**
 * 更新食谱
 * */
export function updateRecipes ({ cover, recipesName, scopeId, timeQuantumGroupId, labelIdList, remarks, color, recipesId }) {
  return request({
    url: `/standardcare/recipes/${recipesId}`,
    method: 'put',
    data: { cover, recipesName, scopeId, timeQuantumGroupId, labelIdList, remarks, color }
  })
}

/**
 * 删除食谱
 * */
export function removeRecipes ({ recipesId }) {
  return request({
    url: `/standardcare/recipes/${recipesId}`,
    method: 'delete'
  })
}

/**
 * 获取食谱网格
 * */
export function queryGridRecipe ({ recipesId }) {
  return request({
    url: `/standardcare/recipes/grid_recipe/${recipesId}`,
    method: 'get',
    params: { }
  })
}

/**
 * 追加食谱项菜肴
 * */
export function addCellFood ({ recipeId, week, timeQuantumName, foodIdList }) {
  return request({
    url: '/standardcare/recipe_item/append_food',
    method: 'post',
    data: { recipeId, week, timeQuantumName, foodIdList }
  })
}

/**
 * 移除食谱项菜肴
 * */
export function removeCellFood ({ recipeId, week, timeQuantumName, foodName, foodTypeName }) {
  return request({
    url: '/standardcare/recipe_item/remove_food',
    method: 'delete',
    data: { recipeId, week, timeQuantumName, foodName, foodTypeName }
  })
}

/**
 * 查询食谱项
 * */
export function queryCellFood ({ recipeId, week, timeQuantumName }) {
  return request({
    url: '/standardcare/recipe_item',
    method: 'get',
    params: { recipeId, week, timeQuantumName }
  })
}

/**
 * 使用推荐食谱
 * */
export function updateRecommendedRecipes ({ recommendedRecipesId, recipesId }) {
  return request({
    url: '/standardcare/recipes/use_recommended_recipes',
    method: 'put',
    data: { recommendedRecipesId, recipesId }
  })
}
