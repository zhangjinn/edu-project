// import request from '@/api/base/mock'
import request from '@/utils/request'

/**
 * 查询组织架构树
 * @returns {AxiosPromise}
 */
export function queryOrganizationTree() {
  return request({
    url: '/basic/v2/organization/tree',
    method: 'get'
  })
}

// TODO: 企业
/**
 * 新增指定企业的子企业
 * @param id
 * @param name
 * @param areaCode
 * @param address
 * @param principalName
 * @param principalTelephone
 * @param solutionIdList
 * @returns {AxiosPromise}
 */
export function createSubOrganization({ id, logo, name, areaCode, address, principalName, principalTelephone, solutionIdList }) {
  return request({
    url: `/basic/v2/enterprise/${id}/sub`,
    method: 'post',
    data: { id, logo, name, areaCode, address, principalName, principalTelephone, solutionIdList }
  })
}

/**
 * 删除子企业
 * @param id
 * @returns {AxiosPromise}
 */
export function removeSubOrganization({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}`,
    method: 'delete',
    data: { id }
  })
}

/**
 * 更新企业
 * @param id
 * @param name
 * @param areaCode
 * @param address
 * @param principalName
 * @param principalTelephone
 * @param solutionIdList
 * @returns {AxiosPromise}
 */
export function updateSubOrganization({ id, logo, name, areaCode, address, principalName, principalTelephone, solutionIdList }) {
  return request({
    url: `/basic/v2/enterprise/${id}`,
    method: 'put',
    data: { id, logo, name, areaCode, address, principalName, principalTelephone, solutionIdList }
  })
}

/**
 * 查询企业详情
 * @param id 企业的ID
 * @returns {AxiosPromise}
 */
export function queryOrganizationDetailById({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}`,
    method: 'get'
  })
}

// TODO: 部门

/**
 * 查询部门详情
 * @param id {string} 部门的ID
 * @returns {AxiosPromise}
 */
export function queryDepartmentDetailById({ id }) {
  return request({
    url: `/basic/v2/department/${id}`,
    method: 'get'
  })
}

/**
 * 创建部门
 * @param id 企业的ID
 * @param parentId 上级部门的ID
 * @param name 部门的名称
 * @param tagIdList 业务标签的ID列表
 * @returns {AxiosPromise}
 */
export function createDepartment({ id, parentId, name, tagIdList }) {
  return request({
    url: `/basic/v2/enterprise/${id}/department`,
    method: 'post',
    data: { id, parentId, name, tagIdList }
  })
}

/**
 * 更新部门
 * @param id 部门的ID
 * @param parentId 上级部门的ID
 * @param name 部门的名称
 * @param tagIdList 业务标签的ID列表
 * @returns {AxiosPromise}
 */
export function updateDepartment({ id, parentId, name, tagIdList }) {
  return request({
    url: `/basic/v2/department/${id}`,
    method: 'put',
    data: { id, parentId, name, tagIdList }
  })
}

/**
 * 删除部门
 * @param id
 * @returns {AxiosPromise}
 */
export function removeDepartmentById({ id }) {
  return request({
    url: `/basic/v2/department/${id}`,
    method: 'delete',
    data: { id }
  })
}

/**
 * 获取部门下拉列表
 * @param id 企业的ID
 * @returns {AxiosPromise}
 */
export function queryDepartmentSelect({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}/department_name`,
    method: 'get',
    params: { id }
  })
}

/**
 * 查询部门级联
 * @param id
 * @returns {AxiosPromise}
 */
export function queryDepartmentCascader({ id }) {
  return request({
    url: `/basic/v2/enterprise/${id}/department_name_tree`,
    method: 'get',
    params: { id }
  })
}

/**
 * 查询指定企业的数据标签列表
 * @param id
 * @param type
 * @returns {AxiosPromise}
 */
export function queryTagByEnterpriseId({ id, type }) {
  return request({
    url: `/basic/enterprise/${id}/tag`,
    method: 'get',
    params: { id, type }
  })
}
