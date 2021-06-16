import request from '@/utils/request'

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param clazzName 班级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function getClazz ({ gradeId, clazzId, clazzName, pageNum, pageSize, paged, noLoadding }) {
  return request({
    url: '/newdaycare/guard/educational/clazz',
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged, noLoadding }
  })
}

/**
 * 批量新增班级
 * @param gradeId 年级id
 * @param clazzes 班级集合
 * @returns {AxiosPromise}
 */
export function postClazz ({ gradeId, clazzes }) {
  return request({
    url: '/newdaycare/guard/educational/clazz/batch_save',
    method: 'post',
    data: { gradeId, clazzes }
  })
}

/**
 * 更新班级
 * @param id
 * @param gradeId 年级id
 * @param name 班级名称
 * @param clazzRoles 班级角色集合
 * @returns {AxiosPromise}
 */
export function putClazz ({ id, gradeId, name, clazzRoles }) {
  return request({
    url: `/newdaycare/guard/educational/clazz/${id}`,
    method: 'put',
    data: { gradeId, name, clazzRoles }
  })
}

/**
 * 删除班级
 * @param id
 * @returns {AxiosPromise}
 */
export function delClazz ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/clazz/${id}`,
    method: 'delete'

  })
}

/**
 * 获取班级详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getClazzItemDetail ({ id }) {
  return request({
    url: `/newdaycare/guard/educational/clazz/${id}`,
    method: 'get'
  })
}

/**
 * 获取年级班级集合
 * @param clazzName 班级名称
 * @returns {AxiosPromise}
 */
export function queryClazzCollection ({ clazzName }) {
  return request({
    url: '/newdaycare/guard/educational/clazz/by_grade',
    method: 'get',
    params: { clazzName }
  })
}

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
