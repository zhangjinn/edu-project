// import request from './mockRequest'
import request from '../http.js'

/**
 * 查询健康检查应用设置列表
 * @param type 检查类型
 CHECK_TYPE :检查类型
 COMMON_TYPES_OF_SYMPTOMS :常见病状类型
 * @returns {AxiosPromise}
 */
export function queryBodyCheckSetting({ type }) {
  return request({
    url: `/daycare/check_settings`,
    method: 'get',
    params: { type }
  })
}

/**
 * 根据id 查询检查名称
 * @param checkSettingsId 健康检查应用设置 ID
 * @returns {AxiosPromise}
 */
export function queryCheckType({ checkSettingsId }) {
  return request({
    url: `/daycare/check_settings/find_name/${checkSettingsId}`,
    method: 'get'
  })
}

/**
 *当天已排课程的托育课程、班级查询
 * @returns {AxiosPromise}
 */
export function queryClazzAndCourse() {
  return request({
    url: `/daycare/check_inspection_records/find_course/clazz_name_and_course`,
    method: 'get'
  })
}

/**
 *当天已排课程id 查询待检/正常/异常学员
 * @param courseManagementId 排课id
 * @param type  检查类型
 NORMAL :正常
 ABNORMAL :异常
 PENDING :待检
 * @param examinationSettingsId 检查类型id
 * @param childName 学员姓名
 * @returns {AxiosPromise}
 */
export function queryCheckChild({ courseManagementId, type, examinationSettingsId, childName }) {
  return request({
    url: `/daycare/check_inspection_records/clazz_name_and_course/${courseManagementId}`,
    method: 'get',
    params: { type, examinationSettingsId, childName }
  })
}

/**
 * 获取待检 正常 异常 数量
 * @param caScourseManagementId 排课id
 * @param examinationSettingsId 检查类型id
 * @returns {AxiosPromise}
 */
export function queryTypeNumber({ caScourseManagementId, examinationSettingsId }) {
  return request({
    url: `/daycare/check_inspection_records/find_number`,
    method: 'get',
    params: { caScourseManagementId, examinationSettingsId }
  })
}

/**
 * 新增健康检查记录
 * @param childIds 学员id
 * @param caScourseManagementId 排课id
 * @param examinationSettingsId 检查类型id
 * @param type 新增 正常/异常   NORMAL :正常 ABNORMAL :异常 PENDING :待检
 * @param source 来源  待检/正常/异常 NORMAL :正常 ABNORMAL :异常 PENDING :待检
 * @param bodyTemperature 体温
 * @param imageList 图片列表
 * @param remarks
 * @param checkSettingsIds
 * @returns {AxiosPromise}
 */
export function createNewCheck({ childIds, caScourseManagementId, examinationSettingsId, type, source, bodyTemperature, imageList, remarks, checkSettingsIds }) {
  return request({
    url: `/daycare/check_inspection_records`,
    method: 'post',
    data: { childIds, caScourseManagementId, examinationSettingsId, type, source, bodyTemperature, imageList, remarks, checkSettingsIds }
  })
}

/**
 *根据日期查询近一周是否有体检记录
 * @param child
 * @param localDate 日期条件
 * @returns {AxiosPromise}
 */
export function queryWeekCheck({ child, localDate }) {
  return request({
    url: `/daycare/check_inspection_records/find_examination/${child}`,
    method: 'get',
    params: { child, localDate }
  })
}

/**
 * 检查详情接口
 * @param checkDate 检查日期
 * @param hildId 学员id
 * @returns {AxiosPromise}
 */
export function queryCheckDetail({ checkDate, childId }) {
  return request({
    url: `/daycare/check_inspection_records/details`,
    method: 'get',
    params: { checkDate, childId }
  })
}

/**
 * 获取学员信息
 * @param childId
 * @returns {AxiosPromise}
 */
export function queryStu({ childId }) {
  return request({
    url: `/daycare/child/${childId}`,
    method: 'get'
  })
}
