import request from '@/utils/request'

// 应用设置日程时段
/**
 * 查询日程时段列表
 * */
export function queryScheduleIntervalList () {
  return request({
    url: '/standardcare/schedule_interval',
    method: 'get',
    params: { }
  })
}

/**
 * 新增日程时段
 * */
export function addScheduleIntervalType ({ startTime, endTime, sort }) {
  return request({
    url: '/standardcare/schedule_interval',
    method: 'post',
    data: { startTime, endTime, sort }
  })
}

/**
 * 更新日程时段
 * */
export function updateScheduleIntervalType ({ scheduleIntervalId, startTime, endTime, sort }) {
  return request({
    url: `/standardcare/schedule_interval/${scheduleIntervalId}`,
    method: 'put',
    data: { startTime, endTime, sort }
  })
}

/**
 * 删除日程时段
 * */
export function removeScheduleIntervalType ({ scheduleIntervalId }) {
  return request({
    url: `/standardcare/schedule_interval/${scheduleIntervalId}`,
    method: 'delete'
  })
}

/**
 * 修改日程时段排序
 * */
export function updateScheduleIntervalSort ({ idList }) {
  return request({
    url: '/standardcare/schedule_interval/sort',
    method: 'put',
    data: { idList }
  })
}

// 应用设置类目
/**
 * 查询日程类目列表
 * */
export function queryScheduleCategoryList () {
  return request({
    url: '/standardcare/schedule_type',
    method: 'get',
    params: { }
  })
}

/**
 * 新增日程类目
 * */
export function addScheduleCategoryType ({ scheduleTypeName, sort }) {
  return request({
    url: '/standardcare/schedule_type',
    method: 'post',
    data: { scheduleTypeName, sort }
  })
}

/**
 * 更新日程类目
 * */
export function updateScheduleCategoryType ({ scheduleTypeId, scheduleTypeName, sort }) {
  return request({
    url: `/standardcare/schedule_type/${scheduleTypeId}`,
    method: 'put',
    data: { scheduleTypeName, sort }
  })
}

/**
 * 删除日程类目
 * */
export function removeScheduleCategoryType ({ scheduleTypeId }) {
  return request({
    url: `/standardcare/schedule_type/${scheduleTypeId}`,
    method: 'delete'
  })
}

/**
 * 修改日程类目排序
 * */
export function updateScheduleCategorySort ({ idList }) {
  return request({
    url: '/standardcare/schedule_type/sort',
    method: 'put',
    data: { idList }
  })
}
// 应用设置标签
/**
 * 查询日程标签列表
 * */
export function queryLabelList () {
  return request({
    url: '/standardcare/schedule_label',
    method: 'get',
    params: { }
  })
}

/**
 * 新增日程标签
 * */
export function addLabelType ({ scheduleLabelName, sort }) {
  return request({
    url: '/standardcare/schedule_label',
    method: 'post',
    data: { scheduleLabelName, sort }
  })
}

/**
 * 更新日程标签
 * */
export function updateLabelType ({ scheduleLabelId, scheduleLabelName, sort }) {
  return request({
    url: `/standardcare/schedule_label/${scheduleLabelId}`,
    method: 'put',
    data: { scheduleLabelName, sort }
  })
}

/**
 * 删除日程标签
 * */
export function removeLabelType ({ scheduleLabelId }) {
  return request({
    url: `/standardcare/schedule_label/${scheduleLabelId}`,
    method: 'delete'
  })
}

/**
 * 修改标签排序
 * */
export function updateLabelSort ({ idList }) {
  return request({
    url: '/standardcare/schedule_label/sort',
    method: 'put',
    data: { idList }
  })
}

// 页面接口
/**
 * 查询周程模板列表
 * */
export function queryWeekScheduleTemplateList ({ name, labelId, pageNum, pageSize, paged = true }) {
  return request({
    url: '/standardcare/week_schedule_template',
    method: 'get',
    params: { name, labelId, pageNum, pageSize, paged }
  })
}

/**
 * 获取周程模板基本信息
 * */
export function queryWeekScheduleTemplateDetail ({ weekScheduleTemplateId }) {
  return request({
    url: `/standardcare/week_schedule_template/${weekScheduleTemplateId}`,
    method: 'get'
  })
}

/**
 * 新增周程模板
 * */
export function addWeekScheduleTemplate ({ weekScheduleTemplateName, labelIdList, coverUrl, mark, bgcolor }) {
  return request({
    url: '/standardcare/week_schedule_template',
    method: 'post',
    data: { weekScheduleTemplateName, labelIdList, coverUrl, mark, bgcolor }
  })
}

/**
 * 更新周程模板
 * */
export function updateWeekScheduleTemplate ({ weekScheduleTemplateName, labelIdList, coverUrl, mark, bgcolor, weekScheduleTemplateId }) {
  return request({
    url: `/standardcare/week_schedule_template/${weekScheduleTemplateId}`,
    method: 'put',
    data: { weekScheduleTemplateName, labelIdList, coverUrl, mark, bgcolor }
  })
}

/**
 * 删除周程模板
 * */
export function removeWeekScheduleTemplate ({ weekScheduleTemplateId }) {
  return request({
    url: `/standardcare/week_schedule_template/${weekScheduleTemplateId}`,
    method: 'delete'
  })
}

/**
 * 查看周程模板
 * */
export function queryGridWeekScheduleTemplate ({ weekScheduleTemplateId }) {
  return request({
    url: `/standardcare/week_schedule_template/view/${weekScheduleTemplateId}`,
    method: 'get'
  })
}

/**
 * 添加｜更新|删除日程项模板, 删除把则类目置为空
 * */
export function updateGridWeekScheduleTemplate ({ scheduleItemTemplateId, scheduleType, scheduleTypeId, bgcolor }) {
  return request({
    url: `/standardcare/week_schedule_template/item/${scheduleItemTemplateId}`,
    method: 'put',
    data: { scheduleType, scheduleTypeId, bgcolor }
  })
}

/**
 * 批量更新日程项模板
 * */
export function updateBatchGridWeekScheduleTemplate ({ scheduleId, intervalId, weeks, scheduleType, scheduleTypeId, bgcolor }) {
  return request({
    url: '/standardcare/week_schedule_template/batch/item',
    method: 'put',
    data: { scheduleId, intervalId, weeks, scheduleType, scheduleTypeId, bgcolor }
  })
}
