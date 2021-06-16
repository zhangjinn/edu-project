import request from '@/utils/request'

/**
 * 客户扫描
 * */
export function getCustomerContact (params) {
  return request({
    url: '/customer/customer_contact',
    method: 'get',
    params
  })
}

/**
 * 打电话
 * */
export function postCustomerContactDoCall (data) {
  return request({
    url: '/customer/customer_contact/do_call',
    method: 'post',
    data
  })
}
