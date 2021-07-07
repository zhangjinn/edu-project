import request from '@/utils/request'
/**
 * 获取岗位树，岗位列表显示树形结构
 * post方法的参数是data
 * */
export function getPositionTree(id) {
  return request({
    url: '/basic/organization/' + id + '/position',
    method: 'get'
  })
}

/**
 * 根据岗位id获取岗位列表
 * post方法的参数是data
 * */
export function getPositionListByPostId(id) {
  return request({
    url: '/basic/position/' + id + '/position_tree',
    method: 'get'
  })
}

/**
 * 根据组织id获取岗位列表
 * post方法的参数是data
 * */
export function getPositionListByOrganizationId(id) {
  return request({
    url: '/basic/organization/' + id + '/position',
    method: 'get'
  })
}

/**
 * 添加一个机构
 * post方法的参数是data
 * */
export function addPosition(data) {
  console.log(data)
  return request({
    url: '/basic/position',
    method: 'post',
    data
  })
}

/**
 * 修改一个部门
 * post方法的参数是data
 * */
export function updatePosition(data) {
  return request({
    url: '/basic/position',
    method: 'Put',
    data
  })
}

/**
 * 根据ID获取机构
 * */
export function getPositionById(params) {
  return request({
    url: '/organization',
    method: 'get',
    params
  })
}

/**
 * 根据ID删除机构
 * */
export function delPosition(id) {
  return request({
    url: '/organization/' + id,
    method: 'del'
  })
}

/**
 * 根据ID修改机构
 * */
export function putPosition(params) {
  return request({
    url: '/organization',
    method: 'put',
    params
  })
}

/**
 *获取岗位员工
 * */
export function getPositionEmployees(params) {
  return request({
    url: '/basic/account',
    method: 'get',
    params
  })
}

export function removePositionEmployees(data) {
  return request({
    url: '/basic/employee/position',
    method: 'Delete',
    data
  })
}
