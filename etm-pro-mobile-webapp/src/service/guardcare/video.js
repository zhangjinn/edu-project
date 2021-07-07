// import request from './mockRequest'
import request from '../http.js'

/**
 * 获取视频列表
 * @returns {AxiosPromise}
 */
export function queryVideoList({ employeeId, pageNum, pageSize }) {
  return request({
    url: `/guardcare/camera/grant/employee`,
    method: 'get',
    params: { employeeId, pageNum, pageSize }
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
    url: `/guardcare/camera/play`,
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
    url: `/guardcare/device_open_time`,
    method: 'get',
    params: { type }
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
    url: `/guardcare/device_open_time`,
    method: 'get',
    params: { type, enableFlag }
  })
}
