import request from '@/utils/request'

/**
 * 查询AI雷达获客列表
 * */
export function queryCustomerContact({ address, distance, province, city, childAge, parentsAge, childGender, parentsEducation, appType, consumption, flightTag, noLoadding }) {
  return request({
    url: `/customer/customer_contact`,
    method: 'get',
    timeout: 30000,
    params: { address, distance, province, city, childAge, parentsAge, childGender, parentsEducation, appType, consumption, flightTag, noLoadding }
  })
}

/**
 * 获取已探索统计
 * */
export function queryStatistical({ type, noLoadding }) {
  return request({
    url: `/customer/customer_contact/statistical`,
    method: 'get',
    params: { type, noLoadding }
  })
}
