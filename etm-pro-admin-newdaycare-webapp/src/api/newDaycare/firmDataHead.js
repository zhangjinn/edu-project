import request from '@/utils/request'

/**
 * 查询园所信息
 * @returns {AxiosPromise}
 */
export function queryMessage () {
  return request({
    url: '/newdaycare/school_operation/school_message',
    method: 'get'
  })
}

/**
 * 查询园所信息列表
 * @param areaName 区域名称
 * @param enterpriseId 组织id
 * @param kindergarten 是否是幼儿园,有选择就传个true
 * @param nurserySchool 是否是托育园,有选择就传个true
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
// export function querySchoolMessagePage ({ areaName, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }) {
//   return request({
//     url: '/newdaycare/school_operation/school_message_page',
//     method: 'get',
//     params: { areaName, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }
//   })
// }

/**
 * 查询园所信息列表
 * @param areaId 区域id
 * @param enterpriseId 组织id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function querySchoolMessagePage ({ areaId, enterpriseId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/school_operation/school_message_page',
    method: 'get',
    params: { areaId, enterpriseId, pageNum, pageSize, paged }
  })
}
