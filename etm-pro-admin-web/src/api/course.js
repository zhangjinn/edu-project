// import axios from 'axios'
// import { Loading } from 'element-ui-etm'
//
// axios.defaults.baseURL = 'http://192.168.7.54:3000/mock/42/'
// const request = axios
// request.interceptors.request.use(req => {
//   Loading.service({ text: '加载中...', background: 'rgba(255,0,0 .5)' })
//   return req
// })
//
// request.interceptors.response.use(res => {
//   Loading.service().close()
//   return res.data
// })
import request from '@/utils/request'

// TODO 课程管理api接口文档

/**
 * @description 获取课程分类
 * @param showAll {boolean} - true:显示全部, false:只显示启用的
 */
export function queryCourseCategorySelect({ showAll = false }) {
  return request({
    url: '/sacc/course_category',
    method: 'get',
    params: { showAll }
  })
}

/**
 * @description 分页获取课程列表
 * @param courseName
 * @param categoryId
 * @param pageNum
 * @param pageSize
 */
export function queryCourseListPage({ courseName, categoryId, pageNum, pageSize }) {
  return request({
    url: '/sacc/course',
    method: 'get',
    params: { courseName, categoryId, pageNum, pageSize }
  })
}

/**
 * @description 新增课程
 * @param courseName {string}
 * @param enable {boolean}
 * @param monthAgeEnd {number} 适用月龄结束
 * @param monthAgeStart {number} 适用月龄开始
 * @param extraAddressArray {string[]} 附件地址数组
 * @param categoryId {string}
 * @param content {string}
 */
export function addCourse({ courseName, enable, monthAgeEnd, monthAgeStart, extraAddressArray, categoryId, content }) {
  return request({
    url: '/sacc/course',
    method: 'post',
    data: { courseName, enable, monthAgeEnd, monthAgeStart, extraAddressArray, categoryId, content }
  })
}

/**
 * @description 更新课程
 * @param courseId
 * @param courseName {string}
 * @param enable {boolean}
 * @param monthAgeEnd {number} 适用月龄结束
 * @param monthAgeStart {number} 适用月龄开始
 * @param extraAddressArray {string[]} 附件地址数组
 * @param categoryId {string}
 * @param content {string}
 */
export function updateCourse({ courseId, courseName, enable, monthAgeEnd, monthAgeStart, extraAddressArray, categoryId, content }) {
  return request({
    url: `/sacc/course/${courseId}`,
    method: 'put',
    data: { courseName, enable, monthAgeEnd, monthAgeStart, extraAddressArray, categoryId, content }
  })
}

/**
 * @description 通过课程ID获取课程详情
 * @param courseId
 */
export function queryCourseDetailById({ courseId }) {
  return request({
    url: `/sacc/course/${courseId}`,
    method: 'get'
  })
}

/**
 * @description 新增课程分类类型
 * @param courseCategoryName {string} 课程名称
 * @param enable {boolean} 是否显示
 */
export function addCategory({ courseCategoryName, enable }) {
  return request({
    url: '/sacc/course_category',
    method: 'post',
    data: { courseCategoryName, enable }
  })
}

/**
 * @description 通过课程类型ID更新课程类型
 * @param courseCategoryId
 * @param courseCategoryName
 * @param enable
 */
export function updateCategoryByCourseCategoryId({ courseCategoryId, courseCategoryName, enable }) {
  return request({
    url: `/sacc/course_category/${courseCategoryId}`,
    method: 'put',
    data: { courseCategoryName, enable }
  })
}

/**
 * @description 删除课程分类
 * @param courseCategoryId
 */
export function deleteCourseTypeByCourseCategoryId({ courseCategoryId }) {
  return request({
    url: `/sacc/course_category/${courseCategoryId}`,
    method: 'delete'
  })
}
