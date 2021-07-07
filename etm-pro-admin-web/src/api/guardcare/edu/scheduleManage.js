import request from '@/utils/request'
// const aa = 'http://192.168.7.54:3000/mock/125'

/**
 * 查询特色课程课表课表列表时间视图
 * */
export function getScheduleTimeView(params) {
  return request({
    url: '/guardcare/educational/course/special/schedule/time_view',
    method: 'get',
    params
  })
}

/**
 * 查询特色课程课表课表列表班级视图
 * */
export function getScheduleClazzView(params) {
  return request({
    url: '/guardcare/educational/course/special/schedule/clazz_view',
    method: 'get',
    params
  })
}

/**
 * 保存特色课程排课
 * */
export function postSchedule(data) {
  return request({
    url: '/guardcare/educational/course/special/schedule/batch',
    method: 'post',
    data
  })
}

/**
 * 修改特色课程排课
 * */
export function putSchedule(data, id) {
  return request({
    url: `/guardcare/educational/course/special/schedule/batch/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除特色课程排课
 * */
export function delSchedule(id) {
  return request({
    url: `/guardcare/educational/course/special/schedule/batch/${id}`,
    method: 'delete'
  })
}

/**
 * 获取特色课程排课详情
 * */
export function getScheduleItem(id) {
  return request({
    url: `/guardcare/educational/course/special/schedule/batch/${id}`,
    method: 'get'
  })
}

/**
 * ------
 * 查询课表时间段设置列表
 * */
export function getScheduleTimeSetting(params) {
  return request({
    url: '/guardcare/educational/course/schedule/time_setting',
    method: 'get',
    params
  })
}

/**
 * 保存课表时间段设置
 * */
export function postScheduleTimeSetting(data) {
  return request({
    url: '/guardcare/educational/course/schedule/time_setting',
    method: 'post',
    data
  })
}

/**
 * 修改课表时间段设置
 * */
export function putScheduleTimeSetting(data, id) {
  return request({
    url: `/guardcare/educational/course/schedule/time_setting/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新课表时间段设置排序
 * */
export function putScheduleTimeSettingSort(data) {
  return request({
    url: `/guardcare/educational/course/schedule/time_setting/sort_index`,
    method: 'put',
    data
  })
}

/**
 * 删除特色课程排课
 * */
export function delScheduleTimeSetting(id) {
  return request({
    url: `/guardcare/educational/course/schedule/time_setting/${id}`,
    method: 'delete'
  })
}

/**
 * ----------
 * 查询学期周次列表
 * */
export function getSemesterWeekSetting(params) {
  return request({
    url: '/guardcare/educational/course/term/week',
    method: 'get',
    params
  })
}

/**
 * ----------
 * 查询学期列表
 * */
export function getSemesterSetting(params) {
  return request({
    url: '/guardcare/educational/course/term',
    method: 'get',
    params
  })
}

/**
 * 保存学期
 * */
export function postSemesterSetting(data) {
  return request({
    url: '/guardcare/educational/course/term',
    method: 'post',
    data
  })
}

/**
 * 更新学期
 * */
export function putSemesterSetting(data, id) {
  return request({
    url: `/guardcare/educational/course/term/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新学期排序
 * */
export function putSemesterSettingSort(data) {
  return request({
    url: `/guardcare/educational/course/term/sort_index`,
    method: 'put',
    data
  })
}

/**
 * 删除学期
 * */
export function delSemesterSetting(id) {
  return request({
    url: `/guardcare/educational/course/term/${id}`,
    method: 'delete'
  })
}

/**
 * ----------
 * 查询课程科目列表
 * */
export function getSubjectSetting(params) {
  return request({
    url: '/guardcare/educational/course/subject',
    method: 'get',
    params
  })
}

/**
 * 保存课程科目
 * */
export function postSubjectSetting(data) {
  return request({
    url: '/guardcare/educational/course/subject',
    method: 'post',
    data
  })
}

/**
 * 更新课程科目
 * */
export function putSubjectSetting(data, id) {
  return request({
    url: `/guardcare/educational/course/subject/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新课程科目排序
 * */
export function putSubjectSettingSort(data) {
  return request({
    url: `/guardcare/educational/course/subject/sort_index`,
    method: 'put',
    data
  })
}

/**
 * 删除课程科目
 * */
export function delSubjectSetting(id) {
  return request({
    url: `/guardcare/educational/course/subject/${id}`,
    method: 'delete'
  })
}

/**
 * ---------
 * 查询班级课表
 * */
export function getScheduleClazz(params) {
  return request({
    url: '/guardcare/educational/course/schedule',
    method: 'get',
    params
  })
}

/**
 * 保存班级课表
 * */
export function postScheduleClazz(data) {
  return request({
    url: '/guardcare/educational/course/schedule',
    method: 'post',
    data
  })
}

/**
 * 修改班级课表
 * */
export function putScheduleClazz(data, id) {
  return request({
    url: `/guardcare/educational/course/schedule/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除班级课表
 * */
export function delScheduleClazz(id) {
  return request({
    url: `/guardcare/educational/course/schedule/${id}`,
    method: 'delete'
  })
}

/**
 * 获取班级课表详情
 * */
export function getScheduleClazzItem(id) {
  return request({
    url: `/guardcare/educational/course/schedule/${id}`,
    method: 'get'
  })
}

/**
 * ---------
 * 查询每周计划
 * */
export function getScheduleWeek(params) {
  return request({
    url: '/guardcare/educational/course/schedule/term/week',
    method: 'get',
    params
  })
}

/**
 * 保存每周计划
 * */
export function postScheduleWeek(data) {
  return request({
    url: '/guardcare/educational/course/schedule/term/week',
    method: 'post',
    data
  })
}

/**
 * 修改每周计划
 * */
export function putScheduleWeek(data, id) {
  return request({
    url: `/guardcare/educational/course/schedule/term/week/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除每周计划
 * */
export function delScheduleWeek(id) {
  return request({
    url: `/guardcare/educational/course/schedule/term/week/${id}`,
    method: 'delete'
  })
}

/**
 * 获取每周计划
 * */
export function getScheduleWeekItem(id) {
  return request({
    url: `/guardcare/educational/course/schedule/term/week/${id}`,
    method: 'get'
  })
}

/**
 * 获取特色课表报名幼儿
 * */
export function getChildIn(data) {
  return request({
    url: `/guardcare/educational/course/special/schedule/children`,
    method: 'get',
    params: data
  })
}
