// import axios from 'axios'
// import { Loading } from 'element-ui-etm'
//
// axios.defaults.baseURL = 'http://192.168.7.54:3000/mock/18/'
// const request = axios
//
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

// TODO 组织架构api接口文档

/**
 * @description 获取当前组织的顶级组织ID
 * @returns {AxiosPromise}
 */
export function getCurrentTop() {
  return request({
    url: '/basic/organization/enterprise/top',
    method: 'get'
  })
}

/**
 * @description 通过当前组织ID查询部组织和部门列表  部门列表, 用于下拉和卡片
 * @param  id {string} required  - 子部门上一级组织的ID
 * @param organizationType {string} [ENTERPRISE，DEPARTMENT（枚举：企业，部门）] required - 组织类型
 * @returns {Promise}
 */
export function queryOrganizationOrDepartmentSelectOrList({ id, organizationType }) {
  if (!id) {
    return Promise.reject('ID不能为空')
  }
  return request({
    url: `/basic/organization/${id}/child`,
    method: 'get',
    params: { organizationType }
  })
}

/**
 * @description 根据当前组织查询员工列表卡片
 * @param organizationId {string} required - 当前组织ID
 * @returns {Promise}
 */
export function queryEmployeeByCurrentOrg({ organizationId }) {
  return request({
    url: `/basic/organization/${organizationId}/employee`,
    method: 'get'
  })
}

/**
 * @description 根据组织ID查询部门列表
 * @param id {string} required - 组织ID
 * @returns {AxiosPromise}
 */
export function queryDepartmentByCurrentOrg({ id }) {
  return request({
    url: `/basic/organization/department/${id}/child`,
    method: 'get'
  })
}

/**
 * @description 新增企业
 * @param parentOrganizationId       {string} required - 上级企业ID
 * @param logo                       {string} required - logo
 * @param name                       {string} required - 组织名称
 * @param address                    {string} required - 组织地址
 * @param organizationManager        {string} required - 组织负责人
 * @param telephone                  {string} required - 组织手机号码
 * @returns {Promise}
 */
export function addOrganization({ parentOrganizationId, logo, name, address, organizationManager, telephone, solutionIdList }) {
  return request({
    url: '/basic/organization/enterprise',
    method: 'post',
    data: { parentOrganizationId, logo, name, address, organizationManager, telephone, solutionIdList }
  })
}

/**
 * @description 通过企业ID获取企业详情
 * @param organizationId {string} required - 企业ID
 * @returns {Promise}
 */
export function queryOrganizationById({ organizationId }) {
  return request({
    url: `/basic/organization/enterprise/${organizationId}`,
    method: 'get'
  })
}

/**
 * @description 更新组织企业信息
 * @param id          {string} required - 被编辑的组织ID
 * @param logo        {string} required - logo
 * @param name        {string} required - 组织名称
 * @param address     {string} required - 组织地址
 * @returns {Promise}
 */
export function updateOrganization({ id, logo, name, address, solutionIdList }) {
  return request({
    url: `/basic/organization/enterprise/${id}`,
    method: 'put',
    data: { logo, name, address, solutionIdList }
  })
}

/**
 * 查询当前登录的账户的解决方案列表 主要用于新增子企业时解决方案的勾选列表
 */
export function getCurrentAccountHaveSolutionList() {
  return request({
    url: '/basic/solution',
    method: 'get'
  })
}
