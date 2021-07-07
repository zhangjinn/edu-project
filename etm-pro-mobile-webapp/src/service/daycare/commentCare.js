// import request from './mockRequest'

import request from '../http.js'

/**
 *获取点评频率
 * @returns {AxiosPromise}
 */
export function queryFrequency() {
  return request({
    url: `/daycare/frequency`,
    method: 'get'
  })
}

/**
 *更新点评频率
 * @param frequencyType 频率
 * @returns {AxiosPromise}
 */
export function updateFrequency({ frequencyType }) {
  return request({
    url: `/daycare/frequency`,
    method: 'put',
    data: { frequencyType }
  })
}

/**
 *查询托育表现项列表
 * @param whichPerformedTypeEnum 表现项的类型
 IN_THE_PARK :在园
 AT_HOME :在家
 * @returns {AxiosPromise}
 */
export function queryTypeEnum({ whichPerformedTypeEnum }) {
  return request({
    url: `/daycare/which_performed`,
    method: 'get',
    params: { whichPerformedTypeEnum }
  })
}

/**
 *新增托育表现项
 * @param whichPerformedName 名称
 * @param whichPerformedType 表现类型
 * @returns {AxiosPromise}
 */
export function createPerformed({ whichPerformedName, whichPerformedType }) {
  return request({
    url: `/daycare/which_performed`,
    method: 'post',
    data: { whichPerformedName, whichPerformedType }
  })
}

/**
 * 删除托育表现项
 * @param whichPerformedId 托育表现项 ID
 * @returns {AxiosPromise}
 */
export function removePerformed({ whichPerformedId }) {
  return request({
    url: `/daycare/which_performed/${whichPerformedId}`,
    method: 'delete',
    data: { whichPerformedId }
  })
}

/**
 *根据点评频率获取时间数据
 * @param type 查询实体对象  DAILY :每日一次
 WEEKLY :每周一次
 PER_MONTH :每月一次
 * @returns {AxiosPromise}
 */
export function queryFindByDate({ type }) {
  return request({
    url: `/daycare/cac_reviews/findByDate`,
    method: 'get',
    params: { type }
  })
}

/**
 *根据时间段获取排课数据
 * @param startLocalDate 开始日期
 * @param endLocalDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryClass({ startLocalDate, endLocalDate }) {
  return request({
    url: `/daycare/cac_reviews/find_course/clazz_name_and_course`,
    method: 'get',
    params: { startLocalDate, endLocalDate }
  })
}

/**
 *查询托育点评学员列表
 * @param whichPerformedType 点评表现枚举
 IN_THE_PARK :在园
 AT_HOME :在家
 * @param caScourseManagementId 排课id
 * @param reviewTypeId 点评类型id
 * @param startLocalDate 开始日期
 * @param endLocalDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryReviews({ whichPerformedType, caScourseManagementId, reviewTypeId, startLocalDate, endLocalDate }) {
  return request({
    url: `/daycare/cac_reviews`,
    method: 'get',
    params: { whichPerformedType, caScourseManagementId, reviewTypeId, startLocalDate, endLocalDate }
  })
}

/**
 * 新增托育点评
 * @param childIdList 学员id
 * @param whichPerformedType 表现类型
 * @param teachersMessage 老师寄语
 * @param imageList 图片
 * @param reviewTypeId 点评类型每日/每周/每月
 * @param startLocalDate 开始日期
 * @param endLocalDate 结束日期
 * @param caScourseManagementId 排课id
 * @param reviewsWhichPerformedList 表现项
 * @returns {AxiosPromise}
 */
export function createReviews({ childIdList, whichPerformedType, teachersMessage, imageList, reviewTypeId, startLocalDate, endLocalDate, caScourseManagementId, reviewsWhichPerformedList }) {
  return request({
    url: `/daycare/cac_reviews`,
    method: 'post',
    data: {
      childIdList,
      whichPerformedType,
      teachersMessage,
      imageList,
      reviewTypeId,
      startLocalDate,
      endLocalDate,
      caScourseManagementId,
      reviewsWhichPerformedList
    }
  })
}

/**
 * 获取托育点评
 * @param reviewsId 托育点评 ID
 * @returns {AxiosPromise}
 */
export function queryByReviewsId({ reviewsId }) {
  return request({
    url: `/daycare/cac_reviews/${reviewsId}`,
    method: 'get'
  })
}

/**
 *提醒家长
 * @param childId 提醒家长那里需要填这个参数
 * @param type 早教 or 托育
 * @param courseManagementId 排课id
 * @param reviewTypeId 点评类型每日/每周/每月
 * @param startLocalDate 开始日期
 * @param endLocalDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryRemind({ childId, type, courseManagementId, reviewTypeId, startLocalDate, endLocalDate }) {
  return request({
    url: `/daycare/cac_reviews/remind_parents`,
    method: 'get',
    params: { childId, type, courseManagementId, reviewTypeId, startLocalDate, endLocalDate }
  })
}
