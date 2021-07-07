import request from '@/utils/request'

// import request from '@/api/daycare/mockRequest'

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
    url: `/daycare/call`,
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
    url: `/daycare/call`,
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
//     url: `/daycare/sms`,
//     method: 'post',
//     data: { telephoneList, content }
//   })
// }

