import request from '../http.js'

/**
 * 查询请假审批列表
 */
export function getApprovalList(data) {
  return request({
    url: `/neuroo/leave_request/approval_list`,
    method: 'get',
    params: data
  })
}

/**
 * 查询请假记录列表
 */
export function getLeaveList(data) {
  return request({
    url: `/neuroo/leave_request/record_list`,
    method: 'get',
    params: data
  })
}

/**
 * 查询请假详情
 */
export function getLeaveDetail(data) {
  return request({
    url: `/neuroo/leave_request/details`,
    method: 'get',
    params: data
  })
}

/**
 * 更新-请假审核
 */
export function reviewLeave(data) {
  return request({
    url: `/neuroo/leave_request/review`,
    method: 'put',
    data
  })
}
