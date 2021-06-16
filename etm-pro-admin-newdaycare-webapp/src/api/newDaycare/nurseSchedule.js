// import request from '@/api/newdaycare/mockRequest'
import request from '@/utils/request'

/**
 * 获取托育课程时间段
 * @returns {AxiosPromise}
 */
export function queryNursePeriod () {
  return request({
    url: '/newdaycare/ca_scourse_time_period',
    method: 'get',
    params: {}
  })
}

/**
 * 新增托育课程时间段/newdaycare/ca_scourse_management/check_copy_week_course
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function createNursePeriod ({ startTime, endTime }) {
  return request({
    url: '/newdaycare/ca_scourse_time_period',
    method: 'post',
    data: { startTime, endTime }
  })
}

/**
 * 修改托育课程时间段
 * @param caScourseTimePeriodId
 * @returns {AxiosPromise}
 */
export function updateNursePeriod ({ caScourseTimePeriodId, startTime, endTime }) {
  return request({
    url: `/newdaycare/ca_scourse_time_period/${caScourseTimePeriodId}`,
    method: 'put',
    data: { startTime, endTime }
  })
}

/**
 * 删除课程时间段
 * @param caScourseTimePeriodId
 * @returns {AxiosPromise}
 */
export function removeNursePeriod (caScourseTimePeriodId) {
  return request({
    url: `/newdaycare/ca_scourse_time_period/${caScourseTimePeriodId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 课程时间段排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function updatePeriodSort (ids) {
  return request({
    url: '/newdaycare/ca_scourse_time_period/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 获取节假日列表
 * @param date
 * @returns {AxiosPromise}
 */
export function queryVacationLists (date) {
  return request({
    url: '/newdaycare/ca_soff_date',
    method: 'get',
    params: { date }
  })
}

/**
 * 切换节假日休息上班
 * @param date
 * @param offFlag
 * @returns {AxiosPromise}
 */
export function createTriggerVacation ({ date, offFlag }) {
  return request({
    url: '/newdaycare/ca_soff_date',
    method: 'post',
    data: { date, offFlag }
  })
}

/**
 * 获取学位欸列表
 * @param date
 * @returns {AxiosPromise}
 */
export function queryDegree ({ date }) {
  return request({
    url: '/newdaycare/ca_scourse_management/count_position',
    method: 'get',
    params: { date }
  })
}

/**
 * 获取学位详情
 * @param date
 * @returns {AxiosPromise}
 */
export function queryDegreeDetail (date) {
  return request({
    url: '/newdaycare/ca_scourse_management/detail_position',
    method: 'get',
    params: { date }
  })
}

/**
 * 获取日程列表
 * @param date
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function queryScheduleList ({ date, clazzId }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule',
    method: 'get',
    params: { date, clazzId }
  })
}

/**
 * 新增托育班级日程
 * @param clazzId
 * @param scheduleId
 * @param clazzTeacherId
 * @param teachTeacherId
 * @param helpTeacherId
 * @param date
 * @param timePeriodId
 * @param remark
 * @param colorCode
 * @returns {AxiosPromise}
 */
export function createSchedule ({ clazzId, scheduleId, clazzTeacherId, teachTeacherId, helpTeacherId, date, timePeriodId, remark, colorCode }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule',
    method: 'post',
    data: { clazzId, scheduleId, clazzTeacherId, teachTeacherId, helpTeacherId, date, timePeriodId, remark, colorCode }
  })
}

/**
 * 查询托育日程下拉列表
 * @returns {AxiosPromise}
 */
export function queryScheduleSelect () {
  return request({
    url: '/newdaycare/care/cae_schedule',
    method: 'get',
    params: {}
  })
}

/**
 * 添加日程备注
 * @param id
 * @param remark
 * @returns {AxiosPromise}
 */
export function createRemark ({ id, remark }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule/add_remark',
    method: 'post',
    data: { id, remark }
  })
}

/**
 * 获取日程详情
 * @param caSclazzScheduleId
 * @returns {AxiosPromise}
 */
export function queryScheduleDate (caSclazzScheduleId) {
  return request({
    url: `/newdaycare/ca_sclazz_schedule/${caSclazzScheduleId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 删除日程
 * @param caSclazzScheduleId
 * @returns {AxiosPromise}
 */
export function removeSchedule (caSclazzScheduleId) {
  return request({
    url: `/newdaycare/ca_sclazz_schedule/${caSclazzScheduleId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 更新日程详情
 * @param clazzId
 * @param scheduleId
 * @param clazzTeacherId
 * @param helpTeacherId
 * @param date
 * @param timePeriodId
 * @param remark
 * @param colorCode
 * @param caSclazzScheduleId
 * @returns {AxiosPromise}
 */
export function updateScheduleDetail ({ clazzId, scheduleId, clazzTeacherId, helpTeacherId, date, timePeriodId, remark, colorCode, teachTeacherId, caSclazzScheduleId }) {
  return request({
    url: `/newdaycare/ca_sclazz_schedule/${caSclazzScheduleId}`,
    method: 'put',
    data: { clazzId, scheduleId, helpTeacherId, teachTeacherId, date, timePeriodId, remark, colorCode, clazzTeacherId }
  })
}

/**
 * 复制一周日程
 * @param sourceDate
 * @param sourceClazzId
 * @param targetClazzIdList
 * @returns {AxiosPromise}
 */
export function createCopySchedule ({ sourceDate, sourceClazzId, targetClazzIdList }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule/copy_week',
    method: 'post',
    data: { sourceDate, sourceClazzId, targetClazzIdList }
  })
}

/**
 * 批量添加日程
 * @param clazzId
 * @param scheduleId
 * @param clazzTeacherId
 * @param helpTeacherId
 * @param teachTeacherId
 * @param date
 * @param timePeriodId
 * @param remark
 * @param colorCode
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param courseTimePeriodIdList
 * @returns {AxiosPromise}
 */
export function createMultipleCreate ({ clazzId, scheduleId, clazzTeacherId, helpTeacherId, teachTeacherId, date, timePeriodId, remark, colorCode, startDate, endDate, weekdayList, courseTimePeriodIdList }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule/batch',
    method: 'post',
    data: {
      clazzId,
      scheduleId,
      clazzTeacherId,
      helpTeacherId,
      teachTeacherId,
      date,
      timePeriodId,
      remark,
      colorCode,
      startDate,
      endDate,
      weekdayList,
      courseTimePeriodIdList
    }
  })
}

/* 托育排课接口 */

/**
 * 删除托育课程时段
 * @param courseTimePeriodId
 * @returns {AxiosPromise}
 */
export function removeCaScheduleCourseTime ({ caScourseTimePeriodId }) {
  return request({
    url: `/newdaycare/ca_scourse_time_period/${caScourseTimePeriodId}`,
    method: 'delete',
    data: { caScourseTimePeriodId }
  })
}

/**
 * 查询托育课程时段列表
 * @returns {AxiosPromise}
 */
export function queryCaScheduleCourseTime () {
  return request({
    url: '/newdaycare/ca_scourse_time_period',
    method: 'get',
    params: {}
  })
}

/**
 * 新增早教课程时段
 * @param
 * @param startTime
 * @param endTime
 * @param serialNo
 * @returns {AxiosPromise}
 */
export function createCaScheduleCourseTime ({ startTime, endTime, serialNo }) {
  return request({
    url: '/newdaycare/ca_scourse_time_period',
    method: 'post',
    data: { startTime, endTime, serialNo }
  })
}

/**
 * 更新早教课程时段
 * @param endTime
 * @param startTime
 * @param serialNo
 * @param
 * @param courseTimePeriodId
 * @returns {AxiosPromise}
 */
export function updateCaScheduleCourseTime ({ endTime, startTime, serialNo, caScourseTimePeriodId }) {
  return request({
    url: `/newdaycare/ca_scourse_time_period/${caScourseTimePeriodId}`,
    method: 'put',
    data: { endTime, startTime, serialNo }
  })
}

/**
 * 早教课时排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function updateCaScheduleCourseTimeSort ({ ids }) {
  return request({
    url: '/newdaycare/ca_scourse_time_period/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 查询课表日视图
 * @param date
 * @param courseName
 * @param roomName
 * @param teacherName
 * @returns {AxiosPromise}
 */
export function queryScheduleTimeForDay ({ date, courseName, roomName, teacherName }) {
  return request({
    url: '/newdaycare/course_management/day_view',
    method: 'get',
    params: { date, courseName, roomName, teacherName }
  })
}

/**
 * 查询课表日视图
 * @param date
 * @param viewEnum
 * @param courseName
 * @param roomName
 * @param teacherName
 * @returns {AxiosPromise}
 */
export function queryCaScheduleTimeForWeek ({ date, viewEnum, courseName, roomName, teacherName }) {
  return request({
    url: '/newdaycare/ca_scourse_management/week_view',
    method: 'get',
    params: { date, viewEnum, courseName, roomName, teacherName }
  })
}

/**
 * 新增早教排课管理
 * @param courseId 课程id
 * @param clazzId 班级id
 * @param classsroomId 教室id
 * @param teacherId 授课老师id
 * @param helperTeacherIds 助教老师ids 多个助教,用逗号分割
 * @param courseDate 上课日期
 * @param colorCode 背景颜色
 * @param courseTimePeriodId 课程时段id
 * @param formalChildIdList 正式学员id列表
 * @param expChildIdList 体验学员id列表
 * @returns {AxiosPromise}
 */
export function createCaScheduleOfCourse ({ courseId, clazzId, classsroomId, teacherId, helperTeacherIds, courseDate, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList }) {
  return request({
    url: '/newdaycare/ca_scourse_management',
    method: 'post',
    data: {
      courseId,
      clazzId,
      classsroomId,
      teacherId,
      helperTeacherIds,
      courseDate,
      colorCode,
      courseTimePeriodId,
      formalChildIdList,
      expChildIdList
    }
  })
}

/**
 * 批量排课
 * @param courseId
 * @param clazzId
 * @param classsroomId
 * @param teacherId
 * @param helperTeacherIds
 * @param colorCode
 * @param formalChildIdList
 * @param expChildIdList
 * @param startDate
 * @param endDate
 * @param weekdayList
 * @param courseTimePeriodIdList
 * @returns {AxiosPromise}
 */
export function createCaBatchScheduleOfCourse ({ courseId, clazzId, classsroomId, teacherId, helperTeacherIds, colorCode, formalChildIdList, expChildIdList, startDate, endDate, weekdayList, courseTimePeriodIdList }) {
  return request({
    url: '/newdaycare/ca_scourse_management/batch_save',
    method: 'post',
    data: {
      courseId,
      clazzId,
      classsroomId,
      teacherId,
      helperTeacherIds,
      colorCode,
      formalChildIdList,
      expChildIdList,
      startDate,
      endDate,
      weekdayList,
      courseTimePeriodIdList
    }
  })
}

/**
 * 更新课程
 * @param courseManagementId 主键
 * @param courseId
 * @param clazzId
 * @param classsroomId
 * @param teacherId
 * @param helperTeacherIds
 * @param courseDate
 * @param colorCode
 * @param courseTimePeriodId
 * @param formalChildIdList
 * @param expChildIdList
 * @returns {AxiosPromise}
 */
export function updateCaScheduleOfCourse ({ caScourseManagementId, courseId, clazzId, classsroomId, teacherId, helperTeacherIds, courseDate, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList }) {
  return request({
    url: `/newdaycare/ca_scourse_management/${caScourseManagementId}`,
    method: 'put',
    data: {
      courseId,
      clazzId,
      classsroomId,
      teacherId,
      helperTeacherIds,
      courseDate,
      colorCode,
      courseTimePeriodId,
      formalChildIdList,
      expChildIdList
    }
  })
}

/**
 * 复制单节课程
 * @param targetSDate 目标天
 * @param copyFormalChild 是否复制正式学员
 * @param copyExpChild
 * @param courseManagementId
 * @param courseTimePeriodId
 * @returns {AxiosPromise}
 */
export function createCaCopyCourse ({ targetSDate, copyFormalChild, copyExpChild, courseManagementId, courseTimePeriodId }) {
  return request({
    url: '/newdaycare/ca_scourse_management/copy_one_course',
    method: 'post',
    data: { targetSDate, copyFormalChild, copyExpChild, courseManagementId, courseTimePeriodId }
  })
}

/**
 * 复制单日课程
 * @param copyFormalChild
 * @param targetDate
 * @param sourceDate
 * @returns {AxiosPromise}
 */
export function createCaCopyCourseForDay ({ copyFormalChild, targetDate, sourceDate }) {
  return request({
    url: '/newdaycare/ca_scourse_management/copy_day_course',
    method: 'post',
    data: { copyFormalChild, targetDate, sourceDate }
  })
}

/**
 * 查询课程详情
 * @param courseManagementId
 * @returns {AxiosPromise}
 */
export function queryCaCourseDetailById ({ caScourseManagementId }) {
  return request({
    url: `/newdaycare/ca_scourse_management/${caScourseManagementId}`,
    method: 'get',
    params: { caScourseManagementId }
  })
}

/**
 * 删除课程
 * @param courseManagementId
 * @returns {AxiosPromise}
 */
export function removeCaCourseById ({ caScourseManagementId }) {
  return request({
    url: `/newdaycare/ca_scourse_management/${caScourseManagementId}`,
    method: 'delete',
    data: { caScourseManagementId }
  })
}

/**
 * 复制周课表
 * @param copyFormalChild
 * @param targetEndDate
 * @param targetStartDate
 * @param sourceStartDate
 * @returns {AxiosPromise}
 */
export function createCaCopyWeekCourse ({ copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }) {
  return request({
    url: '/newdaycare/ca_scourse_management/copy_week_course',
    method: 'post',
    data: { copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }
  })
}

/**
 * 验证复制排课
 * @param sourceStartDate
 * @param targetEndDate
 * @param targetStartDate
 * @param copyFormalChild
 * @returns {AxiosPromise}
 */
export function queryCheckCopy ({ sourceStartDate, targetEndDate, targetStartDate, copyFormalChild }) {
  return request({
    url: '/newdaycare/ca_scourse_management/check_copy_week_course',
    method: 'post',
    data: { sourceStartDate, targetEndDate, targetStartDate, copyFormalChild }
  })
}

/**
 * 二次确认复制一周日程
 * @param sourceDate
 * @param sourceClazzId
 * @param targetClazzIdList
 * @returns {AxiosPromise}
 */
export function createCheckCopyWeek ({ sourceDate, sourceClazzId, targetClazzIdList }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule/check_copy_week',
    method: 'post',
    data: { sourceDate, sourceClazzId, targetClazzIdList }
  })
}

/**
 * 二次确认批量排课
 */
export function createCheckBatchAdd ({ clazzId, scheduleId, teachTeacherId, clazzTeacherId, helpTeacherId, date, remark, colorCode, endDate, startDate, weekdayList, courseTimePeriodIdList }) {
  return request({
    url: '/newdaycare/ca_sclazz_schedule/check_batch',
    method: 'post',
    data: { clazzId, scheduleId, teachTeacherId, clazzTeacherId, helpTeacherId, date, remark, colorCode, endDate, startDate, weekdayList, courseTimePeriodIdList }
  })
}
