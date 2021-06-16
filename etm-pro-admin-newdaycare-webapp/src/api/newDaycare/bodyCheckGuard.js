import request from '@/utils/request'
import { downloadFile } from '@/api/base/base'

/**
 * 查询班级列表
 * @param gradeId 年级id
 * @param clazzId 班级id
 * @param clazzName 班级名称
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryClazzList ({ gradeId, clazzId, clazzName, pageNum, pageSize, paged = false }) {
  return request({
    url: '/newdaycare/guard/educational/clazz',
    method: 'get',
    params: { gradeId, clazzId, clazzName, pageNum, pageSize, paged }
  })
}

/* -----------------------------检查设置----------------------------- */

/**
 * 获取当前企业的检查设置
 * @returns {AxiosPromise}
 */
export function queryOddSureSetting () {
  return request({
    url: '/newdaycare/guard/check_setting',
    method: 'get'
  })
}

/**
 * 更新当前企业的检查设置
 * @param abnormalCheck 是否需要异常二次确认
 * @returns {AxiosPromise}
 */
export function updateOddSureSetting ({ abnormalCheck }) {
  return request({
    url: '/newdaycare/guard/check_setting',
    method: 'put',
    data: { abnormalCheck }
  })
}

/**
 * 查询检查类型列表
 * @returns {AxiosPromise}
 */
export function queryCheckTypeList () {
  return request({
    url: '/newdaycare/guard/check_subject',
    method: 'get'
  })
}

/**
 * 新增检查类型
 * @param checkSubjectName 检查类型
 * @returns {AxiosPromise}
 */
export function createCheckTypeListItem ({ checkSubjectName }) {
  return request({
    url: '/newdaycare/guard/check_subject',
    method: 'post',
    data: { checkSubjectName }
  })
}

/**
 * 更新检查类型
 * @param checkSubjectId
 * @param checkSubjectName 检查类型
 * @returns {AxiosPromise}
 */
export function updateCheckTypeListItem ({ checkSubjectId, checkSubjectName }) {
  return request({
    url: `/newdaycare/guard/check_subject/${checkSubjectId}`,
    method: 'put',
    data: { checkSubjectName }
  })
}

/**
 * 删除检查类型
 * @param checkSubjectId 检查类型 ID
 * @returns {AxiosPromise}
 */
export function removeCheckTypeListItem ({ checkSubjectId }) {
  return request({
    url: `/newdaycare/guard/check_subject/${checkSubjectId}`,
    method: 'delete'
  })
}

/**
 * 修改检查类型排序
 * @param ids id列表, 后端按list顺序进行排序
 * @returns {AxiosPromise}
 */
export function updateCheckTypeListSort ({ ids }) {
  return request({
    url: '/newdaycare/guard/check_subject/sort',
    method: 'put',
    data: { ids }
  })
}

/**
 * 查询检查项目列表
 * @returns {AxiosPromise}
 */
export function queryOddTypeList () {
  return request({
    url: '/newdaycare/guard/check_project',
    method: 'get'
  })
}

/**
 * 新增检查项目
 * @param checkProjectName 名称
 * @returns {AxiosPromise}
 */
export function createOddTypeListItem ({ checkProjectName }) {
  return request({
    url: '/newdaycare/guard/check_project',
    method: 'post',
    data: { checkProjectName }
  })
}

/**
 * 更新检查项目
 * @param checkProjectId
 * @param checkProjectName 名称
 * @returns {AxiosPromise}
 */
export function updateOddTypeListItem ({ checkProjectId, checkProjectName }) {
  return request({
    url: `/newdaycare/guard/check_project/${checkProjectId}`,
    method: 'put',
    data: { checkProjectName }
  })
}

/**
 * 删除检查项目
 * @param checkProjectId 检查项目 ID
 * @returns {AxiosPromise}
 */
export function removeOddTypeListItem ({ checkProjectId }) {
  return request({
    url: `/newdaycare/guard/check_project/${checkProjectId}`,
    method: 'delete'
  })
}

/**
 * 修改检查项目排序
 * @param ids id列表, 后端按list顺序进行排序
 * @returns {AxiosPromise}
 */
export function updateOddTypeListSort ({ ids }) {
  return request({
    url: '/newdaycare/guard/check_project/sort',
    method: 'put',
    data: { ids }
  })
}

/* -----------------------------检查记录----------------------------- */

/**
 * 查询检查记录列表
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
export function queryCheckList ({ clazzId, date, subject, abnormal, pageNum, pageSize, paged = true }) {
  return request({
    url: '/newdaycare/guard/check_record',
    method: 'get',
    params: { clazzId, date, subject, abnormal, pageNum, pageSize, paged }
  })
}

/**
 * 进行异常确认, 只有打开异常确认设置才需要
 * @param checkRecordId 检查id
 * @param date 日期
 * @param subject 检查类型
 * @param childId 会员id
 * @param symptom 病状
 * @param checkTime 检查时间
 * @param temperature 体温
 * @param mark 备注
 * @param abnormal 是否异常
 * @param imageList 检查图片地址数组
 * @returns {AxiosPromise}
 */
export function confirmAbnoraml ({ checkRecordId, date, subject, childId, symptom, checkTime, temperature, mark, abnormal, imageList }) {
  return request({
    url: `/newdaycare/guard/check_record/confirm/${checkRecordId}`,
    method: 'put',
    data: { date, subject, childId, symptom, checkTime, temperature, mark, abnormal, imageList }
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

export function exportClazzCheckRecordToExcel (data) {
  const url = '/newdaycare/guard/check_record/class/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询检查记录列表
 * @param checkDate 检查日期
 * @param clazzId 班级id
 * @param subject 检查类型
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
      默认为true
 * @returns {AxiosPromise}
 */
export function queryCheckRecordList ({ checkDate, clazzId, subject, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/guard/check_statistic',
    method: 'get',
    params: { checkDate, clazzId, subject, pageNum, pageSize }
  })
}

/**
 * 获取检查记录
 * @param checkRecordId 检查记录 ID
 * @returns {AxiosPromise}
 */
export function queryCheckRecord ({ checkRecordId }) {
  return request({
    url: `/newdaycare/guard/check_record/${checkRecordId}`,
    method: 'get'
  })
}

// 导出异常检查记录excel
export function exportAbnoramlCheckListToExcel (data) {
  const url = '/newdaycare/guard/check_record/export'
  return downloadFile({ method: 'get', url, params: data })
}

// 导出检查记录excel
export function exportCheckRecordListToExcel (data) {
  const url = '/newdaycare/guard/check_statistic/export'
  return downloadFile({ method: 'get', url, params: data })
}

/**
 * 查询检查记录列表
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
export function queryAbnoramlCheckList ({ clazzId, date, subject, abnormal, pageNum, pageSize, paged = true }) {
  return request({
    url: '/newdaycare/guard/check_record',
    method: 'get',
    params: { clazzId, date, subject, abnormal, pageNum, pageSize, paged }
  })
}
