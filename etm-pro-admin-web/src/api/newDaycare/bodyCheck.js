// import request from '@/api/newdaycare/mockRequest'

import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询健康检查应用设置列表
 * @param type 检查类型
 CHECK_TYPE :检查类型
 COMMON_TYPES_OF_SYMPTOMS :常见病状类型
 * @returns {AxiosPromise}
 */
export function queryBodyCheckSetting({ type }) {
  return request({
    url: `/newdaycare/check_settings`,
    method: 'get',
    params: { type }
  })
}

/**
 * 新增 / 修改 健康检查应用设置
 * @param id id 就是修改 不传id就是增加
 * @param checkSettingsName 名称
 * @param type 检查类型
 * @returns {AxiosPromise}
 */
export function createCheckType({ id, checkSettingsName, type }) {
  return request({
    url: `/newdaycare/check_settings`,
    method: 'post',
    data: { id, checkSettingsName, type }
  })
}

/**
 *删除健康检查应用设置
 * @param checkSettingsId 健康检查应用设置 ID
 * @returns {AxiosPromise}
 */
export function removeCheckType({ checkSettingsId }) {
  return request({
    url: `/newdaycare/check_settings/${checkSettingsId}`,
    method: 'delete'
  })
}

/**
 * 检查记录
 * @param date 检查日期
 * @param courseManagementId 排课id
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryBodyCheckList({ date, courseManagementId, clazzId, examinationSettingsId, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/check_inspection_records/find_inspection_records`,
    method: 'get',
    params: { date, courseManagementId, clazzId, examinationSettingsId, pageNum, pageSize }
  })
}

/**
 * 获取检查记录详情
 * @param checkInspectionRecordsId 检查项id
 * @param examinationSettingsId 检查类型的ID
 * @returns {AxiosPromise}
 */
export function queryCheckListDetail({ checkInspectionRecordsId, examinationSettingsId }) {
  return request({
    url: `/newdaycare/check_inspection_records/${checkInspectionRecordsId}`,
    method: 'get',
    params: { examinationSettingsId }
  })
}

/**
 * 异常明细
 * @param date 检查日期
 * @param courseManagementId 排课id
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryAbnormalList({ date, courseManagementId, clazzId, examinationSettingsId, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/check_inspection_records`,
    method: 'get',
    params: { date, clazzId, examinationSettingsId, pageNum, pageSize }
  })
}

/**
 * 异常确认
 * @param checkInspectionRecordsId id
 * @param checkSettingsIds 常见病例id
 * @param bodyTemperature 体温
 * @returns {AxiosPromise}
 */
export function updateAbnormal({ checkInspectionRecordsId, checkSettingsIds, bodyTemperature }) {
  return request({
    url: `/newdaycare/check_inspection_records/${checkInspectionRecordsId}`,
    method: 'put',
    data: { checkInspectionRecordsId, checkSettingsIds, bodyTemperature }
  })
}

/**
 * 导出检查记录
 * @param date 检查日期
 * @param courseManagementId 排课id
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryBodyCheckExcel({ date, courseManagementId, clazzId, examinationSettingsId, pageNum, pageSize }) {
  const url = '/newdaycare/check_inspection_records/find_inspection_records/export'
  return downloadFile({
    method: 'get',
    url,
    params: { date, courseManagementId, clazzId, examinationSettingsId, pageNum, pageSize }
  })
}

/**
 * 导出检查记录详情
 * @param checkInspectionRecordsId 检查项id
 * @returns {AxiosPromise}
 */
export function queryBodyCheckDetailExcel({ checkInspectionRecordsId }) {
  const url = `/newdaycare/check_inspection_records/export/${checkInspectionRecordsId}`
  return downloadFile({ method: 'get', url })
}

/**
 * 导出异常明细
 * @param date 检查日期
 * @param courseManagementId 排课id
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryAbnormalExcel({ date, clazzId, examinationSettingsId, pageNum, pageSize }) {
  const url = '/newdaycare/check_inspection_records/export'
  return downloadFile({
    method: 'get',
    url,
    params: { date, clazzId, examinationSettingsId, pageNum, pageSize }
  })
}

/**
 * 是否启动异常确认设置
 * @returns {AxiosPromise}
 */
export function queryConfig() {
  return request({
    url: `/newdaycare/enterprise_config`,
    method: 'get'
  })
}

/**
 * 是否启动异常确认设置
 * @param enterpriseConfigId id
 * @param * @param enterpriseConfigId 是否启动
 * @returns {AxiosPromise}
 */
export function createConfig({ enterpriseConfigId, content }) {
  return request({
    url: `/newdaycare/enterprise_config/${enterpriseConfigId}`,
    method: 'put',
    data: { content }
  })
}

/**
 * 异常明细详情接口
 * @param checkInspectionRecordsId 查询实体对象
 * @returns {AxiosPromise}
 */
export function queryInspection({ checkInspectionRecordsId }) {
  return request({
    url: `/newdaycare/check_inspection_records/check_inspection_records/${checkInspectionRecordsId}`,
    method: 'get'
  })
}

/**
 * 当天已排课程的托育课程、班级查询   -- > v2 当天已排课程的托育课程
 * @returns {AxiosPromise}
 */
export function queryClass() {
  return request({
    url: `/newdaycare/check_inspection_records/find_course/clazz_name_and_course`,
    method: 'get'
  })
}

/**
 * 检查记录 -- > v2 检查记录 去掉课程信息
 * @param date 检查日期
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryRecords({ date, clazzId, examinationSettingsId, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/check_inspection_records/find_inspection_records`,
    method: 'get',
    params: { date, clazzId, examinationSettingsId, pageNum, pageSize, paged }
  })
}

/**
 * 导出检查记录 -- > v2 检查记录 去掉课程信息
 * @param date 检查日期
 * @param clazzId 班级id
 * @param examinationSettingsId 检查类型id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryExport({ date, clazzId, examinationSettingsId, pageNum, pageSize, paged }) {
  return downloadFile({
    method: 'get',
    url: `/newdaycare/check_inspection_records/find_inspection_records/export`,
    params: { date, clazzId, examinationSettingsId, pageNum, pageSize, paged }
  })
  // return request({
  //   url: `/newdaycare/check_inspection_records/find_inspection_records/export`,
  //   method: 'get',
  //   params: { date, clazzId, examinationSettingsId, pageNum, pageSize, paged }
  // })
}

/**
 * 获取检查记录详情 -- > v2  获取检查记录详情
 * @param clazzId 班级id
 * @param date 检查日期
 * @param examinationSettingsId 检查类型id
 * @returns {AxiosPromise}
 */
export function queryDetail({ clazzId, date, examinationSettingsId }) {
  return request({
    url: `/newdaycare/check_inspection_records/${clazzId}`,
    method: 'get',
    params: { date, examinationSettingsId }
  })
}

/**
 * 导出检查记录详情 -- > v2 获取检查记录详情 条件基本都修改了
 * @param clazzId
 * @param date 检查日期
 * @param examinationSettingsId 检查类型id
 * @returns {AxiosPromise}
 */
export function queryDetailExport({ clazzId, date, examinationSettingsId }) {
  // return request({
  //   url: `/newdaycare/check_inspection_records/export/${clazzId}`,
  //   method: 'get',
  //   params: { date, examinationSettingsId }
  // })
  return downloadFile({
    method: 'get',
    url: `/newdaycare/check_inspection_records/export/${clazzId}`,
    params: { date, examinationSettingsId }
  })
}
