import request from '@/utils/request'

/**
 * 查询场所列表
 * */
export function getRoom(params) {
  return request({
    url: '/guardcare/educational/room',
    method: 'get',
    params
  })
}

/**
 * 新增场所
 * */
export function postRoom(data) {
  return request({
    url: '/guardcare/educational/room',
    method: 'post',
    data
  })
}

/**
 * 修改场所
 * */
export function putRoom(data, id) {
  return request({
    url: `/guardcare/educational/room/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除场所
 * */
export function delRoom(id) {
  return request({
    url: `/guardcare/educational/room/${id}`,
    method: 'delete'
  })
}

/**
 * 获取场所详情
 * */
export function getRoomItem(id) {
  return request({
    url: `/guardcare/educational/room/${id}`,
    method: 'get'
  })
}

/**
 * 修改场所状态
 * */
export function getRoomEnable(data, id) {
  return request({
    url: `/guardcare/educational/room/${id}/enable`,
    method: 'put',
    data
  })
}

/**
 * 查询场所类型列表
 * */
export function getRoomType(id) {
  return request({
    url: `/guardcare/educational/room_type`,
    method: 'get'
  })
}

/**
 * 新增场所类型
 * */
export function postRoomType(data) {
  return request({
    url: '/guardcare/educational/room_type',
    method: 'post',
    data
  })
}

/**
 * 修改场所类型
 * */
export function putRoomType(data, id) {
  return request({
    url: `/guardcare/educational/room_type/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除场所类型
 * */
export function delRoomType(id) {
  return request({
    url: `/guardcare/educational/room_type/${id}`,
    method: 'delete'
  })
}

/**
 * 修改场所类型排序
 * */
export function putRoomSort(data) {
  return request({
    url: `/guardcare/educational/room_type/sort_index`,
    method: 'post',
    data
  })
}
