import request from '@/utils/request'

/**
 * 获取我的工作台设置
 * @returns {AxiosPromise}
 */
export function queryMySetting() {
  return request({
    url: `/daycare/workbench/my/setting`,
    method: 'get',
    params: {}
  })
}

/**
 * 获取所有的工作台设置
 * @returns {AxiosPromise}
 */
export function queryAllSetting() {
  return request({
    url: `/daycare/workbench/part`,
    method: 'get',
    params: {}
  })
}

/**
 * 更新我的工作台设置
 * @param config JSON
 * @returns {AxiosPromise}
 */
export function updateMySetting({ config }) {
  return request({
    url: `/daycare/workbench/my/setting`,
    method: 'put',
    data: { config }
  })
}

/**
 * 查询数据卡
 * @param type
 * @returns {AxiosPromise}
 */
export function queryDataCard({ type }) {
  return request({
    url: `/daycare/workbench/statistics/data_card`,
    method: 'get',
    params: { type }
  })
}

/**
 * 查询图表数据
 * @param type
 * @param status
 * @param startTime
 * @param endTime
 * @returns {AxiosPromise}
 */
export function queryDataChart({ type, status, startTime, endTime }) {
  return request({
    url: `/daycare/workbench/statistics/find_histogram`,
    method: 'get',
    params: { type, status, startTime, endTime }
  })
}

/**
 * 查询待办提醒列表
 * @returns {AxiosPromise}
 */
export function queryTodoList() {
  return request({
    url: `/4o4`,
    method: 'get',
    params: {}
  })
}
