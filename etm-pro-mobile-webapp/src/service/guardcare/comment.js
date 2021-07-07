import request from '../http.js'

/**
 * 查询表现项列表
 * @param type 类型
    IN_HOME :在家表现
    IN_SCHOOL :在校表现
 * @returns {AxiosPromise}
 */
export function queryBehaviorList({ type }) {
  return request({
    url: `/guardcare/performance_item`,
    method: 'get',
    params: { type }
  })
}

/**
 * 删除表现项
 * @param performanceItemId 表现项 ID
 * @returns {AxiosPromise}
 */
export function removeBehaviorItem({ performanceItemId }) {
  return request({
    url: `/guardcare/performance_item/${performanceItemId}`,
    method: 'delete'
  })
}

/**
 * 新增表现项
 * @param performanceItemName 类型名称
 * @param type 类型
 * @returns {AxiosPromise}
 */
export function createBehaviorItem({ performanceItemName, type }) {
  return request({
    url: `/guardcare/performance_item`,
    method: 'post',
    data: { performanceItemName, type }
  })
}

/**
 * 获取点评频率设置项
 * @returns {AxiosPromise}
 */
export function queryFrequency() {
  return request({
    url: `/guardcare/performance_item/setting/get`,
    method: 'get'
  })
}

/**
 * 更改点评频率设置项
 * @param value undefined
 * @returns {AxiosPromise}
 */
export function updateFrequency({ value }) {
  return request({
    url: `/guardcare/performance_item/setting/update`,
    method: 'put',
    data: { value }
  })
}

/**
 * 查询学期列表
 * @returns {AxiosPromise}
 */
export function querySemesterList() {
  return request({
    url: `/guardcare/educational/course/term`,
    method: 'get'
  })
}

/**
 * 查询学期周次列表
 * @param courseTermId 学期id
 * @returns {AxiosPromise}
 */
export function querySemesterWeekList({ courseTermId }) {
  return request({
    url: `/guardcare/educational/course/term/week`,
    method: 'get',
    params: { courseTermId }
  })
}

/**
 * 查询宝宝表现列表
 * @param gradeId 年级id
 * @param weekIdList 周次id列表
 * @param clazzId 班级id
 * @param type 表现类型
 * @returns {AxiosPromise}
 */
export function getBehaviorList({ gradeId, weekIdList, clazzId, type }) {
  return request({
    url: `/guardcare/performance/list`,
    method: 'put',
    data: { gradeId, weekIdList, clazzId, type }
  })
}

/**
 * 获取宝宝表现
 * @param performanceId 宝宝表现 ID
 * @returns {AxiosPromise}
 */
export function queryBehaviorDetail({ performanceId }) {
  return request({
    url: `/guardcare/performance/${performanceId}`,
    method: 'get'
  })
}

/**
 * 新增宝宝表现
 * @param type 表现类型
 * @param rateList 评分列表
 * @param childIdList 幼儿id列表
 * @param weekIdList 周次id列表
 * @param message 寄语
 * @param imageList 图片地址数组
 * @returns {AxiosPromise}
 */
export function createBehavior({ type, rateList, childIdList, weekIdList, message, imageList }) {
  return request({
    url: `/guardcare/performance`,
    method: 'post',
    data: { type, rateList, childIdList, weekIdList, message, imageList }
  })
}

/**
 * 通知家长填写在家表现
 * @param childIds 幼儿id列表
 * @returns {AxiosPromise}
 */
export function noticeToCompleteHomeBehavior({ childIds }) {
  return request({
    url: `/guardcare/performance/notice`,
    method: 'post',
    data: { childIds }
  })
}
