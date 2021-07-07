import request from '../http.js'
// import request from '../mock'

/**
 * 查询交待事宜列表
 * @param createDataStart 交代日期开始
 * @param createDataEnd 交代日期结束
 * @param clazzId 班级id
 * @returns {AxiosPromise}
 */
export function queryMatterList({ createDateStart, createDateEnd, clazzId }) {
  return request({
    url: `/guardcare/leave_message`,
    method: 'get',
    params: { createDateStart, createDateEnd, clazzId }
  })
}

/**
 * 确认交待事宜
 * @param leaveMessageId 交待事宜 ID
 * @returns {AxiosPromise}
 */
export function confirmMatterItem({ leaveMessageId }) {
  return request({
    url: `/guardcare/leave_message/confirm/${leaveMessageId}`,
    method: 'delete'
  })
}

/**
 * 获取交待事宜
 * @param leaveMessageId 交待事宜 ID
 * @returns {AxiosPromise}
 */
export function queryMatterItem({ leaveMessageId }) {
  return request({
    url: `/guardcare/leave_message/${leaveMessageId}`,
    method: 'get'
  })
}
