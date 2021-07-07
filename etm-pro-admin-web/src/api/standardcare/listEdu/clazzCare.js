import request from '@/utils/request'

/**
 * 查询托育班级列表
 * @param teacher 班主任
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
export function queryClazzLists({ teacher, pageNum, pageSize, paged, sort, clazzName }) {
  return request({
    url: `/standardcare/care_clazz`,
    method: 'get',
    params: { teacher, pageNum, pageSize, paged, sort, clazzName }
  })
}

/**
 * 获取托育班级
 * @param careClazzId 托育班级 ID
 * @returns {AxiosPromise}
 */
export function queryClazzDetail({ caeClazzId }) {
  return request({
    url: `/standardcare/care_clazz/${caeClazzId}`,
    method: 'get'

  })
}

/**
 * 更新托育班级
 * @param careClazzId
 * @param clazzId 班级id
 * @param typeId 类型id
 * @param ageId 年龄段id
 * @param capacity 容量
 * @param studentNumber 学员数量
 * @param teacher 班主任
 * @param secondTeacher 助教老师
 * @param mark 备注
 * @param nurse 保育员
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateClazz({ careClazzId, clazzId, typeId, ageId, capacity, studentNumber, teacher, secondTeacher, mark, nurse, enable }) {
  return request({
    url: `/standardcare/care_clazz/${careClazzId}`,
    method: 'put',
    data: { clazzId, typeId, ageId, capacity, studentNumber, teacher, secondTeacher, mark, nurse, enable }
  })
}

/**
 * 查询适用年龄段列表
 * @returns {AxiosPromise}
 */
export function queryDaycareGenerationList() {
  return request({
    url: `/standardcare/clazz_age_range`,
    method: 'get'

  })
}

/**
 * 新增适用年龄段
 * @param name 名称
 * @returns {AxiosPromise}
 */
export function createDaycareGenerationTwo({ name }) {
  return request({
    url: `/standardcare/clazz_age_range`,
    method: 'post',
    data: { name }
  })
}

/**
 * 更新适用年龄段
 * @param clazzAgeRangeId
 * @param name 名称
 * @returns {AxiosPromise}
 */
export function updateDaycareGenerationTwo({ clazzAgeRangeId, name }) {
  return request({
    url: `/standardcare/clazz_age_range/${clazzAgeRangeId}`,
    method: 'put',
    data: { name }
  })
}

/**
 * 删除适用年龄段
 * @param clazzAgeRangeId 适用年龄段 ID
 * @returns {AxiosPromise}
 */
export function removeDaycareGeneration(clazzAgeRangeId) {
  return request({
    url: `/standardcare/clazz_age_range/${clazzAgeRangeId}`,
    method: 'delete'

  })
}

/**
 * 修改排序
 * @param idList 排序数据id集合
 * @returns {AxiosPromise}
 */
export function sortDaycareGeneration(idList) {
  return request({
    url: `/standardcare/clazz_age_range/sort`,
    method: 'put',
    data: { idList }
  })
}

/**
 * 获取适用年龄段
 * @param clazzAgeRangeId 适用年龄段 ID
 * @returns {AxiosPromise}
 */
export function queryDaycareGenerationSingle(clazzAgeRangeId) {
  return request({
    url: `/standardcare/clazz_age_range/${clazzAgeRangeId}`,
    method: 'get'

  })
}

/**
 * 查询可配置的班级列表
 * @returns {AxiosPromise}
 */
export function queryCareSetting() {
  return request({
    url: `/standardcare/care_clazz/type`,
    method: 'get'

  })
}

/**
 * 托育班级设置
 * @param clazzIdList 启用的班级id列表
 * @returns {AxiosPromise}
 */
export function createCareSetting(clazzIdList) {
  return request({
    url: `/standardcare/care_clazz/configClazz`,
    method: 'post',
    data: { clazzIdList }
  })
}
