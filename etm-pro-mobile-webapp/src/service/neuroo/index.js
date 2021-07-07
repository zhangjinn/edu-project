import request from '../http.js'

/**
 * 查询会员详情
 */
export function getCustomerDetail(customerId) {
  return request({
    url: `/neuroo/customer/${customerId}`,
    method: 'get'
  })
}

/**
 * 获取当前账号能看到的园区
 */
export function getSchoolList() {
  return request({
    url: `/neuroo/organization`,
    method: 'get'
  })
}

/**
 * 查询班级列表
 */
export function getClazzList(schoolId) {
  return request({
    url: `/neuroo/clazz/class_list/${schoolId}`,
    method: 'get'
  })
}
