// import request from '@/api/newdaycare/mockRequest'

import request from '@/utils/request'

// /**
//  * 查询托育考勤分页列表
//  * @param type true-已考勤 false-未考勤
//  * @param childName 学员姓名
//  * @param courseId 课程名
//  * @param clazzId 班级id
//  * @param teacherId 上课老师名
//  * @param helpTeacherId 助教老师名
//  * @param date 上课时间
//  * @param pageNum
//  * @param pageSize
//  * @returns {AxiosPromise}
//  */
// export function queryAttendanceCare({ type, childName, courseId, clazzId, teacherId, helpTeacherId, startDate, endDate, pageNum, pageSize }) {
//   return request({
//     url: `/newdaycare/ca_aattendance`,
//     method: 'get',
//     params: { type, childName, courseId, clazzId, teacherId, helpTeacherId, startDate, endDate, pageNum, pageSize }
//   })
// }

/**
 * 查询托育考勤分页列表
 * @param type type页状态
 NOT_ATTENDANCE :未考勤
 IN_SCHOOL :已入园
 OUT_SCHOOL :已离园
 ASK_FOR_LEAVE :已请假
 * @param childName 学员姓名
 * @param clazzName 班级id
 * @param date 上课日期
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryAttendanceCare ({ type, childName, clazzName, date, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/ca_aattendance',
    method: 'get',
    params: { type, childName, clazzName, date, pageNum, pageSize, paged }
  })
}

// /**
//  * 新增托育考勤(还未考勤时)
//  * @param childIdList 学员id集合
//  * @param status 考勤状态
//  * @param reason 请假原因
//  * @returns {AxiosPromise}
//  */
// export function createAttendanceCare({ childCourseIdList, status, reason }) {
//   return request({
//     url: `/newdaycare/ca_aattendance`,
//     method: 'post',
//     data: { childCourseIdList, status, reason }
//   })
// }

/**
 * 新增托育考勤(还未考勤时)/BM端复用
 * @param childIdList 学员id集合
 * @param status 考勤状态
 * @param personId 联系人id
 * @param reason 请假原因
 * @returns {AxiosPromise}
 */
export function createAttendanceCare ({ childIdList, status, reason, attendanceDate }) {
  return request({
    url: '/newdaycare/ca_aattendance',
    method: 'post',
    data: { childIdList, status, reason, attendanceDate }
  })
}

// /**
//  * 更新托育考勤
//  * @param caAattendanceIdList 考勤id集合
//  * @param status 考勤状态
//  * @param reason 请假原因
//  * @param personRelationId  联系人id
//  * @returns {AxiosPromise}
//  */
// export function updateAttendanceCare({ caAattendanceIdList, status, reason, personRelationId }) {
//   return request({
//     url: `/newdaycare/ca_aattendance`,
//     method: 'put',
//     data: { caAattendanceIdList, status, reason, personRelationId }
//   })
// }

/**
 * 更新托育考勤/BM端复用
 * @param caAattendanceIdList 考勤id
 * @param status 考勤状态
 * @param parentId 人际关系id ->内部调整返回为parentId,为了不影响前端还是继续用这个字段
 * @param reason 请假原因
 * @returns {AxiosPromise}
 */
export function updateAttendanceCare ({ caAattendanceIdList, status, parentId, reason }) {
  return request({
    url: '/newdaycare/ca_aattendance',
    method: 'put',
    data: { caAattendanceIdList, status, parentId, reason }
  })
}

/**
 * 查询托育考勤设置列表
 * @returns {AxiosPromise}
 */
export function queryAttendanceCareSetting () {
  return request({
    url: '/newdaycare/ca_aattendance_setting',
    method: 'get'
  })
}

/**
 * 更新托育考勤设置
 * @param caAattendanceSettingId   settingID
 * @param value 值
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateAttendanceCareSetting ({ caAattendanceSettingId, value, enable }) {
  return request({
    url: `/newdaycare/ca_aattendance_setting/${caAattendanceSettingId}`,
    method: 'put',
    data: { caAattendanceSettingId, value, enable }
  })
}

/**
 * 查询学员的联系人
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryParent ({ childId }) {
  return request({
    url: `/newdaycare/child/child_relationship/${childId}`,
    method: 'get'
  })
}

/**
 * 取消托育学员排课预约
 * @param idList
 * @returns {AxiosPromise}
 */
export function createDelAttendanceCare ({ idList }) {
  return request({
    url: '/newdaycare/ca_schild_course/cancel',
    method: 'post',
    data: { idList }
  })
}

/**
 * 查询早教课程列表下拉
 * @returns {AxiosPromise}
 */
export function queryClassCareName () {
  return request({
    url: '/newdaycare/care/cae_course',
    method: 'get'
  })
}

/**
 * 查询托育班级列表
 * @returns {AxiosPromise}
 */
export function queryRomeCareName () {
  return request({
    url: '/newdaycare/care/cae_clazz',
    method: 'get'
  })
}

/**
 * 撤销考勤
 * @param caAattendanceId caAattendanceId
 * @returns {AxiosPromise}
 */
export function updateCare ({ caAattendanceId }) {
  return request({
    url: `/newdaycare/ca_aattendance/${caAattendanceId}`,
    method: 'put'
  })
}
