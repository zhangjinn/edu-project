// import request from './mockRequest'

import request from '../http.js'

/**
 *查询早教表现项列表
 * @param whichPerformedTypeEnum 表现项的类型
 IN_THE_PARK :在园
 AT_HOME :在家
 * @returns {AxiosPromise}
 */
export function queryPerformed({ whichPerformedTypeEnum }) {
  return request({
    url: `/daycare/tcwhich_performed`,
    method: 'get',
    params: { whichPerformedTypeEnum }
  })
}

/**
 *新增早教表现项
 * @param whichPerformedName 名称
 * @param whichPerformedType 表现类型
 * @returns {AxiosPromise}
 */
export function createPerformed({ whichPerformedName, whichPerformedType }) {
  return request({
    url: `/daycare/tcwhich_performed`,
    method: 'post',
    data: { whichPerformedName, whichPerformedType }
  })
}

/**
 *删除早教表现项
 * @param whichPerformedId 早教表现项 ID
 * @returns {AxiosPromise}
 */
export function removePerformed({ whichPerformedId }) {
  return request({
    url: `/daycare/tcwhich_performed/${whichPerformedId}`,
    method: 'delete',
    data: { whichPerformedId }
  })
}

/**
 *根据日期获取早教排课数据
 * @param localDate 日期
 * @returns {AxiosPromise}
 */
export function queryCourseManagement({ localDate }) {
  return request({
    url: `/daycare/tc_reviews/find_courseManagement`,
    method: 'get',
    params: { localDate }
  })
}

/**
 *查询托早教点评学员列表
 * @param whichPerformedType 点评表现枚举
 IN_THE_PARK :在园
 AT_HOME :在家
 * @param courseManagementId 排课id
 * @returns {AxiosPromise}
 */
export function queryStu({ whichPerformedType, courseManagementId }) {
  return request({
    url: `/daycare/tc_reviews`,
    method: 'get',
    params: { whichPerformedType, courseManagementId }
  })
}

/**
 *新增早教点评
 * @param childIdList 学员id
 * @param whichPerformedType 表现类型
 * @param teachersMessage 老师寄语
 * @param imageList 图片
 * @param courseManagementId 排课id
 * @param reviewsWhichPerformedList 表现项
 * @returns {AxiosPromise}
 */
export function createReviews({ childIdList, whichPerformedType, teachersMessage, imageList, courseManagementId, reviewsWhichPerformedList }) {
  return request({
    url: `/daycare/tc_reviews`,
    method: 'post',
    data: { childIdList, whichPerformedType, teachersMessage, imageList, courseManagementId, reviewsWhichPerformedList }
  })
}

/**
 *获取早教点评
 * @param tcreviewsId 早教点评 ID
 * @returns {AxiosPromise}
 */
export function queryReviews({ reviewsId }) {
  return request({
    url: `/daycare/tc_reviews/${reviewsId}`,
    method: 'get'
  })
}

/**
 * 提醒家长
 * @param childId 提醒家长那里需要填这个参数
 * @param type 早教 or 托育
 * @param courseManagementId 排课id
 * @returns {AxiosPromise}
 */
export function queryRemind({ childId, type, courseManagementId }) {
  return request({
    url: `/daycare/cac_reviews/remind_parents`,
    method: 'get',
    params: { childId, type, courseManagementId }
  })
}
