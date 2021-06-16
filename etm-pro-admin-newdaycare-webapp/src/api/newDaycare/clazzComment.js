import request from '@/utils/request'

/**
 * 分页查询托育点评
 * @param state 点评状态 true 查询已点评的 false 查询未点评的
 * @param childName 宝宝姓名
 * @param courseName 课程名称
 * @param startDate 课程开始日期
 * @param endDate 课程结束日期
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
export function queryTcReviews ({ state, childName, courseName, startDate, endDate, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/newdaycare/tc_reviews/find_page',
    method: 'get',
    params: { state, childName, courseName, startDate, endDate, pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询点评详情
 * @param reviewsId 查询实体对象
 * @returns {AxiosPromise}
 */
export function queryTeachDetails ({ reviewsId }) {
  return request({
    url: `/newdaycare/tc_reviews/details/${reviewsId}`,
    method: 'get'
  })
}

/**
 * 获取点评频率
 * @returns {AxiosPromise}
 */
export function queryFrequency () {
  return request({
    url: '/newdaycare/frequency',
    method: 'get'

  })
}

/**
 * 根据点评频率获取时间数据
 * @param type 查询实体对象  DAILY :每日一次
 WEEKLY :每周一次
 PER_MONTH :每月一次
 * @returns {AxiosPromise}
 */
export function queryFindByDate ({ type }) {
  return request({
    url: '/newdaycare/cac_reviews/findByDate',
    method: 'get',
    params: { type }
  })
}

/**
 * 分页查询托育点评
 * @param state 点评状态 true 查询已点评的 false 查询未点评的
 * @param childName 宝宝姓名
 * @param clazzName 班级名称
 * @param dateSrt 点评日期 如 2020-12-09,2020-12-09
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
export function queryCacReviews ({ state, childName, clazzName, dateSrt, pageNum, pageSize, paged, sort }) {
  return request({
    url: '/newdaycare/cac_reviews/find_page',
    method: 'get',
    params: { state, childName, clazzName, dateSrt, pageNum, pageSize, paged, sort }
  })
}

/**
 * 查询点评详情
 * @param reviewsId 查询实体对象
 * @returns {AxiosPromise}
 */
export function queryCacDetails ({ reviewsId }) {
  return request({
    url: `/newdaycare/cac_reviews/details/${reviewsId}`,
    method: 'get'
  })
}

/**
 * 查询幼儿点评列表/PC
 * @param clazzName 班级名称
 * @param childName 幼儿姓名
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param hasMessage 是否已点评
 * @returns {AxiosPromise}
 */
export function updateToddler ({ clazzName, childName, startDate, endDate, hasMessage, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/guard/performance/list/school',
    method: 'put',
    data: { clazzName, childName, startDate, endDate, hasMessage, pageNum, pageSize }
  })
}

/**
 * 获取幼儿点评详情/PC
 * @param performanceId 宝宝表现 ID
 * @returns {AxiosPromise}
 */
export function queryToddler ({ performanceId }) {
  return request({
    url: `/newdaycare/guard/performance/detail/${performanceId}`,
    method: 'get'
  })
}
