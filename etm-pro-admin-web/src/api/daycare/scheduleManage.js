import request from '@/utils/request'

// import request from '@/api/daycare/mockRequest'
/**
 * 删除早教课程时段
 * @param courseTimePeriodId
 * @returns {AxiosPromise}
 */
export function removeScheduleCourseTime({ courseTimePeriodId }) {
  return request({
    url: `/daycare/course_time_period/${courseTimePeriodId}`,
    method: 'delete',
    data: { courseTimePeriodId }
  })
}

/**
 * 查询早教课程时段列表
 * @returns {AxiosPromise}
 */
export function queryScheduleCourseTime() {
  return request({
    url: `/daycare/course_time_period`,
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
export function createScheduleCourseTime({ startTime, endTime, serialNo }) {
  return request({
    url: `/daycare/course_time_period`,
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
export function updateScheduleCourseTime({ endTime, startTime, serialNo, courseTimePeriodId }) {
  return request({
    url: `/daycare/course_time_period/${courseTimePeriodId}`,
    method: 'put',
    data: { endTime, startTime, serialNo }
  })
}

/**
 * 早教课时排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function updateScheduleCourseTimeSort({ ids }) {
  return request({
    url: `/daycare/course_time_period/sort`,
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
export function queryScheduleTimeForDay({ date, courseName, roomName, teacherName }) {
  return request({
    url: `/daycare/course_management/day_view`,
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
export function queryScheduleTimeForWeek({ date, viewEnum, courseName, roomName, teacherName }) {
  return request({
    url: `/daycare/course_management/week_view`,
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
export function createScheduleOfCourse({ courseId, clazzId, classsroomId, teacherId, helperTeacherIds, courseDate, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList }) {
  return request({
    url: `/daycare/course_management`,
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
export function createBatchScheduleOfCourse({ courseId, clazzId, classsroomId, teacherId, helperTeacherIds, colorCode, formalChildIdList, expChildIdList, startDate, endDate, weekdayList, courseTimePeriodIdList }) {
  return request({
    url: `/daycare/course_management/batch_save`,
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
export function updateScheduleOfCourse({ courseManagementId, courseId, clazzId, classsroomId, teacherId, helperTeacherIds, courseDate, colorCode, courseTimePeriodId, formalChildIdList, expChildIdList }) {
  return request({
    url: `/daycare/course_management/${courseManagementId}`,
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
export function createCopyCourse({ targetSDate, copyFormalChild, copyExpChild, courseManagementId, courseTimePeriodId }) {
  return request({
    url: `/daycare/course_management/copy_one_course`,
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
export function createCopyCourseForDay({ copyFormalChild, targetDate, sourceDate }) {
  return request({
    url: `/daycare/course_management/copy_day_course`,
    method: 'post',
    data: { copyFormalChild, targetDate, sourceDate }
  })
}

/**
 * 查询课程详情
 * @param courseManagementId
 * @returns {AxiosPromise}
 */
export function queryCourseDetailById({ courseManagementId }) {
  return request({
    url: `/daycare/course_management/${courseManagementId}`,
    method: 'get',
    params: { courseManagementId }
  })
}

/**
 * 删除课程
 * @param courseManagementId
 * @returns {AxiosPromise}
 */
export function removeCourseById({ courseManagementId }) {
  return request({
    url: `/daycare/course_management/${courseManagementId}`,
    method: 'delete',
    data: { courseManagementId }
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
export function createCopyWeekCourse({ copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }) {
  return request({
    url: `/daycare/course_management/copy_week_course`,
    method: 'post',
    data: { copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }
  })
}

/**
 * 检查该周是否可以批量排课
 * @param copyFormalChild
 * @param targetEndDate
 * @param targetStartDate
 * @param sourceStartDate
 * @param copyFormalChild
 * @returns {AxiosPromise} bool
 */
export function createCheckCourseOverrideForBatch({ copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }) {
  return request({
    url: `/daycare/course_management/check_copy_week_course`,
    method: 'post',
    data: { copyFormalChild, targetEndDate, targetStartDate, sourceStartDate }
  })
}
