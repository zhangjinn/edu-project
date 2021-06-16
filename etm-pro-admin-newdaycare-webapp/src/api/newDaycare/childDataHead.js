import request from '@/utils/request'

/**
 * 查询区域下拉列表
 * @returns {AxiosPromise}
 */
export function queryOrganization () {
  return request({
    url: '/newdaycare/organization/garden/area_down_list',
    method: 'get'
  })
}

export function queryOldOrganization () {
  return request({
    url: '/newdaycare/organization/area_down_list',
    method: 'get'
  })
}

/**
 * 查询学员信息列表
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
// export function queryChildMessage ({ areaName, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }) {
//   return request({
//     url: '/newdaycare/school_operation/child_message_page',
//     method: 'get',
//     params: { areaName, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }
//   })
// }

/**
 * 查询学员信息
 * @returns {AxiosPromise}
 */
export function queryMessage () {
  return request({
    url: '/newdaycare/school_operation/child_message',
    method: 'get'
  })
}

/**
 * 查询员工信息
 * @returns {AxiosPromise}
 */
export function queryStaffInfo () {
  return request({
    url: '/newdaycare/school_operation/employee_message',
    method: 'get'
  })
}

/**
 * 查询员工信息列表
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
export function queryStaffList ({ areaId, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/school_operation/employee_message_page',
    method: 'get',
    params: { areaId, enterpriseId, kindergarten, nurserySchool, pageNum, pageSize, paged }
  })
}

/**
 * 查询区域下的园所
 * @returns {AxiosPromise}
 */
export function querySearchItemList () {
  return request({
    url: '/newdaycare/organization/garden/one_area_list',
    method: 'get'
  })
}

/**
 * 查询区域下拉列表
 * @param areaHeadquartersOrganizationId 区域总部id
 * @param areaName 区域名
 * @returns {AxiosPromise}
 */
export function queryClassRoomList ({ areaHeadquartersOrganizationId, areaName }) {
  return request({
    url: '/newdaycare/organization/garden/area_down_list',
    method: 'get',
    params: { areaHeadquartersOrganizationId, areaName }
  })
}

/**
 * 查询学员信息列表
 * @param areaId 区域id
 * @param enterpriseId 组织id
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryChildMessage ({ areaId, enterpriseId, pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/school_operation/child_message_page',
    method: 'get',
    params: { areaId, enterpriseId, pageNum, pageSize, paged }
  })
}
