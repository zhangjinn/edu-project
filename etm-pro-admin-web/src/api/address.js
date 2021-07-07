import request from '@/utils/request'

// 获取部门所在组织树的根节点
export function getOrganizationRoot(organizationId) {
  return request({
    url: `/basic/organization/${organizationId}/root_organization_tree`,
    method: 'get'
  })
}

// 逐级获取组织树结构
export function getOrganizationTree(organizationId) {
  return request({
    url: `/basic/organization/${organizationId}/organization_tree`,
    method: 'get'
  })
}

// 查询组织树根节点的信息和员工数量
export function getRootEmployeeCount(organizationId) {
  return request({
    url: `/basic/employee/count`,
    method: 'get',
    params: {
      organizationId
    }
  })
}

export function getExternalTree(organizationId) {
  return request({
    url: `/basic/enterprise_app/own/${organizationId}`,
    method: 'get'
  })
}

export function getOrganizationContact(params) {
  return request({
    url: `/basic/employee`,
    method: 'get',
    params
  })
}

export function getExternalContact(appId) {
  return request({
    url: `/basic/customer/customer_list/${appId}`,
    method: 'get'
  })
}

export function getExternalContactNumber(appId) {
  return request({
    url: `/basic/customer/customer_count/${appId}`,
    method: 'get'
  })
}
