import request from '@/utils/request'

// 查询日程时间列表
export function getTimeSetting(showAll) {
  if (showAll === undefined) {
    showAll = true
  }
  return request({
    url: `/sacc/schedule_time?showAll=${showAll}`,
    method: 'get'
  })
}

// 更新日程时间
export function modifyTimeSetting({ scheduleTimeId, enable, startTime, endTime }) {
  return request({
    url: `/sacc/schedule_time/${scheduleTimeId}`,
    method: 'put',
    data: {
      enable,
      startTime,
      endTime
    }
  })
}

// 查询周程列表
export function queryScheduleList({ clazzName, weekNumber, pageNum, pageSize }) {
  let queryString = ''
  let url = '/sacc/week_schedule'
  if (clazzName !== undefined) {
    queryString += `clazzName=${clazzName}&`
  }
  if (weekNumber !== undefined) {
    queryString += `weekNumber=${weekNumber}&`
  }
  if (pageNum !== undefined) {
    queryString += `pageNum=${pageNum}&`
  }
  if (pageSize !== undefined) {
    queryString += `pageSize=${pageSize}&`
  }
  if (queryString) {
    url += '?' + queryString.slice(0, -1)
  }
  return request({
    url,
    method: 'get'
  })
}

// 删除周程
export function deleteScheduleById({ weekScheduleId }) {
  return request({
    url: `/sacc/week_schedule/${weekScheduleId}`,
    method: 'delete'
  })
}

// 查询班级列表
export function getClassList() {
  return request({
    url: `/sacc/clazz/classList`,
    method: 'get'
  })
}

// 新增周程
export function addSchedule({ clazzId, startDate, weekNumber }) {
  return request({
    url: `/sacc/week_schedule`,
    method: 'post',
    data: {
      clazzId,
      startDate,
      weekNumber
    }
  })
}

// 新增日程项的内容
export function addScheduleContent({ scheduleTimeId, type, scheduleItemContentName, courseId, scheduleId }) {
  return request({
    url: `/sacc/schedule_item_content`,
    method: 'post',
    data: {
      scheduleTimeId,
      type,
      scheduleItemContentName,
      courseId,
      scheduleId
    }
  })
}

// 获取周程状态
export function getScheduleState({ clazzId, weekNumber }) {
  return request({
    url: `/sacc/week_schedule/state?clazzId=${clazzId}&weekNumber=${weekNumber}`,
    method: 'get'
  })
}

// 查询日程类型列表
export function getScheduleTypeList() {
  return request({
    url: `/sacc/schedule_type`,
    method: 'get'
  })
}

// 查询日程内容列表
export function getScheduleContentList({ scheduleTypeId }) {
  return request({
    url: `/sacc/schedule_type/content?scheduleTypeId=${scheduleTypeId}`,
    method: 'get'
  })
}

// 查询课程分类列表
export function getCourseTypeList() {
  return request({
    url: `/sacc/course_category?showAll=false`,
    method: 'get'
  })
}

// 查询启用课程列表
export function getCourseList({ categoryId }) {
  return request({
    url: `/sacc/course/list?categoryId=${categoryId}`,
    method: 'get'
  })
}

// 获取周程详情
export function getScheduleDetail({ weekScheduleId }) {
  return request({
    url: `/sacc/week_schedule/detail?weekScheduleId=${weekScheduleId}`,
    method: 'get'
  })
}

// 删除日程项的内容
export function deleteScheduleItem({ scheduleItemContentId }) {
  return request({
    url: `/sacc/schedule_item_content/${scheduleItemContentId}`,
    method: 'delete'
  })
}

// 复制周程
export function copySchedule({ weekScheduleId, clazzIdList, startDate, weekNumber }) {
  return request({
    url: `/sacc/week_schedule/copy`,
    method: 'put',
    data: {
      weekScheduleId,
      clazzIdList,
      startDate,
      weekNumber
    }
  })
}
