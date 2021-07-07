import request from '@/utils/request'

// 应用市场应用
export function getAllApply(data) {
  return request({
    url: '/basic/app',
    method: 'get',
    params: data
  })
}

// 我的应用
export function getMyApply(data) {
  return request({
    // url: '/basic/enterprise_app/'+id,
    url: '/basic/enterprise_app',
    method: 'get',
    params: data
  })
}

// 获取获取菜单
export function getRouter(data) {
  return request({
    url: '/basic/enterprise_folder/' + data + '',
    method: 'get'
  })
}

// 保存文件夹显示
export function postEnterpriseFolder(data) {
  return request({
    url: '/basic/enterprise_folder',
    method: 'post',
    data
  })
}

// 查看菜单应用
export function getEnterpriseFolder(data) {
  return request({
    url: '/basic/enterprise_folder',
    method: 'get',
    params: data
  })
}

// 个人菜单
export function ownRouter(data) {
  return request({
    url: '/basic/account/menu',
    method: 'get',
    params: data
  })
}

// 应用详情
export function applyDetail(id1, id2) {
  return request({
    url: '/basic/app/detail/' + id1,
    method: 'get'
  })
  /* return request({
    url: '/basic/app/detail/' + id1 + '/' + id2,
    method: 'get'
  })*/
}

// 分享应用
export function shareApply(data) {
  return request({
    url: '/basic/app_share/app',
    method: 'post',
    data
  })
}

// 查询分享应用
export function shareRecord(params) {
  return request({
    url: '/basic/app_share',
    method: 'get',
    params
  })
}

// 撤销分享应用
export function repealShare(id) {
  return request({
    url: '/basic/app_share/' + id,
    method: 'delete'
  })
}

// 购买应用
export function purchase(data) {
  return request({
    url: '/basic/app_purchase',
    method: 'post',
    data
  })
}

export function getCategory(data) {
  return request({
    url: '/basic/app/category',
    method: 'get',
    data
  })
}
