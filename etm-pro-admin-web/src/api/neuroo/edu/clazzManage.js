// import Axios from 'axios'
import request from '@/utils/request'
// const request = Axios.create({
//   baseURL: 'http://192.168.7.54:3000/mock/112/',
//   timeout: 300000
//
// })
//
// request.interceptors.request.use(request => {
//   return request
// })
//
// request.interceptors.response.use(response => {
//   return response
// })

/**
 * 查询班级列表并分页
 * @param clazzName 班级名称
 * @param headTeacherName 班主任
 * @param organizationId 园区id
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryClassPage({ clazzName, headTeacherName, schoolId, pageNum, pageSize }) {
  return request({
    url: '/neuroo/clazz',
    method: 'get',
    params: { clazzName, headTeacherName, schoolId, pageNum, pageSize }
  })
}

/**
 * 查询班级列表用于下拉列表
 * @param schoolId
 * @returns {AxiosPromise}
 */
export function queryClazzForSelect({ schoolId }) {
  return request({
    url: `/neuroo/clazz/class_list/${schoolId}`,
    method: 'get'
  })
}

/**
 * 通过clazzID查询班级详情
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function queryClazzByClazzId({ clazzId }) {
  return request({
    url: `/neuroo/clazz/${clazzId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增班级
 * @param schoolId 园区id
 * @param schoolName 园区名称
 * @param clazzName 班级名称
 * @param monthAgeStart
 * @param monthAgeEnd
 * @param fullNumber
 * @param remarks
 * @param headTeacherIds
 * @param teacherIds
 * @returns {AxiosPromise}
 */
export function postClass({ schoolId, schoolName, clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds }) {
  return request({
    url: '/neuroo/clazz',
    method: 'post',
    data: { schoolId, schoolName, clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds }
  })
}

/**
 * 更新班级
 * @param clazzId
 * @param schoolId
 * @param schoolName
 * @param clazzName
 * @param monthAgeStart
 * @param monthAgeEnd
 * @param fullNumber
 * @param remarks
 * @param headTeacherIds
 * @param teacherIds
 * @returns {AxiosPromise}
 */
export function updateClass({ clazzId, clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds }) {
  return request({
    url: `/neuroo/clazz/${clazzId}`,
    method: 'put',
    data: { clazzName, monthAgeStart, monthAgeEnd, fullNumber, remarks, headTeacherIds, teacherIds }
  })
}

/**
 * 班级删除课程 查询班级某段时间内是否有排课
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function queryCanDeleteCourseByClazzId({ clazzId }) {
  return request({
    url: `/neuroo/clazz/find_clazz_schedule/${clazzId}`,
    method: 'get',
    params: { clazzId }
  })
}

/**
 * 删除班级
 * @param clazzId
 * @returns {AxiosPromise}
 */
export function removeClazzByClazzId({ clazzId }) {
  return request({
    url: `/neuroo/clazz/${clazzId}`,
    method: 'delete',
    data: { clazzId }
  })
}
