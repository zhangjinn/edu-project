// import request from './mockRequest'
import request from '../http.js'

/**
 * 查询请假记录列表
 * @param data.status
 */
export function getLeaveList(data) {
  return request({
    url: `/daycare/ask_for_leave`,
    method: 'get',
    params: data
  })
}

/**
 * 查询请假详情
 * @param askForLeaveId
 */
export function getLeaveDetail(askForLeaveId) {
  return request({
    url: `/daycare/ask_for_leave/${askForLeaveId}`,
    method: 'get'
  })
}

/**
 * 更新-请假审核
 * @param askForLeaveId
 * @param startDate
 * @param endDate
 * @param askForLeaveType
 * @param reason
 * @param askCourseList
 * @param reviewStatus
 * @param image
 * @param disease
 * @param denialReason
 */
export function reviewLeave({ askForLeaveId, startDate, endDate, askCourseList, askForLeaveType, disease, reason, image, reviewStatus, denialReason }) {
  return request({
    url: `/daycare/ask_for_leave/${askForLeaveId}`,
    method: 'put',
    data: { startDate, endDate, askCourseList, askForLeaveType, disease, reason, image, reviewStatus, denialReason }
  })
}
