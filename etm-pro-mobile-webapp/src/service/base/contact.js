import request from '../http.js'

/**
 * 获取当前员工所处的组织链
 */
export function getDeptLevel() {
  return request({
    url: '/basic/v2/employee/organization_chain',
    method: 'get'
  })
}

/**
 * 获取组织的下一级部门
 * @param id 组织id
 * @returns {AxiosPromise}
 */
export function getDepartmentTreeById(organizationId) {
  return request({
    url: '/basic/v2/organization/' + organizationId + '/department',
    method: 'get'
  })
}

/**
 * 根据员工姓名和组织id查询员工
 * @param data
 * @returns {AxiosPromise}
 */
export function getEmployee(data) {
  return request({
    url: '/basic/v2/employee',
    method: 'get',
    params: data
  })
}

/**
 * 根据组织id查询所有员工
 * @param id
 * @returns {AxiosPromise}
 */
export function getAllEmployee(organizationId) {
  return request({
    url: '/basic/v2/enterprise/' + organizationId + '/employee',
    method: 'get'
  })
}

/**
 * 查询当前企业的员工详情
 */
export function getEmployeeDetails(personId) {
  return request({
    url: '/basic/v2/employee/' + personId,
    method: 'get'
  })
}
