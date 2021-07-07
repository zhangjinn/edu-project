// import request from './mockRequest'

import request from '../http.js'

/**
 *查询某天某老师所有有托育排课的课程
 * @returns {AxiosPromise}
 */
export function queryManagement({ date }) {
  return request({
    url: `/daycare/ca_scourse_management/course_summary_teacher`,
    method: 'get',
    params: { date }
  })
}

/**
 *
 * @returns {AxiosPromise}
 */
export function querySetting() {
  return request({
    url: `/daycare/diary_setting/enable`,
    method: 'get'
  })
}

/**
 *查询当天某老师托育排课的课程下的所有学员
 * @param courseManagementId 排课id
 * @returns {AxiosPromise}
 */
export function queryChildList({ courseManagementId }) {
  return request({
    url: `/daycare/ca_scourse_management/diary_child_list`,
    method: 'get',
    params: { courseManagementId }
  })
}

/**
 * 查询在园日记设置项列表
 * @returns {AxiosPromise}
 */
export function querySettings() {
  return request({
    url: `/daycare/diary_setting`,
    method: 'get'
  })
}

/**
 *新增在园日记设置项
 * @param diarySettingName 名称 设置项名称
 * @param enable 开关
 * @returns {AxiosPromise}
 */
export function createSetting({ diarySettingName, enable }) {
  return request({
    url: `/daycare/diary_setting`,
    method: 'post',
    data: { diarySettingName, enable }
  })
}

/**
 *删除在园日记设置项
 * @param diarySettingId 在园日记设置项 ID
 * @returns {AxiosPromise}
 */
export function removeSetting({ diarySettingId }) {
  return request({
    url: `/daycare/diary_setting/${diarySettingId}`,
    method: 'delete'
  })
}

/**
 *更新在园日记设置项
 * @param diarySettingId 在园日记设置项 ID
 * @param name
 * @param enable
 * @returns {AxiosPromise}
 */
export function updateSetting({ diarySettingId, name, enable }) {
  return request({
    url: `/daycare/diary_setting/${diarySettingId}`,
    method: 'put',
    data: { name, enable }
  })
}

/**
 *BM端查询日记概览
 * @param date
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryOverview({ date, childId }) {
  return request({
    url: `/daycare/diary/overview`,
    method: 'get',
    params: { date, childId }
  })
}

/**
 *查询在园日记列表
 * @param date
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryDiary({ date, childId }) {
  return request({
    url: `/daycare/diary`,
    method: 'get',
    params: { date, childId }
  })
}

/**
 *新增在园日记--自定义项
 * @param description 描述
 * @param startTime 开始时间,
 * @param imageList
 * @param caDiarySettingId 设置项id
 * @param jsonBO
 * @param childIdList
 * @returns {AxiosPromise}
 */
export function createCustomize({ description, startTime, imageList, caDiarySettingId, jsonBO, childIdList }) {
  return request({
    url: `/daycare/diary/customize`,
    method: 'post',
    data: { description, startTime, imageList, caDiarySettingId, jsonBO, childIdList }
  })
}

/**
 * 获取在园日记详情
 * @param diaryId
 * @returns {AxiosPromise}
 */
export function queryByDiaryId({ diaryId }) {
  return request({
    url: `/daycare/diary/${diaryId}`,
    method: 'get'
  })
}

/**
 * 更新在园日记--自定义项
 * @param diaryId
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param jsonBO undefined
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateCustomize({ diaryId, description, startTime, imageList, caDiarySettingId, jsonBO, childIdList }) {
  return request({
    url: `/daycare/diary/customize/${diaryId}`,
    method: 'put',
    data: { description, startTime, imageList, caDiarySettingId, jsonBO, childIdList }
  })
}

/**
 * 新增在园日记--情绪
 * @param jsonBO 换尿片
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createEmotion({ jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/emotion`,
    method: 'post',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 更新在园日记--情绪
 * @param diaryId
 * @param jsonBO 换尿片
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateEmotion({ diaryId, jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/emotion/${diaryId}`,
    method: 'put',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 新增在园日记--喝水
 * @param jsonBO 喝奶或者喝水
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createWater({ jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/water`,
    method: 'post',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 更新在园日记--喝水
 * @param diaryId
 * @param jsonBO 喝奶或者喝水
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateWater({ diaryId, jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/water/${diaryId}`,
    method: 'put',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 新增在园日记--喂奶
 * @param jsonBO 喝奶或者喝水
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createMilk({ jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/milk`,
    method: 'post',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 更新在园日记--喂奶
 * @param diaryId
 * @param jsonBO 喝奶或者喝水
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateMilk({ diaryId, jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/milk/${diaryId}`,
    method: 'put',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 新增在园日记--换尿布
 * @param jsonBO 换尿片
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createDiaper({ jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/change_diaper`,
    method: 'post',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 更新在园日记--换尿布
 * @param diaryId
 * @param jsonBO 换尿片
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateDiaper({ diaryId, jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/change_diaper/${diaryId}`,
    method: 'put',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 获取某日食谱详情
 * @param date 日期
 * @param childIdList 学员id数组
 * @returns {AxiosPromise}
 */
export function queryRecipe({ date, childIdList }) {
  return request({
    url: `/daycare/diary/recipe`,
    method: 'get',
    params: { date, childIdList }
  })
}

/**
 * 新增在园日记--进餐
 * @param jsonBO 进餐
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createEat({ jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/eat`,
    method: 'post',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 更新在园日记--进餐
 * @param diaryId
 * @param jsonBO 进餐
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateEat({ diaryId, jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/eat/${diaryId}`,
    method: 'put',
    data: { jsonBO, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 查询多个学员的最近睡眠日记
 * @param childIdList 学员id数组
 * @param date 日期
 * @returns {AxiosPromise}
 */
export function queryList_sleep({ childIdList, date }) {
  return request({
    url: `/daycare/diary/list_sleep`,
    method: 'get',
    params: { childIdList, date }
  })
}

/**
 * 新增在园日记--睡觉
 * @param jsonBO 睡觉
 * @param endTime 睡眠结束时间 新增时不填
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function createSleep({ jsonBO, endTime, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/sleep`,
    method: 'post',
    data: { jsonBO, endTime, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}

/**
 * 批量更新在园日记--睡觉
 * @param diaryIdList 日记id数组
 * @param jsonBO 睡觉
 * @param endTime 睡眠结束时间 新增时不填
 * @param description 描述
 * @param startTime 开始时间, 非空, DATETIME
 * @param imageList 图片list
 * @param caDiarySettingId 设置项id 更新时非必填
 * @param childIdList 学员id数组  更新时非必填
 * @returns {AxiosPromise}
 */
export function updateSleepALL({ diaryIdList, jsonBO, endTime, description, startTime, imageList, caDiarySettingId, childIdList }) {
  return request({
    url: `/daycare/diary/batch_sleep`,
    method: 'put',
    data: { diaryIdList, jsonBO, endTime, description, startTime, imageList, caDiarySettingId, childIdList }
  })
}
