import request from '@/utils/request'
// import request from '@/api/base/mock'

/**
 * 根据条件筛选当前企业中的部门或者员工
 * @param organizationId 组织ID
      必须是当前企业ID或当前企业的任一部门ID
 * @param name 部门或者员工的名称
 * @returns {AxiosPromise}
 */
export function queryStructureTree({ organizationId, name }) {
  return request({
    url: `/basic/v2/enterprise/department_and_employee`,
    method: 'get',
    params: { organizationId, name }
  })
}

/**
 * 根据部门和员工列表获取去重的员工列表
      该接口会先获取指定部门及以下部门中的所有员工，然后将其与指定的员工列表合并并去重得到新的员工列表
 * @param departmentIdList 部门ID列表
      部门ID列表和员工ID列表必须传入其中一项
 * @param employeeIdList 员工ID列表
      部门ID列表和员工ID列表必须传入其中一项
 * @param departmentIdList 部门ID列表
 * @param employeeIdList 员工ID列表
 * @returns {AxiosPromise}
 */
export function queryEmployeeList({ departmentIdList, employeeIdList }) {
  return request({
    url: `/basic/v2/employee/distinct`,
    method: 'get',
    params: { departmentIdList, employeeIdList }
    // data: { departmentIdList, employeeIdList },
  })
}
