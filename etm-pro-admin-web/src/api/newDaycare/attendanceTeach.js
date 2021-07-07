// import request from '@/api/newdaycare/mockRequest'

import request from '@/utils/request'

/**
 * 查询早教班级列表,下拉搜索
 * @param teCourseName 早教课程名称
 * @returns {AxiosPromise}
 */
export function queryClassName({ teCourseName }) {
  return request({
    url: `/newdaycare/teach/te_clazz`,
    method: 'get',
    params: { teCourseName }
  })
}

/**
 * 查询早教考勤列表
 * @param type true-已考勤 false-未考勤
 * @param childName 学员姓名
 * @param courseId 课程名
 * @param clazzId 班级id
 * @param teacherId 上课老师名
 * @param helpTeacherId 助教老师名
 * @param date 上课时间
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryAttendance({ type, childName, courseId, clazzId, teacherId, helpTeacherId, startDate, endDate, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/taattendance`,
    method: 'get',
    params: {
      type,
      childName,
      courseId,
      clazzId,
      teacherId,
      helpTeacherId,
      startDate,
      endDate,
      pageNum,
      pageSize
    }
  })
}

/**
 * 新增早教考勤
 * @param childCourseIdList 学员排课id集合
 * @param attendanceDate 考勤日期
 * @param status 考勤状态
 * @param reason 请假原因
 * @returns {AxiosPromise}
 */
export function createNewAttendance({ childCourseIdList, status, reason }) {
  return request({
    url: `/newdaycare/taattendance`,
    method: 'post',
    data: { childCourseIdList, status, reason }
  })
}

/**
 * 更新早教考勤
 * @param childCourseIdList 学员排课id集合
 * @param attendanceDate 考勤日期
 * @param status 考勤状态
 * @param reason
 * @returns {AxiosPromise}
 */
export function updateAttendance({ caAattendanceIdList, status, reason }) {
  return request({
    url: `/newdaycare/taattendance`,
    method: 'put',
    data: { caAattendanceIdList, status, reason }
  })
}

/**
 * 查询早教考勤设置列表
 * @returns {AxiosPromise}
 */
export function queryAttendanceSetting() {
  return request({
    url: `/newdaycare/taattendance_setting`,
    method: 'get'
  })
}

/**
 * 更新早教考勤设置
 * @param taattendance SettingId
 * @param value 值
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateAttendanceSetting({ taattendanceSettingId, value, enable }) {
  return request({
    url: `/newdaycare/taattendance_setting/${taattendanceSettingId}`,
    method: 'put',
    data: { value, enable }
  })
}

/**
 *早教课程列表
 * @returns {AxiosPromise}
 */
export function queryCourse() {
  return request({
    url: `/newdaycare/teach/te_course`,
    method: 'get'
  })
}

/**
 * 取消早教学员排课预约
 * @param idList 学员排课id集合
 * @returns {AxiosPromise}
 */
export function delAttendance({ idList }) {
  return request({
    url: `/newdaycare/child_course/cancel`,
    method: 'post',
    data: { idList }
  })
}

/**
 * 撤销考勤
 * @param taattendanceId taattendanceId
 * @returns {AxiosPromise}
 */
export function updateTeach({ taattendanceId }) {
  return request({
    url: `/newdaycare/taattendance/${taattendanceId}`,
    method: 'put'

  })
}
