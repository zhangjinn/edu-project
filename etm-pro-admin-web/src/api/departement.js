import request from '@/utils/request'

// TODO 组织架构 部门 api接口文档

/**
 * @description 新增部门
 * @param organizationId
 * @param name
 * @returns {Promise}
 */
export function addDepartment({ organizationId, name }) {
  return request({
    url: '/basic/organization/department',
    method: 'post',
    data: { organizationId, name }
  })
}

/**
 * @description 通过ID获取部门详情
 * @param id {string}  required - 部门ID
 * @returns {Promise}
 */
export function queryDepartmentById({ id }) {
  return request({
    url: `/basic/organization/department/${id}`,
    method: 'get'
  })
}

/**
 * @description 更新部门信息
 * @param id 更新的部门ID
 * @param name 更新的部门名称
 * @returns {Promise}
 */
export function updateDepartment({ id, name }) {
  return request({
    url: `/basic/organization/department/${id}`,
    method: 'put',
    data: { name }
  })
}
