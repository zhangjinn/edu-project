import request from '@/utils/request'

/**
 * 查询当前接口是否顶级企业
 * @returns {AxiosPromise}
 */
export function queryEnterpriseTop () {
  return request({
    url: '/newdaycare/dashboard/check_top',
    method: 'get'

  })
}

/**
 * 查询顶级企业或区域下拉列表(总部工作台用)
 * @returns {AxiosPromise}
 */
export function queryAreaList () {
  return request({
    url: '/newdaycare/organization/dashboard_area_down_list',
    method: 'get'

  })
}

/**
 * 查询工作台概览数据(businessType为null的数据为全部数据)
 * @param organizationId 组织id
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryOverViewData ({ organizationId, startDate, endDate }) {
  return request({
    url: '/newdaycare/dashboard/over_view',
    method: 'get',
    params: { organizationId, startDate, endDate }
  })
}

/**
 * 查询区域数据
 * @param organizationId 组织id
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns {AxiosPromise}
 */
export function queryAreaTableData ({ organizationId, startDate, endDate }) {
  return request({
    url: '/newdaycare/dashboard/head_quarter',
    method: 'get',
    params: { organizationId, startDate, endDate }
  })
}

/**
 * 查询两个学员数量图表
 * @param organizationId 组织id
 * @param businessType 业务类型
 CARE :托育
 TEACH :早教
 GUARD :幼托
 * @returns {AxiosPromise}
 */
export function queryBarChartData ({ organizationId, businessType }) {
  return request({
    url: '/newdaycare/dashboard/histogram_graph',
    method: 'get',
    params: { organizationId, businessType }
  })
}

/**
 * 查询收入金额折线图
 * @param organizationId 组织id
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param yearOrMonth 年或月
 YEAR :按年查询
 MONTH :按月查询
 * @returns {AxiosPromise}
 */
export function queryIncomeChartData ({ organizationId, startDate, endDate, yearOrMonth }) {
  return request({
    url: '/newdaycare/dashboard/income',
    method: 'get',
    params: { organizationId, startDate, endDate, yearOrMonth }
  })
}

/**
 * 查询新增学员折线图
 * @param organizationId 组织id
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param yearOrMonth 年或月
 YEAR :按年查询
 MONTH :按月查询
 * @returns {AxiosPromise}
 */
export function queryStudentChartData ({ organizationId, startDate, endDate, yearOrMonth }) {
  return request({
    url: '/newdaycare/dashboard/child',
    method: 'get',
    params: { organizationId, startDate, endDate, yearOrMonth }
  })
}

/**
 * 查询总部工作台地图数据
 * @returns {AxiosPromise}
 */
export function queryDashboardMapData () {
  return request({
    url: '/newdaycare/dashboard/map',
    method: 'get'

  })
}
