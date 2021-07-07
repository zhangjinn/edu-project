import request from '@/utils/request'
import { downloadFile, uploadFileForUrlAndFile } from '@/api/base/base'

// 查询待入园幼儿列表并分页
export function getPendingChildList(data) {
  return request({
    url: `/guardcare/child/page/pending`,
    method: 'get',
    params: data
  })
}

// 查询在园幼儿列表并分页
export function getEnterChildList(data) {
  return request({
    url: `/guardcare/child/page/in`,
    method: 'get',
    params: data
  })
}

// 查询离园幼儿列表并分页
export function getLeaveChildList(data) {
  return request({
    url: `/guardcare/child/page/out`,
    method: 'get',
    params: data
  })
}

// 查询在园幼儿列表
export function getChildIn(data) {
  return request({
    url: `/guardcare/child/list/in`,
    method: 'get',
    params: data
  })
}

// 批量离园
export function childLeave(data) {
  return request({
    url: `/guardcare/child/departure`,
    method: 'put',
    data
  })
}

// 批量调班
export function clazzAdjust(data) {
  return request({
    url: `/guardcare/child/clazz`,
    method: 'put',
    data
  })
}

// 添加幼儿
export function addChild(data) {
  return request({
    url: `/guardcare/child`,
    method: 'post',
    data
  })
}

// 删除幼儿
export function deleteChild(childId) {
  return request({
    url: `/guardcare/child/${childId}`,
    method: 'delete'
  })
}

// 查询幼儿详情
export function getChildDetail(childId) {
  return request({
    url: `/guardcare/child/${childId}`,
    method: 'get'
  })
}

// 修改幼儿
export function renewChild(childId, data) {
  return request({
    url: `/guardcare/child/${childId}`,
    method: 'put',
    data
  })
}

// 入园审核
export function auditChild(data) {
  return request({
    url: `/guardcare/child/enrollment_audit`,
    method: 'put',
    data
  })
}

// 重新入园
export function childEnter(data) {
  return request({
    url: `/guardcare/child/admission`,
    method: 'put',
    data
  })
}

// 获取新生报名通知
export function getRegistration(data) {
  return request({
    url: `/guardcare/registration_settings`,
    method: 'get'
  })
}

// 修改新生报名通知
export function renewRegistration(data) {
  return request({
    url: `/guardcare/registration_settings`,
    method: 'put',
    data
  })
}

// 获取C端的报名的入口地址
export function getRegistrationUrl() {
  return request({
    url: `/guardcare/registration_settings/client_registration_url`,
    method: 'get'
  })
}

// 查询年级列表
export function getGradeList(data) {
  return request({
    url: `/guardcare/educational/grade`,
    method: 'get',
    params: data
  })
}

// 查询班级列表
export function getClazzList(data) {
  return request({
    url: `/guardcare/educational/clazz`,
    method: 'get',
    params: data
  })
}

// 获取班级详情
export function getClazzDetail(clazzId) {
  return request({
    url: `/guardcare/educational/clazz/${clazzId}`,
    method: 'get'
  })
}

// 批量导入
export function importEnterChild(data) {
  return request({
    url: `/guardcare/child/import`,
    method: 'post',
    data
  })
}

// 校验幼儿重复
export function checkChildRepeat(data) {
  return request({
    url: `/guardcare/child/check_child_repeat`,
    method: 'post',
    data
  })
}

// 导出在园幼儿
export function exportChildExcel(data) {
  const url = '/guardcare/child/export/in'
  return downloadFile({ method: 'get', url, params: data })
}

// 批量导入
export function importChildExcel(data, options) {
  const url = '/guardcare/child/import'
  return uploadFileForUrlAndFile({ url, file: data, options })
}

// 获取导入幼儿模板下载地址
export function getImportTemplate() {
  return request({
    url: `/guardcare/import_child_batch/template_url`,
    method: 'get'
  })
}

// 查询导入幼儿批次列表并分页
export function getImportBatch(data) {
  return request({
    url: `/guardcare/import_child_batch/page`,
    method: 'get',
    params: data
  })
}

// 撤销导入幼儿批次
export function revokeBatch(data) {
  return request({
    url: `/guardcare/import_child_batch/revoke`,
    method: 'put',
    data
  })
}

// 查询导入幼儿批次
export function getBatchDetail(batchId) {
  return request({
    url: `/guardcare/import_child_batch/${batchId}`,
    method: 'get'
  })
}

// 查询幼儿月考勤统计
export function getAttendanceStatistics(data) {
  return request({
    url: `/guardcare/attendance/statistics/child_monthly`,
    method: 'get',
    params: data
  })
}

// 查询幼儿考勤列表
export function getAttendanceList(data) {
  return request({
    url: `/guardcare/attendance/list`,
    method: 'get',
    params: data
  })
}

// 查询幼儿请假列表
export function getLeaveList(data) {
  return request({
    url: `/guardcare/leave_request/list`,
    method: 'get',
    params: data
  })
}

// 查询幼儿班级轨迹
export function getclazzRecord(data) {
  return request({
    url: `/guardcare/child_status_update_record/list`,
    method: 'get',
    params: data
  })
}

// 校验家长手机号码
export function checkParentPhone(data) {
  return request({
    url: `/guardcare/child/check_parent`,
    method: 'post',
    data
  })
}

// 查询幼儿的家长列表并分页
export function getParentListByChildId(data) {
  return request({
    url: `/guardcare/parent/page`,
    method: 'get',
    params: data
  })
}

// 查询家长
export function getParentById(data) {
  return request({
    url: `/guardcare/parent`,
    method: 'get',
    params: data
  })
}

// 修改家长
export function renewParent(data) {
  return request({
    url: `/guardcare/parent`,
    method: 'put',
    data
  })
}

// 解绑考勤卡
export function delAttendanceCard(data) {
  return request({
    url: `/guardcare/parent/un_bundling_attendance_card_number`,
    method: 'put',
    data
  })
}
