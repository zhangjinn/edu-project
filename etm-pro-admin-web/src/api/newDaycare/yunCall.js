import request from '@/utils/request'

// import request from '@/api/newdaycare/mockRequest'

/**
 * 获取学员通话记录
 * @param startDate通话开始时间
 * @param endDate通话结束时间
 * @param minCallDuration 最小通话时长
 * @param maxCallDuration 最大通话时长
 * @param childName 学员名称
 * @param callPhone 电话号码
 * @param employeeId 操作人
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryStudentCall({ startDate, endDate, minCallDuration, maxCallDuration, childName, callPhone, employeeId, pageNum, pageSize }) {
  return request({
    url: `/newdaycare/call`,
    method: 'get',
    params: {
      startDate,
      endDate,
      minCallDuration,
      maxCallDuration,
      childName,
      callPhone,
      employeeId,
      pageNum,
      pageSize
    }
  })
}

/** 打电话
 * @param childId 学员ID
 * @param phone 拨打的电话
 * @returns {AxiosPromise}
 */
export function createCall({ childId, telephone }) {
  return request({
    url: `/newdaycare/call`,
    method: 'post',
    data: { childId, telephone }
  })
}

/**
 * 通过数据标签查询员工下拉
 * @param tagCode
 * @returns {AxiosPromise}
 */
export function queryEmployeeSelectByTabCode({ tagCode }) {
  return request({
    url: `/basic/v2/enterprise/employee`,
    method: 'get',
    params: { tagCode }
  })
}

/**
 * 从原录音地址下载录音
 * */
export function postDownSrcRecord(data) {
  return request({
    url: `/basic/communication/call/down_src_record`,
    method: 'post',
    data
  })
}

/**
 * 获取呼叫中心的企业的账户信息
 * */
export function getAccount(params) {
  return request({
    url: '/basic/communication/organization/account',
    method: 'get',
    params
  })
}

// /**
//  * 发短信
//  * @param telephoneList 收件人号码列表
//  * @param content 短信内容
//  * @returns {AxiosPromise}
//  */
// export function createSms({ telephoneList, content }) {
//   return request({
//     url: `/newdaycare/sms`,
//     method: 'post',
//     data: { telephoneList, content }
//   })
// }

/**
 * 更新或新增呼叫设置
 * @param showPhone 显示电话
 * @param employeeId 员工id
 * @param open 是否开通
 * @param settingId 设置id
 * @returns {AxiosPromise}
 */
export function createCallSetting({ showPhone, employeeId, open, settingId }) {
  return request({
    url: `/basic/communication/call/setting`,
    method: 'post',
    data: { showPhone, employeeId, open, settingId }
  })
}
