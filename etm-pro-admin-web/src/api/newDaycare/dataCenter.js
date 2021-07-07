import request from '@/utils/request'

/**
 * 查询企业总数据
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryEnterpriseData({ startDate, endDate }) {
  return request({
    url: `/newdaycare/datacenter`,
    method: 'get',
    params: { startDate, endDate }
  })
}

/**
 * 查询子企业早教数据列表
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param orgName 机构名称
 * @param areaCode 省份编码
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryTeachTableData({ startDate, endDate, orgName, areaCode, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/datacenter/teach_list`,
    method: 'get',
    params: { startDate, endDate, orgName, areaCode, pageNum, pageSize, paged }
  })
}

/**
 * 查询子企业托育数据列表
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param orgName 机构名称
 * @param areaCode 省份编码
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryCareTableData({ startDate, endDate, orgName, areaCode, pageNum, pageSize, paged }) {
  return request({
    url: `/newdaycare/datacenter/care_list`,
    method: 'get',
    params: { startDate, endDate, orgName, areaCode, pageNum, pageSize, paged }
  })
}

/**
 * 查询子企业托育柱形图
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryCareChartData({ startDate, endDate }) {
  return request({
    url: `/newdaycare/datacenter/care_histogram`,
    method: 'get',
    params: { startDate, endDate }
  })
}

/**
 * 查询子企业早教柱形图
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryTeachChartData({ startDate, endDate }) {
  return request({
    url: `/newdaycare/datacenter/teach_histogram`,
    method: 'get',
    params: { startDate, endDate }
  })
}

/**
 * 查询总企业地图数据
 * @returns {AxiosPromise}
 */
export function queryMapData() {
  return request({
    url: `/newdaycare/datacenter/map`,
    method: 'get'

  })
}
