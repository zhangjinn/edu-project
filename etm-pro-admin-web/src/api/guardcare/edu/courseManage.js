import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

// const aa = 'http://192.168.7.54:3000/mock/125'
/**
 * 查询特色课程列表
 * */
export function getCourseSpecial(params) {
  return request({
    url: '/guardcare/educational/course/special',
    method: 'get',
    params
  })
}

/**
 * 保存特色课程
 * */
export function postCourseSpecial(data) {
  return request({
    url: '/guardcare/educational/course/special',
    method: 'post',
    data
  })
}

/**
 * 修改特色课程
 * */
export function putCourseSpecial(data, id) {
  return request({
    url: `/guardcare/educational/course/special/${id}`,
    method: 'put',
    data
  })
}

/**
 * 修改特色课程状态
 * */
export function putCourseSpecialStatus(data, id) {
  return request({
    url: `/guardcare/educational/course/special/${id}/enable`,
    method: 'put',
    data
  })
}

/**
 * 删除特色课程
 * */
export function delCourseSpecial(id) {
  return request({
    url: `/guardcare/educational/course/special/${id}`,
    method: 'delete'
  })
}

/**
 * 获取特色课程详情
 * */
export function getCourseSpecialItem(id) {
  return request({
    url: `/guardcare/educational/course/special/${id}`,
    method: 'get'
  })
}

/**
 * ---------
 * 查询班级课程列表
 * */
export function getCourseClazz(params) {
  return request({
    url: '/guardcare/educational/course',
    method: 'get',
    params
  })
}

/**
 * 保存班级课程
 * */
export function postCourseClazz(data) {
  return request({
    url: '/guardcare/educational/course',
    method: 'post',
    data
  })
}

/**
 * 修改班级课程
 * */
export function putCourseClazz(data, id) {
  return request({
    url: `/guardcare/educational/course/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除班级课程
 * */
export function delCourseClazz(id) {
  return request({
    url: `/guardcare/educational/course/${id}`,
    method: 'delete'
  })
}

/**
 * 获取班级课程详情
 * */
export function getCourseClazzItem(id) {
  return request({
    url: `/guardcare/educational/course/${id}`,
    method: 'get'
  })
}

/**
 * 查询已报名幼儿列表
 * */
export function getSpecialChild(params) {
  return request({
    url: `/guardcare/educational/course/special/child`,
    method: 'get',
    params
  })
}

// 导出已报名幼儿excel
export function exportChildExcel(data) {
  const url = '/guardcare/educational/course/special/child/export'
  return downloadFile({ method: 'get', url, params: data })
}
