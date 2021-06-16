import request from '@/utils/request'

/**
 * 查询区域列表
 * @param pageNum 当前页码，默认情况下为第一页，页码从1开始
 * @param pageSize 每页的记录数，默认情况下每页十条记录
 * @param paged 是否分页
 默认为true
 * @returns {AxiosPromise}
 */
export function queryAreaList ({ pageNum, pageSize, paged }) {
  return request({
    url: '/newdaycare/organization/area_list',
    method: 'get',
    params: { pageNum, pageSize, paged }
  })
}

/**
 * 查询组织架构树
 * @returns {AxiosPromise}
 */
export function queryTree () {
  return request({
    url: '/basic/v2/organization/tree',
    method: 'get'
  })
}

/**
 * 新增区域总部
 * @param organizationId 组织机构id
 * @param areaName 区域名称
 * @returns {AxiosPromise}
 */
export function createOrganization ({ organizationId, areaName }) {
  return request({
    url: '/newdaycare/organization/area_add',
    method: 'post',
    data: { organizationId, areaName }
  })
}

/**
 * 删除区域总部
 * @param organizationId 组织机构冗余表 ID
 * @returns {AxiosPromise}
 */
export function removeOrganization ({ organizationId }) {
  return request({
    url: `/newdaycare/organization/area/${organizationId}`,
    method: 'delete'
  })
}

/**
 * 更新区域总部
 * @param oldOrganizationId
 * @param areaName 区域名称
 * @param organizationId 更改之后的组织id
 * @returns {AxiosPromise}
 */
export function updateOrganization ({ oldOrganizationId, areaName, organizationId }) {
  return request({
    url: `/newdaycare/organization/area/${oldOrganizationId}`,
    method: 'put',
    data: { areaName, organizationId }
  })
}

/**
 * 获取某组织的子组织
 * @param organizationId 组织机构冗余表 ID
 * @returns {AxiosPromise}
 */
export function querySonOrganization ({ organizationId }) {
  return request({
    url: `/newdaycare/organization/area/son_organization/${organizationId}`,
    method: 'get'

  })
}
