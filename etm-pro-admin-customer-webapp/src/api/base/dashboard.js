import request from '@/utils/request'

// import request from './mock'

/**
 * 获取当前员工的所有工作台资源
 * @returns {AxiosPromise}
 */
export function queryCurrentEmployeeDashboardRecourseAll () {
  return request({
    url: '/basic/dashboard_resource',
    method: 'get',
    params: { terminalType: 'PC' }
  })
}

/**
 * 获取当前员工的工作台配置
 * @returns {AxiosPromise}
 */
export function queryCurrentEmployeeDashboardResource ({ type }) {
  return request({
    url: '/basic/employee/dashboard_setting',
    method: 'get',
    params: { type, terminalType: 'PC' }
  })
}

/**
 * 更新当前员工的工作台配置
 * @param  {string}   type  [DATA_CARD, QUICK_OPERATION, TO-DO, PRODUCT_NEWS, STATISTIC_CHART_ONE, STATISTIC_CHART_TWO, STATISTIC_CHART_THREE] - 工作台资源的类型
 * @param  {number[]} dashboardResourceIdList - 工作台资源的ID列表
 * @returns {AxiosPromise}
 */
export function updateCurrentEmployeeDashboardResource ({ type, dashboardResourceIdList }) {
  return request({
    url: '/basic/employee/dashboard_setting',
    method: 'put',
    data: { type, dashboardResourceIdList, terminalType: 'PC' }
  })
}

/**
 * 获取面板图表
 * @param url 接口地址
 * @param options 请求参数
 * @returns {AxiosPromise}
 */
export function queryDashboardDataChart ({ url, options }) {
  return request({
    url,
    method: 'get',
    params: { ...options }
  })
}

/**
 * 查询产品动态列表
 * @returns {AxiosPromise}
 */
export function queryDashboardProductDynamicList () {
  return request({
    url: '/basic/product_news',
    method: 'get'
  })
}

/**
 * 查询产品动态列表并分页
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @param sort 排序信息
 格式为：{name1:direction,name2:direction,...}，例如name:desc,age:asc,createTime
 direction不指定时，默认为asc
 排序字段会按如下优先级去匹配：
 1. 查询的Sifter/ResultType类中定义的字段。
 {@link JpaSifterExecutor#findList(Sifter, Class)}
 {@link JpaSifterExecutor#findPage(PagedSifter, Class)}
 2. entity中的字段。
 3. 根据排序字段本身去查找，支持"xx.name"这种链式字段。
 * @returns {AxiosPromise}
 */
export function queryDashboardProductList ({ pageNum, pageSize, paged = false, sort }) {
  return request({
    url: '/basic/product_news/page',
    method: 'get',
    params: { pageNum, pageSize, paged, sort }
  })
}

/**
 * 获取指定的产品动态
 * @returns {AxiosPromise}
 */
export function queryDashboardProductDynamicById ({ id }) {
  return request({
    url: `/basic/product_news/${id}`,
    method: 'get'
  })
}

/**
 * 查询行业头条列表并分页
 * @param pageNum
 * @param pageSize
 * @param paged 是否分页
 * @param sort
 * @returns {AxiosPromise}
 */
export function queryIndustryHeadlinesList ({ pageNum, pageSize, paged = false, sort }) {
  return request({
    url: '/basic/industry_headlines/page',
    method: 'get',
    params: { pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询行业头条
 * @param industryHeadlinesId {number|string}
 * @returns {AxiosPromise}
 */
export function queryIndustryHeadlineById ({ industryHeadlinesId }) {
  return request({
    url: `/basic/industry_headlines/${industryHeadlinesId}`,
    method: 'get'
  })
}

/**
 * 查询广告位
 * @param position {string} 广告位置DATA_CENTER_TOP_BANNER :数据中心顶部横幅ADVERTISEMENT_ON_THE_RIGHT_SIDE_OF_DATA_CENTER :数据中心右侧广告BANNER_ON_TOP_OF_WORKBENCH :工作台顶部横幅ADVERTISEMENT_ONE_ON_THE_RIGHT_SIDE_OF_WORKBENCH :工作台右侧广告1ADVERTISEMENT_TWO_ON_THE_RIGHT_SIDE_OF_WORKBENCH :工作台右侧广告2FRONT_PAGE_MIDDLE_ADVERTISEMENT_ONE :首页中部广告1ADVERTISEMENT_ON_TOP_OF_WORKBENCH :工作台顶部广告
 * @param displayScope
 * @returns {AxiosPromise}
 */
export function queryAdByPosition ({ position, displayScope }) {
  return request({
    url: '/basic/advertisement_position/list',
    method: 'get',
    params: { position, displayScope }
  })
}

/**
 * 根据类型获取待办事项统计数据
 * @returns {AxiosPromise}
 */
export function queryDashboardTodoList ({ url, type }) {
  return request({
    url,
    method: 'get',
    params: { type }
  })
}
