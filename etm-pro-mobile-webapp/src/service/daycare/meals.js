// import request from './mockRequest'
import request from '../http.js'

/**
 * 查询某天某老师所有有托育排课的课程
 * @param date {string} 当天日期
 * @param teacherId {number} 老师id
 * @returns {AxiosPromise}
 */
export function courseSummaryTeacher({ date }) {
  return request({
    url: '/daycare/ca_scourse_management/course_summary_teacher',
    method: 'get',
    params: {
      date
    }
  })
}

/**
 * 添加报餐记录
 * @param date {string} 日期
 * @param courseManagementId  {number} 排课id
 * @param childNormalMealAmount {number} 学员普通餐数量
 * @param childSpecMealAmount {number} 学员特殊餐数量
 * @param employeeMealAmount  {number} 员工餐数量
 * @param remark  {string} 备注
 * @returns {AxiosPromise}
 */
export function addMealsOrder({ date, courseManagementId, childNormalMealAmount, childSpecMealAmount, employeeMealAmount, remark }) {
  return request({
    url: '/daycare/meal_order',
    method: 'post',
    data: {
      date,
      courseManagementId,
      childNormalMealAmount,
      childSpecMealAmount,
      employeeMealAmount,
      remark
    }
  })
}

/**
 * BM查询托育报餐列表
 * @param date {string} 日期
 * @returns {AxiosPromise}
 */
export function mealOrderMobile({ date }) {
  return request({
    url: '/daycare/meal_order/mobile',
    method: 'get',
    params: {
      date
    }
  })
}

/**
 * 删除托育报餐
 * @param mealOrderId {number} 托育报餐id
 * @returns {AxiosPromise}
 */
export function delMealOrder({ mealOrderId }) {
  return request({
    url: `/daycare/meal_order/${mealOrderId}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 更新托育报餐
 * @param mealOrderId {number} 报餐人id
 * @param date {string || date} 日期
 * @param orderPersonId {number} 报餐人id
 * @param courseManagementId {number} 排课id
 * @param childNormalMealAmount {number} 学员普通餐数量
 * @param childSpecMealAmount {number} 学员特殊餐数量
 * @param employeeMealAmount {number} 员工餐数量
 * @param enterpriseId {number} 组织id
 * @param remark {string} 正式学员人数
 * @returns {AxiosPromise}
 */
export function updateMealOrder({ mealOrderId, date, orderPersonId, courseManagementId, childNormalMealAmount, childSpecMealAmount, employeeMealAmount, enterpriseId, remark }) {
  return request({
    url: `/daycare/meal_order/${mealOrderId}`,
    method: 'put',
    data: {
      date,
      orderPersonId,
      courseManagementId,
      childNormalMealAmount,
      childSpecMealAmount,
      employeeMealAmount,
      enterpriseId,
      remark
    }
  })
}

/**
 * 获取某个报餐的详细信息
 * @param mealOrderId {number} 报餐id
 * @returns {AxiosPromise}
 */
export function queryFixMealOrder({ mealOrderId }) {
  return request({
    url: `/daycare/meal_order/${mealOrderId}`,
    method: 'get',
    params: {}
  })
}

/**
 * 查询托育报餐规则列表
 * @returns {AxiosPromise}
 */
export function mealsOrderRule() {
  return request({
    url: '/daycare/meal_order_rule',
    method: 'get',
    params: {}
  })
}
