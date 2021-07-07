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

// TODO 考勤管理api接口文档

/**
 * @description 查询班级列表分页
 * @param clazzName
 * @param headTeacher
 * @param pageNum
 * @param pageSize
 */
export function queryClazzListPage({ clazzName, headTeacherName, pageNum, pageSize }) {
  return request({
    url: '/sacc/clazz',
    method: 'get',
    params: { clazzName, headTeacherName, pageNum, pageSize }
  })
}

/**
 * @description 新增班级
 * @param clazzName {string}
 * @param fullNumber {string}
 * @param remark {string}
 * @param headTeacherIds {number[]} 班主任集合
 * @param teacherIds {number[]} 老师集合
 * @param customerIds {number[]} 会员集合
 */
export function addClazz({ clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds }) {
  return request({
    url: '/sacc/clazz',
    method: 'post',
    data: { clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds }
  })
}

/**
 * @description 更新班级
 * @param clazzId
 * @param clazzName
 * @param fullNumber
 * @param remark
 * @param headTeacherIds
 * @param teacherIds
 * @param customerIds {number[]} 会员集合
 * @returns {*}
 */
export function updateClazz({ clazzId, clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds }) {
  return request({
    url: `/sacc/clazz/${clazzId}`,
    method: 'put',
    data: { clazzName, fullNumber, remark, headTeacherIds, teacherIds, customerIds }
  })
}

/**
 * @description 通过clazzId查询该班级详情
 * @param clazzId
 */
export function queryClazzDetailById({ clazzId }) {
  return request({
    url: `/sacc/clazz/${clazzId}`,
    method: 'get'
  })
}

/**
 * @description 获取班级下拉
 */
export function queryClazzSelect() {
  return request({
    url: '/sacc/clazz/classList',
    method: 'get'
  })
}

// 删除班级
export function deleteClazzById(clazzId) {
  return request({
    url: `/sacc/clazz/${clazzId}`,
    method: 'delete'
  })
}

// 查询该班级有的会员老师班主任(删除班级前置)
export function getClazzDetail(clazzId) {
  return request({
    url: `/sacc/clazz/judge_customer/${clazzId}`,
    method: 'get'
  })
}
