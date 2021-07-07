import request from '@/utils/request'

/**
 * 获取所有权限
 * post方法的参数是data
 * */
export function enterpriseResourcde(id) {
  return request({
    url: '/basic/enterprise_resource/' + id,
    method: 'get'
  })
}

/**
 * 添加一个角色
 * post方法的参数是data
 * */
export function addRole(data) {
  return request({
    url: '/basic/role/',
    method: 'post',
    data
  })
}

/**
 * 修改一个角色
 * */
export function updateRole(params) {
  return request({
    url: '/basic/role/',
    method: 'Put',
    params
  })
}

/**
 * 获取所有角色
 * */
export function roleEnterprise(params) {
  return request({
    url: '/basic/role',
    method: 'get',
    params
  })
}

/**
 * 获取所有角色所有员工
 * */
export function getRoleStaffs(params) {
  return request({
    url: '/basic/account',
    method: 'get',
    params
  })
}

export function membership(data) {
  return request({
    url: '/basic/membership',
    method: 'Delete',
    data
  })
}

export function getRole(id) {
  return request({
    url: '/basic/role/' + id,
    method: 'Get'
  })
}
