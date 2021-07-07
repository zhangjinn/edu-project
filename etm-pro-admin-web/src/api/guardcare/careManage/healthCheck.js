import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 新增检查类型
 * @param checkSubjectName
 * @returns {AxiosPromise}
 */
export function createCheckType(checkSubjectName) {
  return request({
    url: '/guardcare/check_subject',
    method: 'post',
    data: { checkSubjectName }
  })
}

/**
 * 更新检查类型
 * @param checkSubjectName
 * @param checkSubjectId
 * @returns {AxiosPromise}
 */
export function updateCheckType({ checkSubjectId, checkSubjectName }) {
  return request({
    url: `/guardcare/check_subject/${checkSubjectId}`,
    method: 'put',
    data: { checkSubjectName }
  })
}

/**
 * 查询检查类型列表
 * @returns {AxiosPromise}
 */
export function queryCheckTypeList() {
  return request({
    url: '/guardcare/check_subject',
    method: 'get'
  })
}

/**
 * 删除检查类型
 * @param checkSubjectId
 * @returns {AxiosPromise}
 */
export function removeCheckType(checkSubjectId) {
  return request({
    url: `/guardcare/check_subject/${checkSubjectId}`,
    method: 'delete'
  })
}

/**
 * 修改检查类型排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function sortCheckTypeList(ids) {
  return request({
    url: '/guardcare/check_subject/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 查询检查项目列表
 * @param id
 * @returns {AxiosPromise}
 */
export function queryCheckItemList() {
  return request({
    url: '/guardcare/check_project',
    method: 'get'
  })
}

/**
 * 新增检查项目
 * @param checkProjectName
 * @returns {AxiosPromise}
 */
export function createCheckItem(checkProjectName) {
  return request({
    url: '/guardcare/check_project',
    method: 'post',
    data: { checkProjectName }
  })
}

/**
 * 更新检查项目
 * @param checkProjectId
 * @param checkProjectName
 * @returns {AxiosPromise}
 */
export function updateCheckItem({ checkProjectId, checkProjectName }) {
  return request({
    url: `/guardcare/check_project/${checkProjectId}`,
    method: 'put',
    data: { checkProjectName }
  })
}

/**
 * 删除检查项目
 * @param checkProjectId
 * @returns {AxiosPromise}
 */
export function removeCheckItem(checkProjectId) {
  return request({
    url: `/guardcare/check_project/${checkProjectId}`,
    method: 'delete'
  })
}

/**
 * 修改检查项目排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function sortCheckItemList(ids) {
  return request({
    url: '/guardcare/check_project/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 获取当前企业的检查设置
 * @returns {AxiosPromise}
 */
export function queryCheckSwitch() {
  return request({
    url: '/guardcare/check_setting',
    method: 'get'
  })
}

/**
 * 更新当前企业的检查设置
 * @param abnormalCheck
 * @returns {AxiosPromise}
 */
export function updateCheckSwitch(abnormalCheck) {
  return request({
    url: '/guardcare/check_setting',
    method: 'put',
    data: { abnormalCheck }
  })
}

/**
 * 查询班级列表
 * @returns {AxiosPromise}
 */
export function queryClazzList() {
  return request({
    url: '/guardcare/educational/clazz',
    method: 'get',
    params: {
      paged: false
    }
  })
}

// -------------------检查记录-------------------
/**
 * 查询检查记录列表
 * @param checkDate 检查日期
 * @param clazzId 班级id
 * @param subject 检查类型
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @returns {AxiosPromise}
 */
export function queryCheckRecordList({ checkDate, clazzId, subject, pageNum, pageSize }) {
  return request({
    url: '/guardcare/check_statistic',
    method: 'get',
    params: { checkDate, clazzId, subject, pageNum, pageSize }
  })
}

// /**
//  * 导出检查记录excel
//  * @param checkDate 检查日期
//  * @param clazzId 班级id
//  * @param subject 检查类型
//  * @param pageNum 当前页码
//  * @param pageSize 每页的记录数
//  * @returns {AxiosPromise}
//  */

// 导出检查记录excel
export function exportCheckRecordListToExcel(data) {
  const url = '/guardcare/check_statistic/export'
  return downloadFile({ method: 'get', url, params: data })
}

// -------------------异常明细-------------------
/**
 * 查询异常检查记录列表
 * @param clazzId 班级id
 * @param date 检查日期
 * @param subject 检查类型
 * @param abnormal 是否异常
 * @param pageNum 当前页码
 * @param pageSize 每页的记录数
 * @param paged 是否分页 默认为true
 * @returns {AxiosPromise}
 */
export function queryAbnoramlCheckList({ clazzId, date, subject, pageNum, pageSize, abnormal, paged = true }) {
  return request({
    url: '/guardcare/check_record',
    method: 'get',
    params: { clazzId, date, subject, pageNum, pageSize, abnormal, paged }
  })
}

// /**
//  * 导出异常检查记录excel
//  * @param clazzId 班级id
//  * @param date 检查日期
//  * @param subject 检查类型
//  * @param pageNum 当前页码
//  * @param pageSize 每页的记录数
//  * @returns {AxiosPromise}
//  */

// 导出异常检查记录excel
export function exportAbnoramlCheckListToExcel(data) {
  const url = '/guardcare/check_record/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 获取检查记录
 * @param checkRecordId
 * @returns {AxiosPromise}
 */
export function queryCheckRecord(checkRecordId) {
  return request({
    url: `/guardcare/check_record/${checkRecordId}`,
    method: 'get'
  })
}

/**
 * 进行异常确认, 只有打开异常确认设置才需要
 * @param date 日期
 * @param subject 检查类型
 * @param symptom 病状
 * @param checkTime 检查时间
 * @param temperature 体温
 * @param mark 备注
 * @param abnormal 是否异常
 * @param imageList 检查图片地址数组
 * @param childId
 * @returns {AxiosPromise}
 */
export function confirmAbnoraml({ checkRecordId, date, subject, symptom, checkTime, temperature, mark, abnormal, imageList, childId }) {
  return request({
    url: `/guardcare/check_record/confirm/${checkRecordId}`,
    method: 'put',
    data: { date, subject, symptom, checkTime, temperature, mark, abnormal, imageList, childId }
  })
}

/**
 * 导出班级检查记录excel
 * @param clazzId 班级id
 * @param date 检查日期
 * @param subject 检查类型
 * @param abnormal 是否异常
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */

export function exportClazzCheckRecordToExcel(data) {
  const url = '/guardcare/check_record/class/export'
  return downloadFile({ method: 'get', url, params: data })
}
