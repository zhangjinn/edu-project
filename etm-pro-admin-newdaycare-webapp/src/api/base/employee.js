import request from '@/utils/request'

/**
 * 查询员工列表
 * @param organizationId {string}
 * @param positionId {string}
 * @param keyword {string}
 * @param pageNum {number} 分页
 * @param pageSize {number} 分页
 * @returns {AxiosPromise}
 */
export function queryEmployeePageByOrgIdOrRoleIdOrName ({ organizationId, positionId, keyword, pageNum, pageSize }) {
  return request({
    url: '/basic/v2/employee',
    method: 'get',
    params: { organizationId, positionId, keyword, pageNum, pageSize }
  })
}

/**
 * 新增指定企业的员工
 * @param id 企业的ID
 * @param name
 * @param telephone
 * @param positionIdList {number[]}
 * @param departmentId
 * @param gender
 * @returns {AxiosPromise}
 */
export function createEmployee ({ id, name, telephone, positionIdList, departmentId, gender }) {
  return request({
    url: `/basic/v2/enterprise/${id}/employee`,
    method: 'post',
    data: { id, name, telephone, positionIdList, departmentId, gender }
  })
}

/**
 * 更新员工
 * @param id 员工的ID
 * @param name
 * @param telephone
 * @param positionIdList
 * @param departmentId
 * @param gender
 * @returns {AxiosPromise}
 */
export function updateEmployee ({ id, name, telephone, positionIdList, departmentId, gender }) {
  return request({
    url: `/basic/v2/employee/${id}`,
    method: 'put',
    data: { id, name, telephone, positionIdList, departmentId, gender }
  })
}

/** 通过ID获取员工详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryEmployeeById ({ id }) {
  return request({
    url: `/basic/v2/employee/${id}`,
    method: 'get',
    params: { id }
  })
}

/**
 * 更新员工启用/停用
 * @param id
 * @param enable
 * @returns {AxiosPromise}
 */
export function updateEmployeeStatus ({ id, enable }) {
  return request({
    url: `/basic/v2/employee/${id}/status`,
    method: 'put',
    data: { id, enable }
  })
}

/**
 * 通过员工ID删除员工
 * @param id
 * @returns {AxiosPromise}
 */
export function removeEmployeeById ({ id }) {
  return request({
    url: `/basic/v2/employee/${id}`,
    method: 'delete',
    data: { id }
  })
}

/**
 * 通过数据标签查询员工下拉
 * @param tagCode
 * @returns {AxiosPromise}
 */
export function queryEmployeeSelectByTabCode ({ tagCode }) {
  return request({
    url: '/basic/v2/enterprise/employee',
    method: 'get',
    params: { tagCode }
  })
}

/**
 * 获取当前员工的主题配置
 * @returns {AxiosPromise}
 */
export function queryEmployeeConfig () {
  return request({
    url: '/basic/employee/theme_setting',
    method: 'get',
    params: {}
  })
}

/**
 * 更新当前员工的主题配置
 * @param theme
 * @returns {AxiosPromise}
 */
export function updateEmployeeConfig ({ theme }) {
  return request({
    url: '/basic/employee/theme_setting',
    method: 'put',
    data: { theme }
  })
}
