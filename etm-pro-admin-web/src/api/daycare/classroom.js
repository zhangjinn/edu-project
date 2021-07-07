import request from '@/utils/request'

// import request from '@/api/daycare/mockRequest'

/**
 * 获取教室列表
 * @param roomName
 * @returns {AxiosPromise}
 */
export function queryClassRoom({ roomName, pageNum, pageSize, paged }) {
  return request({
    url: `/daycare/room/page_list`,
    method: 'get',
    params: { roomName, pageNum, pageSize, paged }
  })
}

/**
 * 创建教室
 * @param data
 * @returns {AxiosPromise}
 */
export function createClassRoom(data) {
  return request({
    url: `/daycare/room`,
    method: 'post',
    data
  })
}

/**
 * 更新教室
 * @param roomId
 * @returns {AxiosPromise}
 */
export function updateClasses({ roomId, roomName, remarks, details, imageList, enable }) {
  return request({
    url: `/daycare/room/${roomId}`,
    method: 'put',
    data: { roomName, remarks, details, imageList, enable }
  })
}

/**
 * 获取指定教室
 * @param roomId
 * @returns {AxiosPromise}
 */
export function queryClass(roomId) {
  return request({
    url: `/daycare/room/${roomId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 删除教室
 * @param roomId
 * @returns {AxiosPromise}
 */
export function removeClass(roomId) {
  return request({
    url: `/daycare/room/${roomId}`,
    method: 'delete',
    data: {}
  })
}
