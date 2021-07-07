import request from '../http.js'

/**
 * 根据条件查询当前登录的账户的解决方案和资源列表
 * */
export function getSolutionList(data) {
  return request({
    url: '/basic/solution/menu',
    method: 'get',
    params: data
  })
}

/**
 * 待办事务
 */
export function getTransaction(param) {
  return request({
    url: '/basic/transaction',
    method: 'get',
    params: param
  })
}

/**
 * 修改事务状态
 */
export function putTransaction(id, param) {
  return request({
    url: '/basic/transaction/' + id,
    method: 'put',
    params: param
  })
}

/**
 * 删除事务状态
 */
export function deleteTransaction(id) {
  return request({
    url: '/basic/transaction/' + id,
    method: 'delete'
  })
}

/**
 * 应用搜索
 */
export function getApplicationList(param) {
  return request({
    url: '/basic/app/search',
    method: 'get',
    params: param
  })
}

/**
 * 获取当前员工的所有工作台资源
 * @param terminalType 工作台资源的应用端  PC :电脑端
 MOBILE :移动端
 * @returns {AxiosPromise}
 */
export function queryDashboardResource({ terminalType }) {
  return request({
    url: `/basic/dashboard_resource`,
    method: 'get',
    params: { terminalType }
  })
}

/**
 * 获取当前员工的工作台配置
 * @param terminalType 工作台资源的应用端  PC :电脑端  MOBILE :移动端
 * @param type 工作台资源的类型，如果不指定，则获取所有  DATA_CARD :数据卡片
 QUICK_OPERATION :快捷入口
 TODO :待办事项
 PRODUCT_NEWS :产品动态
 STATISTIC_CHART_ONE :数据报表一区
 STATISTIC_CHART_TWO :数据报表二区
 STATISTIC_CHART_THREE :数据报表三区
 * @returns {AxiosPromise}
 */
export function queryDashboardSetting({ terminalType, type }) {
  return request({
    url: `/basic/employee/dashboard_setting`,
    method: 'get',
    params: { terminalType, type }
  })
}

/**
 * 更新当前员工的工作台配置
 * @param terminalType 工作台资源的应用端  PC :电脑端  MOBILE :移动端
 * @param type 工作台资源的类型
 * @param dashboardResourceIdList 工作台资源的ID列表
 * @returns {AxiosPromise}
 */
export function updateDashboardSetting({ terminalType, type, dashboardResourceIdList }) {
  return request({
    url: `/basic/employee/dashboard_setting`,
    method: 'put',
    data: { terminalType, type, dashboardResourceIdList }
  })
}

/**
 * 查询地区详情
 * @param code 地区编码
 * @returns {AxiosPromise}
 */
export function queryAreaByCode({ code }) {
  return request({
    url: `/basic/area/${code}`,
    method: 'get'
  })
}

/**
 * 查询首页的echart图表数据
 * @param url 请求地址
 * @param param 入参
 * @returns {AxiosPromise}
 */
export function queryHomepageData(url, param) {
  return request({
    url: url,
    method: 'get',
    params: param
  })
}

/**
 * 查询行业头条列表并分页
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
export function queryHeadlineList({ pageNum, pageSize, paged, sort }) {
  return request({
    url: `/basic/industry_headlines/page`,
    method: 'get',
    params: { pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询行业头条
 * @param industryHeadlinesId
 * @returns {AxiosPromise}
 */
export function queryHeadLineById({ industryHeadlinesId }) {
  return request({
    url: `/basic/industry_headlines/${industryHeadlinesId}`,
    method: 'get'
  })
}

/**
 * 查询广告位的广告列表
 * @param position 广告位置
 DATA_CENTER_TOP_BANNER :数据中心顶部横幅
 ADVERTISEMENT_ON_THE_RIGHT_SIDE_OF_DATA_CENTER :数据中心右侧广告
 BANNER_ON_TOP_OF_WORKBENCH :工作台顶部横幅
 ADVERTISEMENT_ONE_ON_THE_RIGHT_SIDE_OF_WORKBENCH :工作台右侧广告1
 ADVERTISEMENT_TWO_ON_THE_RIGHT_SIDE_OF_WORKBENCH :工作台右侧广告2
 FRONT_PAGE_MIDDLE_ADVERTISEMENT_ONE :首页中部广告1
 ADVERTISEMENT_ON_TOP_OF_WORKBENCH :工作台顶部广告
 * @param displayScope 显示端
 HEADQUARTERS :总部
 BPC_MANAGEMENT_SCOPE :BPC管理端
 MOBILE_MANAGEMENT_SCOPE :移动管理端
 * @returns {AxiosPromise}
 */
export function queryAdvertisement({ position, displayScope }) {
  return request({
    url: `/basic/advertisement_position/list`,
    method: 'get',
    params: { position, displayScope }
  })
}

/**
 * @description 获取上传文件的前缀
 * @returns {*}
 */
export async function getUploadFilePrefix() {
  return request({
    url: '/basic/qiniu/data_prefix',
    method: 'get'
  }).then(res => res.data)
}
