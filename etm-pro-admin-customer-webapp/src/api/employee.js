// import axios from 'axios'
// import { Loading } from 'element-ui-etm'
//
// axios.defaults.baseURL = 'http://192.168.7.54:3000/mock/18/'
// const request = axios
// request.interceptors.request.use(req => {
//   Loading.service({ text: '加载中...', background: 'rgba(255,0,0 .5)' })
//   return req
// })
//
// request.interceptors.response.use(res => {
//   Loading.service().close()
//   return res
// })

import request from '@/utils/request'

// TODO 员工管理api接口文档

/**
 * @description 获取员工列表
 * @param organizationId 组织id
 * @param employeeName   {string}  - 模糊查询员工姓名
 * @param pageSize       {number}  - 分页条数
 * @param pageNum        {number}  - 页码
 * @returns {Promise}
 */
export function getEmployeeList ({ organizationId, employeeName, pageNum, pageSize }) {
  return request({
    url: `/basic/organization/${organizationId}/sub/employee`,
    method: 'get',
    params: { employeeName, pageNum, pageSize }
  })
}

/**
 * @description 查询岗位下拉列表
 * @returns {Promise}
 */
export function queryPositionSelect () {
  return request({
    url: '/basic/organization/position/name',
    method: 'get'
  })
}

/**
 * @description 查询角色下拉列表
 * @returns {Promise}
 */
export function queryRoleSelect () {
  return request({
    url: '/basic/role/name',
    method: 'get'
  })
}

/**
 * @description 查询子组织列表  用于组织架构
 * @param id {string} required - 组织ID
 * @returns {Promise}
 */
export function queryDepartmentSelectOrList ({ id }) {
  return request({
    url: `/basic/organization/department/${id}/child`,
    method: 'get'
  })
}

/**
 * @description 查询当前企业子部门列表, 用于员工管理 左侧部门树和新增员工下拉
 * @param departmentId
 * @returns {Promise}
 */
export function queryDepartmentSelectList ({ departmentId }) {
  return request({
    url: '/basic/organization/department',
    method: 'get',
    params: { departmentId }
  })
}

/**
 * @description 获取部门列表, 用于员工/角色下拉
 * @returns {*}
 */
export function queryDepartmentSelect () {
  return request({
    url: '/basic/organization/department/all',
    method: 'get'
  })
}

/**
 * @description 新增岗位
 * @param positionName {string} required - 岗位名称
 * @returns {Promise}
 */
export function addPosition ({ positionName }) {
  return request({
    url: '/basic/organization/position',
    method: 'post',
    data: { positionName }
  })
}

/**
 * @description 更新岗位
 * @param positionId 岗位ID
 * @param positionName 岗位名称
 * @returns {Promise}
 */
export function updatePosition ({ positionId, positionName }) {
  return request({
    url: `/basic/organization/position/${positionId}`,
    method: 'put',
    data: { positionName }
  })
}

/**
 * @description 添加员工
 * @param telephone               {string}        required    - 手机
 * @param name                    {string}        required    - 姓名
 * @param roleIds                 {string[]}      required    - 角色ID数组
 * @param positionIds             {string[]}      required    - 岗位ID数组
 * @param departmentId            {string}        required    -  部门
 * @param gender  [MALE, FEMALE]
 * @returns {Promise}
 */
export function addEmployee ({ telephone, name, roleIds, positionIds, departmentId, gender }) {
  return request({
    url: '/basic/organization/employee',
    method: 'post',
    data: { telephone, employeeName: name, roleIds, positionIds, departmentId, gender } // Fix bug: ET-141
  })
}

/**
 * @description 添加员工
 * @param id
 * @param telephone               {string}        required    - 手机
 * @param name                    {string}        required    - 姓名
 * @param roleIds                 {string[]}      required    - 角色ID数组
 * @param positionIds             {string[]}      required    - 岗位ID数组
 * @param departmentId            {string}        required    -  部门
 * @param gender  [MALE, FEMALE]
 * @returns {Promise}
 */
export function updateEmployee ({ id, telephone, name, roleIds, positionIds, departmentId, gender }) {
  return request({
    url: `/basic/organization/employee/${id}`,
    method: 'put',
    data: { telephone, employeeName: name, roleIds, positionIds, departmentId, gender } // Fix bug: ET-141
  })
}

/**
 * @description 通过ID获取员工详情, 用于更新员工信息
 * @param id
 * @returns {Promise}
 */
export function getEmployeeDetailById ({ id }) {
  return request({
    url: `/basic/organization/employee/${id}`,
    method: 'get'
  })
}

/**
 * @description 查询岗位列表
 * @param organizationId    {string} required - 企业ID
 * @param positionName      {string} required - 岗位名称
 * @returns {Promise}
 */
export function queryPositionList ({ pageSie, pageNum, positionName }) {
  return request({
    url: '/basic/organization/position',
    method: 'get',
    params: { pageSie, pageNum, positionName }
  })
}

/**
 * @description 查询企业角色列表
 * @param pageSize  {number} default 10  - 分页大小
 * @param pageNum  {number} default 1 - 页码
 * @param name  {string} - 角色名称
 * @returns {Promise}
 */
export function queryRoleList ({ pageSize, pageNum, name }) {
  return request({
    url: '/basic/role',
    method: 'get',
    params: { pageSize, pageNum, name }
  })
}

/**
 * @description 添加角色
 * @param name              {string}                                            required - 角色
 * @param description       {string}                                            required - 描述
 * @param resourceIds       {string[]}                                          required - 资源列表
 * @param dataPrivilege              {string} [MYSELF、DEPARTMENT、 COMPANY、 CUSTOMIZE]  required - 数据权限类型
 * @returns {Promise}
 */
export function addRole ({ name, description, resourceIds, dataPrivilege }) {
  return request({
    url: '/basic/role',
    method: 'post',
    data: { name, description, resourceIds, dataPrivilege }
  })
}

/**
 * @description 更新角色
 * @param roleId
 * @param name              {string}                                            required - 角色
 * @param description       {string}                                            required - 描述
 * @param resourceIds       {string[]}                                          required - 资源列表
 * @param dataPrivilege              {string} [MYSELF、DEPARTMENT、 COMPANY、 CUSTOMIZE]  required - 数据权限类型
 * @returns {Promise}
 */
export function updateRole ({ roleId, name, description, resourceIds, dataPrivilege }) {
  return request({
    url: `/basic/role/${roleId}`,
    method: 'put',
    data: { name, description, resourceIds, dataPrivilege }
  })
}

/**
 * @description 通过角色ID获取角色详情, 用于更新角色
 * @param roleId
 * @returns {Promise}
 */
export function getRoleDetailById ({ roleId }) {
  return request({
    url: `/basic/role/${roleId}`,
    method: 'get'
  })
}

/**
 * @description 查询企业的资源(权限)列表
 * @returns {Promise}
 */
export function queryAuthList () {
  return request({
    url: '/basic/enterprise_resource',
    method: 'get'
  })
}

/**
 * 根据条件查询当前登录的账户的解决方案和资源列表 主要用于菜单数据的加载
 * @param terminalType 终端类型 PC MOBILE
 * @returns {*}
 */
export function getMySolution ({ terminalType = 'PC' }) {
  return request({
    url: '/basic/solution/my',
    method: 'get',
    params: { terminalType }
  })
}

/**
 * 查询当前登录的账户的所有解决方案和资源列表 主要用于添加角色页的功能权限列表
 * @returns {*}
 */
export function getCurrentAccountSolutionList () {
  return request({
    url: '/basic/solution/resource',
    method: 'get'
  })
}

/**
 * @description 获取当前企业的所有员工
 * @returns {*}
 */
export function queryEmployeeSelectAll () {
  return request({
    url: '/basic/v2/enterprise/employee',
    method: 'get'
  })
}

/**
 * @description 获取接送人列表下拉
 * @param customerId
 * @returns {*}
 */
export function querySurrogateSelect ({ customerId }) {
  return request({
    url: '/sacc/customer/surrogate',
    method: 'get',
    params: { customerId }
  })
}

/**
 * 启用/禁用员工
 * @param enable {boolean} 是否启用
 * @param employeeId
 * @returns {AxiosPromise}
 */
export function switchEmployeeStatus ({ enable, employeeId }) {
  return request({
    url: '/basic/organization/employee/changeEnable',
    method: 'put',
    data: { enable, employeeId }
  })
}
