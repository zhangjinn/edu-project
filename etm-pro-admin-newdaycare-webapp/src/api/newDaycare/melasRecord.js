import request from '@/utils/request'

// import request from '@/api/newdaycare/mockRequest'

/**
 * 查询托育报餐列表
 * @param date {string} 查询日期
 * @param pageNum {number} 当前页码
 * @param pageSize  {number}  每页的记录数
 * @param paged {boolean} 是否分页 默认为true
 * @returns {AxiosPromise}
 */
export function mealsOrder ({ date, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/meal_order',
    method: 'get',
    params: {
      date,
      pageNum,
      pageSize,
      paged
    }
  })
}

/**
 * 查询托育报餐规则列表
 * @returns {AxiosPromise}
 */
export function mealsOrderRule () {
  return request({
    url: '/newdaycare/meal_order_rule',
    method: 'get',
    params: {}
  })
}

/**
 * 更新报餐规则
 * @param enable  {boolean} 开关状态
 * @param editTime  {string} 时间
 * @returns {AxiosPromise}
 */
export function updateMealsOrderRule ({ enable, editTime }) {
  return request({
    url: '/newdaycare/meal_order_rule',
    method: 'put',
    data: {
      enable,
      editTime
    }
  })
}

/**
 * 获取当天报餐列表
 * @param date  {string} 日期
 * @returns {AxiosPromise}
 */
export function mealOrderDetail ({ date }) {
  return request({
    url: '/newdaycare/meal_order/detail',
    method: 'get',
    params: {
      date
    }
  })
}
