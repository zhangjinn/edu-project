// import request from './mockRequest'
import request from '../http.js'

/**
 * 打电话
 * @param phone
 */
export function doCall(data) {
  return request({
    url: `/basic/communication/call/do_call`,
    method: 'post',
    data
  })
}

