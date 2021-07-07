import request from '@/utils/request'
// const aa = 'http://192.168.7.87:3000/mock/146'
/**
 * 获取周程列表
 * */
export function queryWeekScheduleList({ name, startData, endData }) {
  return request({
    url: `/standardcare/listWeekSchedule`,
    method: 'get',
    params: { name, startData, endData }
  })
}

/**
 * 获取日程模板列表
 * */
export function queryWeekScheduleTemplate({ name }) {
  return request({
    url: `/standardcare/template`,
    method: 'get',
    params: { name }
  })
}

/**
 * 创建周程
 * */
export function addWeekSchedule({ clazzIdList, templateId, startDate, endDate }) {
  return request({
    url: '/standardcare/create',
    method: 'post',
    data: { clazzIdList, templateId, startDate, endDate }
  })
}

/**
 * 更换周程
 * */
export function updateWeekSchedule({ oldWeekScheduleId, clazzIdList, templateId, startDate, endDate }) {
  return request({
    url: '/standardcare/change',
    method: 'post',
    data: { oldWeekScheduleId, clazzIdList, templateId, startDate, endDate }
  })
}

/**
 * 删除周程
 * */
export function removeWeekSchedule({ weekScheduleId }) {
  return request({
    url: `/standardcare/${weekScheduleId}`,
    method: 'delete'
  })
}

/**
 * 切换周程详情
 * */
export function queryWeekScheduleDetail({ startDate, endDate, clazzId }) {
  return request({
    url: `/standardcare/view/switch`,
    method: 'get',
    params: { startDate, endDate, clazzId }
  })
}

/**
 * 新增日程项内的内容
 * */
export function addScheduleItemList({ scheduleItemId, content }) {
  return request({
    url: '/standardcare/schedule_item_list',
    method: 'post',
    data: { scheduleItemId, content }
  })
}

/**
 * 更新日程项内的内容
 * */
export function updateScheduleItemList({ scheduleItemListId, scheduleItemId, content }) {
  return request({
    url: `/standardcare/schedule_item_list/${scheduleItemListId}`,
    method: 'put',
    data: { scheduleItemId, content }
  })
}

/**
 * 删除日程项内的内容
 * */
export function removeScheduleItemList({ scheduleItemListId }) {
  return request({
    url: `/standardcare/schedule_item_list/${scheduleItemListId}`,
    method: 'delete'
  })
}

/**
 * 查询托育班级列表
 * */
export function queryCareClazz({ pageNum, pageSize }) {
  return request({
    url: `/standardcare/care_clazz`,
    method: 'get',
    params: { pageNum, pageSize }
  })
}

/**
 * 查询可配置的班级列表
 * */
export function queryCareClazzList() {
  return request({
    url: `/standardcare/care_clazz/type`,
    method: 'get',
    params: { }
  })
}

/**
 * 托育班级设置
 * */
export function careClazzSetting({ clazzIdList }) {
  return request({
    url: '/standardcare/care_clazz/configClazz',
    method: 'post',
    data: { clazzIdList }
  })
}
