import request from '@/utils/request'

// ----------------幼儿请假设置----------------
/**
 * 查询请假病症列表
 * @returns {AxiosPromise}
 */
export function queryIllnessList () {
  return request({
    url: '/newdaycare/guard/leave_illness/list',
    method: 'get'
  })
}

/**
 * 更新请假病症
 * @param illnessId
 * @param illnessName
 * @returns {AxiosPromise}
 */
export function updateIllnessItem ({ illnessId, illnessName }) {
  return request({
    url: `/newdaycare/guard/leave_illness/${illnessId}`,
    method: 'put',
    data: { illnessName }
  })
}

/**
 * 新增请假病症
 * @param illnessName
 * @returns {AxiosPromise}
 */
export function createIllnessItem (illnessName) {
  return request({
    url: '/newdaycare/guard/leave_illness',
    method: 'post',
    data: { illnessName }
  })
}

/**
 * 删除请假病症
 * @param illnessId
 * @returns {AxiosPromise}
 */
export function removeIllnessItem (illnessId) {
  return request({
    url: `/newdaycare/guard/leave_illness/${illnessId}`,
    method: 'delete'
  })
}

/**
 * 修改请假病症排序
 * @param leaveIllnessList
 * @returns {AxiosPromise}
 */
export function sortIllnessItem (leaveIllnessList) {
  return request({
    url: '/newdaycare/guard/leave_illness/sort_index',
    method: 'put',
    data: { leaveIllnessList }
  })
}

// ----------------幼儿请假----------------
/**
 * 查询幼儿请假列表并分页
 * @param childName 幼儿姓名
 * @param gradeId 年级ID
 * @param clazzId 班级ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param status 状态
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @param paged 是否分页 默认为true
 * @returns {AxiosPromise}
 */
export function queryLeaveListByPage ({ childName, gradeId, clazzId, startDate, endDate, status, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/guard/leave_request/page',
    method: 'get',
    params: { childName, gradeId, clazzId, startDate, endDate, status, pageNum, pageSize }
  })
}

/**
 * 删除请假
 * @param leaveRequestId
 * @returns {AxiosPromise}
 */
export function removeLeaveItem (leaveRequestId) {
  return request({
    url: `/newdaycare/guard/leave_request/${leaveRequestId}`,
    method: 'delete'
  })
}

/**
 * 查询请假时长
 * @param startTIme
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryLeaveLast ({ startTIme, endTime }) {
  return request({
    url: '/newdaycare/guard/leave_request/length',
    method: 'get',
    params: { startTIme, endTime }
  })
}

/**
 * 添加请假
 * @param childId
 * @param startTime
 * @param endTime
 * @param leaveType
 * @param illnessIdList
 * @param leaveReason
 * @param imageList
 * @param isNotice
 * @returns {AxiosPromise}
 */
export function createLeaveItem ({ childId, startTime, endTime, leaveType, illnessIdList, leaveReason, imageList, isNotice }) {
  return request({
    url: '/newdaycare/guard/leave_request',
    method: 'post',
    data: { childId, startTime, endTime, leaveType, illnessIdList, leaveReason, imageList, isNotice }
  })
}

/**
 * 查询请假
 * @param leaveRequestId
 * @returns {AxiosPromise}
 */
export function queryLeaveItemDetail (leaveRequestId) {
  return request({
    url: `/newdaycare/guard/leave_request/${leaveRequestId}`,
    method: 'get'
  })
}

/**
 * 修改请假
 * @param leaveRequestId
 * @param startTime
 * @param endTime
 * @param leaveType
 * @param illnessIdList
 * @param leaveReason
 * @param imageList
 * @param isNotice
 * @returns {AxiosPromise}
 */
export function modifyLeaveItem (leaveRequestId, { startTime, endTime, leaveType, illnessIdList, leaveReason, imageList, isNotice }) {
  return request({
    url: `/newdaycare/guard/leave_request/${leaveRequestId}`,
    method: 'put',
    data: { startTime, endTime, leaveType, illnessIdList, leaveReason, imageList, isNotice }
  })
}

/**
 * 请假审核
 * @param leaveRequestId
 * @returns {AxiosPromise}
 */
export function approveLeaveItem (leaveRequestId) {
  return request({
    url: '/newdaycare/guard/leave_request/review',
    method: 'put',
    data: { leaveRequestId }
  })
}

// ----------------考勤卡考勤----------------
/**
 * 通过考勤卡进行考勤
 * @param attendanceCardNumber 考勤卡卡号
 * @returns {AxiosPromise}
 */
export function createAttendanceByCard (attendanceCardNumber) {
  return request({
    url: '/newdaycare/guard/attendance/attendance_by_card',
    method: 'post',
    data: { attendanceCardNumber }
  })
}
