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
//   return res
// })

import request from '@/utils/request'

// TODO 晨午检管理api接口文档

/**
 * @description 查询晨午检统计列表
 * @param date 日期
 * @param type 晨/午检类型
 * @param pageNum
 * @param pageSize
 */
export function queryBodyCheckTotalListPage({ date, checkType, pageNum, pageSize }) {
  return request({
    url: '/sacc/check_statistic/list_check_statistic',
    method: 'get',
    params: { date, checkType, pageNum, pageSize }
  })
}

/**
 * @description 查询异常统计列表
 * @param startDate
 * @param endDate
 * @param type
 * @param pageNum
 * @param pageSize
 */
export function queryBodyCheckAbnormalListPage({ startDate, endDate, checkType, pageNum, pageSize }) {
  return request({
    url: '/sacc/check_statistic/list_abnormal_statistic',
    method: 'get',
    params: { startDate, endDate, checkType, pageNum, pageSize }
  })
}

/**
 * @description 查询个人检测记录列表
 * @param customerName
 * @param clazzId
 * @param startDate
 * @param endDate
 * @param pageNum
 * @param pageSize
 */
export function queryBodyCheckPersonalListPage({ customerName, clazzId, startDate, endDate, pageNum, pageSize }) {
  return request({
    url: '/sacc/customer_check',
    method: 'get',
    params: { customerName, clazzId, startDate, endDate, pageNum, pageSize }
  })
}

/**
 * @description 查询异常统计详情
 * @param clazzId
 * @param startDate
 * @param endDate
 */
export function queryAbnormalDetailByClazzId({ clazzId, checkType, startDate, endDate }) {
  return request({
    url: '/sacc/check_statistic/abnormal_detail',
    method: 'get',
    params: { clazzId, checkType, startDate, endDate }
  })
}

/**
 * @description 查询会员的详情
 * @param customerCheckId
 */
export function queryPersonalDetailByCustomerId({ customerCheckId }) {
  return request({
    url: '/sacc/customer_check/detail',
    method: 'get',
    params: { customerCheckId }
  })
}

/**
 * @description 查询身体检查设置
 */
export function queryBodyCheckSettings() {
  return request({
    url: '/sacc/check_setting',
    method: 'get'
  })
}

/**
 * @description 查询检查项目列表
 * @param enable
 */
export function queryBodyCheckItems({ enable }) {
  return request({
    url: '/sacc/check_project',
    method: 'get',
    params: { enable }
  })
}

/**
 * @description 添加检查项
 * @param checkProjectName
 * @param enable
 * @returns {*}
 */
export function addBodyCheckItem({ checkProjectName, enable }) {
  return request({
    url: '/sacc/check_project',
    method: 'post',
    data: { checkProjectName, enable }
  })
}

/**
 * @description 更新晨午检设置
 * @param checkSettingId
 * @param checkMode
 * @param morningCheckStart
 * @param morningCheckEnd
 * @param middleCheckStart
 * @param middleCheckEnd
 * @param enabledCheckProjects
 */
export function updateBodyCheckSettings({ checkSettingId, checkMode, morningCheckStart, morningCheckEnd, middleCheckStart, middleCheckEnd, enabledCheckProjects }) {
  return request({
    url: `/sacc/check_setting/${checkSettingId}`,
    method: 'put',
    data: { checkMode, morningCheckStart, morningCheckEnd, middleCheckStart, middleCheckEnd, enabledCheckProjects }
  })
}
