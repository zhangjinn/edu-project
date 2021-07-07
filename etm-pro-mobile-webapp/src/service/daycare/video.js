// import request from './mockRequest'

import request from '../http.js'

/**
 * 获取视频列表
 * @returns {AxiosPromise}
 */
export function queryVideoList() {
  return request({
    url: `/daycare/camera/bm_camera_list`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取摄像头直播
 * @param cameraId
 * @param deviceOpenTimeType
 * @returns {AxiosPromise}
 */
export function queryVideo({ cameraId, deviceOpenTimeType }) {
  return request({
    url: `/daycare/camera_authorization/play`,
    method: 'get',
    params: { cameraId, deviceOpenTimeType }
  })
}

/**
 * 根据实时时间查询是否在开启时间内
 * @param type
 * @returns {AxiosPromise}
 */
export function queryCameraSetting(type) {
  return request({
    url: `/daycare/camera_setting/check/${type}`,
    method: 'get',
    params: {}
  })
}

/**
 * 按星期分组查询摄像头设置列表
 * @param type
 * @param enableFlag
 * @returns {AxiosPromise}
 */
export function queryOpenList({ type, enableFlag }) {
  return request({
    url: `/daycare/camera_setting/group_by_weekday`,
    method: 'get',
    params: { type, enableFlag }
  })
}
