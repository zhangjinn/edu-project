import request from '@/utils/request'

/**
 * 获取组织列表,懒加载方式，一次只加载当前节点跟根节点
 * post方法的参数是data
 * */
export function getOrganizationTree(params) {
  return request({
    url: '/basic/organization/organization_tree',
    method: 'get',
    params
  })
}

/**
 * 根据组织id获取该企业组织下的部门各级员工
 * post方法的参数是data
 * */
export function getOrganizationEmployee(id) {
  return request({
    url: '/basic/organization/' + id + '/organization_employee',
    method: 'get'

  })
}

/**
 * 获取组织列表
 * post方法的参数是data
 * */
export function getOrganizationTreeAll(params) {
  return request({
    url: '/basic/organization/organization_tree',
    method: 'get',
    params
  })
}

export function getOrganizationTreeChild(id, params) {
  return request({
    url: '/basic/organization/' + id + '/organization_tree',
    method: 'get',
    params
  })
}

/**
 * 根据组织(企业/部门)id查询出组织的下级组织
 * */
export function getRootOrganizationTree(id) {
  return request({
    url: '/basic/organization/' + id + '/organization_tree',
    method: 'get'
  })
}

/**
 * 根据组织id查询组织所有员工
 * */
export function getRootEmployee(params) {
  return request({
    url: '/basic/employee/employee_list',
    method: 'get',
    params
  })
}

/**
 * 添加一个机构
 * post方法的参数是data
 * */
export function addOrganization(data) {
  return request({
    url: '/basic/organization',
    method: 'post',
    data
  })
}

/**
 * 添加一个机构
 * post方法的参数是data
 * */
export function updateOrganization(data) {
  return request({
    url: '/basic/organization',
    method: 'Put',
    data
  })
}

export function appShare(data) {
  return request({
    url: '/basic/app_share/enterprise',
    method: 'post',
    data
  })
}

export function addRelationShipWithOrgAndPerson(data) {
  return request({
    url: '/basic/employee/employee',
    method: 'post',
    data
  })
}

/**
 *我的应用
 * 添加机构的时候需要添加应用
  */
export function getMyApply(id) {
  return request({
    url: '/basic/enterprise_app/' + id,
    method: 'get'
  })
}

/**
 * 根据ID获取机构
 * */
export function getOrganizationById(params) {
  return request({
    url: '/basic/organization',
    method: 'get',
    params
  })
}

/**
 * 根据ID删除机构
 * */
export function delOrganization(id) {
  return request({
    url: '/basic/organization/' + id,
    method: 'del'
  })
}

/**
 * 根据ID修改机构
 * */
export function putOrganization(params) {
  return request({
    url: '/basic/organization',
    method: 'put',
    params
  })
}

/**
 * 获取机构的所有员工
 * */
export function getOrganizationEmployees(params) {
  return request({
    url: '/basic/account',
    method: 'get',
    params
  })
}

/**
 * 添加一个员工
 * */
export function addEmployees(data) {
  return request({
    url: '/basic/account',
    method: 'Post',
    data
  })
}

export function getEmployees(orgId, accountId) {
  return request({
    url: '/basic/account/basic/' + orgId + '/' + accountId,
    method: 'Get'
  })
}

/**
 * 添加一个员工
 * */
export function updataEmployees(data, id) {
  return request({
    url: '/basic/account/' + id,
    method: 'Put',
    data
  })
}

/**
 * 添加企业的管理员账号
 * */
export function addMajorEmployees(data) {
  return request({
    url: '/basic/employee',
    method: 'Post',
    data
  })
}

export function checkPhone(phone) {
  return request({
    url: '/basic/person/telephone/' + phone,
    method: 'Get'
  })
}

export function employee(data) {
  return request({
    url: '/basic/employee',
    method: 'Put',
    data
  })
}

// 添加企业时添加跟进默认字段
export function organizationDefault1(data) {
  return request({
    url: '/default/follow_record/eav/attribute/default',
    method: 'Post',
    data
  })
}

// 添加企业时添加客户默认字段
export function organizationDefault2(data) {
  return request({
    url: '/default/eav/attribute/default',
    method: 'Post',
    data
  })
}

export function employeeCount(data) {
  return request({
    url: '/basic/employee/count',
    method: 'Post',
    data
  })
}

export function totalEmployeeCount(params) {
  return request({
    url: '/basic/employee/count',
    method: 'Get',
    params
  })
}
