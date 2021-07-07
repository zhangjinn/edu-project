import request from '@/utils/request'

/**
 * 查询班级课表
 * @param courseTermId 学期
 * @param clazzId 班级
 * @returns {AxiosPromise}
 */
export function getScheduleClazz({ courseTermId, clazzId }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule`,
    method: 'get',
    params: { courseTermId, clazzId }
  })
}

/**
 * 查询学期周次列表
 * @param courseTermId 学期id
 * @returns {AxiosPromise}
 */
export function getSemesterWeekSetting({ courseTermId, noLoadding }) {
  return request({
    url: `/newdaycare/guard/educational/course/term/week`,
    method: 'get',
    params: { courseTermId, noLoadding }
  })
}

/**
 * 保存班级课表
 * @param courseTermId 学期
 * @param gradeId 年级
 * @param clazzId 班级
 * @param scheduleTimeSettingId 时间段
 * @param courseSubjectId 课程科目
 * @param courseScheduleRoleList 课表角色列表
 * @param color 课表颜色
 * @param week 星期
 * @returns {AxiosPromise}
 */
export function postScheduleClazz({ courseTermId, gradeId, clazzId, scheduleTimeSettingId, courseSubjectId, courseScheduleRoleList, color, week }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule`,
    method: 'post',
    data: { courseTermId, gradeId, clazzId, scheduleTimeSettingId, courseSubjectId, courseScheduleRoleList, color, week }
  })
}

/**
 * 修改班级课表
 * @param id
 * @param courseTermId 学期
 * @param gradeId 年级
 * @param clazzId 班级
 * @param scheduleTimeSettingId 时间段
 * @param courseSubjectId 课程科目
 * @param courseScheduleRoleList 课表角色列表
 * @param color 课表颜色
 * @param week 星期
 * @returns {AxiosPromise}
 */
export function putScheduleClazz({ id, courseTermId, gradeId, clazzId, scheduleTimeSettingId, courseSubjectId, courseScheduleRoleList, color, week }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/${id}`,
    method: 'put',
    data: { courseTermId, gradeId, clazzId, scheduleTimeSettingId, courseSubjectId, courseScheduleRoleList, color, week }
  })
}

/**
 * 删除班级课表
 * @param id
 * @returns {AxiosPromise}
 */
export function delScheduleClazz({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/${id}`,
    method: 'delete'
  })
}

/**
 * 查询每周计划
 * @param courseTermId 学期
 * @param clazzId 班级
 * @param courseTermWeekId 周次
 * @returns {AxiosPromise}
 */
export function getScheduleWeek({ courseTermId, clazzId, courseTermWeekId }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/term/week`,
    method: 'get',
    params: { courseTermId, clazzId, courseTermWeekId }
  })
}

/**
 * 保存每周计划
 * @param courseScheduleId 课表id
 * @param courseId 班级课程
 * @param courseTermWeekId 学期周次
 * @param courseTermId 学期
 * @returns {AxiosPromise}
 */
export function postScheduleWeek({ courseScheduleId, courseId, courseTermWeekId, courseTermId }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/term/week`,
    method: 'post',
    data: { courseScheduleId, courseId, courseTermWeekId, courseTermId }
  })
}

/**
 * 修改每周计划
 * @param id
 * @param courseScheduleId 课表id
 * @param courseId 班级课程
 * @param courseTermWeekId 学期周次
 * @param courseTermId 学期
 * @returns {AxiosPromise}
 */
export function putScheduleWeek({ id, courseScheduleId, courseId, courseTermWeekId, courseTermId }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/term/week/${id}`,
    method: 'put',
    data: { courseScheduleId, courseId, courseTermWeekId, courseTermId }
  })
}

/**
 * 获取班级课表详情
 * @param id
 * @returns {AxiosPromise}
 */
export function query({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/${id}`,
    method: 'get'

  })
}

/**
 * 删除每周计划
 * @param id
 * @returns {AxiosPromise}
 */
export function delScheduleWeek({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/term/week/${id}`,
    method: 'delete'

  })
}

/**
 * 获取班级课表详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getScheduleClazzItem({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/${id}`,
    method: 'get'
  })
}

/**
 * 查询教室列表
 * @param roomName 查询实体对象
 * @returns {AxiosPromise}
 */
export function getRoom({ roomName }) {
  return request({
    url: `/newdaycare/room/list`,
    method: 'get',
    params: { roomName }
  })
}

/**
 * 获取每周计划
 * @param id
 * @returns {AxiosPromise}
 */
export function getScheduleWeekItem({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/term/week/${id}`,
    method: 'get'

  })
}

/**
 * 获取特色课程排课详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getScheduleItem({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/batch/${id}`,
    method: 'get'

  })
}

/**
 * 查询特色课程课表课表列表时间视图
 * @param specialCourseId 特色课程id
 * @param roomId 上课场地
 * @param employeeId 授课老师
 * @returns {AxiosPromise}
 */
export function getScheduleTimeView({ specialCourseId, roomId, employeeId, courseTermId }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/time_view`,
    method: 'get',
    params: { specialCourseId, roomId, employeeId, courseTermId }
  })
}

/**
 * 保存特色课程排课
 * @param specialCourseId 特色课程id
 * @param scheduleTimeSettingId 上课时段
 * @param color 课表颜色
 * @param roomId 上课场地
 * @param scheduleWeek 上课周次
 * @param scheduleRoles 上课老师集合
 * @param childIds 上课的幼儿id集合
 * @returns {AxiosPromise}
 */
export function postSchedule({ courseTermId, specialCourseId, scheduleTimeSettingId, color, roomId, scheduleWeek, scheduleRoles, childIds }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/batch`,
    method: 'post',
    data: { courseTermId, specialCourseId, scheduleTimeSettingId, color, roomId, scheduleWeek, scheduleRoles, childIds }
  })
}

/**
 * 修改特色课程排课
 * @param id
 * @param specialCourseId 特色课程id
 * @param scheduleTimeSettingId 上课时段
 * @param color 课表颜色
 * @param roomId 上课场地
 * @param scheduleWeek 上课周次
 * @param scheduleRoles 上课老师集合
 * @param childIds 上课的幼儿id集合
 * @returns {AxiosPromise}
 */
export function putSchedule({ id, courseTermId, specialCourseId, scheduleTimeSettingId, color, roomId, scheduleWeek, scheduleRoles, childIds }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/batch/${id}`,
    method: 'put',
    data: { courseTermId, specialCourseId, scheduleTimeSettingId, color, roomId, scheduleWeek, scheduleRoles, childIds }
  })
}

/**
 * 删除特色课程排课
 * @param id
 * @returns {AxiosPromise}
 */
export function delSchedule({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/batch/${id}`,
    method: 'delete'
  })
}

/**
 * 获取特色课表报名幼儿
 * @param childName 幼儿姓名
 * @param specialCourseId 特色课程id
 * @returns {AxiosPromise}
 */
export function getChildIn({ childName, specialCourseId }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/children`,
    method: 'get',
    params: { childName, specialCourseId }
  })
}

/**
 * 查询特色课程课表课表列表班级视图
 * @param specialCourseId 特色课程id
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @returns {AxiosPromise}
 */
export function getScheduleClazzView({ specialCourseId, gradeId, clazzId, courseTermId }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/schedule/clazz_view`,
    method: 'get',
    params: { specialCourseId, gradeId, clazzId, courseTermId }
  })
}

/**
 * 更新课表时间段设置排序
 * @param type 类型
 * @param scheduleTimeSettingList 课表时间段设置集合
 * @returns {AxiosPromise}
 */
export function putScheduleTimeSettingSort({ type, scheduleTimeSettingList }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/time_setting/sort_index`,
    method: 'put',
    data: { type, scheduleTimeSettingList }
  })
}

/**
 * 查询课表时间段设置列表
 * @param type 类型
 COURSE :班级课表
 SPECIAL_COURSE :特色课程课表
 * @returns {AxiosPromise}
 */
export function getScheduleTimeSetting({ type }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/time_setting`,
    method: 'get',
    params: { type }
  })
}

/**
 * 保存课表时间段设置
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param sortIndex 排序号
 * @param type 类型
 * @returns {AxiosPromise}
 */
export function postScheduleTimeSetting({ startTime, endTime, sortIndex, type }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/time_setting`,
    method: 'post',
    data: { startTime, endTime, sortIndex, type }
  })
}

/**
 * 修改课表时间段设置
 * @param id
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param sortIndex 排序号
 * @param type 类型
 * @returns {AxiosPromise}
 */
export function putScheduleTimeSetting({ id, startTime, endTime, sortIndex, type }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/time_setting/${id}`,
    method: 'put',
    data: { startTime, endTime, sortIndex, type }
  })
}

/**
 * 删除课表时间段设置
 * @param id
 * @returns {AxiosPromise}
 */
export function delScheduleTimeSetting({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/schedule/time_setting/${id}`,
    method: 'delete'

  })
}

/**
 * 查询课程科目列表
 * @returns {AxiosPromise}
 */
export function getSubjectSetting() {
  return request({
    url: `/newdaycare/guard/educational/course/subject`,
    method: 'get'

  })
}

/**
 * 保存课程科目
 * @param name 课程科目名称
 * @param sortIndex 排序号
 * @returns {AxiosPromise}
 */
export function postSubjectSetting({ name, sortIndex }) {
  return request({
    url: `/newdaycare/guard/educational/course/subject`,
    method: 'post',
    data: { name, sortIndex }
  })
}

/**
 * 更新课程科目
 * @param id
 * @param name 课程科目名称
 * @param sortIndex 排序号
 * @returns {AxiosPromise}
 */
export function putSubjectSetting({ id, name, sortIndex }) {
  return request({
    url: `/newdaycare/guard/educational/course/subject/${id}`,
    method: 'put',
    data: { name, sortIndex }
  })
}

/**
 * 删除课程科目
 * @param id
 * @returns {AxiosPromise}
 */
export function delSubjectSetting({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/subject/${id}`,
    method: 'delete'

  })
}

/**
 * 更新课程科目排序
 * @param courseSubjectList 班级课程科目集合
 * @returns {AxiosPromise}
 */
export function putSubjectSettingSort({ courseSubjectList }) {
  return request({
    url: `/newdaycare/guard/educational/course/subject/sort_index`,
    method: 'put',
    data: { courseSubjectList }
  })
}

/**
 * 查询学期列表
 * @returns {AxiosPromise}
 */
export function getSemesterSetting(params) {
  return request({
    url: `/newdaycare/guard/educational/course/term`,
    method: 'get',
    params: params
  })
}

/**
 * 更新当前学期
 * @returns {AxiosPromise}
 */
export function updateCurrentSemesterSetting({ id, currentTerm }) {
  return request({
    url: `/newdaycare/guard/educational/course/term/${id}/current`,
    method: 'put',
    data: { currentTerm }
  })
}

/**
 * 保存学期
 * @param name 学期名称
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function postSemesterSetting({ name, startDate, endDate }) {
  return request({
    url: `/newdaycare/guard/educational/course/term`,
    method: 'post',
    data: { name, startDate, endDate }
  })
}

/**
 * 更新学期
 * @param id
 * @param name 学期名称
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function putSemesterSetting({ id, name, startDate, endDate }) {
  return request({
    url: `/newdaycare/guard/educational/course/term/${id}`,
    method: 'put',
    data: { name, startDate, endDate }
  })
}

/**
 * 删除学期
 * @param id
 * @returns {AxiosPromise}
 */
export function delSemesterSetting({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/term/${id}`,
    method: 'delete'

  })
}

/**
 * 更新学期排序
 * @param courseSubjectList 班级课程学期集合
 * @returns {AxiosPromise}
 */
export function putSemesterSettingSort({ courseSubjectList }) {
  return request({
    url: `/newdaycare/guard/educational/course/term/sort_index`,
    method: 'put',
    data: { courseSubjectList }
  })
}
