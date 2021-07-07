import request from '../http.js'

// 设置页

/**
 * 查询成长记录配置列表
 * @param enable 是否启用
 * @returns {AxiosPromise}
 */
export function querySettingList({ enable }) {
  return request({
    url: `/guardcare/growth_record_config`,
    method: 'get',
    params: { enable }
  })
}

/**
 * 新增成长记录配置
 * @param name 名称
 * @param enable 是否启用
 * @param type 内置类型
 * @returns {AxiosPromise}
 */
export function createSettingItem({ name, enable, type }) {
  return request({
    url: `/guardcare/growth_record_config`,
    method: 'post',
    data: { name, enable, type }
  })
}

/**
 * 更新成长记录配置
 * @param growthRecordConfigId
 * @param name 名称
 * @param enable 是否启用
 * @param type 内置类型
 * @returns {AxiosPromise}
 */
export function updateSettingItem({ growthRecordConfigId, name, enable, type }) {
  return request({
    url: `/guardcare/growth_record_config/${growthRecordConfigId}`,
    method: 'put',
    data: { name, enable, type }
  })
}

/**
 * 删除成长记录配置
 * @param growthRecordConfigId 成长记录配置 ID
 * @returns {AxiosPromise}
 */
export function removeSettingItem({ growthRecordConfigId }) {
  return request({
    url: `/guardcare/growth_record_config/${growthRecordConfigId}`,
    method: 'delete'
  })
}

// 宝贝列表页

/**
 * 查询宝宝列表
 * @param clazzId 班级id
 * @returns {AxiosPromise}
 */
export function queryBabyList({ clazzId }) {
  return request({
    url: `/guardcare/growth_record/list/child`,
    method: 'get',
    params: { clazzId }
  })
}

// 宝贝成长记录列表

/**
 * 查询成长记录列表
 * @param childId 小孩id
 * @param date 记录日期
 * @returns {AxiosPromise}
 */
export function queryBabyRecordBriefList({ childId, date }) {
  return request({
    url: `/guardcare/growth_record`,
    method: 'get',
    params: { childId, date }
  })
}

/**
 * 批量新增成长记录
 * @param childIds 小孩id列表
 * @param name 记录名称
 * @param recordTime 记录时间
 * @param textDesc 文字描述
 * @param ml 毫升(喂奶喝水专用)
 * @param imageList 图片列表
 * @param type 记录类型
 * @param dining 进餐专用参数
 * @param sleeping 睡眠专用参数
 * @param diaperChange 换尿布专用参数
 * @param emotion 情绪专用参数
 * @returns {AxiosPromise}
 */
export function createRecordItem({ childIds, name, recordTime, textDesc, ml, imageList, type, dining, sleeping, diaperChange, emotion }) {
  return request({
    url: `/guardcare/growth_record/batch`,
    method: 'post',
    data: { childIds, name, recordTime, textDesc, ml, imageList, type, dining, sleeping, diaperChange, emotion }
  })
}

/**
 * 批量更新成长记录
 * @param recordIds 记录id列表
 * @param name 记录名称
 * @param recordTime 记录时间
 * @param textDesc 文字描述
 * @param ml 毫升(喂奶喝水专用)
 * @param imageList 图片列表
 * @param type 记录类型
 * @param dining 进餐专用参数
 * @param sleeping 睡眠专用参数
 * @param diaperChange 换尿布专用参数
 * @param emotion 情绪专用参数
 * @returns {AxiosPromise}
 */
export function updateRecordItem({ recordIds, name, recordTime, textDesc, ml, imageList, type, dining, sleeping, diaperChange, emotion }) {
  return request({
    url: `/guardcare/growth_record/batch`,
    method: 'put',
    data: { recordIds, name, recordTime, textDesc, ml, imageList, type, dining, sleeping, diaperChange, emotion }
  })
}

/**
 * 获取成长记录
 * @param growthRecordId 成长记录 ID
 * @returns {AxiosPromise}
 */
export function queryRecordItemDetail({ growthRecordId }) {
  return request({
    url: `/guardcare/growth_record/${growthRecordId}`,
    method: 'get'
  })
}

/**
 * 获取食谱项列表
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryRecipeList({ childId }) {
  return request({
    url: `/guardcare/recipe_item/get_recipe_item_msg`,
    method: 'get',
    params: { childId }
  })
}

/**
 * 查询宝宝日历状态
 * @param childId 客户id
 * @param date 日期
 * @returns {AxiosPromise}
 */
export function queryMonthDaily({ childId, date }) {
  return request({
    url: `/guardcare/growth_record/status`,
    method: 'get',
    params: { childId, date }
  })
}
