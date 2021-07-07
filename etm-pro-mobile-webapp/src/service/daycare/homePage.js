// import request from './mockRequest'
import request from '../http.js'

/**
 * 查询数据卡片
 * type类型如下
 * INCOME_AMOUNT :收入金额
 * CONTRACT_AMOUNT :签约金额
 * EXPENDITURE_AMOUNT :支出金额
 * SIGN_IN :出勤
 * ABSENT_FROM_WORK :缺勤
 * ASK_FOR_LEAVE :请假
 * REFUND_AMOUNT :退费金额
 * SIGN_AMOUNT :签约单数
 * CONSUME_COURSE :消课金额/消课课时
 * SCHEDULE_COURSE :排课节数/排课学员
 * AVERAGE_TEACHER_EFFICIENCY :老师平均人效
 * FOLLOW_UP :跟进人数
 * @param type {string}
 * @returns {AxiosPromise}
 */
export function dataCare({ type }) {
  return request({
    method: 'get',
    url: '/daycare/workbench/statistics/data_card',
    params: {
      type
    }
  })
}

/**
 * 根据条件类型获取矩形图数据
 * 统计查询类型(type)
 * INCOME_AND_EXPENSES :收入/支出
 * HEALTH_EXAMINATION :健康检查
 * CONSUME_COURSE_AMOUNT :消课金额
 * CUSTOMER_CONVERSION :客户转化
 * ATTENDANCE :考勤
 * @param type {string}
 * @param status {string} 查询状态 YEAR :按年查询 MONTH :按月查询
 * @param startTime {string|date} 开始时间
 * @param endTime {string|date} 结束时间
 * @returns {AxiosPromise}
 */
export function findHistogram({ type, status, startTime, endTime }) {
  return request({
    method: 'get',
    url: '/daycare/workbench/statistics/find_histogram',
    params: {
      type,
      status,
      startTime,
      endTime
    }
  })
}
