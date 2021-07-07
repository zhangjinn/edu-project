import request from '@/utils/request'

/*
  学员重要程度
*/

export function getChildAttrList() {
  return request({
    url: '/daycare/child_attribute/IMPORTANCE',
    method: 'get'
  })
}

// 删除学员属性
export function deleteChildAttr(childAttributeId) {
  return request({
    url: `/daycare/child_attribute/${childAttributeId}`,
    method: 'delete'
  })
}

// 更新 / 新增学员属性
export function updateChildAttr(data) {
  return request({
    url: '/daycare/child_attribute',
    method: 'put',
    data
  })
}

// 排序
export function sortChildAttr(ids) {
  return request({
    url: '/daycare/child_attribute/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  学员来源
*/

// 查询学员来源列表
export function getChildSourceList() {
  return request({
    url: '/daycare/child_source',
    method: 'get'
  })
}

// 删除学员来源
export function deleteChildSource(childSourceId) {
  return request({
    url: `/daycare/child_source/${childSourceId}`,
    method: 'delete'
  })
}

// 新增/编辑 学员来源
export function updateChildSource(data) {
  return request({
    url: '/daycare/child_source',
    method: 'put',
    data
  })
}

// 排序
export function sortChildSource(ids) {
  return request({
    url: '/daycare/child_source/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  联系人称呼
*/

// 查询关系(称呼)列表
export function getChildCallList() {
  return request({
    url: '/daycare/relationship',
    method: 'get'
  })
}

// 删除关系(称呼)
export function deleteChildCall(relationshipId) {
  return request({
    url: `/daycare/relationship/${relationshipId}`,
    method: 'delete'
  })
}

// 新增 / 更新关系(称呼)
export function updateChildCall(data) {
  return request({
    url: '/daycare/relationship',
    method: 'put',
    data
  })
}

// 排序
export function sortChildCall(ids) {
  return request({
    url: '/daycare/relationship/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  学员标签
*/

// 查询标签列表
export function getChildTag() {
  return request({
    url: '/daycare/tag',
    method: 'get'
  })
}

// 删除标签
export function deleteChildTag(tagId) {
  return request({
    url: `/daycare/tag/${tagId}`,
    method: 'delete'
  })
}

// 新增标签
export function addChildTag(data) {
  return request({
    url: '/daycare/tag',
    method: 'post',
    data
  })
}

// 更新标签
export function updateChildTag({ tagId, data }) {
  return request({
    url: `/daycare/tag/${tagId}`,
    method: 'put',
    data
  })
}

// 排序
export function sortChildTag(ids) {
  return request({
    url: '/daycare/tag/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  学员状态
*/

// 查询学员状态列表
export function getChildStateList(childCategory) {
  return request({
    url: '/daycare/child_status',
    method: 'get',
    params: {
      childCategory
    }
  })
}

// 删除学员状态
export function deleteChildState(childStatusId) {
  return request({
    url: `/daycare/child_status/${childStatusId}`,
    method: 'delete'
  })
}

// 新增学员状态
export function addChildState(data) {
  return request({
    url: '/daycare/child_status',
    method: 'post',
    data
  })
}

// 更新学员状态
export function updateChildState(childStatusId, { childStatusName }) {
  return request({
    url: `/daycare/child_status/${childStatusId}`,
    method: 'put',
    params: {
      childStatusName
    }
  })
}

// 排序
export function sortChildState(ids) {
  return request({
    url: '/daycare/child_status/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  跟进方式
*/

// 查询跟进方式列表
export function getChildFollowMethodList() {
  return request({
    url: '/daycare/follow_means',
    method: 'get'
  })
}

// 删除跟进方式
export function deleteChildFollowMethod(followMeansId) {
  return request({
    url: `/daycare/follow_means/${followMeansId}`,
    method: 'delete'
  })
}

// 更新 / 新增 跟进方式
export function updateChildFollowMethod(data) {
  return request({
    url: '/daycare/follow_means',
    method: 'put',
    data
  })
}

// 排序
export function sortChildFollowMethod(ids) {
  return request({
    url: '/daycare/follow_means/sort',
    method: 'post',
    data: { ids }
  })
}

/*
  跟进内容模板
*/

// 查询跟进内容模板列表
export function queryFollowContentTemplateList(data) {
  return request({
    url: '/daycare/follow_content_template',
    method: 'post',
    data
  })
}

// 删除跟进内容模板
export function deleteFollowContentTemplate(followContentTemplateId) {
  return request({
    url: `/daycare/follow_content_template/${followContentTemplateId}`,
    method: 'delete'
  })
}

// 获取跟进内容模板
export function getFollowContentTemplate(followContentTemplateId) {
  return request({
    url: `/daycare/follow_content_template/${followContentTemplateId}`,
    method: 'get'
  })
}

// 更新 / 新增跟进内容模板
export function updateFollowContentTemplate(data) {
  return request({
    url: '/daycare/follow_content_template',
    method: 'put',
    data
  })
}

/**
 * 查询学员模块的规则列表
 * @param ruleName 规则名称
 * @returns {AxiosPromise}
 */
export function queryStuRule({ ruleName }) {
  return request({
    url: `/daycare/rule`,
    method: 'get',
    params: { ruleName }
  })
}

/**
 * 更新学员模块的规则
 * @param ruleId
 * @param value 规则的值
 * @param enable 是否启用 true启用 false 关闭
 * @returns {AxiosPromise}
 */
export function updateStuRule({ ruleId, value, enable }) {
  return request({
    url: `/daycare/rule/${ruleId}`,
    method: 'put',
    data: { ruleId, value, enable }
  })
}
