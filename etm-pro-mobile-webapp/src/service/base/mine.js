import request from '../http.js'

/**
 *个人中心信息
 * */
export function getPerInfo() {
  return request({
    url: '/basic/account/personnel',
    method: 'get'
  })
}

/**
 *个人中心修改
 * */
export function putPerInfo(data) {
  return request({
    url: '/basic/account/personnel',
    method: 'put',
    data
  })
}

/**
 *密码修改
 * */
export function putPerPass(data) {
  return request({
    url: '/basic/account/password',
    method: 'put',
    data
  })
}

/**
 * 切换当前组织
 */
export function switchOrganizations(data) {
  return request({
    url: '/basic/auth/organization',
    method: 'put',
    data
  })
}
