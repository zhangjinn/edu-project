import request from '@/utils/request'
// import mockrequest from './mockRequest'

// ----------------托育类型设置----------------
/**
 * 查询托育课程类型列表
 * @returns {AxiosPromise}
 */
export function queryNurseCourseTypeList(caeCourseTypeName) {
  return request({
    url: '/newdaycare/care/cae_course_type',
    method: 'get',
    params: { caeCourseTypeName }
  })
}

/**
 * 新增托育课程类型
 * @param caeCourseTypeName
 * @param price
 * @returns {AxiosPromise}
 */
export function createNurseCourseType({ caeCourseTypeName, price }) {
  return request({
    url: '/newdaycare/care/cae_course_type',
    method: 'post',
    data: { caeCourseTypeName, price }
  })
}

/**
 * 获取托育课程
 * @param caeCourseTypeName
 * @returns {AxiosPromise}
 */
export function queryNurseCourse(caeCourseTypeName) {
  return request({
    url: `/newdaycare/care/cae_course`,
    method: 'get',
    params: { caeCourseTypeName }
  })
}

/**
 * 更新托育课程类型
 * @param caeCourseTypeId
 * @param caeCourseTypeName
 * @param price
 * @returns {AxiosPromise}
 */
export function updateNurseCourseType(caeCourseTypeId, { caeCourseTypeName, price }) {
  return request({
    url: `/newdaycare/care/cae_course_type/${caeCourseTypeId}`,
    method: 'put',
    data: { caeCourseTypeName, price }
  })
}

/**
 * 托育课程类型排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function sortNurseCourseType(ids) {
  return request({
    url: '/newdaycare/care/cae_course_type/sort',
    method: 'post',
    data: { ids }
  })
}

/**
 * 删除托育课程类型
 * @param caeCourseTypeId
 * @returns {AxiosPromise}
 */
export function removeNurseCourseType(caeCourseTypeId) {
  return request({
    url: `/newdaycare/care/cae_course_type/${caeCourseTypeId}`,
    method: 'delete'
  })
}

// ----------------早教类型设置----------------
/**
 * 查询早教课程类型列表
 * @returns {AxiosPromise}
 */
export function queryEarlyCourseTypeList(teCourseTypeName) {
  return request({
    url: '/newdaycare/teach/te_course_type',
    method: 'get',
    params: { teCourseTypeName }
  })
}

/**
 * 新增早教课程类型
 * @param teCourseTypeName
 * @param price
 * @returns {AxiosPromise}
 */
export function createEarlyCourseType({ teCourseTypeName, price }) {
  return request({
    url: '/newdaycare/teach/te_course_type',
    method: 'post',
    data: { teCourseTypeName, price }
  })
}

/**
 * 获取费用列表
 * @param priceName
 * @returns {AxiosPromise}
 */
export function queryPrice({ priceName, start }) {
  return request({
    url: `/newdaycare/price`,
    method: 'get',
    params: { priceName, start }
  })
}

/**
 * 查询托育费用列表(不分页)
 * @param name 费用名称
 * @param type true 查询已启用 false 查询未启用
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
export function queryPriceCare({ name, type, sort, start }) {
  return request({
    url: `/newdaycare/ca_price/find_all`,
    method: 'get',
    params: { name, type, sort, start }
  })
}

/**
 * 获取物品列表
 * @param name
 * @returns {AxiosPromise}
 */
export function queryGoods({ name }) {
  return request({
    url: `/newdaycare/material`,
    method: 'get',
    params: { name }
  })
}

/**
 * 更新早教课程类型
 * @param teCourseTypeId
 * @param teCourseTypeName
 * @param price
 * @returns {AxiosPromise}
 */
export function updateEarlyCourseType(teCourseTypeId, { teCourseTypeName, price }) {
  return request({
    url: `/newdaycare/teach/te_course_type/${teCourseTypeId}`,
    method: 'put',
    data: { teCourseTypeName, price }
  })
}

/**
 * 早教课程类型排序
 * @param ids
 * @returns {AxiosPromise}
 */
export function sortEarlyCourseType(ids) {
  return request({
    url: '/newdaycare/teach/te_course_type/sort',
    method: 'post',
    data: { ids }
  })
}

/**
 * 删除早教课程类型
 * @param teCourseTypeId
 * @returns {AxiosPromise}
 */
export function removeEarlyCourseType(teCourseTypeId) {
  return request({
    url: `/newdaycare/teach/te_course_type/${teCourseTypeId}`,
    method: 'delete'
  })
}

// ----------------托育课程----------------
/**
 * 查询托育课程列表
 * @returns {AxiosPromise}
 */
export function queryNurseCourseList({ caeCourseName, caeCourseType }) {
  return request({
    url: '/newdaycare/care/cae_course',
    method: 'get',
    params: { caeCourseName, caeCourseType }
  })
}

/**
 * 查询托育课程分页列表
 * @param courseName
 * @param courseTypeId
 * @param generationId
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryNurseCourseListByPage({ generationId, courseName, courseTypeId, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/care/cae_course/course_page',
    method: 'get',
    params: { generationId, courseName, courseTypeId, pageNum, pageSize }
  })
}

/**
 * 新增托育课程
 * @param courseTypeId 托育课程类型id
 * @param caeCourseName 课程名
 * @param lesson 消课课时
 * @param price 单价
 * @param introduction 托育简介
 * @param capacity 课程容量
 * @param image 图片
 * @returns {AxiosPromise}
 */
export function createNurseCourse({ duration, generationId, courseTypeId, caeCourseName, lesson, price, introduction, formalCapacity, experienceCapacity, totalCapacity, image }) {
  return request({
    url: '/newdaycare/care/cae_course',
    method: 'post',
    data: {
      courseTypeId,
      generationId,
      caeCourseName,
      duration,
      lesson,
      price,
      introduction,
      formalCapacity,
      experienceCapacity,
      totalCapacity,
      image
    }
  })
}

/**
 * 删除托育课程
 * @param caeCourseId
 * @returns {AxiosPromise}
 */
export function removeNurseCourse(caeCourseId) {
  return request({
    url: `/newdaycare/care/cae_course/${caeCourseId}`,
    method: 'delete'
  })
}

/**
 * 获取托育课程
 * @param caeCourseId
 * @returns {AxiosPromise}
 */
export function queryNurseCourseDetail(caeCourseId) {
  return request({
    url: `/newdaycare/care/cae_course/${caeCourseId}`,
    method: 'get'
  })
}

/**
 * 更新托育课程
 * @param caeCourseId
 * @param courseTypeId 托育课程类型id
 * @param caeCourseName 课程名
 * @param lesson 消课课时
 * @param price 单价
 * @param introduction 托育简介
 * @param capacity 课程容量
 * @param image 图片
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateNurseCourse(caeCourseId, { duration, generationId, courseTypeId, caeCourseName, lesson, price, introduction, formalCapacity, experienceCapacity, totalCapacity, image, enable }) {
  return request({
    url: `/newdaycare/care/cae_course/${caeCourseId}`,
    method: 'put',
    data: {
      courseTypeId,
      caeCourseName,
      duration,
      lesson,
      price,
      generationId,
      introduction,
      formalCapacity,
      experienceCapacity,
      totalCapacity,
      image,
      enable
    }
  })
}

// ----------------早教课程----------------
/**
 * 新增早教课程
 * @param courseTypeId 早教课程类型id
 * @param teCourseName 课程名
 * @param lesson 消课课时
 * @param price 单价
 * @param introduction 简介
 * @param capacity 课程容量
 * @param image 图片
 * @returns {AxiosPromise}
 */
export function createEarlyCourse({ courseTypeId, teCourseName, lesson, price, introduction, image, formalCapacity, experienceCapacity, totalCapacity }) {
  return request({
    url: '/newdaycare/teach/te_course',
    method: 'post',
    data: {
      courseTypeId,
      teCourseName,
      lesson,
      price,
      introduction,
      image,
      formalCapacity,
      experienceCapacity,
      totalCapacity
    }
  })
}

/**
 * 查询早教课程分页列表
 * @param courseName
 * @param courseTypeId
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryEarlyCourseListByPage({ courseName, courseTypeId, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/teach/te_course/course_page',
    method: 'get',
    params: { courseName, courseTypeId, pageNum, pageSize }
  })
}

/**
 * 查询早教课程列表下拉
 * @param teCourseName 课程名称
 * @param teCourseTypeId 课程类型
 * @returns {AxiosPromise}
 */
export function queryEarlyCourseList({ teCourseName, teCourseTypeId }) {
  return request({
    url: '/newdaycare/teach/te_course',
    method: 'get',
    params: { teCourseName, teCourseTypeId }
  })
}

/**
 * 删除早教课程
 * @param teCourseId
 * @returns {AxiosPromise}
 */
export function removeEarlyCourse(teCourseId) {
  return request({
    url: `/newdaycare/teach/te_course/${teCourseId}`,
    method: 'delete'
  })
}

/**
 * 获取早教课程
 * @param teCourseId
 * @returns {AxiosPromise}
 */
export function queryEarlyCourseDetail(teCourseId) {
  return request({
    url: `/newdaycare/teach/te_course/${teCourseId}`,
    method: 'get'
  })
}

/**
 * 更新早教课程
 * @param teCourseId
 * @param courseTypeId 早教课程类型id
 * @param teCourseName 课程名
 * @param lesson 消课课时
 * @param price 单价
 * @param introduction 简介
 * @param capacity 课程容量
 * @param image 图片
 * @param enable 是否开启
 * @returns {AxiosPromise}
 */
export function updateEarlyCourse(teCourseId, { courseTypeId, teCourseName, lesson, price, introduction, image, enable, formalCapacity, experienceCapacity, totalCapacity }) {
  return request({
    url: `/newdaycare/teach/te_course/${teCourseId}`,
    method: 'put',
    data: {
      courseTypeId,
      teCourseName,
      lesson,
      price,
      introduction,
      formalCapacity,
      experienceCapacity,
      totalCapacity,
      image,
      enable
    }
  })
}

// ----------------托育一日流程----------------
/**
 * 新增托育日程
 * @param caeScheduleName
 * @param introduction
 * @param image
 * @returns {AxiosPromise}
 */
export function createOneDayProcess({ caeScheduleName, introduction, image }) {
  return request({
    url: '/newdaycare/care/cae_schedule',
    method: 'post',
    data: { caeScheduleName, introduction, image }
  })
}

/**
 * 查询托育日程列表分页
 * @param caeScheduleName
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryOneDayProcessListByPage({ caeScheduleName, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/care/cae_schedule/schedule_page',
    method: 'get',
    params: { caeScheduleName, pageNum, pageSize }
  })
}

/**
 * 删除托育日程
 * @param caeScheduleId
 * @returns {AxiosPromise}
 */
export function removeOneDayProcess(caeScheduleId) {
  return request({
    url: `/newdaycare/care/cae_schedule/${caeScheduleId}`,
    method: 'delete'
  })
}

/**
 * 获取托育日程
 * @param caeScheduleId
 * @returns {AxiosPromise}
 */
export function queryOneDayProcessDetail(caeScheduleId) {
  return request({
    url: `/newdaycare/care/cae_schedule/${caeScheduleId}`,
    method: 'get'
  })
}

/**
 * 更新托育日程
 * @param caeScheduleId
 * @param caeScheduleName
 * @param introduction
 * @param image
 * @param enable
 * @returns {AxiosPromise}
 */
export function updateOneDayProcess(caeScheduleId, { caeScheduleName, introduction, image, enable }) {
  return request({
    url: `/newdaycare/care/cae_schedule/${caeScheduleId}`,
    method: 'put',
    data: { caeScheduleName, introduction, image, enable }
  })
}

// ----------------早教套餐----------------
/**
 * 查询早教套餐列表分页
 * @param caeCoursePackageName
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryEarlySetListByPage({ caeCoursePackageName, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/teach/te_course_package/course_package_page',
    method: 'get',
    params: { caeCoursePackageName, pageNum, pageSize }
  })
}

/**
 * 删除早教套餐
 * @param teCoursePackageId
 * @returns {AxiosPromise}
 */
export function removeEarly(teCoursePackageId) {
  return request({
    url: `/newdaycare/teach/te_course_package/${teCoursePackageId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 获取早教详情
 * @param teCoursePackageId
 * @returns {AxiosPromise}
 */
export function queryEarlyDetail(teCoursePackageId) {
  return request({
    url: `/newdaycare/teach/te_course_package/${teCoursePackageId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 新增早教套餐
 * @param teCoursePackageItemList
 * @param teCoursePackageName
 * @param modify
 * @param enable
 * @param lessonTotal
 * @param buyLessonTotal
 * @param handselLessonTotal
 * @param totalPrice
 * @param introduction
 * @param image
 * @returns {AxiosPromise}
 */
export function createEarlyData({ caeCoursePackageItemList, caeCoursePackageName, modify, enable, lessonTotal, buyLessonTotal, handselLessonTotal, totalPrice, introduction, image }) {
  return request({
    url: `/newdaycare/teach/te_course_package`,
    method: 'post',
    data: {
      caeCoursePackageItemList,
      caeCoursePackageName,
      modify,
      enable,
      lessonTotal,
      buyLessonTotal,
      handselLessonTotal,
      totalPrice,
      introduction,
      image
    }
  })
}

/**
 * 更新早教套餐
 * @param teCoursePackageId
 * @returns {AxiosPromise}
 */
export function updateEarlay({ caeCoursePackageName, modify, caeCoursePackageItemList, enable, lessonTotal, buyLessonTotal, handselLessonTotal, totalPrice, introduction, image, teCoursePackageId }) {
  return request({
    url: `/newdaycare/teach/te_course_package/${teCoursePackageId}`,
    method: 'put',
    data: {
      caeCoursePackageName,
      modify,
      caeCoursePackageItemList,
      enable,
      lessonTotal,
      buyLessonTotal,
      handselLessonTotal,
      totalPrice,
      introduction,
      image
    }
  })
}

// ----------------托育套餐----------------
/**
 * 查询托育套餐列表分页
 * @param caeCoursePackageName
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function queryNurseSetListByPage({ caeCoursePackageName, pageNum, pageSize }) {
  return request({
    url: '/newdaycare/care/cae_course_package/course_package_page',
    method: 'get',
    params: { caeCoursePackageName, pageNum, pageSize }
  })
}

/**
 * 新增托育套餐
 * @param caeCoursePackageItemList
 * @param caeCoursePackageName
 * @param modify
 * @param enable
 * @param lessonTotal
 * @param buyLessonTotal
 * @param handselLessonTotal
 * @param totalPrice
 * @param introduction
 * @param image
 * @returns {AxiosPromise}
 */
export function createNurseData({ caeCoursePackageItemList, caeCoursePackageName, modify, enable, lessonTotal, buyLessonTotal, handselLessonTotal, totalPrice, introduction, image }) {
  return request({
    url: `/newdaycare/care/cae_course_package`,
    method: 'post',
    data: {
      caeCoursePackageItemList,
      caeCoursePackageName,
      modify,
      enable,
      lessonTotal,
      buyLessonTotal,
      handselLessonTotal,
      totalPrice,
      introduction,
      image
    }
  })
}

/**
 * 获取托育详情
 * @param teCoursePackageId
 * @returns {AxiosPromise}
 */
export function queryNurseDetail(caeCoursePackageId) {
  return request({
    url: `/newdaycare/care/cae_course_package/${caeCoursePackageId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 删除托育套餐
 * @param caeCoursePackageId
 * @returns {AxiosPromise}
 */
export function removeNurse(caeCoursePackageId) {
  return request({
    url: `/newdaycare/care/cae_course_package/${caeCoursePackageId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 更新托育套餐
 * @param caeCoursePackageId
 * @returns {AxiosPromise}
 */
export function updateNurse({ caeCoursePackageId, caeCoursePackageItemList, caeCoursePackageName, modify, enable, lessonTotal, buyLessonTotal, handselLessonTotal, totalPrice, introduction, image }) {
  return request({
    url: `/newdaycare/care/cae_course_package/${caeCoursePackageId}`,
    method: 'put',
    data: {
      caeCoursePackageItemList,
      caeCoursePackageName,
      modify,
      enable,
      lessonTotal,
      buyLessonTotal,
      handselLessonTotal,
      totalPrice,
      introduction,
      image
    }
  })
}

/**
 * 获取托育套餐(下拉)
 * @returns {AxiosPromise}
 */
export function queryNurseSetMeal(name) {
  return request({
    url: `/newdaycare/care/cae_course_package`,
    method: 'get',
    params: { name }
  })
}

/**
 * 获取早教套餐(下拉)
 * @returns {AxiosPromise}
 */
export function queryEarlySetMeal(name) {
  return request({
    url: `/newdaycare/teach/te_course_package`,
    method: 'get',
    params: { name }
  })
}

/**
 * 查询删除托育日程二次确认
 * @param caeScheduleId 托育日程 ID
 * @returns {AxiosPromise}
 */
export function queryResolveDel(caeScheduleId) {
  return request({
    url: `/newdaycare/care/cae_schedule/check/${caeScheduleId}`,
    method: 'get'

  })
}

/**
 * 删除托育日程
 * @param caeScheduleId 托育日程 ID
 * @returns {AxiosPromise}
 */
export function removeSchedule(caeScheduleId) {
  return request({
    url: `/newdaycare/care/cae_schedule/${caeScheduleId}`,
    method: 'delete'

  })
}
