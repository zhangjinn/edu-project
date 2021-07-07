// import request from '@/api/daycare/mockRequest'

import request from '@/utils/request'

/**
 * 快捷考勤
 * @param convenientType 输入类型
 * @param number 号码
 * @returns {AxiosPromise}
 */
export function createAttendance({ convenientType, number }) {
  return request({
    url: `/daycare/ask_for_leave/convenient_attendance`,
    method: 'post',
    data: { convenientType, number }
  })
}
