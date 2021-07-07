import request from '../http.js'

/**
 * 查询请假记录列表
 */
export function getLeaveList(data) {
  return request({
    url: `/guardcare/leave_request/record_list`,
    method: 'get',
    params: data
  })
}

/**
 * 查询请假详情
 */
export function getLeaveDetail(leaveRequestId) {
  return request({
    url: `/guardcare/leave_request/${leaveRequestId}`,
    method: 'get'
  })
}

/**
 * 更新-请假审核
 */
export function reviewLeave(data) {
  return request({
    url: `/guardcare/leave_request/review`,
    method: 'put',
    data
  })
}
