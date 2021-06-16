import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询班级课程列表
 * @param courseTermId 学期
 * @param gradeId 年级
 * @param name 课程名称
 * @param courseTermWeekId 学期周次
 * @param courseSubjectId 课程科目id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getCourseClazz ({ courseTermId, gradeId, name, courseTermWeekId, courseSubjectId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/course',
    method: 'get',
    params: { courseTermId, gradeId, name, courseTermWeekId, courseSubjectId, pageNum, pageSize, paged }
  })
}

/**
 * 保存班级课程
 * @param courseTermId 学期
 * @param gradeId 年级
 * @param courseTermWeekId 学期周次
 * @param courseSubjectId 科目
 * @param name 课程名称
 * @param attachment 课程图片
 * @param introduction 课程介绍
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function postCourseClazz ({ courseTermId, gradeId, courseTermWeekId, courseSubjectId, name, attachment, introduction, enable }) {
  return request({
    url: '/newdaycare/guard/educational/course',
    method: 'post',
    data: { courseTermId, gradeId, courseTermWeekId, courseSubjectId, name, attachment, introduction, enable }
  })
}

/**
 * 修改班级课程
 * @param id
 * @param courseTermId 学期
 * @param gradeId 年级
 * @param courseTermWeekId 学期周次
 * @param courseSubjectId 科目
 * @param name 课程名称
 * @param attachment 课程图片
 * @param introduction 课程介绍
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function putCourseClazz ({ id, courseTermId, gradeId, courseTermWeekId, courseSubjectId, name, attachment, introduction, enable }) {
  return request({
    url: `/newdaycare/guard/educational/course/${id}`,
    method: 'put',
    data: { courseTermId, gradeId, courseTermWeekId, courseSubjectId, name, attachment, introduction, enable }
  })
}

/**
 * 删除班级课程
 * @param id
 * @returns {AxiosPromise}
 */
export function delCourseClazz ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/${id}`,
    method: 'delete'

  })
}

/**
 * 获取班级课程详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getCourseClazzItem ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/${id}`,
    method: 'get'

  })
}

/**
 * 查询特色课程列表
 * @param name 课程名称
 * @param enable 是否启用
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getCourseSpecial ({ name, enable, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/course/special',
    method: 'get',
    params: { name, enable, pageNum, pageSize, paged }
  })
}

/**
 * 保存特色课程
 * @param name 课程名称
 * @param scheduleColor 课表颜色
 * @param price 课程价格
 * @param courseHour 上课时长
 * @param age 适用年龄
 * @param num 满班人数
 * @param attachment 课程图片
 * @param introduction 课程介绍
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function postCourseSpecial ({ name, scheduleColor, price, courseHour, age, num, attachment, introduction, enable }) {
  return request({
    url: '/newdaycare/guard/educational/course/special',
    method: 'post',
    data: { name, scheduleColor, price, courseHour, age, num, attachment, introduction, enable }
  })
}

/**
 * 修改特色课程
 * @param id
 * @param name 课程名称
 * @param scheduleColor 课表颜色
 * @param price 课程价格
 * @param courseHour 上课时长
 * @param age 适用年龄
 * @param num 满班人数
 * @param attachment 课程图片
 * @param introduction 课程介绍
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function putCourseSpecial ({ id, name, scheduleColor, price, courseHour, age, num, attachment, introduction, enable }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/${id}`,
    method: 'put',
    data: { name, scheduleColor, price, courseHour, age, num, attachment, introduction, enable }
  })
}

/**
 * 删除特色课程
 * @param id
 * @returns {AxiosPromise}
 */
export function delCourseSpecial ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/${id}`,
    method: 'delete'

  })
}

/**
 * 修改特色课程状态
 * @param id
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function putCourseSpecialStatus ({ id, enable }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/${id}/enable`,
    method: 'put',
    data: { enable }
  })
}

/**
 * 获取特色课程详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getCourseSpecialItem ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/course/special/${id}`,
    method: 'get'
  })
}

/**
 * 查询已报名幼儿列表
 * @param specialCourseId 特色课id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getSpecialChild ({ specialCourseId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/guard/educational/course/special/child',
    method: 'get',
    params: { specialCourseId, pageNum, pageSize, paged }
  })
}

/**
 * 导出已报名幼儿excel
 * @param specialCourseId 特色课id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function exportChildExcel ({ specialCourseId, pageNum, pageSize, paged }) {
  // return request({
  //   url: `/newdaycare/guard/educational/course/special/child/export`,
  //   method: 'get',
  //   params: { specialCourseId, pageNum, pageSize, paged }
  // })
  const url = '/newdaycare/guard/educational/course/special/child/export'
  return downloadFile({ method: 'get', url, params: { specialCourseId, pageNum, pageSize, paged } })
}
