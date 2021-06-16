// import request from '@/api/base/mock'
import request from '@/utils/request'

/**
 * 查询岗位树
 * @returns {AxiosPromise}
 */
export function queryPositionTree () {
  return request({
    url: '/basic/v2/position/tree',
    method: 'get',
    params: {}
  })
}

/**
 * 通过ID获取岗位详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryPositionById ({ id }) {
  return request({
    url: `/basic/v2/position/${id}`,
    method: 'get',
    params: { id }
  })
}

/**
 * 通过ID删除岗位
 * @param id
 * @returns {AxiosPromise}
 */
export function removePositionById ({ id }) {
  return request({
    url: `/basic/v2/position/${id}`,
    method: 'delete'
  })
}

/**
 * 获取岗位下拉
 * @param id
 * @returns {AxiosPromise}
 */
export function queryPositionSelect ({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}/position_name`,
    method: 'get',
    params: { id }
  })
}

/**
 * 查询岗位级联
 * @param id
 * @returns {AxiosPromise}
 */
export function queryPositionCascader ({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}/position_name_tree`,
    method: 'get',
    params: { id }
  })
}

/**
 * 新增岗位
 * @param id 企业的ID
 * @param parentId 上级岗位的ID
 * @param name
 * @param description
 * @param resourceIdList 资源的ID集合
 * @param dataPrivilege ['枚举备注: ALL :全部数据权限' ,'SOLUTION: 使用解决方案数据权限'] 待废弃
 * @deprecated dataPrivilege ['枚举备注: ALL :全部数据权限' ,'SOLUTION: 使用解决方案数据权限'] 待废弃
 * @param dataPrivilegeType 新数据权限
 * @param tagIdList {number[]} 业务标签的ID列表
 * @returns {AxiosPromise}
 */
export function createPosition ({ id, parentId, name, description, resourceIdList, dataPrivilege, dataPrivilegeType, tagIdList }) {
  return request({
    url: `/basic/v2/enterprise/${id}/position`,
    method: 'post',
    data: { id, parentId, name, description, resourceIdList, dataPrivilege, dataPrivilegeType, tagIdList }
  })
}

/**
 * 更新岗位
 * @param id 岗位的ID
 * @param parentId 上级岗位的ID
 * @param name
 * @param description
 * @param resourceIdList 资源的ID集合
 * @param dataPrivilege
 * @deprecated dataPrivilege 待废弃
 * @param dataPrivilegeType 新数据权限
 * @param tagIdList 业务标签的ID列表
 * @returns {AxiosPromise}
 */
export function updatePosition ({ id, parentId, name, description, resourceIdList, dataPrivilege, dataPrivilegeType, tagIdList }) {
  return request({
    url: `/basic/v2/position/${id}`,
    method: 'put',
    data: { id, parentId, name, description, resourceIdList, dataPrivilege, dataPrivilegeType, tagIdList }
  })
}
